import React, { useState, useEffect } from 'react';
import { fetchHistory } from '../services/api';
import { calculateThreatLevel } from '../utils/threatCalculator';
import { Shield, ShieldAlert, ShieldCheck, Activity, BarChart2, RefreshCw, AlertTriangle, Database, ArrowRight } from 'lucide-react';

export default function DashboardPage({ onNavigateToAnalyze }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await fetchHistory();
      setLogs(data || []);
    } catch (err) {
      console.error("Failed to load dashboard logs:", err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  // Compute metrics from REAL history data (No fabricated stats!)
  const totalScans = logs.length;
  const aiGeneratedCount = logs.filter((l) => l.verdict === 'FAKE').length;
  const bonafideCount = logs.filter((l) => l.verdict === 'REAL').length;
  const alertsCount = logs.filter((l) => (l.fake_probability || 0) >= 0.6).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Page Header */}
      <div className="cyber-panel p-6 rounded-2xl border border-[#00E5FF]/30 bg-[#070C18]/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_0_30px_rgba(0,0,0,0.7)] corner-brackets">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#00E5FF] tracking-widest uppercase flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-[#00E5FF]" />
              [ CYBERSECURITY SOC COMMAND ]
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-display mt-1.5 tracking-tight">SECURITY MONITORING CENTER</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Real-time security telemetry, threat analytics & classification audit stream
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadLogs}
            className="p-3 rounded-xl bg-[#0D1527] border border-[#00E5FF]/30 text-slate-200 hover:text-[#00E5FF] hover:border-[#00E5FF] transition-all shadow-[0_0_15px_rgba(0,229,255,0.15)] cursor-pointer"
            title="Refresh Telemetry Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="cyber-panel p-16 text-center rounded-2xl font-mono text-xs text-[#00E5FF] space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#00E5FF]" />
          <span className="font-bold tracking-widest block">FETCHING SOC TELEMETRY METRICS...</span>
        </div>
      ) : totalScans === 0 ? (
        <div className="cyber-panel corner-brackets p-16 text-center rounded-2xl space-y-5 border border-[#00E5FF]/30 bg-[#070C18]">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] shadow-[0_0_30px_rgba(0,229,255,0.2)]">
            <Database className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-white font-display">NO SOC AUDIT LOGS FOUND</h3>
            <p className="text-xs font-mono text-slate-400 max-w-md mx-auto">
              Execute audio forensic scans in the Workstation to generate security telemetry and classification metrics.
            </p>
          </div>
          {onNavigateToAnalyze && (
            <div className="pt-2">
              <button
                onClick={onNavigateToAnalyze}
                className="px-8 py-3.5 rounded-xl bg-[#00E5FF] text-[#030712] font-mono text-xs font-extrabold uppercase tracking-widest hover:bg-[#38BDF8] shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Shield className="w-4 h-4 text-[#030712]" />
                <span>START FIRST FORENSIC SCAN</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8 animate-fadeIn">
          
          {/* TOP METRICS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <div className="cyber-panel p-6 rounded-2xl border border-[#00E5FF]/30 bg-[#070C18] space-y-3 shadow-[0_0_25px_rgba(0,0,0,0.8)]">
              <div className="flex items-center justify-between text-slate-400 font-mono text-xs font-bold">
                <span className="tracking-widest">TOTAL SCANS</span>
                <Activity className="w-4 h-4 text-[#00E5FF]" />
              </div>
              <div className="text-4xl font-black font-mono text-white glow-cyan">{totalScans}</div>
              <div className="text-[10px] font-mono text-slate-400 font-bold">Processed audio signals</div>
            </div>

            <div className="cyber-panel p-6 rounded-2xl border border-red-500/40 bg-red-950/20 space-y-3 shadow-[0_0_25px_rgba(239,68,68,0.15)] corner-brackets-red">
              <div className="flex items-center justify-between text-red-400 font-mono text-xs font-bold">
                <span className="tracking-widest">AI-GENERATED</span>
                <ShieldAlert className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-4xl font-black font-mono text-red-400 glow-red">{aiGeneratedCount}</div>
              <div className="text-[10px] font-mono text-slate-400 font-bold">Synthetic speech detected</div>
            </div>

            <div className="cyber-panel p-6 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 space-y-3 shadow-[0_0_25px_rgba(16,185,129,0.15)] corner-brackets-emerald">
              <div className="flex items-center justify-between text-emerald-400 font-mono text-xs font-bold">
                <span className="tracking-widest">BONAFIDE</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-4xl font-black font-mono text-emerald-400 glow-green">{bonafideCount}</div>
              <div className="text-[10px] font-mono text-slate-400 font-bold">Genuine human audio</div>
            </div>

            <div className="cyber-panel p-6 rounded-2xl border border-amber-500/40 bg-amber-950/20 space-y-3 shadow-[0_0_25px_rgba(245,158,11,0.15)]">
              <div className="flex items-center justify-between text-amber-400 font-mono text-xs font-bold">
                <span className="tracking-widest">HIGH ALERTS</span>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-4xl font-black font-mono text-amber-400">{alertsCount}</div>
              <div className="text-[10px] font-mono text-slate-400 font-bold">High / Critical threat alerts</div>
            </div>

          </div>

          {/* DETECTION ACTIVITY CHART / BREAKDOWN */}
          <div className="cyber-panel corner-brackets p-6 sm:p-8 rounded-2xl bg-[#070C18] border border-[#00E5FF]/30 space-y-6 shadow-[0_0_35px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5 font-mono text-xs font-extrabold text-[#00E5FF] tracking-widest uppercase">
                <BarChart2 className="w-4 h-4 text-[#00E5FF]" />
                <span>[ SPEECH CLASSIFICATION RATIO DISTRIBUTION ]</span>
              </div>
              <span className="font-mono text-[10px] text-slate-400 font-bold">XLS-R WILD MODEL TELEMETRY</span>
            </div>

            <div className="space-y-4">
              {/* Ratio Bar */}
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between text-slate-200 text-xs font-bold">
                  <span className="text-emerald-400">GENUINE SPEECH ({((bonafideCount / totalScans) * 100).toFixed(1)}%)</span>
                  <span className="text-red-400">AI-GENERATED SPEECH ({((aiGeneratedCount / totalScans) * 100).toFixed(1)}%)</span>
                </div>
                <div className="w-full h-5 bg-slate-900 rounded-full overflow-hidden flex border border-slate-800/90 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500 shadow-[0_0_15px_#10B981]"
                    style={{ width: `${(bonafideCount / totalScans) * 100}%` }}
                  />
                  <div
                    className="h-full bg-red-500 transition-all duration-500 shadow-[0_0_15px_#EF4444]"
                    style={{ width: `${(aiGeneratedCount / totalScans) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RECENT SECURITY EVENTS */}
          <div className="cyber-panel p-6 sm:p-8 rounded-2xl bg-[#070C18] border border-[#00E5FF]/20 space-y-5 font-mono text-xs shadow-[0_0_35px_rgba(0,0,0,0.8)]">
            <div className="text-[#00E5FF] font-extrabold tracking-widest uppercase border-b border-slate-800 pb-4 flex items-center justify-between">
              <span>[ RECENT SOC SECURITY EVENTS ]</span>
              <span className="text-slate-400 text-[10px] font-bold">LAST {Math.min(logs.length, 6)} INCIDENTS</span>
            </div>

            <div className="space-y-3">
              {logs.slice(0, 6).map((log) => {
                const threat = calculateThreatLevel(log.fake_probability);
                const isFake = log.verdict === 'FAKE';
                return (
                  <div
                    key={log.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isFake
                        ? 'bg-red-950/20 border-red-500/40 hover:border-red-500'
                        : 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`p-2 rounded-lg border font-bold text-xs ${isFake ? 'bg-red-950 border-red-500/50 text-red-400' : 'bg-emerald-950 border-emerald-500/50 text-emerald-400'}`}>
                        {isFake ? '🔴 FAKE' : '🟢 REAL'}
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">{log.filename}</div>
                        <div className="text-[10px] text-slate-400">{log.timestamp} • {log.format} • {log.id}</div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0 space-y-0.5">
                      <div className={`font-extrabold ${isFake ? 'text-red-400' : 'text-emerald-400'}`}>
                        {isFake ? 'Potential Synthetic Speech' : 'Genuine Human Speech'}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold">
                        AI Probability: {((log.fake_probability || 0) * 100).toFixed(1)}% | Threat: <span className={threat.textColor}>{threat.level}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
