import React from 'react';
import { Download, FileText, Printer, Shield } from 'lucide-react';
import { calculateThreatLevel } from '../utils/threatCalculator';

export default function ForensicReport({ result, file }) {
  if (!result) return null;

  const threatInfo = calculateThreatLevel(result.fake_probability);

  const handleDownloadJSON = () => {
    const reportData = {
      system: "VOICEGUARD AI - AUDIO FORENSIC SYSTEM",
      report_type: "VOICE FORENSIC ANALYSIS REPORT",
      generated_at: new Date().toISOString(),
      file_information: {
        filename: result.filename || file?.name || "audio_sample.wav",
        format: result.format || file?.name?.split('.').pop()?.toUpperCase() || "WAV",
        duration_seconds: result.duration || 5.0,
        sample_rate: result.sample_rate || "16 kHz",
        channels: result.channels || "Mono",
        file_size_bytes: file?.size || null
      },
      analysis_result: {
        verdict: result.verdict,
        fake_probability: result.fake_probability,
        bonafide_score: result.bonafide_score,
        threat_level: threatInfo.level,
        status: result.status || "ANALYZED"
      },
      model_information: {
        model_name: "Forensics XLS-R Wild Deepfake Classifier",
        model_id: "eliya/forensics_0.3B_xlsr_wild_deepfake_classifier",
        architecture: "XLS-R 300M Spectro-Temporal Graph Classifier"
      },
      processing_telemetry: {
        processing_time_seconds: result.processing_time || 0.85,
        target_sample_rate: "16000 Hz",
        target_channels: "Mono PCM"
      },
      security_recommendation: threatInfo.actionRequired,
      disclaimer: "AI detection results are probabilistic and should not be treated as the sole basis for identity verification."
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `voiceguard_forensic_report_${result.id || Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>VoiceGuard AI Forensic Report</title>
        <style>
          body { font-family: monospace, monospace; padding: 40px; background: #fff; color: #111; line-height: 1.5; }
          .header { border-bottom: 3px solid #111; padding-bottom: 15px; margin-bottom: 25px; }
          .title { font-size: 24px; font-weight: bold; margin: 0; }
          .subtitle { font-size: 14px; color: #555; }
          .section { margin-bottom: 25px; }
          .section-title { font-size: 14px; font-weight: bold; background: #eee; padding: 6px 10px; margin-bottom: 10px; text-transform: uppercase; border-left: 4px solid #111; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px; }
          .item { margin-bottom: 6px; }
          .label { color: #666; font-size: 11px; text-transform: uppercase; }
          .value { font-weight: bold; font-size: 13px; }
          .verdict { font-size: 20px; font-weight: bold; padding: 10px; border: 2px solid #111; display: inline-block; margin-top: 10px; }
          .verdict.FAKE { background: #fee2e2; color: #991b1b; border-color: #991b1b; }
          .verdict.REAL { background: #d1fae5; color: #065f46; border-color: #065f46; }
          .footer { border-top: 1px solid #ccc; padding-top: 15px; font-size: 11px; color: #666; margin-top: 40px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">VOICEGUARD AI</h1>
          <div class="subtitle">VOICE FORENSIC ANALYSIS REPORT</div>
          <div style="font-size: 11px; color: #777; margin-top: 5px;">Report ID: ${result.id || 'EV-LOG-001'} | Date: ${result.timestamp || new Date().toLocaleString()}</div>
        </div>

        <div class="section">
          <div class="section-title">File Information</div>
          <div class="grid">
            <div class="item"><div class="label">Filename</div><div class="value">${result.filename || file?.name || 'audio_sample.wav'}</div></div>
            <div class="item"><div class="label">Format</div><div class="value">${result.format || 'WAV'}</div></div>
            <div class="item"><div class="label">Duration</div><div class="value">${result.duration} seconds</div></div>
            <div class="item"><div class="label">Sample Rate</div><div class="value">${result.sample_rate || '16 kHz'}</div></div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Analysis Result</div>
          <div class="verdict ${result.verdict}">
            VERDICT: ${result.verdict === 'FAKE' ? 'AI-GENERATED SPEECH' : 'BONAFIDE SPEECH'}
          </div>
          <div class="grid" style="margin-top: 15px;">
            <div class="item"><div class="label">AI Probability</div><div class="value">${(result.fake_probability * 100).toFixed(2)}%</div></div>
            <div class="item"><div class="label">Bonafide Score</div><div class="value">${(result.bonafide_score * 100).toFixed(2)}%</div></div>
            <div class="item"><div class="label">Threat Level</div><div class="value">${threatInfo.level}</div></div>
            <div class="item"><div class="label">Processing Time</div><div class="value">${result.processing_time || 0.85} sec</div></div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Forensic Engine Model</div>
          <div class="grid">
            <div class="item"><div class="label">Classifier</div><div class="value">Forensics XLS-R Wild Deepfake Classifier</div></div>
            <div class="item"><div class="label">HuggingFace Model</div><div class="value">eliya/forensics_0.3B_xlsr_wild_deepfake_classifier</div></div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Security Recommendation</div>
          <p style="font-size: 12px; margin: 0;">${threatInfo.actionRequired}</p>
        </div>

        <div class="footer">
          <strong>DISCLAIMER:</strong> AI detection results are probabilistic and should not be treated as the sole basis for identity verification.
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="cyber-panel corner-brackets p-6 sm:p-8 rounded-2xl bg-[#070C18] border border-[#00E5FF]/30 space-y-4 font-mono text-xs shadow-[0_0_30px_rgba(0,0,0,0.8)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3 text-[#00E5FF] font-extrabold tracking-widest uppercase">
          <FileText className="w-5 h-5 text-[#00E5FF]" />
          <span>[ FORENSIC REPORT & EXPORT CENTER ]</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrintPDF}
            className="px-5 py-2.5 rounded-xl bg-[#00E5FF] hover:bg-[#38BDF8] text-[#030712] font-mono text-xs font-extrabold tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)] flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#030712]" />
            <span>EXPORT PDF REPORT</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="px-5 py-2.5 rounded-xl bg-[#0D1527] hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-mono text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#00E5FF]" />
            <span>EXPORT JSON DATA</span>
          </button>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[#030611] border border-slate-800/90 text-slate-400 space-y-1.5 text-[11px]">
        <div><strong className="text-slate-200 uppercase">DOCUMENT RECORD:</strong> VoiceGuard AI Forensic Audit Certificate</div>
        <div><strong className="text-slate-200 uppercase">CLASSIFICATION VERDICT:</strong> <span className={result.verdict === 'FAKE' ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>{result.verdict}</span> ({ (result.fake_probability * 100).toFixed(1) }% AI Probability)</div>
        <div><strong className="text-slate-200 uppercase">ENGINE SPECIFICATION:</strong> Forensics XLS-R Wild Deepfake Classifier (300M parameters)</div>
      </div>
    </div>
  );
}
