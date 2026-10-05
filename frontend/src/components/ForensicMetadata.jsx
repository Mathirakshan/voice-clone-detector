import React from 'react';
import { Cpu, FileCode, Sliders, HardDrive, Shield } from 'lucide-react';

export default function ForensicMetadata({ file, duration, metadata }) {
  const fileExt = file?.name?.split('.').pop()?.toUpperCase() || "AUDIO";
  const sizeMB = file?.size ? (file.size / (1024 * 1024)).toFixed(2) : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Audio Forensics Details */}
      <div className="cyber-panel corner-brackets p-6 rounded-2xl bg-[#070C18] border border-[#00E5FF]/30 space-y-4 font-mono text-xs shadow-[0_0_25px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[#00E5FF] font-extrabold tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-[#00E5FF]" />
            <span>[ AUDIO EVIDENCE FILE INTELLIGENCE ]</span>
          </div>
          <HardDrive className="w-3.5 h-3.5 text-slate-500" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-slate-300">
          <div className="space-y-1">
            <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wider">FORMAT EXTENSION</span>
            <span className="font-extrabold text-white text-sm">{fileExt}</span>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wider">FILE SIZE</span>
            <span className="font-extrabold text-white text-sm">{sizeMB ? `${sizeMB} MB` : "N/A"}</span>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wider">RECORDING DURATION</span>
            <span className="font-extrabold text-[#00E5FF] text-sm">{duration ? `${duration.toFixed(2)} sec` : "Detecting..."}</span>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wider">SOURCE STREAM NAME</span>
            <span className="font-bold text-white text-xs truncate block">{file?.name || "Direct Input Stream"}</span>
          </div>
        </div>
      </div>

      {/* Model Input Specifications */}
      <div className="cyber-panel corner-brackets p-6 rounded-2xl bg-[#070C18] border border-[#00E5FF]/30 space-y-4 font-mono text-xs shadow-[0_0_25px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[#38BDF8] font-extrabold tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#38BDF8]" />
            <span>[ FORENSIC CLASSIFIER SPECIFICATIONS ]</span>
          </div>
          <Shield className="w-3.5 h-3.5 text-slate-500" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-slate-300">
          <div className="space-y-1">
            <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wider">TARGET SAMPLE RATE</span>
            <span className="font-extrabold text-white text-sm">16.0 kHz</span>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wider">CHANNEL CONFIG</span>
            <span className="font-extrabold text-white text-sm">MONO 1-CH</span>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wider">ENCODING TYPE</span>
            <span className="font-extrabold text-white text-sm">16-BIT PCM WAV</span>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wider">SPECTRAL WINDOW</span>
            <span className="font-extrabold text-[#38BDF8] text-sm">5.0 SECONDS</span>
          </div>
        </div>
      </div>

    </div>
  );
}
