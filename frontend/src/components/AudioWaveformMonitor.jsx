import React, { useEffect, useRef } from 'react';

export default function AudioWaveformMonitor({ isScanning }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Background subtle grid
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.07)';
      ctx.lineWidth = 1;
      const gridSize = 20;
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

      // Draw Center Reference Line
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.2)';
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Signal Frequency Waveform Bars
      const barCount = Math.floor(width / 6);
      const barWidth = 4;
      const centerY = height / 2;

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + 2);
        let amplitude = 4;

        if (isScanning) {
          const noise = Math.sin(i * 0.15 + phase) * Math.cos(i * 0.05 - phase * 0.7);
          const noise2 = Math.sin(i * 0.4 - phase * 1.5) * 0.5;
          amplitude = Math.abs(noise + noise2) * (height * 0.42) + 4;
        } else {
          amplitude = Math.abs(Math.sin(i * 0.2 + phase * 0.3)) * 8 + 3;
        }

        const gradient = ctx.createLinearGradient(0, centerY - amplitude, 0, centerY + amplitude);
        gradient.addColorStop(0, '#00E5FF');
        gradient.addColorStop(0.5, '#38BDF8');
        gradient.addColorStop(1, '#3B82F6');

        ctx.fillStyle = gradient;
        // Upper bar
        ctx.fillRect(x, centerY - amplitude, barWidth, amplitude);
        // Lower bar mirror
        ctx.fillRect(x, centerY, barWidth, amplitude * 0.7);
      }

      phase += isScanning ? 0.08 : 0.02;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isScanning]);

  return (
    <div className="w-full bg-[#070C18] border border-[#00E5FF]/20 rounded-xl p-3 relative overflow-hidden">
      <div className="flex items-center justify-between font-mono text-[10px] text-[#00E5FF] mb-2 px-1">
        <span className="flex items-center gap-1.5 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-ping" />
          SIGNAL FREQUENCY SPECTRUM MONITOR
        </span>
        <span className="text-slate-400 font-mono">16.0 kHz PCM MONO</span>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={64}
        className="w-full h-16 block rounded bg-[#030611]"
      />
    </div>
  );
}
