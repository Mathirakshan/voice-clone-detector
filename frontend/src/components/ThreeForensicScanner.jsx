import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Central 3D Shield Component
function CentralShield() {
  const shieldMeshRef = useRef();
  const innerCoreRef = useRef();
  const wireframeRef = useRef();

  useFrame((state, delta) => {
    if (shieldMeshRef.current) {
      shieldMeshRef.current.rotation.y += delta * 0.4;
      shieldMeshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y -= delta * 0.6;
    }
    if (innerCoreRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.08;
      innerCoreRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group ref={shieldMeshRef}>
      {/* Outer Metallic Shield Shell */}
      <mesh>
        <octahedronGeometry args={[1.6, 2]} />
        <meshStandardMaterial
          color="#00E5FF"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Cyber Wireframe Shell */}
      <mesh ref={wireframeRef}>
        <octahedronGeometry args={[1.75, 2]} />
        <meshBasicMaterial
          color="#38BDF8"
          wireframe
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Glowing Inner Core */}
      <mesh ref={innerCoreRef}>
        <icosahedronGeometry args={[0.9, 3]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.7} />
      </mesh>

      {/* Center Light */}
      <pointLight color="#00E5FF" intensity={3} distance={6} />
    </group>
  );
}

// Concentric Rotating Cyber Rings
function ScanningRings() {
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();

  useFrame((state, delta) => {
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.6;
      ring1Ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.4;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.4;
      ring2Ref.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.6) * 0.5;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x += delta * 0.8;
      ring3Ref.current.rotation.z -= delta * 0.3;
    }
  });

  return (
    <group>
      {/* Ring 1 - Inner Cyan Torus */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.3, 0.03, 16, 80]} />
        <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.8} />
      </mesh>

      {/* Ring 2 - Middle Electric Blue Torus */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.9, 0.02, 16, 80]} />
        <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={0.6} />
      </mesh>

      {/* Ring 3 - Outer Dotted Radar Ring */}
      <mesh ref={ring3Ref}>
        <torusGeometry args={[3.5, 0.015, 16, 60]} />
        <meshBasicMaterial color="#38BDF8" wireframe />
      </mesh>
    </group>
  );
}

// Rotating 360 Sweep Radar Beam
function RadarSweepBeam() {
  const sweepRef = useRef();

  useFrame((state, delta) => {
    if (sweepRef.current) {
      sweepRef.current.rotation.y += delta * 2.2;
    }
  });

  return (
    <group ref={sweepRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[1.8, 0, 0]}>
        <planeGeometry args={[3.6, 0.05]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0.9, 0, 0]}>
        <coneGeometry args={[1.8, 3.6, 32, 1, true, 0, Math.PI / 3]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// 3D Audio Signal Bars Ring
function AudioWaveform3DRing() {
  const groupRef = useRef();
  const barCount = 32;

  const bars = useMemo(() => {
    const temp = [];
    const radius = 4.2;
    for (let i = 0; i < barCount; i++) {
      const angle = (i / barCount) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      temp.push({ x, z, angle, phase: Math.random() * Math.PI * 2 });
    }
    return temp;
  }, [barCount]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const barData = bars[i];
        if (barData) {
          const scaleY = 0.3 + Math.abs(Math.sin(state.clock.elapsedTime * 4 + barData.phase)) * 1.5;
          child.scale.set(1, scaleY, 1);
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {bars.map((bar, i) => (
        <mesh key={i} position={[bar.x, 0, bar.z]} rotation={[0, -bar.angle, 0]}>
          <boxGeometry args={[0.08, 1, 0.08]} />
          <meshBasicMaterial color={i % 3 === 0 ? "#00E5FF" : i % 3 === 1 ? "#3B82F6" : "#38BDF8"} />
        </mesh>
      ))}
    </group>
  );
}

// Floating Data Nodes
function FloatingDataNodes() {
  const nodesRef = useRef();
  const count = 12;

  const nodes = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 8
        ],
        speed: 0.2 + Math.random() * 0.5
      });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (nodesRef.current) {
      nodesRef.current.children.forEach((node, i) => {
        if (nodes[i]) {
          node.position.y += Math.sin(state.clock.elapsedTime * nodes[i].speed) * 0.004;
        }
      });
    }
  });

  return (
    <group ref={nodesRef}>
      {nodes.map((node, i) => (
        <mesh key={i} position={node.position}>
          <octahedronGeometry args={[0.08, 0]} />
          <meshBasicMaterial color="#00E5FF" wireframe />
        </mesh>
      ))}
    </group>
  );
}

// Camera Animation Rig
function CameraRig() {
  useFrame((state) => {
    state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.5;
    state.camera.position.y = 1.2 + Math.cos(state.clock.elapsedTime * 0.3) * 0.3;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function ThreeForensicScanner() {
  return (
    <div className="w-full h-[380px] sm:h-[460px] relative rounded-2xl overflow-hidden bg-[#030712] border border-[#00E5FF]/40 shadow-[0_0_50px_rgba(0,229,255,0.2)] corner-brackets">
      {/* Laser Scanline Accent Overlay */}
      <div className="animate-scan-line" />

      {/* HUD Header */}
      <div className="absolute top-4 left-5 z-20 font-mono text-[10px] text-[#00E5FF] tracking-widest uppercase flex items-center gap-2 font-bold bg-[#070C18]/90 px-3 py-1 rounded-lg border border-[#00E5FF]/30 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
        <span>3D SOC FORENSIC SCANNER • ACTIVE SCAN</span>
      </div>
      
      <div className="absolute top-4 right-5 z-20 font-mono text-[10px] text-slate-300 font-bold bg-[#070C18]/90 px-3 py-1 rounded-lg border border-slate-700/80 backdrop-blur-md">
        MODEL: XLS-R WILD 0.3B
      </div>

      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        className="w-full h-full"
      >
        <PerspectiveCamera makeDefault position={[0, 1.2, 7.5]} fov={45} />
        <CameraRig />

        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} color="#00E5FF" />
        <directionalLight position={[-5, -5, -5]} intensity={0.6} color="#3B82F6" />

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
          <CentralShield />
        </Float>
        
        <ScanningRings />
        <RadarSweepBeam />
        <AudioWaveform3DRing />
        <FloatingDataNodes />

        <Sparkles count={50} scale={10} size={2.2} speed={0.4} color="#00E5FF" />
        <Sparkles count={30} scale={8} size={1.8} speed={0.5} color="#3B82F6" />

        <gridHelper args={[16, 24, "#00E5FF", "#1E293B"]} position={[0, -2.5, 0]} />
      </Canvas>

      {/* HUD Footer */}
      <div className="absolute bottom-4 left-5 z-20 font-mono text-[10px] text-slate-400 flex items-center gap-3 bg-[#070C18]/90 px-3 py-1 rounded-lg border border-slate-800 backdrop-blur-md">
        <span>XLS-R WILD DEEPFAKE CLASSIFIER</span>
        <span className="text-[#00E5FF]">|</span>
        <span className="text-white font-bold">VECTOR DIM: 1024</span>
      </div>
      <div className="absolute bottom-4 right-5 z-20 font-mono text-[10px] text-[#00E5FF] font-bold bg-[#070C18]/90 px-3 py-1 rounded-lg border border-[#00E5FF]/30 backdrop-blur-md">
        [ 3D FORENSIC ENGINE ONLINE ]
      </div>
    </div>
  );
}
