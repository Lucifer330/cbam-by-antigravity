import React, { useState } from 'react';
import type { CalculationTrace } from '../../types/cbam';
import { TraceChain } from './TraceChain';
import { ProvenanceDrawer } from '../common/ProvenanceDrawer';
import { EmptyState } from '../common/EmptyState';
import { 
  Calculator, 
  ShieldCheck, 
  GitBranch, 
  FileText, 
  Layers, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface CalculationViewProps {
  calculations: CalculationTrace[];
  onOpenDocumentViewer?: (documentId: string, fieldKey?: string) => void;
  selectedTraceId?: string | null;
}

export const CalculationView: React.FC<CalculationViewProps> = ({
  calculations,
  onOpenDocumentViewer,
  selectedTraceId,
}) => {
  const [activeTraceId, setActiveTraceId] = useState<string>(
    selectedTraceId || calculations[0]?.id || ''
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const activeTrace = calculations.find((c) => c.id === activeTraceId) || calculations[0];

  const handleStepClick = () => {
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#e5e5de] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3d5042] mb-1">
            <Calculator className="w-4 h-4 text-[#3d5042]" />
            Signature Deterministic Architecture
          </div>
          <h1 className="text-xl font-semibold text-[#191c1e] tracking-tight">
            Traceable Result
          </h1>
          <p className="text-xs text-[#5a6065] mt-1">
            Every calculated number links backwards through formula, rule version, verified input, source field, and PDF location.
          </p>
        </div>

        {/* Calculation Switcher */}
        {calculations.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#5a6065]">Select Evidence:</span>
            <select
              value={activeTrace?.id}
              onChange={(e) => setActiveTraceId(e.target.value)}
              className="px-3 py-1.5 rounded-[4px] bg-white border border-[#d8d8ce] text-xs font-medium text-[#191c1e] focus:outline-none focus:border-[#3d5042]"
            >
              {calculations.map((calc) => (
                <option key={calc.id} value={calc.id}>
                  {calc.documentName} ({calc.resultValue.toLocaleString()} {calc.resultUnit})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Calculation Stage */}
      {activeTrace ? (
        <div className="bg-[#fbfbfa] border border-[#e2e2dc] rounded-[8px] p-6">
          {/* Top Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-[#e5e5de] text-xs">
            <div className="flex items-center gap-3">
              <span className="text-[#5a6065]">Evidence Document:</span>
              <span className="font-semibold text-[#191c1e] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#3d5042]" />
                {activeTrace.documentName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#5a6065] bg-[#ecece6] px-2 py-0.5 rounded">
                Rule Engine: {activeTrace.ruleVersion}
              </span>
              <span className="text-[11px] text-[#1b6830] font-medium bg-[#ecf7ef] px-2 py-0.5 rounded border border-[#c8e6ce]">
                Human Verified
              </span>
            </div>
          </div>

          {/* Interactive Provenance Chain */}
          <TraceChain
            trace={activeTrace}
            onStepClick={handleStepClick}
            onOpenDocumentViewer={onOpenDocumentViewer}
          />

          {/* Disclaimer at bottom */}
          <div className="mt-6 pt-4 border-t border-[#e5e5de] text-center text-xs text-[#848a90]">
            Deterministic engine executed under EU Regulation (EU) 2023/956 & Implementing Regulation 2023/1773.
            AI extraction models do not perform mathematical operations.
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Calculator}
          title="No calculation traces generated yet"
          description="Confirm extracted evidence fields in the Verification or Split View to execute the deterministic CBAM rules engine (v2026.1)."
          actionLabel="Go to Human Verification"
          onAction={() => {
            if (onOpenDocumentViewer) onOpenDocumentViewer('doc-001');
          }}
        />
      )}

      {/* Slide-in Provenance Drawer */}
      <ProvenanceDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        trace={activeTrace}
        onOpenDocument={onOpenDocumentViewer}
      />
    </div>
  );
};
