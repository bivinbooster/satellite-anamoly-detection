from __future__ import annotations

import io
import json
import uuid
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Tuple

import numpy as np
import cv2
from PIL import Image
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from skimage.metrics import structural_similarity as ssim

# RasterIO is the easiest way to read OSCD GeoTIFFs
import rasterio

STATIC_DIR = Path("static")
RUNS_DIR = STATIC_DIR / "runs"
RUNS_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="Satellite Anomaly Studio (MVP)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")


# -----------------------------
# Helpers: IO / preprocessing
# -----------------------------
def _read_geotiff(path: Path) -> np.ndarray:
    """
    Reads OSCD multi-band GeoTIFF and resamples all bands to 10m resolution.
    Returns HxWxC float32 image in [0,1].
    """

    with rasterio.open(path) as src:
        meta = src.meta.copy()

        # Get full resolution for band 4 (Red, 10m)
        # If TIFF uses 20m/60m scale, pick largest resolution available.
        max_w = src.width
        max_h = src.height

        # Build target transform
        target_transform = src.transform

        # Prepare output array
        bands = []
        for b in range(1, src.count + 1):
            band = src.read(b)

            # If band is not same resolution → resample to match largest (10m)
            if band.shape != (max_h, max_w):
                # Compute scale (old → new)
                src_h, src_w = band.shape
                bandscale_x = src_w / max_w
                bandscale_y = src_h / max_h

                band = cv2.resize(
                    band.astype(np.float32),
                    (max_w, max_h),
                    interpolation=cv2.INTER_LINEAR,
                )

            bands.append(band.astype(np.float32))

    # Stack to HxWxC
    arr = np.stack(bands, axis=-1)

    # Robust normalize each band
    out = np.empty_like(arr, dtype=np.float32)
    for c in range(arr.shape[2]):
        band = arr[..., c]
        lo = np.percentile(band, 2)
        hi = np.percentile(band, 98)
        out[..., c] = (band - lo) / (hi - lo + 1e-6)

    return np.clip(out, 0.0, 1.0)

def _pick_s2_rgb(img: np.ndarray) -> np.ndarray:
    """
    Sentinel-2 typical band order in many stacks: B1..B12 etc.
    For OSCD, a common assumption is:
      B2=Blue (index 1), B3=Green (index 2), B4=Red (index 3) in 0-based.
    If we can't, fallback to first 3 channels.
    Returns float32 HxWx3 in [0,1].
    """
    c = img.shape[2]
    if c >= 4:
        # R,G,B = B4,B3,B2
        rgb = img[..., [3, 2, 1]]
    elif c >= 3:
        rgb = img[..., :3]
    else:
        rgb = np.repeat(img[..., :1], 3, axis=2)
    return np.clip(rgb, 0.0, 1.0)


def _save_png(rgb01: np.ndarray, path: Path) -> None:
    rgb8 = (np.clip(rgb01, 0, 1) * 255).astype(np.uint8)
    Image.fromarray(rgb8).save(path)


# -----------------------------
# Heuristic land-cover (MVP)
# -----------------------------
# Labels:
# 0=urban/other, 1=agriculture, 2=forest, 3=water
LC_COLORS = {
    0: (160, 160, 160),  # gray
    1: (255, 215, 0),    # yellow-ish
    2: (34, 139, 34),    # green
    3: (30, 144, 255),   # blue
}

