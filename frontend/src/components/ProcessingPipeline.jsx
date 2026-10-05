import React from 'react';
import { CheckCircle2, RefreshCw, Circle, Cpu } from 'lucide-react';

export default function ProcessingPipeline({ currentStep = 0 }) {
  const steps = [
    { label: "AUDIO FILE", description: "Payload loaded" },
    { label: "VALIDATION", description: "Sanity & MIME check" },
    { label: "FORMAT CONVERSION", description: "Audio decoding" },
    { label: "16 kHz MONO", description: "Acoustic resampling" },
    { label: "PREPROCESSING", description: "Normalization & framing" },
    { label: "XLS-R WILD", description: "Deepfake spectro-temporal model" },
    { label: "CLASSIFICATION", description: "Neural softmax scoring" },
    { label: "THREAT ASSESSMENT", description: "Application policy mapping" },
    { label: "REPORT GENERATION", description: "Forensic summary" }
  ];

  return (
    <div className="cyber-panel corner-brackets p-6 rounded-2xl bg-[#070C18] border border-[#00E5FF]/30 space-y-4 font-mono text-xs shadow-[0_0_30px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#00E5FF]" />
          <span className="text-[#00E5FF] font-extrabold tracking-widest uppercase">
            [ FORENSIC PROCESSING PIPELINE ]
          </span>
        </div>
        <span className="text-[#00E5FF] text-[10px] font-bold">
          STAGE {Math.min(currentStep + 1, steps.length)} / {steps.length}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {steps.map((step, idx) => {
          const isDone = currentStep > idx;
          const isCurrent = currentStep === idx;
          const isPending = currentStep < idx;

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                isDone
                  ? "bg-[#00E5FF]/10 border-[#00E5FF]/40 text-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.15)]"
                  : isCurrent
                  ? "bg-[#38BDF8]/20 border-[#00E5FF] text-white animate-pulse shadow-[0_0_20px_rgba(0,229,255,0.3)]"
                  : "bg-[#030611]/80 border-slate-800/80 text-slate-500 opacity-60"
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <span className="text-[#00E5FF] font-extrabold text-sm">✓</span>
                ) : isCurrent ? (
                  <span className="text-[#00E5FF] font-extrabold text-sm animate-ping">◉</span>
                ) : (
                  <span className="text-slate-600 font-normal text-sm">○</span>
                )}
              </div>

              <div className="space-y-0.5 overflow-hidden">
                <div className={`font-extrabold tracking-wider text-[11px] truncate ${
                  isDone ? "text-[#00E5FF]" : isCurrent ? "text-white" : "text-slate-400"
                }`}>
                  {step.label}
                </div>
                <div className="text-[10px] text-slate-400 truncate">{step.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
