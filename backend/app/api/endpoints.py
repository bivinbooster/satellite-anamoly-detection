from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
import uuid
import os
import shutil
from pathlib import Path

from app.services.image_processor import process_images
from app.models.schemas import RunResponse, DetectResponse

router = APIRouter()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# In-memory store for run metadata (replace with DB if needed)
runs: dict = {}


# ── POST /api/runs ─ Upload image pair and create a run ──────────────────────
@router.post("/runs", response_model=RunResponse)
async def create_run(
    t0: UploadFile = File(...),
    t1: UploadFile = File(...),
):
    run_id = str(uuid.uuid4())
    run_dir = UPLOAD_DIR / run_id
    run_dir.mkdir(parents=True, exist_ok=True)

    # Save uploaded files
    t0_path = run_dir / f"t0_{t0.filename}"
    t1_path = run_dir / f"t1_{t1.filename}"

    with open(t0_path, "wb") as f:
        shutil.copyfileobj(t0.file, f)
    with open(t1_path, "wb") as f:
        shutil.copyfileobj(t1.file, f)

    runs[run_id] = {
        "id": run_id,
        "status": "uploaded",
        "t0_path": str(t0_path),
        "t1_path": str(t1_path),
        "assets": {},
        "metrics": {},
    }

    # Auto-trigger detection immediately after upload
    try:
        result = process_images(run_id, str(t0_path), str(t1_path), str(run_dir))
        runs[run_id]["status"] = "done"
        runs[run_id]["assets"] = result["assets"]
        runs[run_id]["metrics"] = result["metrics"]
    except Exception as e:
        runs[run_id]["status"] = "error"
        runs[run_id]["error"] = str(e)
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

    return RunResponse(run_id=run_id)


# ── POST /api/runs/{run_id}/detect ─ Manually trigger detection ─────────────
@router.post("/runs/{run_id}/detect", response_model=DetectResponse)
async def detect_run(run_id: str):
    run = runs.get(run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")

    run_dir = UPLOAD_DIR / run_id

    try:
        result = process_images(
            run_id,
            run["t0_path"],
            run["t1_path"],
            str(run_dir),
        )
        runs[run_id]["status"] = "done"
        runs[run_id]["assets"] = result["assets"]
        runs[run_id]["metrics"] = result["metrics"]
    except Exception as e:
        runs[run_id]["status"] = "error"
        raise HTTPException(status_code=500, detail=str(e))

    return DetectResponse(
        assets=list(result["assets"].keys()),
        metrics=result["metrics"],
    )


# ── GET /api/runs/{run_id} ─ Get run status + metrics ───────────────────────
@router.get("/runs/{run_id}")
async def get_run(run_id: str):
    run = runs.get(run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return {
        "id": run["id"],
        "status": run["status"],
        "assets": run.get("assets", {}),
        "metrics": run.get("metrics", {}),
    }


# ── GET /api/assets/{run_id}/{asset_type} ─ Serve generated images ───────────
@router.get("/assets/{run_id}/{asset_type}")
async def get_asset(run_id: str, asset_type: str):
    run = runs.get(run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")

    assets = run.get("assets", {})
    asset_path = assets.get(asset_type)

    if not asset_path or not os.path.exists(asset_path):
        # Fallback: try to find file directly in run directory
        run_dir = UPLOAD_DIR / run_id
        for ext in [".png", ".jpg", ".tif"]:
            candidate = run_dir / f"{asset_type}{ext}"
            if candidate.exists():
                return FileResponse(str(candidate))
        raise HTTPException(status_code=404, detail=f"Asset '{asset_type}' not found for run {run_id}")

    return FileResponse(asset_path)
