import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, RefreshCw, Shield, ArrowRight, AlertCircle, Volume2, Radio } from 'lucide-react';

export default function AudioRecorder({ onRecordingComplete, onCancel }) {
  const [recordingState, setRecordingState] = useState('idle'); // 'idle' | 'recording' | 'recorded'
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [micError, setMicError] = useState("");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, [audioUrl]);

  const startRecording = async () => {
    setMicError("");
    audioChunksRef.current = [];
    setRecordingTime(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup Web Audio Analyser for live mic visualizer
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtx();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || "audio/webm";
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setRecordingState('recorded');

        // Stop all mic tracks
        stream.getTracks().forEach((track) => track.stop());
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
      };

      mediaRecorder.start(100);
      setRecordingState('recording');

      // Timer
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      // Start Visualizer
      drawMicVisualizer();

    } catch (err) {
      console.error("Microphone access error:", err);
      setMicError("Microphone access denied or unsupported. Please check browser permissions.");
      setRecordingState('idle');
    }
  };

  const drawMicVisualizer = () => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current) return;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      if (!analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        ctx.fillStyle = '#00E5FF';
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 2;
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };
    render();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const handleReRecord = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setIsPlaying(false);
    setRecordingState('idle');
    setRecordingTime(0);
    startRecording();
  };

  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const handleAnalyzeRecording = () => {
    if (!audioBlob) return;
    const fileExtension = audioBlob.type.includes('mp4') ? 'mp4' : audioBlob.type.includes('wav') ? 'wav' : 'webm';
    const recordedFile = new File([audioBlob], `live_recording_${Date.now()}.${fileExtension}`, {
      type: audioBlob.type || 'audio/webm',
    });
    onRecordingComplete(recordedFile);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="cyber-panel corner-brackets p-6 sm:p-12 rounded-2xl border border-[#00E5FF]/40 bg-[#070C18] space-y-6 shadow-[0_0_35px_rgba(0,0,0,0.8)]">
      
      {micError && (
        <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/50 flex items-center gap-3 text-red-200 font-mono text-xs">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{micError}</span>
        </div>
      )}

      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}

      {/* IDLE STATE */}
      {recordingState === 'idle' && (
        <div className="text-center space-y-6 py-4">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-[#00E5FF]/10 border-2 border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF] shadow-[0_0_30px_rgba(0,229,255,0.25)] corner-brackets">
            <Mic className="w-10 h-10" />
          </div>

          <div className="space-y-2.5">
            <div className="font-mono text-xs font-extrabold text-[#00E5FF] tracking-widest uppercase flex items-center justify-center gap-2">
              <Radio className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>[ LIVE MICROPHONE STREAM ]</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">Record Voice Evidence</h3>
            <p className="text-xs text-slate-400 font-mono max-w-md mx-auto">
              Speak clearly into your microphone to capture real-time audio input for spectro-temporal deepfake classification.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={startRecording}
              className="px-8 py-4 rounded-xl bg-[#00E5FF] hover:bg-[#38BDF8] text-[#030712] font-mono text-xs font-extrabold tracking-widest uppercase shadow-[0_0_35px_rgba(0,229,255,0.4)] transition-all flex items-center gap-2.5 cursor-pointer"
            >
              <Mic className="w-5 h-5" />
              <span>START RECORDING</span>
            </button>

            {onCancel && (
              <button
                onClick={onCancel}
                className="px-6 py-4 rounded-xl border border-slate-700 text-slate-300 font-mono text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                CANCEL
              </button>
            )}
          </div>
        </div>
      )}

      {/* RECORDING STATE */}
      {recordingState === 'recording' && (
        <div className="text-center space-y-6 py-4 animate-fadeIn">
          <div className="flex items-center justify-center gap-3">
            <span className="w-4 h-4 rounded-full bg-red-500 animate-ping shadow-[0_0_15px_#EF4444]" />
            <span className="font-mono text-xs font-extrabold text-red-500 tracking-widest uppercase">
              🔴 RECORDING LIVE SPEECH INPUT
            </span>
          </div>

          <div className="font-mono text-6xl font-black text-white tracking-widest glow-red">
            {formatTimer(recordingTime)}
          </div>

          {/* Live Waveform Canvas */}
          <div className="w-full h-20 bg-[#030611] rounded-xl border border-red-500/40 overflow-hidden flex items-center justify-center p-2 shadow-[inset_0_0_20px_rgba(239,68,68,0.2)]">
            <canvas ref={canvasRef} width={600} height={70} className="w-full h-full" />
          </div>

          <div>
            <button
              onClick={stopRecording}
              className="px-8 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-extrabold tracking-widest uppercase shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-all flex items-center gap-2.5 mx-auto cursor-pointer"
            >
              <Square className="w-5 h-5 fill-current" />
              <span>STOP RECORDING</span>
            </button>
          </div>
        </div>
      )}

      {/* RECORDED STATE */}
      {recordingState === 'recorded' && (
        <div className="text-center space-y-6 py-4 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-extrabold tracking-widest uppercase shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <span>✓ VOICE RECORDING CAPTURED</span>
          </div>

          <div className="font-mono text-4xl font-extrabold text-white">
            RECORDING DURATION: {formatTimer(recordingTime)}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={handleTogglePlay}
              className="px-7 py-3.5 rounded-xl bg-[#00E5FF]/20 hover:bg-[#00E5FF] text-[#00E5FF] hover:text-[#030712] border border-[#00E5FF]/50 font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? "PAUSE PREVIEW" : "PLAY PREVIEW"}</span>
            </button>

            <button
              onClick={handleReRecord}
              className="px-7 py-3.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>RE-RECORD</span>
            </button>

            <button
              onClick={handleAnalyzeRecording}
              className="px-8 py-3.5 rounded-xl bg-[#00E5FF] text-[#030712] hover:bg-[#38BDF8] font-mono text-xs font-extrabold tracking-widest uppercase shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all flex items-center gap-2.5 cursor-pointer"
            >
              <Shield className="w-5 h-5 text-[#030712]" />
              <span>ANALYZE RECORDING</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
