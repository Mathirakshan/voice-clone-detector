import React from 'react';
import { ShieldCheck, Check, AlertCircle, ShieldAlert } from 'lucide-react';

export default function SecurityRecommendation({ isFake, challengeResult, attackIndicators }) {
  const isFinancial = attackIndicators?.financial;
  const isCredential = attackIndicators?.credential;
  const isUrgency = attackIndicators?.urgency;
  const isIdentity = attackIndicators?.identity;
  const isChallengeSuspicious = challengeResult?.verification_signal === 'ELEVATED_RISK';

  return (
    <div className="cyber-panel corner-brackets p-6 sm:p-8 rounded-2xl bg-[#070C18] border border-[#00E5FF]/30 space-y-5 font-mono text-xs shadow-[0_0_30px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-[#00E5FF] font-bold tracking-widest uppercase">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-[#00E5FF]" />
          <span>[ ACTIONABLE SECURITY RECOMMENDATIONS ]</span>
        </div>
        <span className="text-[10px] text-slate-500 uppercase font-bold">SOC RESPONSE PROTOCOL</span>
      </div>

      <div className="space-y-3">
        {/* Core Voice Recommendation */}
        {isFake && (
          <div className="p-3.5 rounded-xl bg-[#030611] border border-red-500/30 flex items-start gap-3 text-slate-200">
            <Check className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span><strong>High Synthetic Risk Detected:</strong> Do not rely on the voice alone for authentication or approval.</span>
          </div>
        )}

        {/* Dynamic Challenge Recommendation */}
        {isChallengeSuspicious && (
          <div className="p-3.5 rounded-xl bg-[#030611] border border-amber-500/40 flex items-start gap-3 text-slate-200">
            <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span><strong>Elevated Challenge Signal:</strong> Treat the additional verification signal as elevated risk. The challenge response matched synthetic acoustic features.</span>
          </div>
        )}

        {/* Scenario-based Attack Graph Recommendations */}
        {isFinancial && (
          <div className="p-3.5 rounded-xl bg-[#030611] border border-red-500/30 flex items-start gap-3 text-slate-200">
            <Check className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span><strong>Financial Demand Present:</strong> Verify any financial transfer request through a known independent contact method before executing funds movement.</span>
          </div>
        )}

        {isCredential && (
          <div className="p-3.5 rounded-xl bg-[#030611] border border-red-500/30 flex items-start gap-3 text-slate-200">
            <Check className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span><strong>Credential Request Present:</strong> Never share OTPs, passwords, PINs, or multi-factor authentication codes over voice calls.</span>
          </div>
        )}

        {(isUrgency || isIdentity) && (
          <div className="p-3.5 rounded-xl bg-[#030611] border border-amber-500/30 flex items-start gap-3 text-slate-200">
            <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span><strong>Urgency & Impersonation Tactic:</strong> Pause before taking action and independently verify the caller using pre-established trusted channels.</span>
          </div>
        )}

        {!isFake && !isChallengeSuspicious && !isFinancial && !isCredential && (
          <>
            <div className="p-3.5 rounded-xl bg-[#030611] border border-emerald-500/30 flex items-start gap-3 text-slate-200">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Result indicates likely genuine speech with low synthetic voice cloning probability.</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#030611] border border-emerald-500/30 flex items-start gap-3 text-slate-200">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Maintain standard multi-factor verification protocols for critical organizational approvals.</span>
            </div>
          </>
        )}
      </div>

      {/* Mandatory Disclaimer */}
      <div className="p-4 rounded-xl bg-[#030611] border border-slate-800/90 text-[11px] text-slate-400 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-200">DISCLAIMER:</strong> AI forensic evaluation results are probabilistic neural estimations. Security protocols recommend combining voice classification with out-of-band verification.
        </p>
      </div>
    </div>
  );
}
