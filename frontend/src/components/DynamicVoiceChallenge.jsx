import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, Phone, Upload, RefreshCw, CheckCircle2, 
  AlertTriangle, Lock, Activity, Info, FileAudio, Search, ArrowRight
} from 'lucide-react';
import { generateChallenge, analyzeChallenge } from '../services/api';

export default function DynamicVoiceChallenge({ initialResult }) {
  const [challengeState, setChallengeState] = useState('idle'); // 'idle' | 'generated' | 'selected' | 'analyzing' | 'completed'
  const [challenge, setChallenge] = useState(null); // { challenge_id, phrase, status }
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCallGuidance, setShowCallGuidance] = useState(false);
  const [challengeResult, setChallengeResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef(null);

  const supportedFormats = ["WAV", "MP3", "M4A", "MP4", "FLAC", "OGG", "WEBM", "AAC", "WMA"];

  // Generate a fresh random dynamic voice challenge
  const handleGenerateChallenge = async () => {
    setErrorMessage('');
    setSelectedFile(null);
    setChallengeResult(null);
    setShowCallGuidance(false);

    try {
      setChallengeState('analyzing'); // transient loading
      const data = await generateChallenge();
      setChallenge(data);
      setChallengeState('generated');
    } catch (err) {
      console.error('Failed to generate challenge:', err);
      // Fallback local random generation if offline/error
      const numbers = ['12', '19', '34', '47', '64', '83', '91'];
      const colors = ['PURPLE', 'SILVER', 'BLUE', 'GOLD', 'GREEN', 'RED'];
      const words = ['RIVER', 'TIGER', 'ROCKET', 'MANGO', 'EAGLE', 'LION'];
      const num = numbers[Math.floor(Math.random() * numbers.length)];
      const col = colors[Math.floor(Math.random() * colors.length)];
      const wrd = words[Math.floor(Math.random() * words.length)];
      
      setChallenge({
        challenge_id: `VC-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        phrase: `${num} ${col} ${wrd}`,
        status: 'ACTIVE'
      });
      setChallengeState('generated');
    }
  };

  // Handle call recording file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setChallengeState('selected');
      setErrorMessage('');
    }
  };

  // Submit selected call recording for Forensics XLS-R Wild classification
  const handleAnalyzeChallengeRecording = async () => {
    if (!selectedFile || !challenge) return;

    setChallengeState('analyzing');
    setErrorMessage('');

    try {
      const res = await analyzeChallenge(selectedFile, challenge.challenge_id);
      setChallengeResult(res);
      setChallengeState('completed');
    } catch (err) {
      console.error('Challenge analysis error:', err);
      setErrorMessage(err.message || 'Failed to analyze call recording audio.');
      setChallengeState('selected');
    }
  };

  // Calculate Application Security Score comparison logic
  const initialFakeProb = initialResult ? initialResult.fake_probability : 0.5;
  const challengeFakeProb = challengeResult ? challengeResult.fake_probability : 0;
  
  // Weighted Application Security Index (60% initial signal, 40% challenge call recording signal)
  const applicationSecurityScore = challengeResult
    ? Math.round((initialFakeProb * 0.60 + challengeFakeProb * 0.40) * 100)
    : null;

  return (
    <div className="cyber-panel corner-brackets p-6 sm:p-8 rounded-2xl border border-[#00E5FF]/40 bg-[#070C18] space-y-6 shadow-[0_0_40px_rgba(0,0,0,0.8)] animate-fadeIn">
      
      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,video/*,.wav,.mp3,.m4a,.mp4,.flac,.ogg,.webm,.aac,.wma"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="font-mono text-xs font-bold text-[#00E5FF] tracking-widest uppercase flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#00E5FF]" />
            <span>[ ADDITIONAL SECURITY VERIFICATION ]</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white font-display mt-1 tracking-tight">
            DYNAMIC VOICE CHALLENGE
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Challenge-response anti-replay signal layer via external call recording & XLS-R Wild analysis
          </p>
        </div>

        {challenge && (
          <div className="px-3.5 py-2 rounded-xl bg-[#0D1527] border border-[#00E5FF]/30 font-mono text-xs text-[#00E5FF] flex items-center gap-2 self-start sm:self-center">
            <Lock className="w-3.5 h-3.5" />
            <span>ID: {challenge.challenge_id}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              challengeState === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-[#00E5FF]/20 text-[#00E5FF]'
            }`}>
              {challengeState === 'completed' ? 'COMPLETED' : 'ACTIVE'}
            </span>
          </div>
        )}
      </div>

      {/* Security Bounds Alert */}
      <div className="p-4 rounded-xl bg-[#0D1527] border border-[#00E5FF]/20 flex items-start gap-3 text-slate-300 font-mono text-xs leading-relaxed">
        <Info className="w-5 h-5 text-[#00E5FF] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#00E5FF]">SECURITY PURPOSE & BOUNDS:</span>{' '}
          The Dynamic Voice Challenge provides an additional anti-replay security signal after suspicious initial detection. It does not independently prove identity or guarantee that the speaker is human.
        </div>
      </div>

      {/* Error Message Display */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/50 flex items-center gap-3 text-red-200 font-mono text-xs animate-fadeIn">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <span>⚠ {errorMessage}</span>
        </div>
      )}

      {/* IDLE / PROMPT TO START CHALLENGE */}
      {challengeState === 'idle' && (
        <div className="text-center py-6 space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF] shadow-[0_0_25px_rgba(0,229,255,0.2)] corner-brackets">
            <Phone className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h3 className="text-xl font-bold text-white font-display">
              Additional Verification Available
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Generate a unique random challenge phrase, call the suspected person, record the call externally, and upload the call recording for XLS-R Wild forensic classification.
            </p>
          </div>

          <button
            onClick={handleGenerateChallenge}
            className="px-8 py-4 rounded-xl bg-[#00E5FF] hover:bg-[#38BDF8] text-[#030712] font-mono text-xs font-extrabold tracking-widest uppercase shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all inline-flex items-center gap-2.5 cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>[ START DYNAMIC VOICE CHALLENGE ]</span>
          </button>
        </div>
      )}

      {/* GENERATED / ACTIVE CHALLENGE PHRASE & CALL WORKFLOW CARD */}
      {(challengeState === 'generated' || challengeState === 'selected') && challenge && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Random Challenge Phrase Box */}
          <div className="p-6 rounded-2xl bg-[#030611] border-2 border-[#00E5FF]/50 text-center space-y-3 shadow-[0_0_30px_rgba(0,229,255,0.15)] corner-brackets">
            <div className="font-mono text-xs font-bold text-[#00E5FF] tracking-widest uppercase">
              CHALLENGE PHRASE TO REPEAT DURING CALL:
            </div>

            <div className="font-mono text-3xl sm:text-5xl font-black text-white tracking-wider glow-cyan py-2">
              "{challenge.phrase}"
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              Challenge ID: <span className="text-slate-200 font-bold">{challenge.challenge_id}</span> | Status: <span className="text-[#00E5FF] font-bold">ACTIVE</span>
            </div>
          </div>

          {/* Workflow Steps Card */}
          <div className="p-6 rounded-xl bg-[#0D1527] border border-slate-800 space-y-4">
            <div className="font-mono text-xs font-bold text-[#00E5FF] tracking-widest uppercase flex items-center justify-between border-b border-slate-800 pb-3">
              <span>[ CALL VERIFICATION PROTOCOL ]</span>
              <button
                onClick={() => setShowCallGuidance(!showCallGuidance)}
                className="text-xs text-[#00E5FF] hover:underline cursor-pointer flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{showCallGuidance ? 'Hide Call Instructions' : '📞 Call & Verify Guidance'}</span>
              </button>
            </div>

            {/* Step-by-step Call Instructions */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-[#030611] border border-slate-800 space-y-1">
                <span className="text-[#00E5FF] font-bold block text-[10px]">STEP 1</span>
                <span className="text-white font-bold block">Call Person</span>
                <span className="text-[11px] text-slate-400 block">Call the suspected person via phone or VoIP app.</span>
              </div>
              <div className="p-3 rounded-lg bg-[#030611] border border-slate-800 space-y-1">
                <span className="text-[#00E5FF] font-bold block text-[10px]">STEP 2</span>
                <span className="text-white font-bold block">Ask For Phrase</span>
                <span className="text-[11px] text-slate-400 block">Ask them to repeat "{challenge.phrase}" clearly.</span>
              </div>
              <div className="p-3 rounded-lg bg-[#030611] border border-slate-800 space-y-1">
                <span className="text-[#00E5FF] font-bold block text-[10px]">STEP 3</span>
                <span className="text-white font-bold block">Record Call</span>
                <span className="text-[11px] text-slate-400 block">Record the call audio externally on your device.</span>
              </div>
              <div className="p-3 rounded-lg bg-[#030611] border border-slate-800 space-y-1">
                <span className="text-[#00E5FF] font-bold block text-[10px]">STEP 4</span>
                <span className="text-white font-bold block">Upload & Analyze</span>
                <span className="text-[11px] text-slate-400 block">Upload call recording file here for forensic check.</span>
              </div>
            </div>

            {/* Call Guidance Dropdown Box */}
            {showCallGuidance && (
              <div className="p-4 rounded-xl bg-[#030611] border border-[#00E5FF]/30 text-xs font-mono space-y-2 text-slate-300 animate-fadeIn">
                <div className="font-bold text-[#00E5FF] flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#00E5FF]" />
                  <span>CALL & VERIFY GUIDANCE FOR SOC OPERATORS</span>
                </div>
                <p className="leading-relaxed">
                  1. Dial the suspected caller back on an independent, trusted phone number.<br />
                  2. Once connected, instruct the person to say: <strong className="text-white">"{challenge.phrase}"</strong>.<br />
                  3. Use your phone's built-in call recorder, voice memo recorder, or system recorder.<br />
                  4. Save the call recording file and upload it below.
                </p>
              </div>
            )}
          </div>

          {/* Selected File Card or Upload Area */}
          <div className="p-6 rounded-xl bg-[#0D1527] border border-[#00E5FF]/30 text-center space-y-4">
            
            {selectedFile ? (
              <div className="p-4 rounded-xl bg-[#030611] border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
                <div className="flex items-center gap-3">
                  <FileAudio className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div className="text-left">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase block">SELECTED CALL RECORDING:</span>
                    <span className="text-white font-bold text-sm block">{selectedFile.name}</span>
                    <span className="text-[11px] text-slate-400">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB | {selectedFile.type || 'audio/recording'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer font-bold"
                >
                  [ CHANGE RECORDING FILE ]
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="font-mono text-xs font-bold text-slate-300 uppercase">
                  READY TO UPLOAD CALL RECORDING EVIDENCE
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  Supported forensic formats: {supportedFormats.join(", ")}
                </p>
              </div>
            )}

            {/* Action Control Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              
              <button
                onClick={() => setShowCallGuidance(!showCallGuidance)}
                className="px-6 py-3.5 rounded-xl bg-[#0D1527] border border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#00E5FF]/10 font-mono text-xs font-bold tracking-wider uppercase transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>[ 📞 CALL & VERIFY ]</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3.5 rounded-xl bg-[#00E5FF]/20 hover:bg-[#00E5FF] text-[#00E5FF] hover:text-[#030712] border border-[#00E5FF]/50 font-mono text-xs font-extrabold tracking-wider uppercase transition-all inline-flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,229,255,0.2)]"
              >
                <Upload className="w-4 h-4" />
                <span>[ 📁 UPLOAD CALL RECORDING ]</span>
              </button>

              {selectedFile && (
                <button
                  onClick={handleAnalyzeChallengeRecording}
                  className="px-7 py-3.5 rounded-xl bg-[#00E5FF] text-[#030712] hover:bg-[#38BDF8] font-mono text-xs font-extrabold tracking-widest uppercase shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4 text-[#030712]" />
                  <span>[ 🔍 ANALYZE CHALLENGE RECORDING ]</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={handleGenerateChallenge}
                className="px-5 py-3.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-white/5 font-mono text-xs font-bold tracking-wider uppercase transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>[ 🔄 GENERATE NEW CHALLENGE ]</span>
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ANALYZING SPINNER */}
      {challengeState === 'analyzing' && (
        <div className="p-8 rounded-2xl bg-[#030611] border border-[#00E5FF]/30 text-center space-y-4 animate-fadeIn">
          <RefreshCw className="w-8 h-8 text-[#00E5FF] animate-spin mx-auto" />
          <div className="font-mono text-sm font-bold text-white uppercase tracking-wider">
            ANALYZING CALL RECORDING VIA FORENSICS XLS-R WILD...
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Evaluating spectral features and anti-replay verification signal from call audio
          </p>
        </div>
      )}

      {/* COMPLETED RESULT PANEL */}
      {challengeState === 'completed' && challengeResult && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="p-6 rounded-2xl bg-[#030611] border border-[#00E5FF]/40 space-y-6 corner-brackets">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-[#00E5FF] tracking-widest uppercase">
                  CHALLENGE ANALYSIS COMPLETE
                </span>
                <h3 className="text-xl font-bold text-white font-display mt-0.5">
                  Challenge: "{challengeResult.phrase || challenge.phrase}"
                </h3>
                <div className="text-xs font-mono text-slate-400 mt-0.5">
                  Recording File: <span className="text-slate-200 font-bold">{challengeResult.filename || selectedFile?.name}</span>
                </div>
              </div>

              <div className={`px-3.5 py-2 rounded-xl font-mono text-xs font-extrabold border ${
                challengeResult.verification_signal === 'LOW_RISK'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
              }`}>
                VERIFICATION SIGNAL: {challengeResult.verification_signal === 'LOW_RISK' ? 'LOW RISK' : 'ELEVATED RISK'}
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs">
              
              <div className="p-4 rounded-xl bg-[#070C18] border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">CHALLENGE ID</span>
                <div className="text-sm font-bold text-[#00E5FF] truncate">{challengeResult.challenge_id}</div>
              </div>

              <div className="p-4 rounded-xl bg-[#070C18] border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">MODEL VERDICT</span>
                <div className={`text-base font-bold ${
                  challengeResult.verdict === 'FAKE' ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {challengeResult.verdict === 'FAKE' ? 'AI-GENERATED' : 'LIKELY BONAFIDE'}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#070C18] border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">AI-GENERATED PROBABILITY</span>
                <div className="text-base font-bold text-[#00E5FF]">
                  {Math.round(challengeResult.fake_probability * 100)}%
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#070C18] border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">BONAFIDE PROBABILITY</span>
                <div className="text-base font-bold text-emerald-400">
                  {Math.round(challengeResult.bonafide_score * 100)}%
                </div>
              </div>

            </div>

            {/* Application Security Logic Score Comparison */}
            <div className="p-4 rounded-xl bg-[#070C18] border border-[#00E5FF]/20 font-mono text-xs space-y-3">
              <div className="font-bold text-[#00E5FF] uppercase tracking-wider flex items-center justify-between">
                <span>ADDITIONAL SECURITY SIGNAL EVALUATION</span>
                {applicationSecurityScore !== null && (
                  <span className="px-2.5 py-0.5 rounded bg-[#00E5FF]/20 text-[#00E5FF] text-[11px]">
                    Application Security Score: {applicationSecurityScore}%
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                <div className="p-3 rounded-lg bg-[#030611] border border-slate-800">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">INITIAL VOICE ANALYSIS</span>
                  <span className="text-white font-bold">
                    {Math.round((initialResult?.fake_probability || 0) * 100)}% Synthetic Probability ({initialResult?.verdict || 'SUSPICIOUS'})
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-[#030611] border border-slate-800">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">CHALLENGE CALL RECORDING</span>
                  <span className="text-white font-bold">
                    {Math.round(challengeResult.fake_probability * 100)}% Synthetic Probability ({challengeResult.verdict})
                  </span>
                </div>
              </div>

              <div className="text-slate-300 leading-relaxed text-[11px] border-t border-slate-800 pt-2.5">
                {challengeResult.fake_probability < 0.35 ? (
                  <span className="text-emerald-400 font-bold">
                    ✓ The challenge recording produced a lower synthetic-voice risk signal. Note that initial suspicious findings remain part of the overall security assessment.
                  </span>
                ) : (
                  <span className="text-amber-400 font-bold">
                    ⚠ The challenge recording produced an elevated synthetic-voice signal. Consider this result together with the initial analysis and call context.
                  </span>
                )}
              </div>
            </div>

            {/* Multi-Speaker Disclaimer */}
            <div className="p-4 rounded-xl bg-[#070C18] border border-slate-800 font-mono text-xs text-slate-400 leading-relaxed space-y-1">
              <span className="text-slate-200 font-bold block">MULTI-SPEAKER & RECORDING DISCLAIMER:</span>
              <p>
                Call recordings may contain multiple speakers (caller & subject), background noise, and telephony channel compression. The challenge analysis serves as an additional security signal and does not independently prove identity or guarantee that the speaker is human.
              </p>
            </div>

          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={handleGenerateChallenge}
              className="px-7 py-3.5 rounded-xl border border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#00E5FF]/10 font-mono text-xs font-bold tracking-wider uppercase transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>[ GENERATE NEW CHALLENGE ]</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
