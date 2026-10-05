import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, FileAudio, Shield, ShieldCheck, ShieldAlert, 
  Trash2, Cpu, CheckCircle2, AlertTriangle, 
  RefreshCw, Radio, Server, Lock, Scan, Mic, Activity
} from 'lucide-react';
import ThreeForensicScanner from './ThreeForensicScanner';
import AudioWaveform from './AudioWaveform';
import AudioPlayer from './AudioPlayer';
import AudioRecorder from './AudioRecorder';
import ForensicMetadata from './ForensicMetadata';
import ProcessingPipeline from './ProcessingPipeline';
import ThreatLevel from './ThreatLevel';
import SecurityAlert from './SecurityAlert';
import SecurityRecommendation from './SecurityRecommendation';
import ForensicReport from './ForensicReport';
import PrivacyProtection from './PrivacyProtection';
import DynamicVoiceChallenge from './DynamicVoiceChallenge';
import AttackGraph from './AttackGraph';
import { analyzeAudio } from '../services/api';


export default function AnalyzePage() {
  const [inputMode, setInputMode] = useState('upload'); // 'upload' | 'record'
  const [file, setFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  
  // Audio playback state for waveform sync
  const [isPlaying, setIsPlaying] = useState(false);

  // Workflow states: 'idle' | 'preview' | 'scanning' | 'result'
  const [analysisState, setAnalysisState] = useState('idle');
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStep, setScanStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeIndicators, setActiveIndicators] = useState(null);


  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  const supportedFormats = ["WAV", "MP3", "M4A", "MP4", "FLAC", "OGG", "WEBM", "AAC", "WMA"];

  // Revoke object URL on file change or unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Handle Drag & Drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (selectedFile) => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    const newUrl = URL.createObjectURL(selectedFile);
    setAudioUrl(newUrl);
    setFile(selectedFile);
    setAnalysisState('preview');
    setErrorMessage("");
    setAnalysisResult(null);
    setIsPlaying(false);
  };

  const handleRemoveFile = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setFile(null);
    setAnalysisState('idle');
    setAnalysisResult(null);
    setErrorMessage("");
    setIsPlaying(false);
  };

  // Execute Analysis via Backend API
  const startAnalysis = async () => {
    if (!file) return;
    setAnalysisState('scanning');
    setScanProgress(5);
    setScanStep(0);
    setErrorMessage("");

    // Simulated step sequence for backend request
    const stepInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 92) return prev;
        const next = prev + Math.floor(Math.random() * 8) + 4;
        if (next > 15 && next <= 30) setScanStep(1);
        else if (next > 30 && next <= 45) setScanStep(2);
        else if (next > 45 && next <= 60) setScanStep(3);
        else if (next > 60 && next <= 75) setScanStep(4);
        else if (next > 75 && next <= 88) setScanStep(5);
        else if (next > 88) setScanStep(6);
        return Math.min(next, 92);
      });
    }, 280);

    try {
      const data = await analyzeAudio(file);

      clearInterval(stepInterval);
      setScanProgress(100);
      setScanStep(7);

      // Smooth transition to Result Dashboard
      setTimeout(() => {
        setAnalysisResult(data);
        setAnalysisState('result');
      }, 500);

    } catch (err) {
      clearInterval(stepInterval);
      setErrorMessage(err.message || "Failed to analyze audio. Ensure Python backend is running on port 8000.");
      setAnalysisState('preview');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Workstation Header */}
      <div className="cyber-panel p-6 rounded-2xl border border-[#00E5FF]/30 bg-[#070C18]/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_0_30px_rgba(0,0,0,0.7)] corner-brackets">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-[#00E5FF] tracking-widest uppercase flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#00E5FF]" />
              [ FORENSIC WORKSTATION ]
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-[#00E5FF]/10 text-[#00E5FF] text-[10px] font-mono border border-[#00E5FF]/30 font-bold">
              XLS-R WILD 0.3B DETECTOR
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-display mt-1.5 tracking-tight">
            AUDIO SPEECH THREAT SCANNER
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Real-time synthetic voice classification, spectral feature analysis & deepfake identification
          </p>
        </div>

        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#0D1527] border border-[#00E5FF]/30 font-mono text-xs text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.15)]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-ping" />
          <span className="font-bold tracking-wider">● SYSTEM READY</span>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-5 rounded-2xl bg-red-950/80 border border-red-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-red-200 font-mono text-xs shadow-[0_0_30px_rgba(239,68,68,0.25)] corner-brackets-red animate-fadeIn">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 animate-pulse" />
            <span>⚠ ANALYSIS ERROR: {errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage("")}
            className="px-4 py-2 rounded-lg bg-red-900/80 hover:bg-red-800 text-white font-bold border border-red-500/40 cursor-pointer transition-all"
          >
            [ REAUTHORIZE & RETRY ]
          </button>
        </div>
      )}

      {/* Hidden Native Audio Reference for Waveform Sync */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}

      {/* ========================================================================= */}
      {/* 1. INPUT SELECTION: UPLOAD AUDIO vs RECORD VOICE */}
      {/* ========================================================================= */}
      {(analysisState === 'idle' || analysisState === 'preview') && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Mode Selector Toggle Tabs */}
          {analysisState === 'idle' && (
            <div className="flex justify-center">
              <div className="p-1.5 rounded-2xl bg-[#070C18] border border-[#00E5FF]/30 flex items-center gap-2 font-mono text-xs shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                <button
                  onClick={() => setInputMode('upload')}
                  className={`px-7 py-3 rounded-xl font-extrabold tracking-wider transition-all cursor-pointer flex items-center gap-2.5 ${
                    inputMode === 'upload'
                      ? 'bg-[#00E5FF] text-[#030712] shadow-[0_0_20px_rgba(0,229,255,0.4)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>UPLOAD AUDIO FILE</span>
                </button>

                <span className="text-slate-600 font-bold px-1">/</span>

                <button
                  onClick={() => setInputMode('record')}
                  className={`px-7 py-3 rounded-xl font-extrabold tracking-wider transition-all cursor-pointer flex items-center gap-2.5 ${
                    inputMode === 'record'
                      ? 'bg-[#00E5FF] text-[#030712] shadow-[0_0_20px_rgba(0,229,255,0.4)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  <span>🎙 RECORD LIVE VOICE</span>
                </button>
              </div>
            </div>
          )}

          {/* UPLOAD DRAG & DROP PANEL */}
          {analysisState === 'idle' && inputMode === 'upload' && (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`cyber-panel corner-brackets cursor-pointer p-10 sm:p-16 text-center rounded-2xl border-2 transition-all group ${
                dragActive
                  ? "border-[#00E5FF] bg-[#00E5FF]/10 shadow-[0_0_50px_rgba(0,229,255,0.3)] scale-[1.01]"
                  : "border-[#00E5FF]/30 hover:border-[#00E5FF]/70 bg-[#070C18]/90 hover:bg-[#070C18]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,.wav,.mp3,.m4a,.mp4,.flac,.ogg,.webm,.aac,.wma"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="max-w-xl mx-auto space-y-6 pointer-events-none">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF] group-hover:scale-110 transition-transform shadow-[0_0_25px_rgba(0,229,255,0.25)] corner-brackets">
                  <Upload className="w-10 h-10" />
                </div>

                <div className="space-y-3">
                  <span className="font-mono text-xs font-bold text-[#00E5FF] tracking-widest uppercase">
                    [ AUDIO FORENSIC DROP ZONE ]
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                    Drag & Drop Audio Evidence File
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    Select a recording file to begin automated deepfake audio classification
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      className="px-6 py-3 rounded-xl bg-[#00E5FF]/20 hover:bg-[#00E5FF] text-[#00E5FF] hover:text-[#030712] border border-[#00E5FF]/50 font-mono text-xs font-extrabold tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)] pointer-events-auto cursor-pointer"
                    >
                      [ BROWSE AUDIO FILES ]
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800/80">
                  <div className="font-mono text-[11px] text-slate-400 mb-3 uppercase tracking-wider font-bold">
                    SUPPORTED FORENSIC FORMATS:
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {supportedFormats.map((fmt) => (
                      <span
                        key={fmt}
                        className="px-3 py-1 rounded-lg bg-[#0D1527] border border-[#00E5FF]/25 text-[10px] font-mono text-slate-300 font-bold tracking-wider hover:border-[#00E5FF] transition-colors"
                      >
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LIVE VOICE RECORDING PANEL */}
          {analysisState === 'idle' && inputMode === 'record' && (
            <AudioRecorder
              onRecordingComplete={(recordedFile) => {
                handleFileSelected(recordedFile);
              }}
              onCancel={() => setInputMode('upload')}
            />
          )}

          {/* AUDIO PREVIEW & EVIDENCE CARD */}
          {analysisState === 'preview' && file && (
            <div className="space-y-8 animate-fadeIn">
              <AudioPlayer
                file={file}
                audioUrl={audioUrl}
                onRemove={handleRemoveFile}
                onAnalyze={startAnalysis}
              />

              {/* Real-time Web Audio API Signal Waveform */}
              <AudioWaveform
                isPlaying={isPlaying}
                audioRef={audioRef}
                isScanning={false}
              />

              {/* Forensic Metadata Display */}
              <ForensicMetadata
                file={file}
                duration={null}
              />
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. THREE.JS 3D SCANNER & SCANNING PROGRESS SCREEN */}
      {/* ========================================================================= */}
      {analysisState === 'scanning' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Three.js 3D Cybersecurity Forensic Scanner */}
          <ThreeForensicScanner />

          {/* Signal Waveform Monitor */}
          <AudioWaveform isPlaying={false} isScanning={true} />

          {/* Live Analysis Progress Card */}
          <div className="cyber-panel corner-brackets p-6 sm:p-8 rounded-2xl border border-[#00E5FF]/40 bg-[#070C18] space-y-6 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="font-mono text-xs font-bold text-[#00E5FF] tracking-widest uppercase flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-ping" />
                  FORENSIC CLASSIFICATION IN PROGRESS
                </div>
                <h3 className="text-xl font-bold text-white font-display mt-1">
                  EXTRACTING SPEECH SIGNAL SPECTRALS...
                </h3>
              </div>
              <div className="font-mono text-4xl font-extrabold text-[#00E5FF] glow-cyan">
                {scanProgress}%
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-[#00E5FF]/30">
              <div
                className="h-full bg-gradient-to-r from-[#00E5FF] via-[#38BDF8] to-[#2563EB] rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(0,229,255,0.7)]"
                style={{ width: `${scanProgress}%` }}
              />
            </div>

            {/* Pipeline Stage Indicators */}
            <ProcessingPipeline currentStep={scanStep} />

            {/* Engine Telemetry */}
            <div className="p-4 rounded-xl bg-[#030611] border border-slate-800 font-mono text-xs text-slate-300">
              <div className="text-[10px] text-[#00E5FF] font-bold tracking-widest uppercase mb-2.5 flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>[ FORENSIC ENGINE TELEMETRY ]</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                <div><span className="text-slate-500 block text-[9px] uppercase font-bold">ENGINE STATE</span> <span className="text-[#00E5FF] font-bold">ACTIVE SCAN</span></div>
                <div><span className="text-slate-500 block text-[9px] uppercase font-bold">STATUS</span> <span className="text-[#38BDF8] font-bold">CLASSIFYING</span></div>
                <div><span className="text-slate-500 block text-[9px] uppercase font-bold">MODEL</span> <span className="text-white font-bold">XLS-R WILD 0.3B</span></div>
                <div><span className="text-slate-500 block text-[9px] uppercase font-bold">FORMAT</span> <span className="text-white font-bold">16 kHz PCM MONO</span></div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. RESULT DASHBOARD & THREAT ASSESSMENT */}
      {/* ========================================================================= */}
      {analysisState === 'result' && analysisResult && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Main Threat Assessment Card */}
          <ThreatLevel
            fakeProbability={analysisResult.fake_probability}
            bonafideScore={analysisResult.bonafide_score}
          />

          {/* Security Alert Banner */}
          <SecurityAlert fakeProbability={analysisResult.fake_probability} />

          {/* Dynamic Voice Challenge Component */}
          <DynamicVoiceChallenge initialResult={analysisResult} />

          {/* Voice + Intent Attack Graph Component */}
          <AttackGraph 
            initialResult={analysisResult} 
            onIndicatorsChange={(indicators) => setActiveIndicators(indicators)} 
          />

          {/* Security Recommendations & Disclaimer */}
          <SecurityRecommendation 
            isFake={analysisResult.verdict === 'FAKE'} 
            attackIndicators={activeIndicators}
          />


          {/* Forensic Audit Report Download (PDF & JSON) */}
          <ForensicReport result={analysisResult} file={file} />

          {/* Privacy & Security Protection Indicators */}
          <PrivacyProtection />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={handleRemoveFile}
              className="w-full sm:w-auto px-9 py-4 rounded-xl bg-[#00E5FF] text-[#030712] hover:bg-[#38BDF8] font-mono text-xs font-extrabold tracking-widest uppercase shadow-[0_0_30px_rgba(0,229,255,0.4)] hover:shadow-[0_0_40px_rgba(0,229,255,0.6)] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>ANALYZE ANOTHER AUDIO FILE</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
