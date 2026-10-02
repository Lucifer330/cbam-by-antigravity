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
  Hash
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
  const primaryInput = trace.verifiedInputs[1] || trace.verifiedInputs[0];

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto py-4 space-y-3">
      {/* Node 1: RESULT */}
      <div 
        onClick={() => onStepClick('result')}
        className="w-full p-5 rounded-[6px] bg-[#ffffff] border-2 border-[#3d5042] shadow-sm hover:shadow-md transition-all cursor-pointer text-center group"
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
          {trace.resultLabel} (Direct: {trace.directEmissionsTonnes} t + Indirect: {trace.indirectEmissionsTonnes} t)
        </div>
        <div className="mt-2 text-[11px] font-medium text-[#3d5042] flex items-center justify-center gap-1 group-hover:underline">
          <span>Click to open cryptographic provenance dossier</span>
          <ExternalLink className="w-3 h-3" />
        </div>
      </div>

      {/* Down Connector */}
      <div className="flex flex-col items-center">
        <div className="w-0.5 h-4 bg-[#c8c8bd]" />
        <ArrowDown className="w-4 h-4 text-[#848a90] my-0.5" />
      </div>

      {/* Node 2: FORMULA */}
      <div 
        onClick={() => onStepClick('formula')}
        className="w-full p-4 rounded-[6px] bg-[#fbfbfa] border border-[#e2e2dc] hover:border-[#3d5042] transition-all cursor-pointer text-center group"
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

      {/* Down Connector */}
      <div className="flex flex-col items-center">
        <div className="w-0.5 h-4 bg-[#c8c8bd]" />
        <ArrowDown className="w-4 h-4 text-[#848a90] my-0.5" />
      </div>

      {/* Node 3: RULE VERSION */}
      <div 
        onClick={() => onStepClick('rule')}
        className="w-full p-4 rounded-[6px] bg-[#fbfbfa] border border-[#e2e2dc] hover:border-[#3d5042] transition-all cursor-pointer text-center group"
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

      {/* Down Connector */}
      <div className="flex flex-col items-center">
        <div className="w-0.5 h-4 bg-[#c8c8bd]" />
        <ArrowDown className="w-4 h-4 text-[#848a90] my-0.5" />
      </div>

      {/* Node 4: VERIFIED INPUT */}
      <div 
        onClick={() => onStepClick('input')}
        className="w-full p-4 rounded-[6px] bg-[#fbfbfa] border border-[#e2e2dc] hover:border-[#1b6830] transition-all cursor-pointer group"
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

      {/* Down Connector */}
      <div className="flex flex-col items-center">
        <div className="w-0.5 h-4 bg-[#c8c8bd]" />
        <ArrowDown className="w-4 h-4 text-[#848a90] my-0.5" />
      </div>

      {/* Node 5: SOURCE FIELD */}
      <div 
        onClick={() => onStepClick('source')}
        className="w-full p-4 rounded-[6px] bg-[#fbfbfa] border border-[#e2e2dc] hover:border-[#3d5042] transition-all cursor-pointer text-center group"
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

      {/* Down Connector */}
      <div className="flex flex-col items-center">
        <div className="w-0.5 h-4 bg-[#c8c8bd]" />
        <ArrowDown className="w-4 h-4 text-[#848a90] my-0.5" />
      </div>

      {/* Node 6: SUPPLIER DOCUMENT */}
      <div 
        onClick={() => onStepClick('document')}
        className="w-full p-4 rounded-[6px] bg-[#ffffff] border border-[#e2e2dc] hover:border-[#191c1e] transition-all cursor-pointer text-center group"
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
            className="inline-flex items-center gap-1.5 text-xs text-[#3d5042] font-medium hover:underline mt-2.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Inspect exact line item on original document
          </button>
        )}
      </div>
    </div>
  );
};
