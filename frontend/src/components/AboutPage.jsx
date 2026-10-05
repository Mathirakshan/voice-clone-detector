import React from 'react';
import { Cpu, Shield, Server, Activity, Database, CheckCircle2, Award, FileCode } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#0D1527] border border-[#00E5FF]/30 font-mono text-xs text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.15)] corner-brackets">
          <Cpu className="w-4 h-4 text-[#00E5FF]" />
          <span>[ NEURAL ARCHITECTURE SPECIFICATIONS ]</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white font-display tracking-tight">
          FORENSICS XLS-R WILD ENGINE
        </h1>
        <p className="text-base text-slate-300 font-sans max-w-2xl mx-auto leading-relaxed">
          State-of-the-art 300M parameter speech deepfake classification architecture engineered for real-world out-of-domain audio forensics.
        </p>
      </div>

      {/* Model Spec Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="cyber-panel corner-brackets p-7 rounded-2xl bg-[#070C18] space-y-3.5 border border-[#00E5FF]/30 shadow-[0_0_25px_rgba(0,0,0,0.8)]">
          <div className="font-mono text-xs text-[#00E5FF] font-extrabold uppercase tracking-wider">[ TRANSFORMER BACKBONE ]</div>
          <h3 className="text-xl font-extrabold text-white font-display">Wav2Vec2 XLS-R 300M</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-mono">
            Cross-lingual self-supervised speech representation transformer trained on over 436,000 hours of raw audio across 128 languages.
          </p>
        </div>

        <div className="cyber-panel corner-brackets p-7 rounded-2xl bg-[#070C18] space-y-3.5 border border-[#00E5FF]/30 shadow-[0_0_25px_rgba(0,0,0,0.8)]">
          <div className="font-mono text-xs text-[#00E5FF] font-extrabold uppercase tracking-wider">[ GRAPH POOLING ]</div>
          <h3 className="text-xl font-extrabold text-white font-display">AASIST Graph Attention</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-mono">
            Integrated Spectro-Temporal Graph Attention Networks (AASIST) construct spatial and temporal graph structures to spot micro-level spectral anomalies.
          </p>
        </div>

        <div className="cyber-panel corner-brackets p-7 rounded-2xl bg-[#070C18] space-y-3.5 border border-[#00E5FF]/30 shadow-[0_0_25px_rgba(0,0,0,0.8)]">
          <div className="font-mono text-xs text-[#00E5FF] font-extrabold uppercase tracking-wider">[ PREPROCESSING ]</div>
          <h3 className="text-xl font-extrabold text-white font-display">Reflection Signal Boundary</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-mono">
            16 kHz Mono PCM resample pipeline with boundary reflection padding to prevent phase step jumps and retain signal continuity.
          </p>
        </div>

      </div>

      {/* Benchmark EER Table */}
      <div className="cyber-panel corner-brackets p-8 sm:p-10 rounded-2xl bg-[#070C18] border border-[#00E5FF]/30 space-y-6 shadow-[0_0_35px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-2xl font-extrabold text-white font-display">BENCHMARK EVALUATION RESULTS</h3>
            <p className="text-xs font-mono text-slate-400 mt-1">Equal Error Rate (EER %) across standard audio deepfake benchmarks</p>
          </div>
          <span className="px-4 py-2 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 font-mono text-xs text-[#00E5FF] font-extrabold tracking-wider shadow-[0_0_15px_rgba(0,229,255,0.2)]">
            1.03% EER ON IN-THE-WILD
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-5 rounded-xl bg-[#030611] border border-[#00E5FF]/30 space-y-1 text-center">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">In-the-Wild</div>
            <div className="text-2xl font-black text-[#00E5FF] glow-cyan">1.03%</div>
            <div className="text-[10px] text-slate-400 font-bold">Real-world speech</div>
          </div>

          <div className="p-5 rounded-xl bg-[#030611] border border-emerald-500/30 space-y-1 text-center">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">DFADD Benchmark</div>
            <div className="text-2xl font-black text-emerald-400 glow-green">0.30%</div>
            <div className="text-[10px] text-slate-400 font-bold">Synthetic audio</div>
          </div>

          <div className="p-5 rounded-xl bg-[#030611] border border-emerald-500/30 space-y-1 text-center">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">CodecFake</div>
            <div className="text-2xl font-black text-emerald-400 glow-green">1.90%</div>
            <div className="text-[10px] text-slate-400 font-bold">Compressed streams</div>
          </div>

          <div className="p-5 rounded-xl bg-[#030611] border border-emerald-500/30 space-y-1 text-center">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">ASVspoof2019 LA</div>
            <div className="text-2xl font-black text-emerald-400 glow-green">1.48%</div>
            <div className="text-[10px] text-slate-400 font-bold">Logical Access</div>
          </div>
        </div>
      </div>

    </div>
  );
}
