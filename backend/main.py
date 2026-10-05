import os
import sys
import time
import json
import uuid
import tempfile
import shutil
from typing import List, Dict, Any
from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Add workspace root and model paths to sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "model", "Forensics_XLSR_Wild")
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)
if MODEL_DIR not in sys.path:
    sys.path.insert(0, MODEL_DIR)

# Import Forensics XLS-R Wild inference module
from inference import detect

app = FastAPI(
    title="VoiceGuard AI - Forensic Voice Deepfake Detection API",
    version="1.0.0"
)

# Enable CORS for frontend client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

HISTORY_FILE = os.path.join(os.path.dirname(__file__), "history.json")

def load_history_data() -> List[Dict[str, Any]]:
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []
    return []

def save_history_data(history: List[Dict[str, Any]]):
    try:
        with open(HISTORY_FILE, "w", encoding="utf-8") as f:
            json.dump(history, f, indent=2)
    except Exception as e:
        print(f"Error saving history: {e}")

# Initial seed history if empty
if not os.path.exists(HISTORY_FILE):
    seed_history = [
        {
            "id": "log-001",
            "timestamp": "2026-09-17 20:42:11",
            "filename": "VOICE_RECORDING_01.WAV",
            "format": ".WAV",
            "duration": 14.7,
            "sample_rate": "16 kHz",
            "channels": "Mono",
            "fake_probability": 0.1208,
            "bonafide_score": 0.8792,
            "verdict": "REAL",
            "processing_time": 1.12,
            "status": "ANALYZED"
        },
        {
            "id": "log-002",
            "timestamp": "2026-09-17 20:44:21",
            "filename": "SUSPICIOUS_AUDIO_02.MP3",
            "format": ".MP3",
            "duration": 5.93,
            "sample_rate": "16 kHz",
            "channels": "Mono",
            "fake_probability": 0.7385,
            "bonafide_score": 0.2615,
            "verdict": "FAKE",
            "processing_time": 0.85,
            "status": "THREAT DETECTED"
        }
    ]
    save_history_data(seed_history)

@app.get("/api/health")
def health_check():
    return {
        "status": "ONLINE",
        "system": "VOICEGUARD AI",
        "engine": "Forensics XLS-R Wild Deepfake Classifier",
        "model_version": "0.3B",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    }

@app.get("/api/history")
def get_history():
    return load_history_data()

@app.delete("/api/history")
def clear_history():
    save_history_data([])
    return {"message": "Security analysis log cleared successfully."}

@app.delete("/api/history/{item_id}")
def delete_history_item(item_id: str):
    current = load_history_data()
    updated = [item for item in current if item.get("id") != item_id]
    if len(updated) == len(current):
        raise HTTPException(status_code=404, detail=f"Record {item_id} not found.")
    save_history_data(updated)
    return {"message": f"Record {item_id} deleted successfully."}

@app.post("/api/analyze")
async def analyze_audio(file: UploadFile = File(None), audio: UploadFile = File(None)):
    target_file = file or audio
    if not target_file or not target_file.filename:
        raise HTTPException(status_code=400, detail="No audio file provided")
    file = target_file
    ext = os.path.splitext(file.filename)[1].lower()
    allowed_exts = {".wav", ".mp3", ".m4a", ".flac", ".ogg", ".webm", ".aac", ".wma", ".mp4", ".mpeg"}
    if ext not in allowed_exts:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported format '{ext}'. Allowed: {', '.join(sorted(allowed_exts))}"
        )

    # Save uploaded file to temp file
    temp_dir = tempfile.mkdtemp()
    temp_path = os.path.join(temp_dir, file.filename)

    start_time = time.time()
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Execute Forensics XLS-R Wild detector
        res = detect(temp_path)
        proc_time = round(time.time() - start_time, 2)

        # Read actual audio duration from librosa/soundfile if available
        duration = 5.0
        try:
            import librosa
            audio, sr = librosa.load(temp_path, sr=16000, mono=True)
            duration = round(len(audio) / sr, 2)
        except Exception:
            pass

        fake_prob = round(float(res.get("fake_probability", 0.0)), 4)
        bonafide_score = round(float(res.get("bonafide_score", 0.0)), 4)
        verdict = res.get("verdict", "REAL").upper()

        record = {
            "id": f"log-{uuid.uuid4().hex[:6]}",
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "filename": file.filename,
            "format": ext.upper(),
            "duration": duration,
            "sample_rate": "16 kHz",
            "channels": "Mono",
            "fake_probability": fake_prob,
            "bonafide_score": bonafide_score,
            "verdict": verdict,
            "processing_time": proc_time,
            "status": "THREAT DETECTED" if verdict == "FAKE" else "ANALYZED"
        }

        # Update persistent history
        current_history = load_history_data()
        current_history.insert(0, record)
        save_history_data(current_history)

        return record

    except Exception as e:
        print(f"Analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"Forensic Engine Analysis Error: {str(e)}")

    finally:
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir, ignore_errors=True)

