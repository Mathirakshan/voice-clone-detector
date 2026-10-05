"""
Forensics XLS-R Wild Deepfake Detector

Supports:
    WAV
    MP3
    MP4
    M4A
    FLAC
    OGG
    WEBM
    AAC
    WMA

All input audio is converted to:
    - Mono
    - 16 kHz
    - PCM 16-bit WAV

Then:
    - Peak normalization
    - 5-second center crop
    - Short audio is repeated to 5 seconds

Model:
    eliya/forensics_0.3B_xlsr_wild_deepfake_classifier
"""

import os
import sys
import tempfile
import subprocess

import numpy as np
import torch
import librosa
import imageio_ffmpeg

from model import DeepfakeDetector


# ============================================================
# CONFIGURATION
# ============================================================

CHECKPOINT = "checkpoint_epoch_4.pt"

TARGET_SAMPLE_RATE = 16000
TARGET_SECONDS = 5.0
TARGET_SAMPLES = int(TARGET_SAMPLE_RATE * TARGET_SECONDS)

SUPPORTED_FORMATS = {
    ".wav",
    ".mp3",
    ".mp4",
    ".m4a",
    ".flac",
    ".ogg",
    ".webm",
    ".aac",
    ".wma",
}


# ============================================================
# HEADER
# ============================================================

print()
print("==============================================")
print("       FORENSICS XLS-R WILD DETECTOR")
print("==============================================")


# ============================================================
# DEVICE
# ============================================================

if torch.cuda.is_available():
    DEVICE = "cuda"
    print("\nDevice          : NVIDIA GPU")
else:
    DEVICE = "cpu"
    print("\nDevice          : CPU")


# ============================================================
# FIND CHECKPOINT
# ============================================================

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

CHECKPOINT_PATH = os.path.join(
    SCRIPT_DIR,
    CHECKPOINT
)

SAFETENSORS_PATH = os.path.join(
    SCRIPT_DIR,
    "checkpoint_epoch_4.safetensors"
)


# ============================================================
# LOAD CHECKPOINT
# ============================================================

def load_state_dict():

    # --------------------------------------------------------
    # Prefer SafeTensors
    # --------------------------------------------------------

    if os.path.exists(SAFETENSORS_PATH):

        print("\nCheckpoint      : checkpoint_epoch_4.safetensors")

        from safetensors.torch import load_file

        return load_file(
            SAFETENSORS_PATH,
            device="cpu"
        )

    # --------------------------------------------------------
    # Otherwise use .pt
    # --------------------------------------------------------

    if os.path.exists(CHECKPOINT_PATH):

        print("\nCheckpoint      : checkpoint_epoch_4.pt")

        checkpoint = torch.load(
            CHECKPOINT_PATH,
            map_location="cpu",
            weights_only=False
        )

        if (
            isinstance(checkpoint, dict)
            and "model_state_dict" in checkpoint
        ):
            return checkpoint["model_state_dict"]

        return checkpoint

    # --------------------------------------------------------
    # No checkpoint
    # --------------------------------------------------------

    raise FileNotFoundError(
        "\nNo model checkpoint found.\n\n"
        "Expected one of:\n"
        f"  {SAFETENSORS_PATH}\n"
        f"  {CHECKPOINT_PATH}\n"
    )


# ============================================================
# LOAD MODEL
# ============================================================

print("\nLoading Forensics XLS-R Wild model...")

try:

    model = DeepfakeDetector()

    state_dict = load_state_dict()

    model.load_state_dict(
        state_dict,
        strict=False
    )

    model = model.to(DEVICE)

    model.eval()

except Exception as e:

    print("\n==============================================")
    print("MODEL LOADING ERROR")
    print("==============================================")

    print(type(e).__name__)
    print(e)

    print("==============================================")

    sys.exit(1)


print("\nModel loaded successfully!")


# ============================================================
# GET FFMPEG
# ============================================================

def get_ffmpeg():

    try:

        return imageio_ffmpeg.get_ffmpeg_exe()

    except Exception as e:

        raise RuntimeError(
            "FFmpeg was not found.\n\n"
            "Install it with:\n"
            "pip install imageio-ffmpeg"
        ) from e


# ============================================================
# CONVERT AUDIO
# ============================================================

