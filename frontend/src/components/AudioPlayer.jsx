import React, { useState, useRef, useEffect } from 'react';
import { FileAudio, Play, Pause, Trash2, Shield, ArrowRight, Volume2, VolumeX, AlertTriangle, Music, Sliders } from 'lucide-react';

export default function AudioPlayer({ file, audioUrl, onRemove, onAnalyze }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [audioCanPlay, setAudioCanPlay] = useState(true);
  const [formatNotice, setFormatNotice] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setAudioCanPlay(true);
    setFormatNotice(false);
  }, [file, audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current || !audioCanPlay) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        console.warn("Playback error:", err);
        setAudioCanPlay(false);
        setFormatNotice(true);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && audioRef.current.duration && !isNaN(audioRef.current.duration)) {
      setDuration(audioRef.current.duration);
      setAudioCanPlay(true);
    }
  };

  const handleAudioError = () => {
    setAudioCanPlay(false);
    setFormatNotice(true);
  };

  const handleSeek = (e) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 1;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || secs === 0) return "00:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0.0 MB";
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return `${mb.toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const fileExtension = file?.name?.split('.').pop()?.toUpperCase() || "AUDIO";

  return (
    <div className="cyber-panel corner-brackets p-6 sm:p-8 rounded-2xl border border-[#00E5FF]/40 bg-[#070C18] space-y-6 shadow-[0_0_35px_rgba(0,0,0,0.8)]">
      
      {/* Hidden HTML5 Audio Element for playback */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onError={handleAudioError}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}

      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)]">
            <FileAudio className="w-6 h-6" />
          </div>
          <div>
            <div className="font-mono text-[10px] text-[#00E5FF] tracking-widest uppercase font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
              AUDIO EVIDENCE LOADED
            </div>
            <h3 className="text-lg font-bold text-white font-display truncate max-w-md mt-0.5">
              {file?.name || "Uploaded Audio Stream"}
            </h3>
          </div>
        </div>

        <span className="px-3.5 py-1.5 rounded-lg bg-[#0D1527] text-[#00E5FF] font-mono text-xs border border-[#00E5FF]/30 font-bold tracking-wider">
          STATUS: READY FOR SCAN
        </span>
      </div>

      {/* File Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#030611] border border-slate-800 font-mono text-xs">
        <div className="space-y-1">
          <span className="text-slate-500 text-[9px] block uppercase font-bold tracking-wider">FORMAT</span>
          <span className="text-slate-200 font-bold">{fileExtension}</span>
        </div>
        <div className="space-y-1">
          <span className="text-slate-500 text-[9px] block uppercase font-bold tracking-wider">FILE SIZE</span>
          <span className="text-slate-200 font-bold">{formatFileSize(file?.size)}</span>
        </div>
        <div className="space-y-1">
          <span className="text-slate-500 text-[9px] block uppercase font-bold tracking-wider">DURATION</span>
          <span className="text-slate-200 font-bold">{duration ? `${duration.toFixed(1)}s` : "Detecting..."}</span>
        </div>
        <div className="space-y-1">
          <span className="text-slate-500 text-[9px] block uppercase font-bold tracking-wider">RESAMPLE STANDARD</span>
          <span className="text-[#00E5FF] font-bold">16.0 kHz MONO</span>
        </div>
      </div>

      {/* Fallback Notice for Unsupported Browser Playback */}
      {formatNotice && (
        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 font-mono text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Preview playback disabled for format in this browser. The file remains fully valid for AI spectral analysis.</span>
        </div>
      )}

      {/* Audio Player Controls */}
      <div className="space-y-4 p-5 rounded-xl bg-[#050814] border border-[#00E5FF]/20 shadow-[inset_0_1px_0_rgba(0,229,255,0.1)]">
        
        {/* Native HTML5 Audio Controls Element */}
        {audioUrl && (
          <div className="mb-2">
            <audio
              controls
              src={audioUrl}
              className="w-full h-10 filter invert opacity-90 rounded-lg"
            >
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {/* Custom Cyber Player Interface */}
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            disabled={!audioCanPlay}
            className="w-12 h-12 rounded-xl bg-[#00E5FF] hover:bg-[#38BDF8] disabled:bg-slate-800 disabled:text-slate-600 text-[#030712] flex items-center justify-center transition-all shadow-[0_0_25px_rgba(0,229,255,0.4)] shrink-0 cursor-pointer"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
          </button>

          <div className="grow space-y-1.5">
            <div className="flex justify-between font-mono text-[11px] text-slate-400 font-bold">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              disabled={!audioCanPlay}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00E5FF]"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button onClick={toggleMute} className="text-slate-400 hover:text-[#00E5FF] p-1 cursor-pointer">
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00E5FF]"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <button
          onClick={onRemove}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>RESET EVIDENCE</span>
        </button>

        <button
          onClick={onAnalyze}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#00E5FF] text-[#030712] hover:bg-[#38BDF8] font-mono text-xs font-extrabold tracking-widest uppercase shadow-[0_0_30px_rgba(0,229,255,0.4)] hover:shadow-[0_0_40px_rgba(0,229,255,0.6)] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <Shield className="w-5 h-5 text-[#030712]" />
          <span>START FORENSIC ANALYSIS</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
