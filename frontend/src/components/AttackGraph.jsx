import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, ShieldCheck, Activity, Eye, ZoomIn, ZoomOut, 
  RotateCcw, Info, AlertTriangle, ChevronRight, UserCheck, 
  DollarSign, Key, Lock, Clock, HelpCircle, FileText, CheckCircle2
} from 'lucide-react';

export default function AttackGraph({ initialResult, onIndicatorsChange }) {
  // Scenario Indicator selections (user-selected attack indicators)
  const [selectedIndicators, setSelectedIndicators] = useState({
    identity: false,
    identityText: "I'm your manager / relative",
    urgency: false,
    urgencyText: "Do it immediately / Emergency",
    financial: false,
    financialText: "Transfer funds / Send money",
    credential: false,
    credentialText: "Provide OTP / Password",
    sensitiveInfo: false,
    sensitiveText: "Share account details / ID",
    secrecy: false,
    secrecyText: "Keep this confidential / Don't tell anyone"
  });

  const [selectedNode, setSelectedNode] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const fakeProb = initialResult ? initialResult.fake_probability : 0.75;
  const initialVerdict = initialResult ? initialResult.verdict : 'SUSPICIOUS';

  // Toggle scenario indicator
  const toggleIndicator = (key) => {
    setSelectedIndicators(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      if (onIndicatorsChange) onIndicatorsChange(updated);
      return updated;
    });
  };

  // Determine Overall Graph Threat State
  const graphThreatState = useMemo(() => {
    const activeCount = Object.keys(selectedIndicators).filter(k => k !== 'identityText' && k !== 'urgencyText' && k !== 'financialText' && k !== 'credentialText' && k !== 'sensitiveText' && k !== 'secrecyText' && selectedIndicators[k]).length;
    
    if (fakeProb >= 0.75 || (fakeProb >= 0.50 && activeCount >= 2)) {
      return { level: 'CRITICAL', color: 'red', borderColor: 'border-red-500', glow: 'shadow-[0_0_30px_rgba(239,68,68,0.4)]', bg: 'bg-red-950/30' };
    } else if (fakeProb >= 0.50 || activeCount >= 2) {
      return { level: 'HIGH RISK', color: 'amber', borderColor: 'border-amber-500', glow: 'shadow-[0_0_30px_rgba(245,158,11,0.4)]', bg: 'bg-amber-950/30' };
    } else if (fakeProb >= 0.30 || activeCount >= 1) {
      return { level: 'SUSPICIOUS', color: 'yellow', borderColor: 'border-yellow-500', glow: 'shadow-[0_0_20px_rgba(234,179,8,0.3)]', bg: 'bg-yellow-950/30' };
    } else {
      return { level: 'LOW RISK', color: 'emerald', borderColor: 'border-emerald-500', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]', bg: 'bg-emerald-950/30' };
    }
  }, [fakeProb, selectedIndicators]);

  // Construct Active Graph Nodes
  const nodes = useMemo(() => {
    const list = [];
    let yPos = 40;

    // Node 1: Voice Input
    list.push({
      id: 'voice-input',
      title: 'Voice Input Signal',
      subtitle: initialResult?.filename || 'Captured Audio Stream',
      category: 'PRIMARY ENGINE',
      source: 'Forensics XLS-R Wild 0.3B',
      type: 'input',
      x: 350,
      y: yPos,
      status: 'active',
      details: 'Original audio file or live microphone stream analyzed by the Forensics XLS-R Wild deepfake classifier.'
    });
    yPos += 110;

    // Node 2: Voice Risk
    list.push({
      id: 'voice-risk',
      title: 'Voice Synthetic Risk',
      subtitle: `${Math.round(fakeProb * 100)}% AI Probability (${initialVerdict})`,
      category: 'AI CLASSIFICATION',
      source: 'Forensics XLS-R Wild Model',
      type: fakeProb >= 0.6 ? 'threat' : 'normal',
      x: 350,
      y: yPos,
      status: 'active',
      details: `Forensics XLS-R Wild evaluated the spectro-temporal audio structure at ${Math.round(fakeProb * 100)}% synthetic voice probability.`
    });
    yPos += 110;

    // Node 3: Identity Claim (optional)
    if (selectedIndicators.identity) {
      list.push({
        id: 'identity-claim',
        title: 'Identity Claim',
        subtitle: `"${selectedIndicators.identityText}"`,
        category: 'SCENARIO INDICATOR',
        source: 'User-Selected Indicator',
        type: 'scenario',
        x: 350,
        y: yPos,
        status: 'active',
        details: 'The caller asserts a specific role or relationship (e.g., manager, family member, bank official, law enforcement) to establish trust.'
      });
      yPos += 110;
    }

    // Node 4: Urgency (optional)
    if (selectedIndicators.urgency) {
      list.push({
        id: 'urgency-tactic',
        title: 'Urgency & Time Pressure',
        subtitle: `"${selectedIndicators.urgencyText}"`,
        category: 'SOCIAL ENGINEERING',
        source: 'User-Selected Indicator',
        type: 'scenario',
        x: 350,
        y: yPos,
        status: 'active',
        details: 'Urgency tactics exploit fear or panic to compel immediate action before the victim can verify the situation independently.'
      });
      yPos += 110;
    }

    // Node 5: Financial / Credential / Sensitive Request (optional)
    if (selectedIndicators.financial) {
      list.push({
        id: 'financial-request',
        title: 'Financial Demand',
        subtitle: `"${selectedIndicators.financialText}"`,
        category: 'ATTACK TARGET',
        source: 'User-Selected Indicator',
        type: 'threat',
        x: 350,
        y: yPos,
        status: 'active',
        details: 'Direct request for monetary transfer, wire, gift cards, or financial asset movement.'
      });
      yPos += 110;
    }

    if (selectedIndicators.credential) {
      list.push({
        id: 'credential-request',
        title: 'Credential Access Request',
        subtitle: `"${selectedIndicators.credentialText}"`,
        category: 'ATTACK TARGET',
        source: 'User-Selected Indicator',
        type: 'threat',
        x: 350,
        y: yPos,
        status: 'active',
        details: 'Request for authentication factors such as one-time passwords (OTP), login credentials, or PIN codes.'
      });
      yPos += 110;
    }

    if (selectedIndicators.sensitiveInfo) {
      list.push({
        id: 'sensitive-info',
        title: 'Sensitive Data Request',
        subtitle: `"${selectedIndicators.sensitiveText}"`,
        category: 'ATTACK TARGET',
        source: 'User-Selected Indicator',
        type: 'threat',
        x: 350,
        y: yPos,
        status: 'active',
        details: 'Attempt to elicit confidential personal identification, account numbers, or corporate data.'
      });
      yPos += 110;
    }

    if (selectedIndicators.secrecy) {
      list.push({
        id: 'secrecy-pressure',
        title: 'Secrecy & Isolation Pressure',
        subtitle: `"${selectedIndicators.secrecyText}"`,
        category: 'SOCIAL ENGINEERING',
        source: 'User-Selected Indicator',
        type: 'scenario',
        x: 350,
        y: yPos,
        status: 'active',
        details: 'Insistence on keeping the conversation confidential to prevent the victim from consulting colleagues, family, or security.'
      });
      yPos += 110;
    }

    // Node: Impersonation Attack Structure
    list.push({
      id: 'impersonation-risk',
      title: 'Impersonation Attack Risk',
      subtitle: graphThreatState.level,
      category: 'SECURITY INTERPRETATION',
      source: 'VoiceGuard Security Layer',
      type: graphThreatState.level === 'LOW RISK' ? 'normal' : 'critical',
      x: 350,
      y: yPos,
      status: 'active',
      details: `Combined structural synthesis indicates ${graphThreatState.level} potential impersonation attack vulnerability based on voice synthetic score and scenario indicators.`
    });
    yPos += 110;

    // Node: Security Intervention
    list.push({
      id: 'security-action',
      title: 'Security Intervention',
      subtitle: graphThreatState.level === 'LOW RISK' ? 'Standard Verification' : 'Halt Transaction & Out-of-Band Verify',
      category: 'RECOMMENDED INTERVENTION',
      source: 'VoiceGuard Policy Engine',
      type: 'intervention',
      x: 350,
      y: yPos,
      status: 'active',
      details: 'Recommended defense action: Do not authenticate via voice alone. Initiate independent out-of-band contact via known secondary phone or channel.'
    });

    return list;
  }, [fakeProb, initialVerdict, initialResult, selectedIndicators, graphThreatState]);

  // Construct Connections (Edges)
  const edges = useMemo(() => {
    const list = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      list.push({
        id: `e-${nodes[i].id}-${nodes[i + 1].id}`,
        from: nodes[i],
        to: nodes[i + 1]
      });
    }
    return list;
  }, [nodes]);

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSelectedNode(null);
  };

  const svgHeight = Math.max(550, nodes.length * 115 + 40);

  return (
    <div className="cyber-panel corner-brackets p-6 sm:p-8 rounded-2xl border border-[#00E5FF]/40 bg-[#070C18] space-y-6 shadow-[0_0_40px_rgba(0,0,0,0.8)] animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="font-mono text-xs font-bold text-[#00E5FF] tracking-widest uppercase flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#00E5FF]" />
            <span>[ ATTACK STRUCTURE VISUALIZATION ]</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white font-display mt-1 tracking-tight">
            VOICE + INTENT ATTACK GRAPH
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Structural social engineering & impersonation attack graph around voice threat evidence
          </p>
        </div>

        <div className={`px-4 py-2 rounded-xl border font-mono text-xs font-extrabold flex items-center gap-2.5 ${graphThreatState.bg} ${graphThreatState.borderColor} ${graphThreatState.glow} self-start sm:self-center`}>
          <ShieldAlert className={`w-4 h-4 ${graphThreatState.level === 'LOW RISK' ? 'text-emerald-400' : 'text-red-400'}`} />
          <span className="text-white">GRAPH THREAT STATE:</span>
          <span className={graphThreatState.level === 'LOW RISK' ? 'text-emerald-400' : 'text-red-400'}>
            {graphThreatState.level}
          </span>
        </div>
      </div>

      {/* Scenario Indicators Selection Panel */}
      <div className="p-5 rounded-xl bg-[#030611] border border-[#00E5FF]/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs font-bold text-[#00E5FF] tracking-widest uppercase flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#00E5FF]" />
            <span>[ SCENARIO INDICATOR SELECTOR ]</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            * Selected indicators are labeled as user-provided scenario context
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono text-xs">
          
          <button
            onClick={() => toggleIndicator('identity')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
              selectedIndicators.identity
                ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-white shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                : 'bg-[#070C18] border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <UserCheck className={`w-4 h-4 shrink-0 ${selectedIndicators.identity ? 'text-[#00E5FF]' : 'text-slate-500'}`} />
            <div className="truncate">
              <span className="block text-[10px] uppercase font-bold text-slate-400">IDENTITY CLAIM</span>
              <span className="font-bold text-[11px] truncate block">{selectedIndicators.identityText}</span>
            </div>
          </button>

          <button
            onClick={() => toggleIndicator('urgency')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
              selectedIndicators.urgency
                ? 'bg-amber-500/20 border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                : 'bg-[#070C18] border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Clock className={`w-4 h-4 shrink-0 ${selectedIndicators.urgency ? 'text-amber-400' : 'text-slate-500'}`} />
            <div className="truncate">
              <span className="block text-[10px] uppercase font-bold text-slate-400">URGENCY TACTIC</span>
              <span className="font-bold text-[11px] truncate block">{selectedIndicators.urgencyText}</span>
            </div>
          </button>

          <button
            onClick={() => toggleIndicator('financial')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
              selectedIndicators.financial
                ? 'bg-red-500/20 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                : 'bg-[#070C18] border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <DollarSign className={`w-4 h-4 shrink-0 ${selectedIndicators.financial ? 'text-red-400' : 'text-slate-500'}`} />
            <div className="truncate">
              <span className="block text-[10px] uppercase font-bold text-slate-400">FINANCIAL DEMAND</span>
              <span className="font-bold text-[11px] truncate block">{selectedIndicators.financialText}</span>
            </div>
          </button>

          <button
            onClick={() => toggleIndicator('credential')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
              selectedIndicators.credential
                ? 'bg-red-500/20 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                : 'bg-[#070C18] border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Key className={`w-4 h-4 shrink-0 ${selectedIndicators.credential ? 'text-red-400' : 'text-slate-500'}`} />
            <div className="truncate">
              <span className="block text-[10px] uppercase font-bold text-slate-400">CREDENTIAL REQUEST</span>
              <span className="font-bold text-[11px] truncate block">{selectedIndicators.credentialText}</span>
            </div>
          </button>

          <button
            onClick={() => toggleIndicator('sensitiveInfo')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
              selectedIndicators.sensitiveInfo
                ? 'bg-amber-500/20 border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                : 'bg-[#070C18] border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Info className={`w-4 h-4 shrink-0 ${selectedIndicators.sensitiveInfo ? 'text-amber-400' : 'text-slate-500'}`} />
            <div className="truncate">
              <span className="block text-[10px] uppercase font-bold text-slate-400">SENSITIVE INFO</span>
              <span className="font-bold text-[11px] truncate block">{selectedIndicators.sensitiveText}</span>
            </div>
          </button>

          <button
            onClick={() => toggleIndicator('secrecy')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
              selectedIndicators.secrecy
                ? 'bg-purple-500/20 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                : 'bg-[#070C18] border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Lock className={`w-4 h-4 shrink-0 ${selectedIndicators.secrecy ? 'text-purple-400' : 'text-slate-500'}`} />
            <div className="truncate">
              <span className="block text-[10px] uppercase font-bold text-slate-400">SECRECY / PRESSURE</span>
              <span className="font-bold text-[11px] truncate block">{selectedIndicators.secrecyText}</span>
            </div>
          </button>

        </div>
      </div>

      {/* Interactive SVG Attack Graph Viewport */}
      <div className="relative rounded-2xl bg-[#030611] border border-[#00E5FF]/30 overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.9)] min-h-[480px]">
        
        {/* Controls Toolbar */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-[#070C18]/90 border border-[#00E5FF]/30 p-1.5 rounded-xl backdrop-blur font-mono text-xs shadow-lg">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.8))}
            className="p-2 rounded-lg text-slate-300 hover:text-[#00E5FF] hover:bg-white/5 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.6))}
            className="p-2 rounded-lg text-slate-300 hover:text-[#00E5FF] hover:bg-white/5 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="p-2 rounded-lg text-slate-300 hover:text-[#00E5FF] hover:bg-white/5 cursor-pointer"
            title="Reset Graph"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Graph Render Container */}
        <div className="w-full overflow-x-auto p-4 flex justify-center">
          <svg
            width={700}
            height={svgHeight}
            viewBox={`0 0 700 ${svgHeight}`}
            className="transition-transform duration-200 ease-out"
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
              transformOrigin: 'center top'
            }}
          >
            <defs>
              <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="threatGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#991B1B" stopOpacity="0.5" />
              </linearGradient>
              <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glowRed" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Render Animated Connecting Edges */}
            {edges.map(edge => (
              <g key={edge.id}>
                <line
                  x1={edge.from.x}
                  y1={edge.from.y + 25}
                  x2={edge.to.x}
                  y2={edge.to.y - 25}
                  stroke={edge.to.type === 'threat' || edge.to.type === 'critical' ? '#EF4444' : '#00E5FF'}
                  strokeWidth={2.5}
                  strokeDasharray="6,4"
                  className="animate-pulse"
                  opacity={0.75}
                />
                {/* Flow particle */}
                <circle
                  cx={(edge.from.x + edge.to.x) / 2}
                  cy={(edge.from.y + edge.to.y) / 2}
                  r={3}
                  fill={edge.to.type === 'threat' ? '#EF4444' : '#00E5FF'}
                  filter="url(#glowCyan)"
                />
              </g>
            ))}

            {/* Render Interactive Nodes */}
            {nodes.map(node => {
              const isSelected = selectedNode?.id === node.id;
              let borderColor = '#00E5FF';
              let bgColor = '#070C18';
              let textColor = '#38BDF8';

              if (node.type === 'threat' || node.type === 'critical') {
                borderColor = '#EF4444';
                bgColor = '#1A060A';
                textColor = '#F87171';
              } else if (node.type === 'scenario') {
                borderColor = '#F59E0B';
                bgColor = '#140E04';
                textColor = '#FBBF24';
              } else if (node.type === 'intervention') {
                borderColor = '#10B981';
                bgColor = '#04140D';
                textColor = '#34D399';
              }

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer group"
                >
                  {/* Node Outer Glowing Shell */}
                  <rect
                    x={-150}
                    y={-28}
                    width={300}
                    height={56}
                    rx={12}
                    fill={bgColor}
                    stroke={borderColor}
                    strokeWidth={isSelected ? 3 : 1.5}
                    filter={node.type === 'threat' ? 'url(#glowRed)' : 'url(#glowCyan)'}
                    className="transition-all duration-200 group-hover:scale-105"
                  />

                  {/* Node Title & Subtitle */}
                  <text
                    x={0}
                    y={-6}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize={12}
                    fontWeight="bold"
                    fontFamily="monospace"
                    className="pointer-events-none"
                  >
                    {node.title}
                  </text>

                  <text
                    x={0}
                    y={12}
                    textAnchor="middle"
                    fill={textColor}
                    fontSize={10}
                    fontFamily="monospace"
                    className="pointer-events-none"
                  >
                    {node.subtitle}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

      </div>

      {/* Selected Node Details Inspector Modal/Panel */}
      {selectedNode && (
        <div className="p-5 rounded-2xl bg-[#030611] border border-[#00E5FF]/40 space-y-4 animate-fadeIn corner-brackets">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#00E5FF]" />
              <span className="font-mono text-xs font-bold text-[#00E5FF] tracking-widest uppercase">
                NODE DETAILS INSPECTOR
              </span>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-slate-400 hover:text-white font-mono text-xs cursor-pointer"
            >
              [ CLOSE ]
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">NODE NAME</span>
              <span className="text-white text-base font-bold">{selectedNode.title}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase font-bold">DATA SOURCE</span>
              <span className="text-[#00E5FF] font-bold">{selectedNode.source}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#070C18] border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed">
            <span className="text-[#00E5FF] font-bold">EXPLANATION:</span> {selectedNode.details}
          </div>
        </div>
      )}

    </div>
  );
}
