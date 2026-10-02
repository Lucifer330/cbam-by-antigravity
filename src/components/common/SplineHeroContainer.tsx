import React, { useState } from 'react';
import { Layers, ShieldCheck, CheckCircle2, Move3d, ArrowRight } from 'lucide-react';
import { CBAM3DLogo } from './CBAM3DLogo';

interface SplineHeroContainerProps {
  splineUrl?: string;
  onUpdateSplineUrl?: (url: string) => void;
  onNavigateToTrace?: () => void;
}

export const SplineHeroContainer: React.FC<SplineHeroContainerProps> = ({
  onNavigateToTrace,
}) => {
  const [activeTab, setActiveTab] = useState<'shield' | 'visualizer'>('shield');
  const [isHoveredNode, setIsHoveredNode] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <div className="relative rounded-[8px] bg-[#fbfbfa] border border-[#e2e2dc] overflow-hidden shadow-xs">
      {/* Top bar with mode switcher */}
      <div className="px-5 py-3 border-b border-[#e5e5de] bg-[#f6f6f3] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#1b6830]" />
          <span className="text-xs font-semibold text-[#191c1e] tracking-tight">
            EU Regulation (EU) 2023/956 Live Verification Pipeline
          </span>
          <span className="text-[11px] font-mono text-[#5a6065] bg-white px-2 py-0.5 rounded border border-[#e5e5de]">
            Transitional Period 2026
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab toggle for 3D Compliance Shield vs Lineage Visualizer */}
          <div className="inline-flex rounded-[5px] bg-[#ecece6] p-0.5 border border-[#d8d8ce] text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('shield')}
              className={`px-3 py-1 rounded-[4px] font-medium transition-all ${
                activeTab === 'shield'
                  ? 'bg-[#090d10] text-white shadow-xs'
                  : 'text-[#5a6065] hover:text-[#191c1e]'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#34d399]" />
                3D Compliance Shield
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('visualizer')}
              className={`px-3 py-1 rounded-[4px] font-medium transition-all ${
                activeTab === 'visualizer'
                  ? 'bg-white text-[#191c1e] shadow-xs'
                  : 'text-[#5a6065] hover:text-[#191c1e]'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#3d5042]" />
                Lineage Topology
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5">
        {activeTab === 'shield' ? (
          /* 3D CBAM COMPLIANCE SHIELD: SLEEK BLACK / CARBON AESTHETIC WITH ZERO SPLINE WATERMARK */
          <div 
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
            className="relative w-full min-h-[460px] md:min-h-[500px] rounded-[8px] bg-[#07090c] border border-[#1e293b] overflow-hidden flex flex-col items-center justify-center p-6 group"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 35%, rgba(16, 185, 129, 0.08) 0%, rgba(2, 6, 23, 0.95) 70%, #030712 100%)',
            }}
          >
            {/* Subtle High-Tech Blueprint Matrix Grid */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#34d399 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />

            {/* Glowing Corner Accents */}
            <div className="absolute top-0 left-0 w-44 h-44 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Top Status Indicators */}
            <div className="absolute top-3.5 left-4 z-10 pointer-events-none flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[#0f172a]/90 border border-[#334155] text-[11px] font-mono font-medium text-[#f1f5f9] shadow-sm backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                3D Compliance Shield Active
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[#0f172a]/70 border border-[#334155]/60 text-[10px] font-mono text-[#94a3b8] backdrop-blur-md">
                <Move3d className="w-3 h-3 text-[#34d399]" />
                Move cursor to inspect 3D perspective
              </span>
            </div>

            {/* Center: The High-Clarity 3D CBAM Shield Logo */}
            <div className="relative z-10 w-full flex items-center justify-center">
              <CBAM3DLogo 
                tiltX={-mousePos.y * 22} 
                tiltY={mousePos.x * 22} 
                onTraceClick={onNavigateToTrace} 
              />
            </div>

            {/* Bottom-right Switcher */}
            <div className="absolute bottom-3.5 right-4 z-10 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('visualizer')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#0f172a]/90 border border-[#334155] text-[11px] font-mono font-medium text-[#e2e8f0] hover:bg-[#1e293b] hover:text-white shadow-sm transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-[#34d399]" />
                <span>View Lineage Topology</span>
              </button>
            </div>
          </div>
        ) : (
          /* NATIVE INTERACTIVE DATA LINEAGE TOPOLOGY VISUALIZER */
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
              {/* Node 1: Evidence Ingestion */}
              <div 
                onMouseEnter={() => setIsHoveredNode('node-1')}
                onMouseLeave={() => setIsHoveredNode(null)}
                className={`p-4 rounded-[6px] transition-all border ${
                  isHoveredNode === 'node-1' 
                    ? 'bg-[#ffffff] border-[#3d5042] shadow-sm' 
                    : 'bg-[#fcfcfb] border-[#e5e5de]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-[#848a90] font-mono mb-2">
                  <span>STAGE 01</span>
                  <span className="w-2 h-2 rounded-full bg-[#1b6830]" />
                </div>
                <div className="text-xs font-semibold text-[#191c1e] mb-1">Supplier Evidence</div>
                <div className="text-[11px] text-[#5a6065] leading-normal mb-2">
                  Invoices, EPDs & mill test certs fingerprinted with SHA-256 upon arrival.
                </div>
                <div className="font-mono text-[10px] text-[#3d5042] bg-[#eaf0eb] p-1.5 rounded border border-[#c8e6ce]">
                  SHA256: 4a8f9c...0c85
                </div>
              </div>

              {/* Node 2: AI-Assisted Extraction */}
              <div 
                onMouseEnter={() => setIsHoveredNode('node-2')}
                onMouseLeave={() => setIsHoveredNode(null)}
                className={`p-4 rounded-[6px] transition-all border ${
                  isHoveredNode === 'node-2' 
                    ? 'bg-[#ffffff] border-[#3d5042] shadow-sm' 
                    : 'bg-[#fcfcfb] border-[#e5e5de]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-[#848a90] font-mono mb-2">
                  <span>STAGE 02</span>
                  <span className="w-2 h-2 rounded-full bg-[#9e5d03]" />
                </div>
                <div className="text-xs font-semibold text-[#191c1e] mb-1">Candidate Proposals</div>
                <div className="text-[11px] text-[#5a6065] leading-normal mb-2">
                  OCR extracts coordinates & values. Clearly marked as unverified proposals.
                </div>
                <div className="font-mono text-[10px] text-[#9e5d03] bg-[#fef8eb] p-1.5 rounded border border-[#f8dfaa]">
                  x=132, y=418 (91% conf)
                </div>
              </div>

              {/* Node 3: Human Gatekeeper */}
              <div 
                onMouseEnter={() => setIsHoveredNode('node-3')}
                onMouseLeave={() => setIsHoveredNode(null)}
                className={`p-4 rounded-[6px] transition-all border ${
                  isHoveredNode === 'node-3' 
                    ? 'bg-[#ffffff] border-[#3d5042] shadow-sm' 
                    : 'bg-[#fcfcfb] border-[#e5e5de]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-[#848a90] font-mono mb-2">
                  <span>STAGE 03</span>
                  <span className="w-2 h-2 rounded-full bg-[#1b6830]" />
                </div>
                <div className="text-xs font-semibold text-[#191c1e] mb-1">Human Sign-Off</div>
                <div className="text-[11px] text-[#5a6065] leading-normal mb-2">
                  Customs declarant confirms or edits values. Human gatekeeper mandatory.
                </div>
                <div className="font-mono text-[10px] text-[#1b6830] bg-[#ecf7ef] p-1.5 rounded border border-[#c8e6ce] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  E. Moreau · 09:44 CET
                </div>
              </div>

              {/* Node 4: Deterministic Rules Engine */}
              <div 
                onMouseEnter={() => setIsHoveredNode('node-4')}
                onMouseLeave={() => setIsHoveredNode(null)}
                className={`p-4 rounded-[6px] transition-all border ${
                  isHoveredNode === 'node-4' 
                    ? 'bg-[#ffffff] border-[#3d5042] shadow-sm' 
                    : 'bg-[#fcfcfb] border-[#e5e5de]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-[#848a90] font-mono mb-2">
                  <span>STAGE 04</span>
                  <span className="w-2 h-2 rounded-full bg-[#3d5042]" />
                </div>
                <div className="text-xs font-semibold text-[#191c1e] mb-1">Deterministic Result</div>
                <div className="text-[11px] text-[#5a6065] leading-normal mb-2">
                  Rule v2026.1 locks formula. AI never touches calculations. Fully source-linked.
                </div>
                <div className="font-mono text-[10px] text-[#191c1e] font-semibold bg-white p-1.5 rounded border border-[#e2e2dc] flex items-center justify-between">
                  <span>1,900.00 tCO₂e</span>
                  <span className="text-[#3d5042]">v2026.1</span>
                </div>
              </div>
            </div>

            {/* Bottom summary bar with quick-to-trace trigger */}
            <div className="mt-4 pt-3 border-t border-[#e5e5de] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4 text-[#5a6065]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#1b6830]" />
                  <span>Strict Separation: AI proposes → Human verifies → Deterministic engine computes</span>
                </span>
              </div>

              {onNavigateToTrace && (
                <button
                  type="button"
                  onClick={onNavigateToTrace}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#3d5042] hover:text-[#191c1e] transition-colors"
                >
                  <span>Explore interactive calculation provenance</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
