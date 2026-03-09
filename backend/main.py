from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
import uuid
import os
import numpy as np
import cv2
from typing import Dict, Any

app = FastAPI(title="Satellite Anomaly Studio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

runs: Dict[str, Any] = {}
os.makedirs("uploads", exist_ok=True)


# ── Image helpers ──────────────────────────────────────────────────────────────

def read_image_cv2(path: str) -> np.ndarray:
    img = cv2.imread(path, cv2.IMREAD_UNCHANGED)
    if img is None:
        raise ValueError(f"Could not read image: {path}")
    if img.dtype != np.uint8:
        img = cv2.normalize(img, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
    if img.ndim == 2:
        img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    if img.ndim == 3 and img.shape[2] == 4:
        img = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)
    return img


def resize_to_match(img: np.ndarray, ref: np.ndarray) -> np.ndarray:
    if img.shape[:2] != ref.shape[:2]:
        img = cv2.resize(img, (ref.shape[1], ref.shape[0]), interpolation=cv2.INTER_LINEAR)
    return img


def make_heatmap(t0: np.ndarray, t1: np.ndarray) -> np.ndarray:
    t1 = resize_to_match(t1, t0)
    g0 = cv2.cvtColor(t0, cv2.COLOR_BGR2GRAY).astype(np.float32)
    g1 = cv2.cvtColor(t1, cv2.COLOR_BGR2GRAY).astype(np.float32)
    diff = cv2.GaussianBlur(np.abs(g1 - g0), (7, 7), 1.5)
    diff_norm = cv2.normalize(diff, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
    return cv2.applyColorMap(diff_norm, cv2.COLORMAP_JET)


def make_overlay(t0: np.ndarray, t1: np.ndarray, pct: float = 75) -> np.ndarray:
    t1 = resize_to_match(t1, t0)
    g0 = cv2.cvtColor(t0, cv2.COLOR_BGR2GRAY).astype(np.float32)
    g1 = cv2.cvtColor(t1, cv2.COLOR_BGR2GRAY).astype(np.float32)
    diff = cv2.GaussianBlur(np.abs(g1 - g0), (5, 5), 1.0)
    mask = (diff > np.percentile(diff, pct)).astype(np.uint8)
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, k)
    mask = cv2.morphologyEx(mask, cv2.MORPH_DILATE, k)
    red = np.zeros_like(t1); red[:, :, 2] = 255
    m3 = np.stack([mask]*3, axis=-1).astype(np.float32)
    out = (t1 * (1 - m3 * 0.55) + red * m3 * 0.55).clip(0, 255).astype(np.uint8)
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cv2.drawContours(out, contours, -1, (0, 0, 255), 2)
    return out


def compute_metrics(t0: np.ndarray, t1: np.ndarray, pct: float = 75) -> dict:
    t1 = resize_to_match(t1, t0)
    g0 = cv2.cvtColor(t0, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255.0
    g1 = cv2.cvtColor(t1, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255.0
    diff = np.abs(g1 - g0).flatten()
    threshold = np.percentile(diff, pct)
    return {
        "global": {
            "anomaly_pixels_pct": round(float((diff > threshold).sum() / len(diff) * 100), 3),
            "score_mean": round(float(diff.mean()), 6),
            "score_std":  round(float(diff.std()), 6),
            "score_p50":  round(float(np.percentile(diff, 50)), 6),
            "score_p95":  round(float(np.percentile(diff, 95)), 6),
            "score_p99":  round(float(np.percentile(diff, 99)), 6),
            "score_max":  round(float(diff.max()), 6),
        }
    }


# ── Routes ─────────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "Satellite Anomaly Studio API"}

@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/api/runs")
async def create_run(t0: UploadFile = File(...), t1: UploadFile = File(...)):
    run_id = str(uuid.uuid4())
    run_dir = f"uploads/{run_id}"
    os.makedirs(run_dir, exist_ok=True)

    t0_ext = os.path.splitext(t0.filename or "image.png")[1] or ".png"
    t1_ext = os.path.splitext(t1.filename or "image.png")[1] or ".png"
    t0_path = f"{run_dir}/t0{t0_ext}"
    t1_path = f"{run_dir}/t1{t1_ext}"

    try:
        c0 = await t0.read()
        c1 = await t1.read()
        open(t0_path, "wb").write(c0)
        open(t1_path, "wb").write(c1)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save files: {e}")

    try:
        t0_bgr = read_image_cv2(t0_path)
        t1_bgr = read_image_cv2(t1_path)

        heatmap = make_heatmap(t0_bgr, t1_bgr)
        overlay = make_overlay(t0_bgr, t1_bgr)
        metrics = compute_metrics(t0_bgr, t1_bgr)

        paths = {
            "t0_rgb":  f"{run_dir}/t0_rgb.png",
            "t1_rgb":  f"{run_dir}/t1_rgb.png",
            "heatmap": f"{run_dir}/heatmap.png",
            "overlay": f"{run_dir}/overlay.png",
        }
        cv2.imwrite(paths["t0_rgb"],  t0_bgr)
        cv2.imwrite(paths["t1_rgb"],  t1_bgr)
        cv2.imwrite(paths["heatmap"], heatmap)
        cv2.imwrite(paths["overlay"], overlay)

        runs[run_id] = {"id": run_id, "status": "done", "assets": paths, "metrics": metrics}

    except Exception as e:
        runs[run_id] = {"id": run_id, "status": "error", "error": str(e), "assets": {}, "metrics": {}}
        raise HTTPException(status_code=500, detail=f"Processing failed: {e}")

    return {"run_id": run_id}


@app.post("/api/runs/{run_id}/detect")
async def detect_run(run_id: str):
    if run_id not in runs:
        raise HTTPException(status_code=404, detail="Run not found")
    run = runs[run_id]
    return {"assets": list(run.get("assets", {}).keys()), "metrics": run.get("metrics", {})}


@app.get("/api/runs/{run_id}")
async def get_run(run_id: str):
    if run_id not in runs:
        raise HTTPException(status_code=404, detail="Run not found")
    return runs[run_id]


@app.get("/api/assets/{run_id}/{asset_type}")
async def get_asset(run_id: str, asset_type: str):
    if run_id not in runs:
        raise HTTPException(status_code=404, detail="Run not found")
    asset_path = runs[run_id].get("assets", {}).get(asset_type)
    if not asset_path or not os.path.exists(asset_path):
        raise HTTPException(status_code=404, detail=f"Asset '{asset_type}' not found")
    with open(asset_path, "rb") as f:
        data = f.read()
    return Response(content=data, media_type="image/png", headers={"Cache-Control": "max-age=600"})


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