def convert_to_wav(input_path):

    """
    Convert input audio/video to:

        WAV
        PCM 16-bit
        16 kHz
        Mono
    """

    ffmpeg = get_ffmpeg()

    temp_file = tempfile.NamedTemporaryFile(
        suffix=".wav",
        delete=False
    )

    output_path = temp_file.name

    temp_file.close()

    command = [
        ffmpeg,

        "-y",

        # Input
        "-i",
        input_path,

        # Select first audio stream
        "-map",
        "0:a:0",

        # Mono
        "-ac",
        "1",

        # 16 kHz
        "-ar",
        "16000",

        # PCM 16-bit
        "-c:a",
        "pcm_s16le",

        # Output
        output_path
    ]

    try:

        subprocess.run(
            command,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            check=True
        )

        return output_path

    except subprocess.CalledProcessError:

        if os.path.exists(output_path):
            os.remove(output_path)

        raise RuntimeError(
            "FFmpeg could not convert this file.\n"
            "Make sure it contains a valid audio stream."
        )


# ============================================================
# LOAD AUDIO
# ============================================================

def load_audio(path):

    extension = os.path.splitext(path)[1].lower()

    if extension not in SUPPORTED_FORMATS:

        raise ValueError(
            f"Unsupported format: {extension}\n\n"
            "Supported formats:\n"
            + ", ".join(sorted(SUPPORTED_FORMATS))
        )

    print("\n==============================================")
    print("AUDIO PROCESSING")
    print("==============================================")

    print("Input file      :", path)
    print("Input format    :", extension.upper())

    converted_file = None

    try:

        # ----------------------------------------------------
        # Convert using FFmpeg
        # ----------------------------------------------------

        converted_file = convert_to_wav(path)

        print("Converted to    : WAV")
        print("Sample rate     : 16000 Hz")
        print("Channels        : Mono")
        print("Encoding        : PCM 16-bit")

        # ----------------------------------------------------
        # Load audio
        # ----------------------------------------------------

        audio, sample_rate = librosa.load(
            converted_file,
            sr=16000,
            mono=True
        )

        audio = np.asarray(
            audio,
            dtype=np.float32
        )

        # ----------------------------------------------------
        # Remove NaN / Infinity
        # ----------------------------------------------------

        audio = np.nan_to_num(
            audio,
            nan=0.0,
            posinf=0.0,
            neginf=0.0
        )

        # ----------------------------------------------------
        # Remove DC offset
        # ----------------------------------------------------

        if len(audio) > 0:

            audio = audio - np.mean(audio)

        # ----------------------------------------------------
        # Peak normalization
        # ----------------------------------------------------

        peak = np.max(
            np.abs(audio)
        )

        if peak > 0:

            audio = audio / peak

        duration = len(audio) / TARGET_SAMPLE_RATE

        print(
            "Duration        :",
            f"{duration:.2f} seconds"
        )

        return audio

    finally:

        # ----------------------------------------------------
        # Delete temporary WAV
        # ----------------------------------------------------

        if (
            converted_file
            and os.path.exists(converted_file)
        ):

            os.remove(converted_file)


# ============================================================
# PREPARE 5-SECOND AUDIO
# ============================================================

def prepare_audio(audio):

    """
    Model expects 5 seconds of audio.

    If audio < 5 sec:
        reflect pad to 5s to maintain boundary signal continuity

    If audio > 5 sec:
        center crop to 5s
    """

    if len(audio) == 0:

        raise ValueError(
            "The audio file contains no usable audio."
        )

    if len(audio) < TARGET_SAMPLES:

        pad_len = TARGET_SAMPLES - len(audio)
        return np.pad(
            audio,
            (0, pad_len),
            mode="reflect"
        ).astype(np.float32)

    elif len(audio) > TARGET_SAMPLES:

        start = (
            len(audio) - TARGET_SAMPLES
        ) // 2

        audio = audio[
            start:start + TARGET_SAMPLES
        ]

    return audio.astype(
        np.float32
    )


# ============================================================
# DETECTION
# ============================================================

THRESHOLD = 0.185