import random

# Active challenges store (in-memory)
ACTIVE_CHALLENGES: Dict[str, Dict[str, Any]] = {}

NUMBERS = [str(n) for n in range(10, 100)]
COLORS = ["BLUE", "GREEN", "RED", "SILVER", "GOLD", "PURPLE", "NEON", "AMBER"]
WORDS = ["TIGER", "ROCKET", "MANGO", "EAGLE", "LION", "RIVER", "FALCON", "PHOENIX", "ORBIT", "SHIELD", "DRAGON", "VIPER"]

@app.post("/api/challenge/generate")
def generate_challenge():
    """Generates a fresh random dynamic voice challenge phrase."""
    number = random.choice(NUMBERS)
    color = random.choice(COLORS)
    word = random.choice(WORDS)
    phrase = f"{number} {color} {word}"
    challenge_id = f"VC-2026-{uuid.uuid4().hex[:6].upper()}"
    
    challenge_data = {
        "challenge_id": challenge_id,
        "phrase": phrase,
        "status": "ACTIVE",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    }
    ACTIVE_CHALLENGES[challenge_id] = challenge_data
    return challenge_data

@app.post("/api/analyze-challenge")
async def analyze_challenge(
    challengeId: str = Query(None),
    file: UploadFile = File(None),
    audio: UploadFile = File(None)
):
    """Analyzes a dynamic voice challenge response using the core Forensics XLS-R Wild model."""
    target_file = file or audio
    if not target_file or not target_file.filename:
        raise HTTPException(status_code=400, detail="No challenge response audio file provided")
    
    file = target_file
    ext = os.path.splitext(file.filename)[1].lower()
    allowed_exts = {".wav", ".mp3", ".m4a", ".flac", ".ogg", ".webm", ".aac", ".wma", ".mp4", ".mpeg"}
    if ext not in allowed_exts:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported format '{ext}'. Allowed: {', '.join(sorted(allowed_exts))}"
        )

    # Save uploaded challenge audio to temp file
    temp_dir = tempfile.mkdtemp()
    temp_path = os.path.join(temp_dir, file.filename)
    start_time = time.time()

    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Execute Forensics XLS-R Wild detector on challenge audio
        res = detect(temp_path)
        proc_time = round(time.time() - start_time, 2)

        fake_prob = round(float(res.get("fake_probability", 0.0)), 4)
        bonafide_score = round(float(res.get("bonafide_score", 0.0)), 4)
        verdict = res.get("verdict", "REAL").upper()

        # Verification signal: LOW_RISK if synthetic probability < 0.40, else ELEVATED_RISK
        verification_signal = "LOW_RISK" if fake_prob < 0.40 else "ELEVATED_RISK"
        
        # Security interpretation disclaimer
        interpretation = (
            "The challenge response provides an additional security signal. "
            "It does not independently prove identity or guarantee that the speaker is human."
        )

        # Mark challenge as COMPLETED if challengeId provided
        phrase_used = "UNKNOWN"
        if challengeId and challengeId in ACTIVE_CHALLENGES:
            ACTIVE_CHALLENGES[challengeId]["status"] = "COMPLETED"
            phrase_used = ACTIVE_CHALLENGES[challengeId].get("phrase", "UNKNOWN")

        challenge_result = {
            "challenge_id": challengeId or f"VC-2026-{uuid.uuid4().hex[:6].upper()}",
            "filename": file.filename,
            "phrase": phrase_used,
            "status": "COMPLETED",
            "fake_probability": fake_prob,
            "bonafide_score": bonafide_score,
            "verdict": verdict,
            "verification_signal": verification_signal,
            "processing_time": proc_time,
            "security_interpretation": interpretation,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }


        return challenge_result

    except Exception as e:
        print(f"Challenge analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"Challenge Forensic Analysis Error: {str(e)}")

    finally:
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir, ignore_errors=True)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

