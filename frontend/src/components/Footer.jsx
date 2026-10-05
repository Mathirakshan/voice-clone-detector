import React from 'react';
import { Shield, Radio, Lock } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="mt-20 border-t border-[#00E5FF]/20 bg-[#030712]/95 backdrop-blur-xl py-12 text-xs font-mono text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left branding */}
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-[#0D1527] border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)] corner-brackets">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="font-display text-base font-bold text-white tracking-wider flex items-center gap-2">
              <span>VOICEGUARD AI</span>
              <span className="text-[10px] text-[#00E5FF] font-mono px-1.5 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/30">
                SOC
              </span>
            </div>
            <div className="text-[10px] text-slate-400 tracking-widest uppercase mt-0.5">
              FORENSIC AUDIO SECURITY & DEEPFAKE DETECTION ENGINE
            </div>
          </div>
        </div>

        {/* Center Nav */}
        <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-400 font-bold">
          <button onClick={() => setActiveTab('overview')} className="hover:text-[#00E5FF] transition-colors cursor-pointer">OVERVIEW</button>
          <button onClick={() => setActiveTab('analyze')} className="hover:text-[#00E5FF] transition-colors cursor-pointer">ANALYZE</button>
          <button onClick={() => setActiveTab('dashboard')} className="hover:text-[#00E5FF] transition-colors cursor-pointer">DASHBOARD</button>
          <button onClick={() => setActiveTab('history')} className="hover:text-[#00E5FF] transition-colors cursor-pointer">HISTORY</button>
          <button onClick={() => setActiveTab('how-it-works')} className="hover:text-[#00E5FF] transition-colors cursor-pointer">HOW IT WORKS</button>
          <button onClick={() => setActiveTab('about')} className="hover:text-[#00E5FF] transition-colors cursor-pointer">ABOUT</button>
        </div>

        {/* Right Info */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D1527] border border-emerald-500/30 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>XLS-R WILD 0.3B ONLINE</span>
          </span>
        </div>

      </div>
    </footer>
  );
}
