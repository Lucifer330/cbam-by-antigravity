import React, { useState } from 'react';
import type { CalculationTrace } from '../../types/cbam';
import { 
  ArrowDown, 
  FileText, 
  MapPin, 
  GitBranch, 
  CheckCircle2, 
  Calculator, 
  ExternalLink,
  ShieldCheck,
  Hash,
  Play,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface TraceChainProps {
  trace: CalculationTrace;
  onStepClick: (stepType: 'result' | 'formula' | 'rule' | 'input' | 'source' | 'document') => void;
  onOpenDocumentViewer?: (documentId: string, fieldKey?: string) => void;
}

export const TraceChain: React.FC<TraceChainProps> = ({
  trace,
  onStepClick,
  onOpenDocumentViewer,
}) => {
  const [sweepingIndex, setSweepingIndex] = useState<number>(-1);
  const primaryInput = trace.verifiedInputs[1] || trace.verifiedInputs[0];

  const handleReplayTrace = () => {
    setSweepingIndex(0);
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step >= 6) {
        clearInterval(interval);
        setTimeout(() => setSweepingIndex(-1), 600);
      } else {
        setSweepingIndex(step);
      }
    }, 450);
  };

  const renderConnector = (index: number) => {
    const isSweeping = sweepingIndex === index || sweepingIndex === index + 1;

    return (
      <div className="flex flex-col items-center py-1.5 relative my-0.5">
        <svg className="w-8 h-10 overflow-visible">
          {/* Vertical Base Line */}
          <line 
            x1="16" 
            y1="0" 
            x2="16" 
            y2="34" 
            stroke={isSweeping ? '#3d5042' : '#d2d2c8'} 
            strokeWidth="2" 
            strokeDasharray="4 3" 
            className="transition-colors duration-300"
          />

          {/* Animated Glowing Pulse Beam Dot */}
          <circle 
            cx="16" 
            cy="0" 
            r="4.5" 
            fill="#3d5042" 
            className={`transition-all ${
              sweepingIndex >= 0 
                ? isSweeping ? 'opacity-100 scale-125' : 'opacity-30'
                : `animate-beam-flow-${index}`
            }`}
            style={{
              filter: 'drop-shadow(0 0 5px rgba(61, 80, 66, 0.8))'
            }}
          />

          {/* Small Arrowhead at Bottom */}
          <polygon 
            points="12,32 16,38 20,32" 
            fill={isSweeping ? '#1b6830' : '#848a90'} 
            className="transition-colors duration-300"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto py-2 space-y-2">
      {/* Replay Trace Control Bar */}
      <div className="w-full flex items-center justify-between px-4 py-2 bg-white border border-[#e5e5de] rounded-[6px] text-xs mb-2 shadow-2xs">
        <div className="flex items-center gap-2 text-[#5a6065]">
          <span className="w-2 h-2 rounded-full bg-[#1b6830] animate-pulse" />
          <span className="font-medium text-[#191c1e]">Active Provenance Beam:</span>
          <span className="text-[11px] font-mono text-[#5a6065] hidden sm:inline">
            Bi-directional data lineage running continuously
          </span>
        </div>

        <button
          type="button"
          onClick={handleReplayTrace}
          aria-label="Replay trace beam animation"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[4px] bg-[#eaf0eb] border border-[#c8e6ce] text-[#2c3d31] font-medium hover:bg-[#dce6dd] transition-all text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3d5042] cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 text-[#1b6830]" />
          <span>Replay Trace Beam</span>
        </button>
      </div>

      {/* Node 1: RESULT */}
      <div 
        onClick={() => onStepClick('result')}
        className={`w-full p-5 rounded-[6px] border-2 transition-all cursor-pointer text-center group ${
          sweepingIndex === 0
            ? 'bg-[#ecf7ef] border-[#1b6830] shadow-md scale-[1.01] ring-2 ring-[#c8e6ce]'
            : 'bg-[#ffffff] border-[#3d5042] shadow-sm hover:shadow-md'
        }`}
      >
        <div className="flex items-center justify-between text-xs text-[#5a6065] mb-1">
          <span className="font-mono text-[11px] font-semibold text-[#3d5042] uppercase tracking-wider">
            STEP 01 · RESULT
          </span>
          <span className="text-[11px] font-mono text-[#1b6830] bg-[#ecf7ef] px-2 py-0.5 rounded border border-[#c8e6ce] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Deterministic Output
          </span>
        </div>
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-4xl font-semibold tracking-tight text-[#191c1e] font-mono group-hover:text-[#3d5042] transition-colors">
            {trace.resultValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-base font-semibold text-[#5a6065] font-mono">
            {trace.resultUnit}
          </span>
        </div>
        <div className="text-xs text-[#5a6065] mt-1">
          {trace.resultLabel} (Direct: {trace.directEmissionsTonnes.toLocaleString()} t + Indirect: {trace.indirectEmissionsTonnes.toLocaleString()} t)
        </div>
        <div className="mt-2 text-[11px] font-medium text-[#3d5042] flex items-center justify-center gap-1 group-hover:underline">
          <span>Click to open cryptographic provenance dossier</span>
          <ExternalLink className="w-3 h-3" />
        </div>
      </div>

      {/* Connector 1 */}
      {renderConnector(0)}

      {/* Node 2: FORMULA */}
      <div 
        onClick={() => onStepClick('formula')}
        className={`w-full p-4 rounded-[6px] border transition-all cursor-pointer text-center group ${
          sweepingIndex === 1
            ? 'bg-[#ecf7ef] border-[#1b6830] shadow-md scale-[1.01] ring-2 ring-[#c8e6ce]'
            : 'bg-[#fbfbfa] border-[#e2e2dc] hover:border-[#3d5042]'
        }`}
      >
        <div className="text-[11px] font-mono font-semibold text-[#848a90] uppercase tracking-wider mb-1">
          STEP 02 · FORMULA
        </div>
        <div className="font-mono text-base font-medium text-[#191c1e] group-hover:text-[#3d5042] transition-colors">
          {trace.formulaDisplay}
        </div>
        <div className="font-mono text-xs text-[#5a6065] mt-0.5">
          {trace.formula}
        </div>
      </div>

      {/* Connector 2 */}
      {renderConnector(1)}

      {/* Node 3: RULE VERSION */}
      <div 
        onClick={() => onStepClick('rule')}
        className={`w-full p-4 rounded-[6px] border transition-all cursor-pointer text-center group ${
          sweepingIndex === 2
            ? 'bg-[#ecf7ef] border-[#1b6830] shadow-md scale-[1.01] ring-2 ring-[#c8e6ce]'
            : 'bg-[#fbfbfa] border-[#e2e2dc] hover:border-[#3d5042]'
        }`}
      >
        <div className="text-[11px] font-mono font-semibold text-[#848a90] uppercase tracking-wider mb-1">
          STEP 03 · RULE VERSION
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#eaf0eb] text-[#2c3d31] border border-[#c8e6ce] font-mono text-xs font-semibold">
          <GitBranch className="w-3.5 h-3.5 text-[#3d5042]" />
          Rule {trace.ruleVersion}
        </div>
        <div className="text-xs text-[#191c1e] font-medium mt-1">
          {trace.ruleName}
        </div>
        <div className="text-[11px] text-[#5a6065]">
          {trace.regulationReference}
        </div>
      </div>

      {/* Connector 3 */}
      {renderConnector(2)}

      {/* Node 4: VERIFIED INPUT */}
      <div 
        onClick={() => onStepClick('input')}
        className={`w-full p-4 rounded-[6px] border transition-all cursor-pointer group ${
          sweepingIndex === 3
            ? 'bg-[#ecf7ef] border-[#1b6830] shadow-md scale-[1.01] ring-2 ring-[#c8e6ce]'
            : 'bg-[#fbfbfa] border-[#e2e2dc] hover:border-[#1b6830]'
        }`}
      >
        <div className="text-center text-[11px] font-mono font-semibold text-[#848a90] uppercase tracking-wider mb-2">
          STEP 04 · VERIFIED INPUT
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 rounded-[4px] bg-white border border-[#e5e5de] text-center">
            <div className="text-[11px] text-[#5a6065]">Direct Specific Emissions</div>
            <div className="font-mono text-sm font-semibold text-[#191c1e] mt-0.5">
              1.60 tCO₂e/t
            </div>
            <div className="text-[11px] text-[#1b6830] font-medium flex items-center justify-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3" />
              Human confirmed
            </div>
          </div>

          <div className="p-2.5 rounded-[4px] bg-white border border-[#e5e5de] text-center">
            <div className="text-[11px] text-[#5a6065]">Indirect Specific Emissions</div>
            <div className="font-mono text-sm font-semibold text-[#191c1e] mt-0.5">
              0.30 tCO₂e/t
            </div>
            <div className="text-[11px] text-[#1b6830] font-medium flex items-center justify-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3" />
              Human confirmed
            </div>
          </div>
        </div>
        <div className="text-center text-[11px] text-[#5a6065] mt-2">
          Verifier: {trace.complianceOfficer} · Signed at {trace.timestamp}
        </div>
      </div>

      {/* Connector 4 */}
      {renderConnector(3)}

      {/* Node 5: SOURCE FIELD */}
      <div 
        onClick={() => onStepClick('source')}
        className={`w-full p-4 rounded-[6px] border transition-all cursor-pointer text-center group ${
          sweepingIndex === 4
            ? 'bg-[#ecf7ef] border-[#1b6830] shadow-md scale-[1.01] ring-2 ring-[#c8e6ce]'
            : 'bg-[#fbfbfa] border-[#e2e2dc] hover:border-[#3d5042]'
        }`}
      >
        <div className="text-[11px] font-mono font-semibold text-[#848a90] uppercase tracking-wider mb-1">
          STEP 05 · SOURCE FIELD LOCATOR
        </div>
        <div className="font-mono text-xs font-semibold text-[#191c1e]">
          emissions_value (Scope 1 & Scope 2 lines)
        </div>
        <div className="inline-flex items-center gap-1.5 font-mono text-xs text-[#3d5042] bg-[#eaf0eb] px-2.5 py-1 rounded border border-[#c8e6ce] mt-1.5">
          <MapPin className="w-3 h-3 text-[#3d5042]" />
          Page {primaryInput.boundingBox.page} · x={primaryInput.boundingBox.x} · y={primaryInput.boundingBox.y}
        </div>
        <div className="text-[11px] text-[#848a90] mt-1">
          Bounding Box: {primaryInput.boundingBox.width}px × {primaryInput.boundingBox.height}px
        </div>
      </div>

      {/* Connector 5 */}
      {renderConnector(4)}

      {/* Node 6: SUPPLIER DOCUMENT */}
      <div 
        onClick={() => onStepClick('document')}
        className={`w-full p-4 rounded-[6px] border transition-all cursor-pointer text-center group ${
          sweepingIndex === 5
            ? 'bg-[#ecf7ef] border-[#1b6830] shadow-md scale-[1.01] ring-2 ring-[#c8e6ce]'
            : 'bg-[#ffffff] border-[#e2e2dc] hover:border-[#191c1e]'
        }`}
      >
        <div className="text-[11px] font-mono font-semibold text-[#848a90] uppercase tracking-wider mb-1">
          STEP 06 · SUPPLIER DOCUMENT EVIDENCE
        </div>
        <div className="flex items-center justify-center gap-2 text-sm font-semibold text-[#191c1e]">
          <FileText className="w-4 h-4 text-[#3d5042]" />
          <span>{trace.documentName}</span>
        </div>
        <div className="text-xs text-[#5a6065] mt-0.5">
          Supplier: Steel Components Ltd. (Turkey)
        </div>
        <div className="mt-2 font-mono text-[10px] text-[#5a6065] bg-[#f6f6f3] p-1.5 rounded border border-[#e5e5de] break-all">
          <Hash className="w-3 h-3 inline mr-1 text-[#848a90]" />
          SHA-256: {trace.documentHash}
        </div>

        {onOpenDocumentViewer && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDocumentViewer(trace.documentId, primaryInput.sourceFieldKey);
            }}
            className="inline-flex items-center gap-1.5 text-xs text-[#3d5042] font-medium hover:underline mt-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3d5042]"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Inspect exact line item on original document
          </button>
        )}
      </div>
    </div>
  );
};

