import React from 'react';
import { calculateThreatLevel } from '../utils/threatCalculator';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function SecurityAlert({ fakeProbability }) {
  const threatInfo = calculateThreatLevel(fakeProbability);
  const probPercent = (fakeProbability * 100).toFixed(1);

  if (threatInfo.level === 'HIGH' || threatInfo.level === 'CRITICAL') {
    return (
      <div className="p-6 sm:p-8 rounded-2xl bg-red-950/60 border-2 border-red-500/60 font-mono space-y-4 shadow-[0_0_35px_rgba(239,68,68,0.3)] corner-brackets-red animate-fadeIn">
        <div className="flex items-center gap-4 text-red-400">
          <div className="p-3 rounded-xl bg-red-900/60 border border-red-500/50">
            <ShieldAlert className="w-8 h-8 shrink-0 animate-pulse text-red-400" />
          </div>
          <div>
            <div className="text-[10px] text-red-400 font-bold uppercase tracking-widest">
              [ INCIDENT NOTIFICATION ]
            </div>
            <h3 className="text-2xl font-extrabold tracking-wide font-display text-white mt-0.5">⚠ SECURITY ALERT</h3>
            <p className="text-xs text-red-200 mt-0.5">Potential synthetic speech detected by Forensics XLS-R Wild engine.</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-red-900/40 border border-red-500/40 text-xs text-red-100 space-y-2">
          <div className="flex justify-between items-center"><span className="text-red-400 font-bold uppercase">AI DEEPFAKE PROBABILITY:</span> <span className="font-extrabold text-white text-base glow-red">{probPercent}%</span></div>
          <div className="flex justify-between items-center border-t border-red-500/30 pt-2"><span className="text-red-400 font-bold uppercase">REQUIRED RESPONSE:</span> <span className="text-red-200 font-bold">{threatInfo.actionRequired}</span></div>
        </div>
      </div>
    );
  }

  if (threatInfo.level === 'MEDIUM') {
    return (
      <div className="p-6 sm:p-8 rounded-2xl bg-amber-950/60 border-2 border-amber-500/60 font-mono space-y-4 shadow-[0_0_30px_rgba(245,158,11,0.25)] animate-fadeIn">
        <div className="flex items-center gap-4 text-amber-300">
          <div className="p-3 rounded-xl bg-amber-900/60 border border-amber-500/50">
            <AlertTriangle className="w-8 h-8 shrink-0 text-amber-400" />
          </div>
          <div>
            <div className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">
              [ ADVISORY NOTICE ]
            </div>
            <h3 className="text-2xl font-extrabold tracking-wide font-display text-white mt-0.5">⚠ REVIEW RECOMMENDED</h3>
            <p className="text-xs text-amber-200 mt-0.5">Acoustic spectrum parameters warrant secondary forensic inspection.</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-900/40 border border-amber-500/40 text-xs text-amber-100 space-y-2">
          <div className="flex justify-between items-center"><span className="text-amber-400 font-bold uppercase">AI PROBABILITY:</span> <span className="font-extrabold text-white text-base">{probPercent}%</span></div>
          <div className="flex justify-between items-center border-t border-amber-500/30 pt-2"><span className="text-amber-400 font-bold uppercase">RECOMMENDED ACTION:</span> <span className="text-amber-200 font-bold">{threatInfo.actionRequired}</span></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-emerald-950/60 border-2 border-emerald-500/60 font-mono space-y-4 shadow-[0_0_35px_rgba(16,185,129,0.3)] corner-brackets-emerald animate-fadeIn">
      <div className="flex items-center gap-4 text-emerald-400">
        <div className="p-3 rounded-xl bg-emerald-900/60 border border-emerald-500/50">
          <CheckCircle2 className="w-8 h-8 shrink-0 text-emerald-400" />
        </div>
        <div>
          <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
            [ VERIFICATION PASSED ]
          </div>
          <h3 className="text-2xl font-extrabold tracking-wide font-display text-white mt-0.5">✓ AUDIO APPEARS BONAFIDE</h3>
          <p className="text-xs text-emerald-200 mt-0.5">Audio signal classified as genuine human speech with high confidence.</p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-500/40 text-xs text-emerald-100 space-y-2">
        <div className="flex justify-between items-center"><span className="text-emerald-400 font-bold uppercase">BONAFIDE CONFIDENCE SCORE:</span> <span className="font-extrabold text-white text-base glow-green">{(100 - parseFloat(probPercent)).toFixed(1)}%</span></div>
        <div className="flex justify-between items-center border-t border-emerald-500/30 pt-2"><span className="text-emerald-400 font-bold uppercase">GUIDANCE:</span> <span className="text-emerald-200 font-bold">{threatInfo.actionRequired}</span></div>
      </div>
    </div>
  );
}
