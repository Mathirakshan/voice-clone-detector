import React from 'react';
import { Shield, ShieldCheck, Cpu, Activity, ArrowRight, Radio, Terminal, Lock, Zap } from 'lucide-react';

export default function Hero({ onStartAnalysis, onViewHowItWorks }) {
  return (
    <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Command Center Text & Actions */}
          <div className="lg:col-span-7 space-y-8 text-left z-10">
            
            {/* Top Security Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-[#0D1527] border border-[#00E5FF]/30 shadow-[0_0_20px_rgba(0,229,255,0.15)] corner-brackets">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-pulse shadow-[0_0_10px_#00E5FF]" />
              <span className="font-mono text-xs font-bold text-[#00E5FF] tracking-widest uppercase">
                [ AI CYBERSECURITY OPERATIONS CENTER ]
              </span>
              <span className="font-mono text-[10px] text-slate-400 border-l border-slate-700 pl-2.5 hidden sm:inline">
                XLS-R WILD 0.3B CLASSIFIER
              </span>
            </div>

            {/* Main Title & Subtitle */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-display">
                DETECT VOICE IMPERSONATION THREATS.
              </h1>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#00E5FF] glow-cyan font-display">
                BEFORE THEY COMPROMISE SECURITY.
              </h2>
            </div>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-sans font-normal">
              AI-powered audio forensics engineered to classify synthetic speech, voice clones, and deepfake impersonations in real time using deep neural spectro-temporal graph attention networks.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onStartAnalysis}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#00E5FF] text-[#030712] font-mono text-xs font-extrabold tracking-widest uppercase transition-all duration-300 hover:bg-[#38BDF8] hover:shadow-[0_0_35px_rgba(0,229,255,0.6)] active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(0,229,255,0.3)]"
              >
                <Shield className="w-5 h-5 text-[#030712] group-hover:rotate-12 transition-transform" />
                <span>OPEN FORENSIC WORKSTATION</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onViewHowItWorks}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-[#0D1527]/90 border border-[#00E5FF]/30 text-slate-200 font-mono text-xs font-bold tracking-wider hover:border-[#00E5FF] hover:bg-[#0D1527] hover:text-[#00E5FF] hover:shadow-[0_0_20px_rgba(0,229,255,0.2)] transition-all duration-200 cursor-pointer"
              >
                <Terminal className="w-4 h-4 text-[#00E5FF]" />
                <span>VIEW ARCHITECTURE & MODEL</span>
              </button>
            </div>

            {/* Real-time Telemetry Bar */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 font-mono text-xs text-slate-400">
              <div className="space-y-1.5 p-3 rounded-xl bg-[#070C18]/80 border border-slate-800/80">
                <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">DETECTION ENGINE</div>
                <div className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
                  <Cpu className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span>XLS-R WILD 0.3B</span>
                </div>
              </div>

              <div className="space-y-1.5 p-3 rounded-xl bg-[#070C18]/80 border border-slate-800/80">
                <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">SIGNAL STREAM</div>
                <div className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
                  <Activity className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>16 kHz PCM MONO</span>
                </div>
              </div>

              <div className="space-y-1.5 p-3 rounded-xl bg-[#070C18]/80 border border-slate-800/80">
                <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">TELEMETRY LATENCY</div>
                <div className="font-bold text-emerald-400 flex items-center gap-1.5 text-xs">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>&lt; 1.2s REALTIME</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Cybersecurity Radar & Shield Visualizer */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
              
              {/* Outer Glow Ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#2563EB]/15 via-[#00E5FF]/20 to-transparent blur-3xl animate-pulse-cyan" />
              
              {/* Concentric Scanner Rings */}
              <div className="absolute inset-2 rounded-full border border-[#00E5FF]/20 cyber-grid-dense" />
              <div className="absolute inset-12 rounded-full border border-[#00E5FF]/30 border-dashed animate-spin-slow" style={{ animationDuration: '35s' }} />
              <div className="absolute inset-24 rounded-full border border-[#38BDF8]/40" />
              
              {/* Rotating Radar Line */}
              <div className="absolute inset-4 rounded-full overflow-hidden">
                <div className="w-full h-full animate-radar origin-center bg-gradient-to-tr from-[#00E5FF]/30 via-transparent to-transparent" />
              </div>

              {/* Central Shield Card */}
              <div className="relative z-10 w-48 h-48 rounded-2xl bg-[#0D1527]/95 backdrop-blur-2xl border border-[#00E5FF]/50 shadow-[0_0_50px_rgba(0,229,255,0.3)] flex flex-col items-center justify-center p-4 text-center corner-brackets">
                
                {/* Shield Icon with animated inner rings */}
                <div className="relative mb-3 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/50 flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                    <Shield className="w-9 h-9 text-[#00E5FF] animate-pulse" />
                  </div>
                  <div className="absolute -inset-1.5 rounded-full border border-[#00E5FF]/30 animate-ping opacity-30" />
                </div>

                <div className="font-mono text-xs font-extrabold tracking-widest text-[#00E5FF] uppercase">
                  FORENSIC SHIELD
                </div>
                <div className="font-mono text-[10px] text-slate-300 mt-1">
                  WAVEFORM THREAT SCAN
                </div>

                {/* Animated Mini Waveform */}
                <div className="flex items-end gap-1 h-4 mt-2">
                  <span className="w-1 bg-[#00E5FF] h-2 animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <span className="w-1 bg-[#00E5FF] h-4 animate-bounce" style={{ animationDelay: '0.3s' }} />
                  <span className="w-1 bg-[#00E5FF] h-3 animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="w-1 bg-[#00E5FF] h-4 animate-bounce" style={{ animationDelay: '0.4s' }} />
                  <span className="w-1 bg-[#00E5FF] h-2 animate-bounce" style={{ animationDelay: '0.15s' }} />
                </div>
              </div>

              {/* Floating Cyber Telemetry Labels */}
              <div className="absolute top-4 left-0 px-3.5 py-1.5 rounded-xl bg-[#070C18]/95 border border-[#00E5FF]/40 font-mono text-[11px] text-slate-200 backdrop-blur-xl shadow-xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
                <span>AUDIO STREAM: ACTIVE</span>
              </div>

              <div className="absolute bottom-6 right-0 px-3.5 py-1.5 rounded-xl bg-[#070C18]/95 border border-emerald-500/40 font-mono text-[11px] text-emerald-400 backdrop-blur-xl shadow-xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>FORENSIC ENGINE: ONLINE</span>
              </div>

              <div className="absolute top-1/2 -right-4 -translate-y-1/2 px-3 py-1 rounded-lg bg-[#070C18]/95 border border-slate-700 font-mono text-[10px] text-slate-400 backdrop-blur-xl hidden sm:block">
                RADAR: 360° SWEEP
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
