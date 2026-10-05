import React from 'react';
import { Lock, ShieldCheck, Check } from 'lucide-react';

export default function PrivacyProtection() {
  return (
    <div className="cyber-panel corner-brackets p-6 rounded-2xl bg-[#070C18] border border-[#00E5FF]/30 font-mono text-xs space-y-4 shadow-[0_0_25px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-[#00E5FF] font-extrabold tracking-widest uppercase">
          <Lock className="w-4 h-4 text-[#00E5FF]" />
          <span>[ PRIVACY & DATA GUARANTEE PROTOCOL ]</span>
        </div>
        <span className="text-[10px] text-emerald-400 font-bold">100% SECURE PROCESSING</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-200">
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#030611] border border-slate-800/80">
          <Check className="w-4 h-4 text-[#00E5FF] shrink-0" />
          <span className="text-[11px] font-bold">Secure Local Audio Ingestion</span>
        </div>

        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#030611] border border-slate-800/80">
          <Check className="w-4 h-4 text-[#00E5FF] shrink-0" />
          <span className="text-[11px] font-bold">Auto-Purge Temp Files Post-Scan</span>
        </div>

        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#030611] border border-slate-800/80">
          <Check className="w-4 h-4 text-[#00E5FF] shrink-0" />
          <span className="text-[11px] font-bold">Zero Permanent Voice Bio Retention</span>
        </div>
      </div>
    </div>
  );
}
