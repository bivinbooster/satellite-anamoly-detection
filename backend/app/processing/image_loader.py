import numpy as np
import cv2
from pathlib import Path
from typing import Any


def load_band(path: str) -> np.ndarray:
    """Load image from any format (jpg/png/tif) as grayscale float32 0-1."""
    img = cv2.imread(path, cv2.IMREAD_UNCHANGED)
    if img is None:
        raise ValueError(f"Could not read image: {path}")

    # Handle multi-channel (RGB/RGBA) → grayscale
    if img.ndim == 3:
        if img.shape[2] == 4:
            img = cv2.cvtColor(img, cv2.COLOR_BGRA2GRAY)
        else:
            img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Normalize to float32 0-1
    img = img.astype(np.float32)
    max_val = img.max()
    if max_val > 0:
        img /= max_val if max_val > 1 else 255.0
    return img


def load_rgb(path: str, target_size: tuple | None = None) -> np.ndarray:
    """Load image as BGR uint8 for visualization."""
    img = cv2.imread(path, cv2.IMREAD_COLOR)
    if img is None:
        # Try reading as 16-bit and normalize
        img = cv2.imread(path, cv2.IMREAD_UNCHANGED)
        if img is None:
            raise ValueError(f"Could not read image: {path}")
        if img.ndim == 2:
            # Grayscale → fake RGB
            img = cv2.normalize(img, None, 0, 255, cv2.NORM_MINMAX, cv2.CV_8U)
            img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
        else:
            img = cv2.normalize(img, None, 0, 255, cv2.NORM_MINMAX, cv2.CV_8U)

    if target_size:
        img = cv2.resize(img, target_size, interpolation=cv2.INTER_LINEAR)
    return img


def compute_change_score(t0: np.ndarray, t1: np.ndarray) -> np.ndarray:
    """
    Compute per-pixel change score between two float32 images.
    Returns score map in range [0, 1].
    """
    # Resize t1 to match t0 if needed
    if t0.shape != t1.shape:
        t1 = cv2.resize(t1, (t0.shape[1], t0.shape[0]), interpolation=cv2.INTER_LINEAR)

    # Absolute difference
    diff = np.abs(t1.astype(np.float32) - t0.astype(np.float32))

    # Gaussian blur to reduce noise
    diff = cv2.GaussianBlur(diff, (5, 5), 1.0)

    # Normalize to 0-1
    d_min, d_max = diff.min(), diff.max()
    if d_max > d_min:
        score = (diff - d_min) / (d_max - d_min)
    else:
        score = diff

    return score.astype(np.float32)


def score_to_heatmap(score: np.ndarray) -> np.ndarray:
    """Convert float score map to a COLORMAP_JET BGR heatmap uint8."""
    score_u8 = (score * 255).clip(0, 255).astype(np.uint8)
    heatmap = cv2.applyColorMap(score_u8, cv2.COLORMAP_JET)
    return heatmap


def score_to_overlay(score: np.ndarray, base_img: np.ndarray, threshold: float = 0.35) -> np.ndarray:
    """
    Overlay detected anomaly regions (above threshold) in red on the base image.
    """
    h, w = score.shape
    base = cv2.resize(base_img, (w, h), interpolation=cv2.INTER_LINEAR)

    # Create mask of anomaly regions
    mask = (score > threshold).astype(np.uint8)

    # Morphological cleanup: remove tiny specks, fill gaps
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    mask = cv2.morphologyEx(mask, cv2.MORPH_DILATE, kernel, iterations=1)

    # Red overlay
    overlay = base.copy()
    red_layer = np.zeros_like(base)
    red_layer[:, :, 2] = 255  # Red in BGR

    # Blend: anomaly areas get 55% red tint
    alpha = 0.55
    mask3 = np.stack([mask, mask, mask], axis=-1).astype(np.float32)
    overlay = (base * (1 - mask3 * alpha) + red_layer * mask3 * alpha).clip(0, 255).astype(np.uint8)

    # Draw contours for crisp edges
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cv2.drawContours(overlay, contours, -1, (0, 0, 255), 2)

    return overlay


def compute_metrics(score: np.ndarray, threshold: float = 0.35) -> dict[str, Any]:
    """Compute global anomaly metrics from the score map."""
    flat = score.flatten()
    anomaly_mask = flat > threshold
    anomaly_pct = float(anomaly_mask.sum() / len(flat) * 100)

    return {
        "global": {
            "anomaly_pixels_pct": round(anomaly_pct, 3),
            "score_mean": round(float(flat.mean()), 6),
            "score_std": round(float(flat.std()), 6),
            "score_p50": round(float(np.percentile(flat, 50)), 6),
            "score_p95": round(float(np.percentile(flat, 95)), 6),
            "score_p99": round(float(np.percentile(flat, 99)), 6),
            "score_max": round(float(flat.max()), 6),
            "threshold_used": threshold,
        }
    }


def process_images(
    run_id: str,
    t0_path: str,
    t1_path: str,
    output_dir: str,
    threshold: float = 0.35,
) -> dict[str, Any]:
    """
    Full pipeline:
      1. Load T0 and T1
      2. Compute change score map
      3. Generate heatmap + overlay PNGs
      4. Save RGB previews of T0 and T1
      5. Return asset paths + metrics

    Returns:
        {
            "assets": {
                "t0_rgb":  "/path/to/t0_rgb.png",
                "t1_rgb":  "/path/to/t1_rgb.png",
                "heatmap": "/path/to/heatmap.png",
                "overlay": "/path/to/overlay.png",
            },
            "metrics": { "global": { ... } }
        }
    """
    out = Path(output_dir)
    out.mkdir(parents=True, exist_ok=True)

    # ── 1. Load bands ──────────────────────────────────────────────────────────
    t0_band = load_band(t0_path)
    t1_band = load_band(t1_path)

    # Load RGB versions for visualization (resize t1 to match t0 dimensions)
    target_size = (t0_band.shape[1], t0_band.shape[0])  # (w, h)
    t0_rgb = load_rgb(t0_path, target_size)
    t1_rgb = load_rgb(t1_path, target_size)

    # ── 2. Change detection ────────────────────────────────────────────────────
    score = compute_change_score(t0_band, t1_band)

    # ── 3. Generate visualizations ─────────────────────────────────────────────
    heatmap = score_to_heatmap(score)
    overlay = score_to_overlay(score, t1_rgb, threshold=threshold)

    # ── 4. Save all outputs ────────────────────────────────────────────────────
    t0_out   = str(out / "t0_rgb.png")
    t1_out   = str(out / "t1_rgb.png")
    heat_out = str(out / "heatmap.png")
    over_out = str(out / "overlay.png")

    cv2.imwrite(t0_out,   t0_rgb)
    cv2.imwrite(t1_out,   t1_rgb)
    cv2.imwrite(heat_out, heatmap)
    cv2.imwrite(over_out, overlay)

    # ── 5. Metrics ─────────────────────────────────────────────────────────────
    metrics = compute_metrics(score, threshold=threshold)

    return {
        "assets": {
            "t0_rgb":  t0_out,
            "t1_rgb":  t1_out,
            "heatmap": heat_out,
            "overlay": over_out,
        },
        "metrics": metrics,
    }