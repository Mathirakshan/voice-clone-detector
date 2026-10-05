import React, { useState } from 'react';
import { Shield, Menu, X, Cpu, Activity, BarChart2, Database, HelpCircle, Info } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'OVERVIEW', icon: Activity },
    { id: 'analyze', label: 'ANALYZE', icon: Shield },
    { id: 'dashboard', label: 'DASHBOARD', icon: BarChart2 },
    { id: 'history', label: 'HISTORY', icon: Database },
    { id: 'how-it-works', label: 'HOW IT WORKS', icon: HelpCircle },
    { id: 'about', label: 'ABOUT', icon: Info }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#030712]/90 backdrop-blur-xl border-b border-[#00E5FF]/20 shadow-[0_8px_30px_rgba(0,0,0,0.9)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left Logo & Brand */}
        <div 
          onClick={() => handleNavClick('overview')}
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-[#0D1527] border border-[#00E5FF]/40 group-hover:border-[#00E5FF] group-hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all duration-300 corner-brackets">
            <Shield className="w-6 h-6 text-[#00E5FF] group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2 font-display text-xl font-bold tracking-wider text-white">
              <span>VOICEGUARD</span>
              <span className="text-[#00E5FF] font-mono text-[11px] font-extrabold px-2 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/40 shadow-[0_0_10px_rgba(0,229,255,0.2)]">
                AI SOC
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 tracking-widest uppercase flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
              <span>FORENSIC AUDIO SECURITY</span>
            </div>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#070C18]/90 p-1.5 rounded-xl border border-[#00E5FF]/20 shadow-[inset_0_1px_0_rgba(0,229,255,0.1)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 rounded-lg font-mono text-xs font-bold tracking-wider transition-all duration-200 relative flex items-center gap-2 ${
                  isActive
                    ? 'text-[#00E5FF] bg-[#00E5FF]/15 border border-[#00E5FF]/40 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#00E5FF]' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Telemetry Badge & Mobile Menu Button */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#0D1527] border border-emerald-500/30 text-xs font-mono text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold tracking-widest text-[11px]">SOC ONLINE</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-lg bg-[#0D1527] border border-[#00E5FF]/30 text-slate-300 hover:text-[#00E5FF] hover:border-[#00E5FF] transition-all"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#00E5FF]" /> : <Menu className="w-6 h-6 text-[#00E5FF]" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#070C18]/95 backdrop-blur-xl border-b border-[#00E5FF]/30 px-4 py-5 space-y-2 font-mono text-xs shadow-2xl animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-between ${
                  isActive
                    ? 'bg-[#00E5FF] text-[#030712] shadow-[0_0_20px_rgba(0,229,255,0.4)]'
                    : 'text-slate-300 hover:bg-[#0D1527] border border-transparent hover:border-[#00E5FF]/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#030712]' : 'text-[#00E5FF]'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <span className="font-mono text-[10px] uppercase font-bold">[ ACTIVE ]</span>}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
