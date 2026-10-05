import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import AnalyzePage from './components/AnalyzePage';
import DashboardPage from './components/DashboardPage';
import HistoryPage from './components/HistoryPage';
import HowItWorksPage from './components/HowItWorksPage';
import AboutPage from './components/AboutPage';
import BackgroundGrid from './components/BackgroundGrid';
import { Shield, ArrowRight, Activity, Lock, Cpu, CpuIcon } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 relative flex flex-col selection:bg-[#00E5FF]/20 selection:text-[#00E5FF]">
      
      {/* Background Animated Cyber Grid */}
      <BackgroundGrid />

      {/* Futuristic Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="grow relative z-10">
        {activeTab === 'overview' && (
          <div className="space-y-12 animate-fadeIn">
            <Hero
              onStartAnalysis={() => setActiveTab('analyze')}
              onViewHowItWorks={() => setActiveTab('how-it-works')}
            />

            {/* Quick Threat Lab Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
              <div className="cyber-panel corner-brackets p-8 sm:p-12 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-[#00E5FF]/30 bg-[#070C18]/90 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                <div className="space-y-3 text-left">
                  <div className="font-mono text-xs font-bold text-[#00E5FF] tracking-widest uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
                    <span>FORENSIC LAB READY</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
                    EVALUATE AN AUDIO FILE OR LIVE VOICE STREAM
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-2xl leading-relaxed">
                    Upload pre-recorded audio or capture live speech to perform deep spectro-temporal feature extraction and synthetic voice classification via Forensics XLS-R Wild.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('analyze')}
                  className="px-8 py-4 rounded-xl bg-[#00E5FF] text-[#030712] font-mono text-xs font-extrabold tracking-widest uppercase hover:bg-[#38BDF8] shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:shadow-[0_0_35px_rgba(0,229,255,0.6)] transition-all shrink-0 flex items-center gap-2.5 cursor-pointer"
                >
                  <Shield className="w-5 h-5 text-[#030712]" />
                  <span>OPEN WORKSTATION</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        )}

        <div className={activeTab === 'analyze' ? 'animate-fadeIn' : 'hidden'}>
          <AnalyzePage />
        </div>

        {activeTab === 'dashboard' && <div className="animate-fadeIn"><DashboardPage onNavigateToAnalyze={() => setActiveTab('analyze')} /></div>}
        {activeTab === 'history' && <div className="animate-fadeIn"><HistoryPage /></div>}
        {activeTab === 'how-it-works' && <div className="animate-fadeIn"><HowItWorksPage onStartAnalysis={() => setActiveTab('analyze')} /></div>}
        {activeTab === 'about' && <div className="animate-fadeIn"><AboutPage /></div>}

      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

    </div>
  );
}