def _landcover_heuristic(img_allbands: np.ndarray) -> np.ndarray:
    """
    Very practical, training-free landcover mask so your app can already show:
    agri/forest/water/urban routing.

    Uses NDVI and NDWI if we can find NIR/red/green bands.
    Assumption (common): NIR ~ B8 at 0-based index 7 (8th band) if C>=8.
    Red ~ B4 at index 3 if C>=4
    Green ~ B3 at index 2 if C>=3
    """
    h, w, c = img_allbands.shape
    lc = np.zeros((h, w), dtype=np.uint8)

    if c >= 8:
        red = img_allbands[..., 3]
        green = img_allbands[..., 2]
        nir = img_allbands[..., 7]

        ndvi = (nir - red) / (nir + red + 1e-6)
        ndwi = (green - nir) / (green + nir + 1e-6)

        # water first
        water = ndwi > 0.20
        lc[water] = 3

        # vegetation
        veg = (ndvi > 0.30) & (~water)
        # split agri vs forest by NDVI strength (rough heuristic)
        forest = (ndvi > 0.60) & veg
        agri = veg & (~forest)

        lc[forest] = 2
        lc[agri] = 1

        # remaining is urban/other (0)
        return lc

    # Fallback: everything urban/other
    return lc


def _save_landcover_png(lc: np.ndarray, path: Path) -> None:
    h, w = lc.shape
    out = np.zeros((h, w, 3), dtype=np.uint8)
    for k, color in LC_COLORS.items():
        out[lc == k] = color
    Image.fromarray(out).save(path)


# -----------------------------
# Anomaly map (AbsDiff + SSIM)
# -----------------------------
def _compute_anomaly_map(t0_rgb: np.ndarray, t1_rgb: np.ndarray) -> np.ndarray:
    """
    Inputs are HxWx3 float32 in [0,1]. Output is HxW float32 in [0,1].
    """
    diff = np.mean(np.abs(t1_rgb - t0_rgb), axis=2)  # HxW

    g0 = np.mean(t0_rgb, axis=2)
    g1 = np.mean(t1_rgb, axis=2)

    # SSIM returns similarity; convert to anomaly
    _, ssim_map = ssim(g0, g1, full=True, data_range=1.0)
    ssim_anom = 1.0 - ssim_map

    score = 0.6 * diff + 0.4 * ssim_anom
    score = (score - score.min()) / (score.max() - score.min() + 1e-6)
    return score.astype(np.float32)


def _save_heatmap(anom01: np.ndarray, path: Path) -> None:
    heat = cv2.applyColorMap((np.clip(anom01, 0, 1) * 255).astype(np.uint8), cv2.COLORMAP_HOT)
    heat = cv2.cvtColor(heat, cv2.COLOR_BGR2RGB)
    Image.fromarray(heat).save(path)


def _save_diff_rgb(t0_rgb: np.ndarray, t1_rgb: np.ndarray, path: Path) -> None:
    diff = np.abs(t1_rgb - t0_rgb)
    _save_png(diff, path)


def _save_overlay(t1_rgb: np.ndarray, anom01: np.ndarray, threshold: float, path: Path) -> None:
    """
    Creates a premium-looking overlay: red mask over t1.
    """
    base = (np.clip(t1_rgb, 0, 1) * 255).astype(np.uint8)
    mask = (anom01 >= threshold).astype(np.uint8)

    overlay = base.copy()
    # red overlay where mask=1
    overlay[mask == 1] = (0.65 * overlay[mask == 1] + 0.35 * np.array([255, 0, 0], dtype=np.float32)).astype(np.uint8)

    Image.fromarray(overlay).save(path)


def _save_anomaly_u8(anom01: np.ndarray, path: Path) -> None:
    """
    Save grayscale 0..255 anomaly map so frontend can threshold instantly on canvas.
    """
    u8 = (np.clip(anom01, 0, 1) * 255).astype(np.uint8)
    Image.fromarray(u8, mode="L").save(path)


def _metrics(anom01: np.ndarray, lc: np.ndarray, thr: float) -> Dict:
    binmask = (anom01 >= thr).astype(np.uint8)
    global_pct = float(binmask.mean() * 100.0)

    by_cat = {}
    for name, lab in [("urban", 0), ("agriculture", 1), ("forest", 2), ("water", 3)]:
        region = (lc == lab)
        denom = int(region.sum())
        if denom == 0:
            by_cat[name] = {"anomaly_pixels_pct": 0.0, "pixels": 0}
        else:
            pct = float((binmask[region].mean()) * 100.0)
            by_cat[name] = {"anomaly_pixels_pct": pct, "pixels": denom}

    return {
        "global": {
            "anomaly_pixels_pct": global_pct,
            "score_mean": float(anom01.mean()),
            "score_p95": float(np.quantile(anom01, 0.95)),
        },
        "by_category": by_cat,
    }


