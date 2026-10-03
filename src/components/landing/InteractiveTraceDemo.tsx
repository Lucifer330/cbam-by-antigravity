import React, { useState } from 'react';
import { 
  FileText, 
  MapPin, 
  Calculator, 
  GitBranch, 
  Play, 
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

interface SampleCase {
  id: string;
  name: string;
  goodsCategory: string;
  cnCode: string;
  calcValue: string;
  supplier: string;
  country: string;
  documentName: string;
  sha256: string;
  activeField: {
    label: string;
    value: string;
    boundingBox: { page: number; x: number; y: number; width: number; height: number };
  };
  formula: string;
  ruleVersion: string;
  verifiedBy: string;
}

const SAMPLE_CASES: SampleCase[] = [
  {
    id: 'case-steel',
    name: 'Hot-Rolled Non-Alloy Steel Coils',
    goodsCategory: 'Iron & Steel',
    cnCode: '7208 39 00',
    calcValue: '1,900.00 tCO₂e',
    supplier: 'Steel Components Ltd.',
    country: 'TR (Turkey)',
    documentName: 'supplier_invoice_042.pdf',
    sha256: '4a8f9c73e1b209d845e2a6d3910c85e492f1b0a8d7e6c5b4a39281726354abc1',
    activeField: {
      label: 'Direct Specific Emissions',
      value: '1.60 tCO₂e/t',
      boundingBox: { page: 1, x: 38, y: 56, width: 44, height: 6 } // percentages for responsive overlay
    },
    formula: '1,000 t × (1.60 + 0.30 tCO₂e/t)',
    ruleVersion: 'v2026.1 (Implementing Reg EU 2023/1773)',
    verifiedBy: 'E. Moreau (Lead CBAM Officer)'
  },
  {
    id: 'case-alum',
    name: 'Aluminium Extruded Bars & Rods',
    goodsCategory: 'Aluminium',
    cnCode: '7604 29 10',
    calcValue: '3,575.00 tCO₂e',
    supplier: 'Emirates Global Aluminium PJSC',
    country: 'AE (UAE)',
    documentName: 'ega_billet_cert_881.pdf',
    sha256: '2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c',
    activeField: {
      label: 'Direct Specific Emissions',
      value: '1.95 tCO₂e/t',
      boundingBox: { page: 1, x: 38, y: 54, width: 42, height: 6 }
    },
    formula: '500 t × (1.95 + 5.20 tCO₂e/t)',
    ruleVersion: 'v2026.1 (Transitional Methodology)',
    verifiedBy: 'E. Moreau (Lead CBAM Officer)'
  },
  {
    id: 'case-cement',
    name: 'Portland Cement CEM I 52.5 R',
    goodsCategory: 'Cement',
    cnCode: '2523 29 00',
    calcValue: '2,880.00 tCO₂e',
    supplier: 'Çimsa Çimento Sanayi T.A.Ş.',
    country: 'TR (Turkey)',
    documentName: 'heidelberg_grey_cement_mill07.pdf',
    sha256: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
    activeField: {
      label: 'Net Mass Quantity',
      value: '3,200 t',
      boundingBox: { page: 1, x: 42, y: 44, width: 38, height: 6 }
    },
    formula: '3,200 t × (0.75 + 0.15 tCO₂e/t)',
    ruleVersion: 'v2026.1 (Transitional Methodology)',
    verifiedBy: 'H. Lindqvist (Senior Auditor)'
  }
];

interface InteractiveTraceDemoProps {
  onLaunchApp?: () => void;
}

export const InteractiveTraceDemo: React.FC<InteractiveTraceDemoProps> = ({ onLaunchApp }) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>('case-steel');
  const [isTracing, setIsTracing] = useState<boolean>(false);
  const [activeLayer, setActiveLayer] = useState<number>(0);

  const currentCase = SAMPLE_CASES.find(c => c.id === selectedCaseId) || SAMPLE_CASES[0];

  const handleTriggerTrace = () => {
    setIsTracing(true);
    setActiveLayer(0);
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step >= 4) {
        clearInterval(interval);
        setTimeout(() => setIsTracing(false), 500);
      } else {
        setActiveLayer(step);
      }
    }, 400);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Sample Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-lg border border-[#e5e5de] shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-semibold text-[#5a6065] px-2 hidden sm:inline">
            Select Live Audit Case:
          </span>
          {SAMPLE_CASES.map((c) => {
            const isSelected = c.id === selectedCaseId;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCaseId(c.id);
                  handleTriggerTrace();
                }}
                className={`px-3 py-1.5 rounded-[6px] text-xs font-medium transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#3d5042] text-white shadow-xs'
                    : 'bg-[#f6f6f3] text-[#5a6065] hover:bg-[#eaf0eb] hover:text-[#191c1e]'
                }`}
              >
                {c.goodsCategory}: {c.name.split(' ')[0]} ({c.calcValue})
              </button>
            );
          })}
        </div>

        <button
          onClick={handleTriggerTrace}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#eaf0eb] text-[#3d5042] border border-[#c8e6ce] rounded-[6px] text-xs font-medium hover:bg-[#d8e7dc] transition-colors cursor-pointer active:scale-95"
        >
          {isTracing ? (
            <RotateCcw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-[#3d5042]" />
          )}
          <span>Pulse Lineage Beam</span>
        </button>
      </div>

      {/* Main Split Demo Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-[#e5e5de] rounded-xl p-5 md:p-7 shadow-sm">
        {/* Left Column: Authentic Document View with Bounding Box Pin */}
        <div className="lg:col-span-6 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#3d5042]" />
              <span className="text-xs font-bold text-[#191c1e] font-mono">
                {currentCase.documentName}
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#1b6830] bg-[#ecf7ef] px-2 py-0.5 rounded border border-[#c8e6ce]">
              SHA-256 VERIFIED
            </span>
          </div>

          {/* Document Canvas Mockup */}
          <div className="relative w-full aspect-[4/3] bg-[#fbfbfa] rounded-lg border border-[#d2d2c8] overflow-hidden p-6 select-none flex flex-col justify-between shadow-inner">
            {/* Watermark Grid Texture */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#3d5042 1px, transparent 1px)',
                backgroundSize: '16px 16px'
              }}
            />

            {/* Document Header Header */}
            <div className="relative z-10 space-y-1 pb-3 border-b border-[#e5e5de]">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs font-bold text-[#191c1e] uppercase">
                    {currentCase.supplier}
                  </div>
                  <div className="text-[10px] text-[#5a6065]">
                    Facility Country: {currentCase.country} · ISO 14064-1 Certified
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-[#848a90]">
                    CN {currentCase.cnCode}
                  </div>
                  <div className="text-[10px] font-mono text-[#191c1e] font-bold">
                    PAGE 01 / 01
                  </div>
                </div>
              </div>
            </div>

            {/* Document Body Lines Mock */}
            <div className="relative z-10 space-y-2 py-3 text-[11px] text-[#5a6065]">
              <div className="flex justify-between border-b border-[#e5e5de]/60 pb-1">
                <span>Product Item:</span>
                <span className="font-semibold text-[#191c1e]">{currentCase.name}</span>
              </div>
              <div className="flex justify-between border-b border-[#e5e5de]/60 pb-1">
                <span>Declaration Standard:</span>
                <span className="font-mono text-[#191c1e]">EU CBAM transitional Art. 7</span>
              </div>
              <div className="flex justify-between border-b border-[#e5e5de]/60 pb-1">
                <span>Direct Specific Emissions:</span>
                <span className="font-mono font-bold text-[#191c1e]">1.60 tCO₂e / metric tonne</span>
              </div>
              <div className="flex justify-between pb-1">
                <span>Indirect Specific Emissions:</span>
                <span className="font-mono text-[#191c1e]">0.30 tCO₂e / metric tonne</span>
              </div>
            </div>

            {/* Glowing Active Bounding Box Highlight */}
            <div 
              className={`absolute border-2 border-[#3d5042] bg-[#3d5042]/15 rounded transition-all duration-300 pointer-events-none z-20 ${
                isTracing ? 'animate-pulse ring-4 ring-[#3d5042]/30' : ''
              }`}
              style={{
                top: `${currentCase.activeField.boundingBox.y}%`,
                left: `${currentCase.activeField.boundingBox.x}%`,
                width: `${currentCase.activeField.boundingBox.width}%`,
                height: `${currentCase.activeField.boundingBox.height}%`
              }}
            >
              <div className="absolute -top-5 left-0 bg-[#3d5042] text-white text-[9px] font-mono font-bold px-1.5 py-0.2 rounded shadow-sm flex items-center gap-1 whitespace-nowrap">
                <MapPin className="w-2.5 h-2.5" />
                <span>{currentCase.activeField.label} ({currentCase.activeField.value})</span>
              </div>
            </div>

            {/* Document Footer Hash */}
            <div className="relative z-10 pt-2 border-t border-[#e5e5de] flex justify-between items-center text-[9px] font-mono text-[#848a90]">
              <span className="truncate max-w-[220px]">
                HASH: {currentCase.sha256}
              </span>
              <span>SIGNED & SEALED</span>
            </div>
          </div>

          <div className="text-[11px] text-[#5a6065] flex items-center justify-between">
            <span>Coordinates: [x:132, y:418, 160×26]</span>
            <span className="font-mono text-[#1b6830]">Bounding Box Locked</span>
          </div>
        </div>

        {/* Right Column: Live Provenance Lineage Engine */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[#3d5042]" />
                <span className="text-xs font-bold text-[#191c1e]">
                  Cryptographic Trace Chain
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#3d5042] font-semibold bg-[#eaf0eb] px-2 py-0.5 rounded">
                Result: {currentCase.calcValue}
              </span>
            </div>

            {/* Lineage Steps Stack */}
            <div className="space-y-2.5">
              {/* Layer 1: Final Number */}
              <div className={`p-3 rounded-lg border transition-all ${
                activeLayer === 0 ? 'bg-[#ecf7ef] border-[#c8e6ce] ring-1 ring-[#c8e6ce]' : 'bg-[#fbfbfa] border-[#e5e5de]'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#191c1e] flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5 text-[#1b6830]" />
                    Target Result
                  </span>
                  <span className="text-xs font-mono font-bold text-[#1b6830]">
                    {currentCase.calcValue}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[#5a6065] mt-1">
                  {currentCase.formula}
                </div>
              </div>

              {/* Layer 2: Rule Lock */}
              <div className={`p-3 rounded-lg border transition-all ${
                activeLayer === 1 ? 'bg-[#f6f6f3] border-[#3d5042] ring-1 ring-[#3d5042]/20' : 'bg-[#fbfbfa] border-[#e5e5de]'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#191c1e] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#3d5042]" />
                    Applied Rule Version
                  </span>
                  <span className="text-[10px] font-mono bg-[#eaf0eb] text-[#3d5042] px-1.5 py-0.2 rounded font-semibold">
                    v2026.1
                  </span>
                </div>
                <div className="text-[11px] text-[#5a6065] mt-0.5">
                  {currentCase.ruleVersion}
                </div>
              </div>

              {/* Layer 3: Gatekeeper */}
              <div className={`p-3 rounded-lg border transition-all ${
                activeLayer === 2 ? 'bg-[#ecf7ef] border-[#c8e6ce] ring-1 ring-[#c8e6ce]' : 'bg-[#fbfbfa] border-[#e5e5de]'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#191c1e] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1b6830]" />
                    Human Gatekeeper
                  </span>
                  <span className="text-[10px] text-[#1b6830] font-medium">
                    Confirmed
                  </span>
                </div>
                <div className="text-[11px] text-[#5a6065] mt-0.5">
                  {currentCase.verifiedBy}
                </div>
              </div>

              {/* Layer 4: Source Evidence */}
              <div className={`p-3 rounded-lg border transition-all ${
                activeLayer === 3 ? 'bg-[#eef2ff] border-[#c7d2fe] ring-1 ring-[#c7d2fe]' : 'bg-[#fbfbfa] border-[#e5e5de]'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#191c1e] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#4338ca]" />
                    Source File
                  </span>
                  <span className="text-[10px] font-mono text-[#4338ca]">
                    Page 1 Coordinates
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[#5a6065] mt-0.5 truncate">
                  {currentCase.documentName}
                </div>
              </div>
            </div>
          </div>

          {/* Launch App Callout */}
          <div className="pt-2 border-t border-[#e5e5de] flex items-center justify-between">
            <div className="text-xs text-[#5a6065]">
              Want to test with your own custom CBAM documents?
            </div>
            {onLaunchApp && (
              <button
                onClick={onLaunchApp}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#2c3d31] hover:bg-[#1f2c23] text-white text-xs font-medium shadow-2xs transition-colors cursor-pointer"
              >
                <span>Launch App</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