@torch.no_grad()
def detect(audio_path):

    # --------------------------------------------------------
    # Load audio
    # --------------------------------------------------------

    audio = load_audio(
        audio_path
    )

    if len(audio) == 0:
        raise ValueError("The audio file contains no usable audio.")

    # --------------------------------------------------------
    # Prepare 5-second windows (sliding window for long audio)
    # --------------------------------------------------------

    windows = []
    if len(audio) <= TARGET_SAMPLES:
        windows.append(prepare_audio(audio))
    else:
        stride = TARGET_SAMPLES // 2  # 2.5s stride
        for i in range(0, len(audio) - TARGET_SAMPLES + 1, stride):
            windows.append(audio[i:i + TARGET_SAMPLES].astype(np.float32))
        if (len(audio) - TARGET_SAMPLES) % stride != 0:
            windows.append(audio[-TARGET_SAMPLES:].astype(np.float32))

    print("\n==============================================")
    print("MODEL ANALYSIS")
    print("==============================================")
    print(f"Model windows   : {len(windows)} x 5.00s window(s)")

    fake_probabilities = []
    for win in windows:
        audio_tensor = torch.from_numpy(win).unsqueeze(0).to(DEVICE)
        output = model(audio_tensor)
        b_score = torch.sigmoid(output.float()).item()
        fake_probabilities.append(1.0 - b_score)

    # Maximum spoof score across segments
    fake_probability = max(fake_probabilities)
    bonafide_score = 1.0 - fake_probability

    if fake_probability >= THRESHOLD:
        verdict = "FAKE"
    else:
        verdict = "REAL"

    return {
        "fake_probability": fake_probability,
        "bonafide_score": bonafide_score,
        "verdict": verdict
    }


# ============================================================
# DISPLAY RESULT
# ============================================================

def display_result(result):

    fake = result[
        "fake_probability"
    ]

    real = result[
        "bonafide_score"
    ]

    verdict = result[
        "verdict"
    ]

    print("\n==============================================")
    print("             ANALYSIS RESULT")
    print("==============================================")

    print(
        "\nAI-GENERATED / FAKE :",
        f"{fake * 100:.2f}%"
    )

    print(
        "REAL / BONAFIDE     :",
        f"{real * 100:.2f}%"
    )

    print("\n----------------------------------------------")

    if verdict == "FAKE":

        print(
            "FINAL PREDICTION   : AI-GENERATED"
        )

        print(
            "\nWARNING:"
        )

        print(
            "Possible synthetic / cloned voice detected."
        )

    else:

        print(
            "FINAL PREDICTION   : REAL / BONAFIDE"
        )

        print(
            "\nNo spoof detected by the model."
        )

    print("----------------------------------------------")

    print("\nRaw result:")

    print(
        result
    )

    print(
        "==============================================\n"
    )


# ============================================================
# MAIN
# ============================================================

def main():

    if len(sys.argv) < 2:

        print("\nUsage:")

        print(
            'python model\\Forensics_XLSR_Wild\\inference.py '
            '"audio_file"'
        )

        print("\nSupported formats:")

        print(
            "WAV, MP3, MP4, M4A, FLAC, "
            "OGG, WEBM, AAC, WMA"
        )

        print("\nExample:")

        print(
            'python model\\Forensics_XLSR_Wild\\inference.py '
            '"DFBench_Speech25\\dataset\\our voice.mp4"'
        )

        sys.exit(1)

    audio_path = sys.argv[1]

    # --------------------------------------------------------
    # Check file
    # --------------------------------------------------------

    if not os.path.isfile(audio_path):

        print("\n==============================================")
        print("FILE ERROR")
        print("==============================================")

        print(
            "\nFile not found:"
        )

        print(
            audio_path
        )

        sys.exit(1)

    # --------------------------------------------------------
    # Detect
    # --------------------------------------------------------

    try:

        result = detect(
            audio_path
        )

        display_result(
            result
        )

    except KeyboardInterrupt:

        print(
            "\n\nAnalysis cancelled."
        )

        sys.exit(1)

    except Exception as e:

        print("\n==============================================")
        print("ANALYSIS ERROR")
        print("==============================================")

        print(
            "Error type:",
            type(e).__name__
        )

        print(
            "\nError:"
        )

        print(
            e
        )

        print(
            "\n=============================================="
        )

        sys.exit(1)


# ============================================================
# START
# ============================================================

if __name__ == "__main__":
    main()