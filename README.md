# VoiceGuard AI — Voice Clone & Deepfake Audio Detector

![VoiceGuard AI](https://img.shields.io/badge/Status-Active-brightgreen)
![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-1.0-009688.svg)
![React](https://img.shields.io/badge/React-18-61DAFB.svg)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg)
![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-EE4C2C.svg)

## 📌 Project Description

**VoiceGuard AI** is a state-of-the-art forensic audio analysis platform designed to detect synthetic voice clones, AI-generated speech, and acoustic deepfakes in real-time. Driven by growing threats of voice impersonation, biometric identity spoofing, and AI-assisted financial fraud, VoiceGuard AI provides cybersecurity teams, digital forensic examiners, and end users with a robust, automated defense mechanism to verify audio authenticity.

The system combines a **deep learning neural network backend** with a **modern interactive forensic dashboard**. The underlying machine learning architecture utilizes fine-tuned XLS-R (Wav2Vec 2.0 cross-lingual speech representations) trained on wild forensic datasets (`Forensics_XLSR_Wild`). By evaluating micro-spectral anomalies, phase jitter, temporal irregularities, high-frequency boundary artifacts, and vocoder generation signatures, VoiceGuard AI outputs a precise probability score distinguishing authentic human speech from AI-cloned audio.

Complementing the backend is an intuitive React frontend equipped with 3D audio visualizers, interactive waveform spectrum monitors, dynamic voice challenge liveness verification, threat level calculators, and comprehensive forensic PDF/JSON export reports. The application stores scan history locally to enable trend tracking and forensic auditing across multiple audio files.

---

## ✨ Key Features

- 🎧 **Multi-Format Audio Scanner**: Analyze uploaded audio files (`.wav`, `.mp3`, `.flac`, `.ogg`, `.m4a`) or record live microphone input directly in the browser.
- 🔬 **XLS-R Deepfake Detection Model**: High-precision forensic classifier detecting subtle neural vocoder artifacts and pitch modulation anomalies.
- 🛡️ **Interactive Dynamic Voice Challenge**: Real-time interactive liveness test prompting users with dynamic phrases to prevent replay attacks and voice cloning bypasses.
- 📊 **Forensic Metadata & Threat Metrics**: Instant breakdown of risk scores, confidence intervals, frequency spectra, and actionable security recommendations.
- 📁 **Scan Audit History**: Automated JSON logging for historical comparison and security auditing.

---

## 🛠️ Tech Stack

- **Backend**: Python 3.9+, FastAPI, PyTorch, Librosa, Transformers, Uvicorn
- **Frontend**: React 18, Vite, Three.js, Lucide Icons, Modern CSS3
- **Model**: `Forensics_XLSR_Wild` (Wav2Vec2 XLS-R Architecture)

---

## 📁 Project Directory Structure

```text
voice-clone-detector/
├── backend/
│   ├── main.py          # FastAPI server endpoints & forensic pipeline logic
│   └── history.json     # Local scan audit history database
├── frontend/
│   ├── src/             # React component hierarchy & UI views
│   ├── package.json     # Frontend dependencies & Vite scripts
│   └── vite.config.js   # Vite configuration
├── model/
│   └── Forensics_XLSR_Wild/  # Neural network model architecture & inference logic
├── package.json         # Root npm workspace runner configuration
├── run.py               # Combined Python launcher script
└── README.md            # Project documentation
```

---

## 🚀 Setup & Installation Guide

### Prerequisites
- **Python**: Version 3.9 or higher installed
- **Node.js**: Version 18.0 or higher installed with `npm`
- **Git**: Installed on your system

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/voice-clone-detector.git
cd voice-clone-detector
```

---

### Step 2: Backend Setup (Python & Dependencies)

1. **Create and activate a virtual environment**:
   - **Windows**:
     ```bash
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **Linux/macOS**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

2. **Install Python dependencies**:
   ```bash
   pip install fastapi uvicorn torch torchaudio transformers librosa pydantic python-multipart
   ```

---

### Step 3: Frontend Setup (Node.js & React)

1. Navigate to the `frontend` folder and install dependencies:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

---

## 🏃 Run the Application

You can start both the FastAPI backend server and Vite React frontend using any of the following methods:

### Method 1: Using the Python Unified Launcher (Recommended)
```bash
python run.py
```

### Method 2: Using NPM Concurrently
```bash
npm run dev
```

### Method 3: Running Services Separately

1. **Backend Server** (Port 8000):
   ```bash
   python -m uvicorn backend.main:app --reload --port 8000
   ```
   *Swagger API Documentation will be available at: http://localhost:8000/docs*

2. **Frontend App** (Port 5173):
   ```bash
   cd frontend
   npm run dev
   ```
   *Open your browser at: http://localhost:5173*

---

## 🔒 License & Disclaimer
This software is intended for educational, research, and defensive security auditing purposes. Ensure compliance with privacy laws and user consent regulations when processing biometric audio data.