# -----------------------------
# API
# -----------------------------
@app.post("/api/runs")
async def create_run(t0: UploadFile = File(...), t1: UploadFile = File(...)):
    run_id = uuid.uuid4().hex
    run_dir = RUNS_DIR / run_id
    run_dir.mkdir(parents=True, exist_ok=True)

    t0_path = run_dir / f"t0_{t0.filename}"
    t1_path = run_dir / f"t1_{t1.filename}"
    t0_path.write_bytes(await t0.read())
    t1_path.write_bytes(await t1.read())

    return {"run_id": run_id}


@app.post("/api/runs/{run_id}/detect")
def detect(run_id: str):
    run_dir = RUNS_DIR / run_id
    if not run_dir.exists():
        raise HTTPException(status_code=404, detail="run_id not found")

    # locate uploaded files
    t0_files = list(run_dir.glob("t0_*"))
    t1_files = list(run_dir.glob("t1_*"))
    if not t0_files or not t1_files:
        raise HTTPException(status_code=400, detail="Missing t0/t1 uploads in run dir")

    t0_all = _read_geotiff(t0_files[0])
    t1_all = _read_geotiff(t1_files[0])

    t0_rgb = _pick_s2_rgb(t0_all)
    t1_rgb = _pick_s2_rgb(t1_all)

    # landcover (heuristic)
    lc = _landcover_heuristic(t1_all)

    # anomaly map
    anom = _compute_anomaly_map(t0_rgb, t1_rgb)

    # choose a reasonable default threshold (p95 is often too aggressive; use p90-ish)
    thr = float(np.quantile(anom, 0.90))
    thr = float(np.clip(thr, 0.35, 0.85))

    # save assets
    _save_png(t0_rgb, run_dir / "t0.png")
    _save_png(t1_rgb, run_dir / "t1.png")
    _save_diff_rgb(t0_rgb, t1_rgb, run_dir / "diff.png")
    _save_heatmap(anom, run_dir / "heatmap.png")
    _save_overlay(t1_rgb, anom, thr, run_dir / "overlay.png")
    _save_anomaly_u8(anom, run_dir / "anomaly_u8.png")
    _save_landcover_png(lc, run_dir / "landcover.png")

    result = {
        "run_id": run_id,
        "size": [int(t1_rgb.shape[1]), int(t1_rgb.shape[0])],
        "assets": {
            "t0_rgb": f"/static/runs/{run_id}/t0.png",
            "t1_rgb": f"/static/runs/{run_id}/t1.png",
            "diff_rgb": f"/static/runs/{run_id}/diff.png",
            "heatmap": f"/static/runs/{run_id}/heatmap.png",
            "overlay": f"/static/runs/{run_id}/overlay.png",
            "landcover": f"/static/runs/{run_id}/landcover.png",
            "anomaly_u8": f"/static/runs/{run_id}/anomaly_u8.png",
        },
        "metrics": _metrics(anom, lc, thr),
        "threshold_suggestion": thr,
        "landcover_labels": {"urban": 0, "agriculture": 1, "forest": 2, "water": 3},
    }

    (run_dir / "result.json").write_text(json.dumps(result, indent=2))
    return result


@app.get("/api/runs/{run_id}")
def get_run(run_id: str):
    run_dir = RUNS_DIR / run_id
    if not run_dir.exists():
        raise HTTPException(status_code=404, detail="run_id not found")
    result_path = run_dir / "result.json"
    if not result_path.exists():
        raise HTTPException(status_code=404, detail="No result.json yet. Call /detect first.")
    return json.loads(result_path.read_text())


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)