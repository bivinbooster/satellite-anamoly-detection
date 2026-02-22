from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
import uuid
import os
from typing import Dict, Any
from PIL import Image, ImageDraw
import numpy as np
import io

app = FastAPI(title="Satellite Anomaly Studio API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for demo purposes
runs: Dict[str, Any] = {}

@app.get("/")
async def root():
    return {"message": "Satellite Anomaly Studio API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/runs")
async def create_run(t0: UploadFile = File(...), t1: UploadFile = File(...)):
    run_id = str(uuid.uuid4())
    
    # Create uploads directory if it doesn't exist
    os.makedirs("uploads", exist_ok=True)
    
    # Save files (for demo purposes)
    with open(f"uploads/{run_id}_t0.tif", "wb") as f:
        content = await t0.read()
        f.write(content)
    
    with open(f"uploads/{run_id}_t1.tif", "wb") as f:
        content = await t1.read()
        f.write(content)
    
    # Initialize run with mock data
    runs[run_id] = {
        "run_id": run_id,
        "status": "created",
        "files": {
            "t0": t0.filename,
            "t1": t1.filename
        }
    }
    
    return {"run_id": run_id}

@app.post("/api/runs/{run_id}/detect")
async def detect_run(run_id: str):
    if run_id not in runs:
        raise HTTPException(status_code=404, detail="Run not found")
    
    # Mock detection result
    result = {
        "run_id": run_id,
        "size": [512, 512],
        "assets": {
            "t0_rgb": f"/api/assets/{run_id}/t0_rgb",
            "t1_rgb": f"/api/assets/{run_id}/t1_rgb",
            "diff_rgb": f"/api/assets/{run_id}/diff_rgb",
            "heatmap": f"/api/assets/{run_id}/heatmap",
            "overlay": f"/api/assets/{run_id}/overlay",
            "landcover": f"/api/assets/{run_id}/landcover",
            "anomaly_u8": f"/api/assets/{run_id}/anomaly_u8"
        },
        "metrics": {
            "global": {
                "anomaly_pixels_pct": 2.34,
                "score_mean": 0.156,
                "score_p95": 0.892
            },
            "by_category": {
                "water": {"anomaly_pixels_pct": 0.5, "pixels": 1000},
                "vegetation": {"anomaly_pixels_pct": 1.2, "pixels": 5000},
                "urban": {"anomaly_pixels_pct": 3.8, "pixels": 3000},
                "bare": {"anomaly_pixels_pct": 0.8, "pixels": 2000}
            }
        },
        "threshold_suggestion": 0.25,
        "landcover_labels": {
            "water": 1,
            "vegetation": 2,
            "urban": 3,
            "bare": 4
        }
    }
    
    runs[run_id].update(result)
    runs[run_id]["status"] = "completed"
    
    return result

@app.get("/api/runs/{run_id}")
async def get_run(run_id: str):
    if run_id not in runs:
        raise HTTPException(status_code=404, detail="Run not found")
    
    return runs[run_id]

def create_mock_image(asset_type: str) -> bytes:
    """Create realistic mock satellite images for demonstration purposes"""
    width, height = 512, 512
    img = Image.new('RGB', (width, height))
    pixels = img.load()
    
    if asset_type == "t0_rgb":
        # Create realistic satellite image (before) - landscape with terrain
        import random
        
        # Create base terrain with natural patterns
        for y in range(height):
            for x in range(width):
                # Simulate natural terrain with multiple layers
                noise1 = np.sin(x/100) * np.cos(y/100) * 50
                noise2 = np.sin(x/50) * np.sin(y/75) * 30
                noise3 = random.random() * 20
                
                # Base terrain color (green/brown landscape)
                base_r = 80 + int(noise1 + noise2 + noise3)
                base_g = 120 + int(noise1 * 0.8 + noise2 + noise3)
                base_b = 60 + int(noise1 * 0.5 + noise3)
                
                # Add water bodies (blue areas)
                water_mask = np.sin(x/80) * np.cos(y/60) > 0.3
                if water_mask:
                    base_r = 40 + int(noise3)
                    base_g = 80 + int(noise3)
                    base_b = 140 + int(noise1)
                
                # Add vegetation (darker green patches)
                veg_mask = np.sin(x/40) * np.sin(y/40) > 0.2
                if veg_mask and not water_mask:
                    base_r = max(30, base_r - 30)
                    base_g = min(180, base_g + 40)
                    base_b = max(20, base_b - 20)
                
                pixels[x, y] = (
                    max(0, min(255, base_r)),
                    max(0, min(255, base_g)),
                    max(0, min(255, base_b))
                )
    
    elif asset_type == "t1_rgb":
        # Create realistic satellite image (after) with visible changes
        import random
        
        for y in range(height):
            for x in range(width):
                # Similar base terrain as before
                noise1 = np.sin(x/100) * np.cos(y/100) * 50
                noise2 = np.sin(x/50) * np.sin(y/75) * 30
                noise3 = random.random() * 20
                
                base_r = 80 + int(noise1 + noise2 + noise3)
                base_g = 120 + int(noise1 * 0.8 + noise2 + noise3)
                base_b = 60 + int(noise1 * 0.5 + noise3)
                
                water_mask = np.sin(x/80) * np.cos(y/60) > 0.3
                if water_mask:
                    base_r = 40 + int(noise3)
                    base_g = 80 + int(noise3)
                    base_b = 140 + int(noise1)
                
                veg_mask = np.sin(x/40) * np.sin(y/40) > 0.2
                if veg_mask and not water_mask:
                    base_r = max(30, base_r - 30)
                    base_g = min(180, base_g + 40)
                    base_b = max(20, base_b - 20)
                
                # Add visible changes (urbanization, deforestation, etc.)
                change_mask = (x > 150 and x < 350 and y > 100 and y < 400) or \
                             (x > 200 and x < 450 and y > 50 and y < 200)
                
                if change_mask:
                    # Simulate urban development (gray/brown)
                    base_r = min(200, base_r + 60)
                    base_g = min(200, base_g + 40)
                    base_b = min(200, base_b + 50)
                
                # Simulate deforestation (lighter brown)
                forest_change = (x > 100 and x < 250 and y > 250 and y < 450)
                if forest_change and veg_mask:
                    base_r = min(180, base_r + 50)
                    base_g = max(80, base_g - 40)
                    base_b = max(40, base_b - 20)
                
                pixels[x, y] = (
                    max(0, min(255, base_r)),
                    max(0, min(255, base_g)),
                    max(0, min(255, base_b))
                )
    
    elif asset_type == "heatmap":
        # Create realistic anomaly heatmap
        for y in range(height):
            for x in range(width):
                # Create realistic heat patterns based on change areas
                heat_value = 0
                
                # Hot spots in areas of change
                if (x > 150 and x < 350 and y > 100 and y < 400):
                    heat_value = max(heat_value, 0.8 * np.exp(-((x-250)**2 + (y-250)**2)/10000))
                if (x > 200 and x < 450 and y > 50 and y < 200):
                    heat_value = max(heat_value, 0.9 * np.exp(-((x-325)**2 + (y-125)**2)/8000))
                if (x > 100 and x < 250 and y > 250 and y < 450):
                    heat_value = max(heat_value, 0.7 * np.exp(-((x-175)**2 + (y-350)**2)/12000))
                
                # Add some noise for realism
                heat_value += np.random.random() * 0.1
                heat_value = min(1.0, heat_value)
                
                # Convert to color (blue -> green -> yellow -> red)
                if heat_value < 0.25:
                    # Blue to cyan
                    r = 0
                    g = int(heat_value * 4 * 100)
                    b = 255
                elif heat_value < 0.5:
                    # Cyan to green
                    r = 0
                    g = 255
                    b = int((0.5 - heat_value) * 4 * 255)
                elif heat_value < 0.75:
                    # Green to yellow
                    r = int((heat_value - 0.5) * 4 * 255)
                    g = 255
                    b = 0
                else:
                    # Yellow to red
                    r = 255
                    g = int((1.0 - heat_value) * 4 * 255)
                    b = 0
                
                pixels[x, y] = (r, g, b)
    
    elif asset_type == "overlay":
        # Create base satellite image first
        import random
        
        for y in range(height):
            for x in range(width):
                noise1 = np.sin(x/100) * np.cos(y/100) * 50
                noise2 = np.sin(x/50) * np.sin(y/75) * 30
                noise3 = random.random() * 20
                
                base_r = 80 + int(noise1 + noise2 + noise3)
                base_g = 120 + int(noise1 * 0.8 + noise2 + noise3)
                base_b = 60 + int(noise1 * 0.5 + noise3)
                
                water_mask = np.sin(x/80) * np.cos(y/60) > 0.3
                if water_mask:
                    base_r = 40 + int(noise3)
                    base_g = 80 + int(noise3)
                    base_b = 140 + int(noise1)
                
                veg_mask = np.sin(x/40) * np.sin(y/40) > 0.2
                if veg_mask and not water_mask:
                    base_r = max(30, base_r - 30)
                    base_g = min(180, base_g + 40)
                    base_b = max(20, base_b - 20)
                
                # Add red overlay for anomalies
                overlay_intensity = 0
                if (x > 150 and x < 350 and y > 100 and y < 400):
                    overlay_intensity = max(overlay_intensity, 0.6)
                if (x > 200 and x < 450 and y > 50 and y < 200):
                    overlay_intensity = max(overlay_intensity, 0.8)
                if (x > 100 and x < 250 and y > 250 and y < 450):
                    overlay_intensity = max(overlay_intensity, 0.5)
                
                # Blend red overlay with base image
                pixels[x, y] = (
                    min(255, base_r + int(overlay_intensity * 150)),
                    max(0, base_g - int(overlay_intensity * 50)),
                    max(0, base_b - int(overlay_intensity * 50))
                )
    
    else:
        # Default: realistic gradient
        for y in range(height):
            for x in range(width):
                intensity = int(128 + 127 * np.sin(x/100) * np.cos(y/100))
                pixels[x, y] = (intensity, intensity, intensity)
    
    # Convert to bytes
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='PNG')
    return img_bytes.getvalue()

@app.get("/api/assets/{run_id}/{asset_type}")
async def get_asset(run_id: str, asset_type: str):
    """Generate and return mock images for different asset types"""
    try:
        image_bytes = create_mock_image(asset_type)
        return Response(
            content=image_bytes,
            media_type="image/png",
            headers={"Cache-Control": "no-cache"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate image: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)