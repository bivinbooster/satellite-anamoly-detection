from fastapi import APIRouter, UploadFile, File
import cv2
import os

from app.processing.image_loader import load_image
from app.inference.inference_engine import run_inference
from app.visualization.heatmap_generator import generate_heatmap
from app.visualization.overlay_generator import generate_overlay

router = APIRouter()

@router.post("/analyze")
async def analyze(before: UploadFile = File(...), after: UploadFile = File(...)):
    img1 = load_image(await before.read())
    img2 = load_image(await after.read())

    diff,score = run_inference(img1,img2)

    heatmap = generate_heatmap(diff)
    overlay = generate_overlay(img2,heatmap)

    # Ensure uploads directory exists
    os.makedirs("uploads", exist_ok=True)
    
    cv2.imwrite("uploads/heatmap.png",heatmap)
    cv2.imwrite("uploads/overlay.png",overlay)

    return {
        "anomaly_percent": float(score),
        "heatmap": "http://localhost:8000/uploads/heatmap.png",
        "overlay": "http://localhost:8000/uploads/overlay.png"
    }
