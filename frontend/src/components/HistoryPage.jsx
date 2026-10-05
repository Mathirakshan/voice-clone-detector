import React, { useState, useEffect } from 'react';
import { fetchHistory, clearHistory, deleteHistoryItem } from '../services/api';
import { calculateThreatLevel } from '../utils/threatCalculator';
import ForensicReport from './ForensicReport';
import { Database, Search, ShieldCheck, ShieldAlert, Trash2, RefreshCw, FileText, Filter, Eye, X } from 'lucide-react';

export default function HistoryPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("ALL"); // ALL, REAL, FAKE
  const [selectedReportLog, setSelectedReportLog] = useState(null);

  const loadHistoryLogs = async () => {
    setLoading(true);
    try {
      const data = await fetchHistory();
      setLogs(data || []);
    } catch (err) {
      console.error("Failed to fetch security logs:", err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistoryLogs();
  }, []);

  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear all security analysis audit logs?")) return;
    try {
      await clearHistory();
      setLogs([]);
    } catch (err) {
      console.error("Failed to clear logs:", err);
    }
  };

  const handleDeleteItem = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteHistoryItem(id);
      setLogs((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete log item:", err);
    }
  };

  const filteredLogs = logs.filter(item => {
    const matchesSearch = item.filename?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "ALL" || item.verdict === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Page Header */}
      <div className="cyber-panel p-6 rounded-2xl border border-[#00E5FF]/30 bg-[#070C18]/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_0_30px_rgba(0,0,0,0.7)] corner-brackets">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#00E5FF] tracking-widest uppercase flex items-center gap-1.5">
              <Database className="w-4 h-4 text-[#00E5FF]" />
              [ FORENSIC CASE ARCHIVE ]
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-display mt-1.5 tracking-tight">SECURITY ANALYSIS LOGS</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Historical audit stream of all analyzed speech recordings & neural threat assessments
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadHistoryLogs}
            className="p-3 rounded-xl bg-[#0D1527] border border-[#00E5FF]/30 text-slate-200 hover:text-[#00E5FF] hover:border-[#00E5FF] transition-all shadow-[0_0_15px_rgba(0,229,255,0.15)] cursor-pointer"
            title="Refresh logs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {logs.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 font-mono text-xs font-bold hover:bg-red-900/60 hover:border-red-500 transition-all cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.2)]"
            >
              <Trash2 className="w-4 h-4" />
              <span>CLEAR CASE ARCHIVE</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="cyber-panel p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs bg-[#070C18] border border-[#00E5FF]/20 shadow-[0_0_25px_rgba(0,0,0,0.8)]">
        
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="SEARCH BY FILENAME OR ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#030611] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00E5FF] font-bold"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-500 mr-1" />
          {['ALL', 'REAL', 'FAKE'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wider transition-all cursor-pointer ${
                filterType === type
                  ? 'bg-[#00E5FF] text-[#030712] shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                  : 'bg-[#030611] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {type === 'FAKE' ? 'AI-GENERATED' : type === 'REAL' ? 'BONAFIDE' : 'ALL CASES'}
            </button>
          ))}
        </div>

      </div>

      {/* Report Modal */}
      {selectedReportLog && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-4xl w-full bg-[#070C18] border border-[#00E5FF]/50 rounded-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto space-y-4 shadow-[0_0_50px_rgba(0,229,255,0.3)] corner-brackets">
            <button
              onClick={() => setSelectedReportLog(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white bg-[#030611] rounded-xl border border-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5 text-[#00E5FF]" />
            </button>
            <div className="font-mono text-xs font-extrabold text-[#00E5FF] tracking-widest uppercase mb-1">
              [ CASE REPORT AUDIT CERTIFICATE ]
            </div>
            <ForensicReport result={selectedReportLog} file={null} />
          </div>
        </div>
      )}

      {/* Logs List */}
      {loading ? (
        <div className="cyber-panel p-16 text-center rounded-2xl font-mono text-xs text-[#00E5FF] space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#00E5FF]" />
          <span className="font-bold tracking-widest block">LOADING AUDIT CASE LOGS...</span>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="cyber-panel corner-brackets p-16 text-center rounded-2xl space-y-4 bg-[#070C18] border border-slate-800">
          <Database className="w-12 h-12 text-slate-600 mx-auto" />
          <div className="font-mono text-lg text-white font-extrabold">NO RECORDINGS MATCH CRITERIA</div>
          <div className="font-mono text-xs text-slate-500 max-w-md mx-auto">No security analysis logs match your selected filter or search term.</div>
        </div>
      ) : (
        <div className="space-y-4 font-mono text-xs animate-fadeIn">
          {filteredLogs.map((log) => {
            const isFake = log.verdict === 'FAKE';
            const threat = calculateThreatLevel(log.fake_probability);

            return (
              <div
                key={log.id}
                className={`cyber-panel p-6 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                  isFake
                    ? 'border-red-500/40 hover:border-red-500 bg-red-950/15 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
                    : 'border-emerald-500/40 hover:border-emerald-500 bg-emerald-950/15 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                }`}
              >
                {/* Left: Timestamp, Icon, Filename */}
                <div className="flex items-start sm:items-center gap-4">
                  <div className={`p-3 rounded-xl border ${isFake ? 'bg-red-950/90 border-red-500/60 text-red-400' : 'bg-emerald-950/90 border-emerald-500/60 text-emerald-400'}`}>
                    {isFake ? <ShieldAlert className="w-6 h-6 animate-pulse" /> : <ShieldCheck className="w-6 h-6" />}
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] text-slate-400 font-bold flex items-center gap-2">
                      <span className="text-[#00E5FF]">[{log.timestamp}]</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400">{log.id}</span>
                    </div>

                    <div className="text-base font-extrabold text-white flex items-center gap-2 font-display">
                      <span>{log.filename}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#030611] text-slate-300 font-mono border border-slate-800">
                        {log.format}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Metrics & Actions */}
                <div className="flex flex-wrap items-center gap-5 justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-800/80">
                  
                  <div className="text-left md:text-right">
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">THREAT LEVEL</div>
                    <div className={`text-xs font-extrabold ${threat.textColor}`}>{threat.level}</div>
                  </div>

                  <div className="text-left md:text-right">
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">VERDICT</div>
                    <div className={`text-sm font-black font-display ${isFake ? 'text-red-400 glow-red' : 'text-emerald-400 glow-green'}`}>
                      {isFake ? 'AI-GENERATED' : 'BONAFIDE'}
                    </div>
                  </div>

                  {/* Actions: View / Report / Delete */}
                  <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800">
                    <button
                      onClick={() => setSelectedReportLog(log)}
                      className="px-3.5 py-2 rounded-xl bg-[#00E5FF]/15 hover:bg-[#00E5FF] text-[#00E5FF] hover:text-[#030712] border border-[#00E5FF]/40 font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_10px_rgba(0,229,255,0.2)]"
                      title="Generate Forensic Audit Report"
                    >
                      <FileText className="w-4 h-4" />
                      <span>REPORT</span>
                    </button>

                    <button
                      onClick={(e) => handleDeleteItem(log.id, e)}
                      className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/80 border border-red-500/40 text-red-400 transition-all cursor-pointer"
                      title="Delete log entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
