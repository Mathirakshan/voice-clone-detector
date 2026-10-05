import subprocess
import sys
import os

def main():
    print("Starting VoiceGuard AI (Backend + Frontend)...")
    
    # Path to python executable in virtualenv or system python
    base_dir = os.path.dirname(os.path.abspath(__file__))
    venv_win = os.path.join(base_dir, "venv", "Scripts", "python.exe")
    venv_nix = os.path.join(base_dir, "venv", "bin", "python")
    
    if os.path.exists(venv_win):
        python_exe = venv_win
    elif os.path.exists(venv_nix):
        python_exe = venv_nix
    else:
        python_exe = sys.executable

    # Start FastAPI backend
    backend_cmd = [python_exe, "-m", "uvicorn", "backend.main:app", "--reload", "--port", "8000"]
    
    # Start Vite frontend
    frontend_cmd = ["npm", "run", "dev", "--prefix", "frontend"]

    backend_proc = None
    frontend_proc = None

    try:
        backend_proc = subprocess.Popen(backend_cmd)
        frontend_proc = subprocess.Popen(frontend_cmd, shell=True)

        backend_proc.wait()
        frontend_proc.wait()

    except KeyboardInterrupt:
        print("\nShutting down backend and frontend...")
        if backend_proc:
            backend_proc.terminate()
        if frontend_proc:
            frontend_proc.terminate()

if __name__ == "__main__":
    main()
