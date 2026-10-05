import React from 'react';
import { calculateThreatLevel } from '../utils/threatCalculator';
import { ShieldAlert, ShieldCheck, Activity } from 'lucide-react';

export default function ThreatLevel({ fakeProbability, bonafideScore }) {
  const threatInfo = calculateThreatLevel(fakeProbability);
  const fakePercent = (fakeProbability * 100).toFixed(2);
  const bonafidePercent = (bonafideScore * 100).toFixed(2);

  const isFake = fakeProbability >= 0.5;

  return (
    <div className={`cyber-panel p-6 sm:p-8 rounded-2xl border ${threatInfo.borderColor} ${threatInfo.bgColor} space-y-6 font-mono shadow-[0_0_40px_rgba(0,0,0,0.8)] ${isFake ? 'corner-brackets-red' : 'corner-brackets-emerald'}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${isFake ? 'bg-red-950/80 border-red-500/50 text-red-400' : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400'}`}>
            {isFake ? <ShieldAlert className="w-6 h-6 animate-pulse" /> : <ShieldCheck className="w-6 h-6" />}
          </div>
          <div>
            <div className="font-mono text-[10px] text-slate-400 tracking-widest uppercase font-bold">
              [ AUTHENTICITY ASSESSMENT VERDICT ]
            </div>
            <h3 className="text-xl font-bold text-white font-display tracking-tight">
              FORENSIC THREAT EVALUATION
            </h3>
          </div>
        </div>

        <span className="px-3.5 py-1.5 rounded-xl bg-[#030611] text-slate-300 text-xs border border-slate-700/80 font-bold hidden sm:inline">
          {threatInfo.label}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Threat Level Badge & Scale */}
        <div className="md:col-span-6 space-y-4 text-center md:text-left">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block">
              SYSTEM SECURITY THREAT LEVEL
            </span>
            <div className={`text-5xl font-black font-display tracking-tight ${threatInfo.textColor} ${isFake ? 'glow-red' : 'glow-green'}`}>
              {threatInfo.level}
            </div>
          </div>

          {/* Visual Threat Meter */}
          <div className="space-y-1.5">
            <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  threatInfo.level === 'CRITICAL' ? 'bg-red-500 shadow-[0_0_15px_#EF4444]' :
                  threatInfo.level === 'HIGH' ? 'bg-amber-500 shadow-[0_0_15px_#F59E0B]' :
                  threatInfo.level === 'MEDIUM' ? 'bg-yellow-400 shadow-[0_0_15px_#FACC15]' : 'bg-emerald-400 shadow-[0_0_15px_#10B981]'
                }`}
                style={{ width: `${Math.max(fakePercent, 6)}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase tracking-wider">
              <span>0% LOW</span>
              <span>30% MED</span>
              <span>60% HIGH</span>
              <span>80%-100% CRITICAL</span>
            </div>
          </div>
        </div>

        {/* AI Probability vs Bonafide Score Metrics */}
        <div className="md:col-span-6 grid grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[#030611] border border-red-500/30 text-center space-y-1 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">SYNTHETIC PROBABILITY</span>
            <span className="text-3xl font-black text-red-400 font-mono glow-red">{fakePercent}%</span>
            <span className="text-[9px] text-slate-500 block">AI Deepfake Score</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#030611] border border-emerald-500/30 text-center space-y-1 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">BONAFIDE SCORE</span>
            <span className="text-3xl font-black text-emerald-400 font-mono glow-green">{bonafidePercent}%</span>
            <span className="text-[9px] text-slate-500 block">Genuine Speech Score</span>
          </div>
        </div>

      </div>
    </div>
  );
}
