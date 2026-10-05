import React, { useEffect, useRef } from 'react';
import { Activity } from 'lucide-react';

export default function AudioWaveform({ isPlaying, audioRef, isScanning }) {
  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    // Connect Web Audio API Analyser if audio element exists
    if (audioRef && audioRef.current && !audioCtxRef.current) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioCtx();
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 128;
        
        // Connect media element
        const source = audioCtx.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);

        audioCtxRef.current = audioCtx;
        analyserRef.current = analyser;
        sourceRef.current = source;
      } catch (err) {
        // Fallback for CORS or re-use restriction
        console.warn("Web Audio API source binding fallback:", err);
      }
    }

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Background Grid
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 16;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center Reference Line
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.3)';
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      const barCount = Math.floor(width / 6);
      const barWidth = 4;
      const centerY = height / 2;

      let frequencyData = null;
      if (analyserRef.current && isPlaying) {
        frequencyData = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(frequencyData);
      }

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + 2);
        let amplitude = 4;

        if (frequencyData && isPlaying) {
          const dataIdx = Math.floor((i / barCount) * frequencyData.length);
          const val = frequencyData[dataIdx] || 0;
          amplitude = Math.max(4, (val / 255) * (height * 0.45));
        } else if (isPlaying || isScanning) {
          const noise = Math.sin(i * 0.2 + phase) * Math.cos(i * 0.08 - phase * 1.2);
          amplitude = Math.abs(noise) * (height * 0.38) + 4;
        } else {
          // Paused state: subtle static baseline
          amplitude = Math.abs(Math.sin(i * 0.15)) * 4 + 3;
        }

        const gradient = ctx.createLinearGradient(0, centerY - amplitude, 0, centerY + amplitude);
        gradient.addColorStop(0, '#00E5FF');
        gradient.addColorStop(0.5, '#38BDF8');
        gradient.addColorStop(1, '#2563EB');

        ctx.fillStyle = gradient;
        // Top bar
        ctx.fillRect(x, centerY - amplitude, barWidth, amplitude);
        // Bottom mirrored bar
        ctx.fillRect(x, centerY, barWidth, amplitude * 0.7);
      }

      if (isPlaying || isScanning) {
        phase += 0.08;
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, isScanning, audioRef]);

  return (
    <div className="w-full bg-[#070C18] border border-[#00E5FF]/30 rounded-2xl p-5 space-y-3 shadow-[0_0_30px_rgba(0,0,0,0.8)] corner-brackets">
      <div className="flex items-center justify-between font-mono text-xs text-[#00E5FF]">
        <div className="flex items-center gap-2.5 font-extrabold tracking-widest uppercase">
          <Activity className="w-4 h-4 text-[#00E5FF]" />
          <span>[ REAL-TIME SPEECH WAVEFORM ]</span>
          <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? "bg-emerald-400 animate-ping" : "bg-slate-600"}`} />
        </div>
        <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">
          {isPlaying ? "SIGNAL STREAM ACTIVE" : isScanning ? "ANALYZING SPECTRUM" : "SIGNAL STANDBY"}
        </span>
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={70}
        className="w-full h-20 block rounded-xl bg-[#030611] border border-slate-800/80 shadow-[inset_0_0_15px_rgba(0,229,255,0.05)]"
      />

      <div className="font-mono text-[10px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <span className="font-bold text-[#00E5FF]">WEB AUDIO API SPECTRUM MONITOR</span>
        <span className="text-slate-500 italic">
          Dynamic audio signal representation for spectro-temporal feature verification.
        </span>
      </div>
    </div>
  );
}
