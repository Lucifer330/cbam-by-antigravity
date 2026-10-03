import React, { useState } from 'react';
import { 
  Calculator, 
  CheckCircle2, 
  FileText, 
  Hash, 
  Play, 
  RotateCcw, 
  ExternalLink,
  ShieldCheck,
  Lock
} from 'lucide-react';

interface HeroProvenancePreviewProps {
  onLaunchApp?: () => void;
}

export const HeroProvenancePreview: React.FC<HeroProvenancePreviewProps> = ({ onLaunchApp }) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isSweeping, setIsSweeping] = useState<boolean>(false);

  const handleReplay = () => {
    setIsSweeping(true);
    setActiveStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step >= 5) {
        clearInterval(interval);
        setTimeout(() => setIsSweeping(false), 400);
      } else {
        setActiveStep(step);
      }
    }, 450);
  };

  const steps = [
    {
      id: 'result',
      title: 'Calculated Embedded Emissions',
      tag: 'Deterministic Output',
      tagColor: 'bg-[#ecf7ef] text-[#1b6830] border-[#c8e6ce]',
      icon: Calculator,
      value: '1,900.00 tCO₂e',
      detail: 'Net Mass (1,000 t) × Total Intensity (1.90 tCO₂e/t)',
      highlight: true
    },
    {
      id: 'rule',
      title: 'EU CBAM Implementing Act Rule v2026.1',
      tag: 'Locked Regulation',
      tagColor: 'bg-[#f4f4f0] text-[#5a6065] border-[#d8d8ce]',
      icon: Lock,
      value: 'Regulation (EU) 2023/956, Annex IV Section 3.1',
      detail: 'Transitional methodology · Zero algorithmic hallucination',
      highlight: false
    },
    {
      id: 'verification',
      title: 'Human-in-the-Loop Verification Sign-off',
      tag: 'Gatekeeper Verified',
      tagColor: 'bg-[#ecf7ef] text-[#1b6830] border-[#c8e6ce]',
      icon: CheckCircle2,
      value: 'E. Moreau (Lead CBAM Officer)',
      detail: 'Direct emissions factor (1.60 tCO₂e/t) confirmed against invoice item 1',
      highlight: false
    },
    {
      id: 'document',
      title: 'Source Document & Coordinates',
      tag: 'Evidence Anchored',
      tagColor: 'bg-[#eef2ff] text-[#4338ca] border-[#c7d2fe]',
      icon: FileText,
      value: 'supplier_invoice_042.pdf · Page 1 [x:132, y:418, 160×26]',
      detail: 'Turkish rolling mill supplier declaration · Dilovasi Installation #2',
      highlight: false
    },
    {
      id: 'hash',
      title: 'Cryptographic SHA-256 Fingerprint',
      tag: 'Immutable Hash',
      tagColor: 'bg-[#f5f3ff] text-[#6d28d9] border-[#ddd6fe]',
      icon: Hash,
      value: 'SHA-256: 4a8f9c73e1b209d845e2a6d3910c85e492f1b0a8d7e6c5...',
      detail: 'Merkle audit trail stamped & timestamped',
      highlight: false
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl bg-white border border-[#e5e5de] shadow-xl shadow-[#191c1e]/5 overflow-hidden transition-all duration-300">
      {/* Top Window Bar */}
      <div className="bg-[#f6f6f3] border-b border-[#e5e5de] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#f87171]/70 inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#fbbf24]/70 inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#34d399]/70 inline-block" />
          </div>
          <span className="text-xs font-mono text-[#848a90] ml-2 hidden sm:inline">
            cbam-audittrace // provenance-graph // calc-001
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReplay}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#3d5042] bg-white border border-[#d2d2c8] rounded-[5px] hover:bg-[#f6f6f3] transition-colors shadow-2xs cursor-pointer active:scale-95"
            title="Replay animated provenance sweep"
          >
            {isSweeping ? (
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-[#3d5042] text-[#3d5042]" />
            )}
            <span>Replay Trace</span>
          </button>

          {onLaunchApp && (
            <button
              onClick={onLaunchApp}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-[#2c3a30] hover:bg-[#1f2c23] rounded-[5px] transition-colors shadow-2xs cursor-pointer"
            >
              <span>Explore in App</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Main Visual Content */}
      <div className="p-4 md:p-6 bg-gradient-to-b from-[#fbfbfa] to-white">
        {/* Header Summary Pill */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 p-3 bg-[#f6f6f3] border border-[#e5e5de] rounded-[8px]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[6px] bg-[#3d5042] flex items-center justify-center text-white shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#191c1e] flex items-center gap-1.5">
                Hot-Rolled Non-Alloy Steel Coils (CN 7208 39 00)
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#eaf0eb] text-[#3d5042] rounded">
                  1,000 tonnes
                </span>
              </div>
              <div className="text-[11px] text-[#5a6065]">
                Supplier: Steel Components Ltd. (TR) · Dilovasi Rolling Mill #2
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#1b6830] bg-[#ecf7ef] border border-[#c8e6ce] px-2 py-0.5 rounded-[4px] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1b6830] animate-pulse" />
              100% Traceable Lineage
            </span>
          </div>
        </div>

        {/* 5-Step Connected Provenance Stack */}
        <div className="space-y-2">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isStepActive = isSweeping ? activeStep === idx : activeStep === idx;
            const isLast = idx === steps.length - 1;

            return (
              <React.Fragment key={step.id}>
                <div 
                  onClick={() => setActiveStep(idx)}
                  className={`cursor-pointer rounded-[8px] p-3.5 transition-all duration-200 border ${
                    isStepActive 
                      ? 'bg-white border-[#3d5042] ring-2 ring-[#3d5042]/15 shadow-sm' 
                      : 'bg-white/80 hover:bg-white border-[#e5e5de] hover:border-[#d2d2c8]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-[6px] flex items-center justify-center shrink-0 mt-0.5 ${
                        step.highlight 
                          ? 'bg-[#3d5042] text-white' 
                          : 'bg-[#f6f6f3] text-[#5a6065] border border-[#e5e5de]'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-[#191c1e]">
                            {step.title}
                          </span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.2 border rounded-[4px] ${step.tagColor}`}>
                            {step.tag}
                          </span>
                        </div>
                        <div className="text-xs font-mono font-medium text-[#191c1e]">
                          {step.value}
                        </div>
                        <div className="text-[11px] text-[#5a6065]">
                          {step.detail}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="text-[10px] font-mono text-[#848a90]">
                        Layer 0{idx + 1}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Animated Connector Line */}
                {!isLast && (
                  <div className="flex justify-center my-0.5">
                    <div className="flex flex-col items-center">
                      <div className="w-0.5 h-3 bg-gradient-to-b from-[#3d5042]/60 to-[#3d5042]/20" />
                      <div className={`w-1.5 h-1.5 rounded-full ${isSweeping && activeStep === idx ? 'bg-[#1b6830] scale-125' : 'bg-[#3d5042]'}`} />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Bottom Micro-Strip */}
        <div className="mt-4 pt-3 border-t border-[#e5e5de] flex flex-wrap items-center justify-between text-[11px] text-[#5a6065] gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1b6830]" />
            <span>Zero math hallucinations — deterministic formula executed in sandboxed engine.</span>
          </div>
          <span className="font-mono text-[10px] text-[#848a90]">
            Audit ID: AUD-2026-TR-042
          </span>
        </div>
      </div>
    </div>
  );
};
