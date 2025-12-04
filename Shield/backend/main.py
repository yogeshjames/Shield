from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import os

# Add current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.detector import detect_ai_image, download_image, safe_load_base64_image, get_detector_config

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DetectPayload(BaseModel):
    url: str

class UploadPayload(BaseModel):
    image: str

@app.get("/")
async def root():
    """Health check and config info"""
    config = get_detector_config()
    return {
        "status": "AI Shield Backend Running",
        "version": "2.0-enhanced",
        "model": config["model"],
        "features": {
            "ensemble_prediction": config["ensemble_enabled"],
            "metadata_detection": config["metadata_check_enabled"],
            "image_preprocessing": config["preprocessing_enabled"],
            "confidence_threshold": f"{config['confidence_threshold']*100}%"
        }
    }

@app.get("/config")
async def get_config():
    """Get current detector configuration"""
    return get_detector_config()

@app.post("/detect")
async def detect(payload: DetectPayload):
    """
    Detect AI-generated image from URL
    Enhanced with ensemble predictions and metadata checking
    """
    try:
        print(f"\n[Shield] Processing URL: {payload.url[:80]}...")
        
        # Download image
        img = download_image(payload.url)

        if img is None:
            return {
                "prediction": "error",
                "ai_probability": 0.0,
                "human_probability": 0.0,
                "confidence": 0.0,
                "error": "Failed to download image"
            }

        # Enhanced detection with ensemble
        result = detect_ai_image(
            img, 
            use_ensemble=True,      # Use ensemble for higher accuracy
            check_metadata=True      # Check EXIF data first
        )
        
        return result
    
    except Exception as e:
        print(f"[Shield] Detection error: {e}")
        return {
            "prediction": "error",
            "ai_probability": 0.0,
            "human_probability": 0.0,
            "confidence": 0.0,
            "error": str(e)
        }

@app.post("/upload")
async def upload_image(data: UploadPayload):
    """
    Detect AI-generated image from base64 upload
    Enhanced with ensemble predictions and metadata checking
    """
    try:
        print(f"\n[Shield] Processing uploaded image...")
        
        # Load base64 image
        img = safe_load_base64_image(data.image)

        if img is None:
            raise HTTPException(status_code=400, detail="Invalid or unsafe image")

        # Enhanced detection with ensemble
        result = detect_ai_image(
            img,
            use_ensemble=True,      # Use ensemble for higher accuracy
            check_metadata=True      # Check EXIF data first
        )
        
        return result
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"[Shield] Upload error: {e}")
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

@app.post("/detect/fast")
async def detect_fast(payload: DetectPayload):
    """
    Fast detection mode (single prediction, no ensemble)
    Use this for quicker results when accuracy is less critical
    """
    try:
        img = download_image(payload.url)
        
        if img is None:
            return {
                "prediction": "error",
                "ai_probability": 0.0,
                "human_probability": 0.0,
                "error": "Failed to download image"
            }

        # Fast mode: single prediction, no ensemble
        result = detect_ai_image(
            img,
            use_ensemble=False,     # Single prediction only
            check_metadata=True      # Still check metadata (instant)
        )
        
        return result
    
    except Exception as e:
        return {
            "prediction": "error",
            "ai_probability": 0.0,
            "human_probability": 0.0,
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*60)
    print("🛡️  AI SHIELD - Enhanced Detection Backend")
    print("="*60)
    print("Version: 2.0-enhanced")
    print("Features: Ensemble predictions, metadata detection, preprocessing")
    print("="*60 + "\n")
    
    uvicorn.run(app, host="127.0.0.1", port=8000)