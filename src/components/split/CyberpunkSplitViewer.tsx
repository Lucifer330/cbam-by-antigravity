import React, { useState, useRef, useEffect } from 'react';
import type { CBAMDocument, ExtractedField } from '../../types/cbam';
import { 
  FileText, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  Layers, 
  Calculator,
  Lock,
  ZoomIn,
  ZoomOut,
  ArrowRight
} from 'lucide-react';

interface CyberpunkSplitViewerProps {
  document: CBAMDocument;
  onConfirmField?: (fieldId: string) => void;
  onRunCalculation?: (documentId: string) => void;
  initialFocusedFieldKey?: string | null;
}

export const CyberpunkSplitViewer: React.FC<CyberpunkSplitViewerProps> = ({
  document: doc,
  onConfirmField,
  onRunCalculation,
  initialFocusedFieldKey
}) => {
  const [activeFieldId, setActiveFieldId] = useState<string>(
    doc.extractedFields.find(f => f.fieldKey === initialFocusedFieldKey)?.id || doc.extractedFields[0]?.id || ''
  );
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [confirmedFields, setConfirmedFields] = useState<Record<string, boolean>>({});

  const docViewportRef = useRef<HTMLDivElement>(null);
  const targetBBoxRef = useRef<HTMLDivElement>(null);

  const activeField = doc.extractedFields.find(f => f.id === activeFieldId) || doc.extractedFields[0];

  // Auto-scroll document viewport to center target coordinate box
  useEffect(() => {
    if (targetBBoxRef.current && docViewportRef.current) {
      targetBBoxRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeFieldId]);

  const handleConfirm = (fieldId: string) => {
    setConfirmedFields(prev => ({ ...prev, [fieldId]: true }));
    if (onConfirmField) {
      onConfirmField(fieldId);
    }
  };

  const getFieldStatus = (field: ExtractedField) => {
    if (confirmedFields[field.id] || field.status === 'human_confirmed') return 'verified';
    if (field.lowConfidenceFlag || (field.confidence && field.confidence < 0.85)) return 'discrepancy';
    return 'needs_review';
  };

  return (
    <div className="w-full rounded-2xl border border-[#10b981]/30 bg-[#0d1410]/85 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
      
      {/* ─── LEFT PANE: HIGH-TECH AUDIT METRICS PANE (5 Cols) ─── */}
      <div className="lg:col-span-5 border-r border-[#10b981]/20 flex flex-col bg-[#090f0c]/90">
        <div className="p-4 border-b border-[#10b981]/20 bg-[#0f1a14]/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
            <h3 className="text-xs font-mono font-bold tracking-widest text-[#a7f3d0] uppercase">
              Audit Telemetry & Lineage
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/40">
            Reg (EU) 2023/956
          </span>
        </div>

        {/* Metrics List */}
        <div className="p-3.5 space-y-2.5 overflow-y-auto flex-1 max-h-[540px]">
          {doc.extractedFields.map((field) => {
            const isSelected = field.id === activeFieldId;
            const status = getFieldStatus(field);

            return (
              <div
                key={field.id}
                onClick={() => setActiveFieldId(field.id)}
                className={`p-3.5 rounded-xl border transition-all duration-300 cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-[#12231a] border-[#10b981] shadow-[0_0_20px_rgba(16,185,129,0.25)] ring-1 ring-[#10b981]'
                    : 'bg-[#0b1410]/70 hover:bg-[#0f1d16] border-[#1b2f24] hover:border-[#264433]'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-[#34d399] to-[#059669]" />
                )}

                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-medium text-[#94a3b8] uppercase tracking-wider font-mono">
                      {field.label}
                    </span>
                    <div className="text-base font-bold font-mono text-white flex items-baseline gap-2">
                      {field.value}
                      {field.confidence && (
                        <span className="text-[10px] text-[#64748b]">
                          ({Math.round(field.confidence * 100)}% Match)
                        </span>
                      )}
                    </div>
                    {field.notes && (
                      <div className="text-[10px] text-[#64748b] line-clamp-1">
                        {field.notes}
                      </div>
                    )}
                  </div>

                  {/* Micro-Badges */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    {status === 'verified' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-[#062419] text-[#34d399] border border-[#059669] shadow-[0_0_10px_rgba(52,211,153,0.35)]">
                        <CheckCircle2 className="w-3 h-3" /> VERIFIED
                      </span>
                    )}
                    {status === 'discrepancy' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-[#2a0b0e] text-[#f87171] border border-[#dc2626] shadow-[0_0_10px_rgba(248,113,113,0.35)]">
                        <XCircle className="w-3 h-3" /> ANOMALY
                      </span>
                    )}
                    {status === 'needs_review' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-[#291b03] text-[#fbbf24] border border-[#d97706] shadow-[0_0_10px_rgba(251,191,36,0.35)]">
                        <AlertTriangle className="w-3 h-3" /> REVIEW
                      </span>
                    )}

                    {/* Neon Trace Source Trigger */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveFieldId(field.id);
                      }}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[5px] text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#10b981] text-[#022c22] shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-105'
                          : 'bg-[#13231a] text-[#34d399] border border-[#10b981]/30 hover:border-[#10b981]'
                      }`}
                    >
                      <MapPin className="w-3 h-3" />
                      <span>Trace Source</span>
                    </button>
                  </div>
                </div>

                {/* Inline Confirmation Action */}
                {status !== 'verified' && (
                  <div className="mt-3 pt-2 border-t border-[#1b2f24] flex items-center justify-between">
                    <span className="text-[10px] text-[#94a3b8] font-mono">
                      Gatekeeper Sign-off Pending
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfirm(field.id);
                      }}
                      className="px-2.5 py-1 rounded-[4px] bg-[#10b981] hover:bg-[#059669] text-[#022c22] text-[10px] font-mono font-bold transition-all shadow-sm cursor-pointer"
                    >
                      ✓ Confirm Parameter
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Deterministic Execution Trigger */}
        {onRunCalculation && (
          <div className="p-3.5 border-t border-[#10b981]/20 bg-[#0c1611] flex items-center justify-between">
            <span className="text-xs text-[#94a3b8] flex items-center gap-1.5 font-mono">
              <Lock className="w-3.5 h-3.5 text-[#34d399]" />
              Rule v2026.1
            </span>
            <button
              type="button"
              onClick={() => onRunCalculation(doc.id)}
              className="px-4 py-2 rounded-lg bg-[#10b981] hover:bg-[#059669] text-[#022c22] text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Execute Rule Engine</span>
            </button>
          </div>
        )}
      </div>

      {/* ─── RIGHT PANE: PROVENANCE DOCUMENT CANVAS (7 Cols) ─── */}
      <div className="lg:col-span-7 flex flex-col bg-[#050806]">
        <div className="p-4 border-b border-[#10b981]/20 bg-[#0a110d] flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs text-[#a7f3d0]">
            <FileText className="w-4 h-4 text-[#10b981]" />
            <span className="truncate">{doc.filename} · Page {activeField?.boundingBox?.page || 1}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Zoom controls */}
            <div className="flex items-center rounded bg-[#0f1d16] border border-[#1b3325]">
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.max(prev - 10, 80))}
                className="p-1 text-[#94a3b8] hover:text-white"
              >
                <ZoomOut className="w-3 h-3" />
              </button>
              <span className="px-1.5 font-mono text-[10px] text-[#34d399]">
                {zoomLevel}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.min(prev + 10, 140))}
                className="p-1 text-[#94a3b8] hover:text-white"
              >
                <ZoomIn className="w-3 h-3" />
              </button>
            </div>

            <span className="text-[10px] font-mono text-[#38bdf8] bg-[#0c1f28] px-2 py-0.5 rounded border border-[#0284c7]">
              SHA-256 Verified
            </span>
          </div>
        </div>

        {/* Viewport with Animated Neon Overlay */}
        <div ref={docViewportRef} className="relative flex-1 p-8 overflow-y-auto max-h-[580px] bg-[#070c09]">
          <div 
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
            className="relative border border-[#1b3325] rounded-xl p-8 bg-[#09120c] font-mono text-xs text-[#94a3b8] space-y-5 shadow-2xl min-h-[460px] transition-transform duration-150"
          >
            <div className="flex justify-between border-b border-[#16291e] pb-3 text-white font-bold">
              <span>COMMERCIAL INVOICE & EMISSIONS MANIFEST</span>
              <span className="text-[#10b981]">CN {doc.cnCode}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[11px] text-[#94a3b8]">
              <div>Supplier: {doc.supplier} ({doc.supplierCountry})</div>
              <div>Installation: {doc.installationName}</div>
            </div>

            <div className="py-2 border-y border-[#16291e] space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span>Net Consignment Mass:</span>
                <span className="font-bold text-white">1,000.00 Metric Tonnes</span>
              </div>
              <div className="flex justify-between">
                <span>Direct Specific Emissions:</span>
                <span className="font-bold text-[#34d399]">1.60 tCO₂e / t</span>
              </div>
              <div className="flex justify-between">
                <span>Indirect Specific Emissions:</span>
                <span className="font-bold text-[#38bdf8]">0.30 tCO₂e / t</span>
              </div>
            </div>

            {/* Neon Glowing Highlight Target */}
            {activeField?.boundingBox && (
              <div
                ref={targetBBoxRef}
                style={{
                  top: `${activeField.boundingBox.y}px`,
                  left: `${activeField.boundingBox.x}px`,
                  width: `${activeField.boundingBox.width}px`,
                  height: `${activeField.boundingBox.height}px`
                }}
                className="absolute border-2 border-[#10b981] bg-[#10b981]/20 rounded-md transition-all duration-300 pointer-events-none neon-pulse-active"
              >
                <div className="absolute -top-7 left-0 bg-[#10b981] text-[#022c22] text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-[0_0_12px_rgba(16,185,129,0.8)] flex items-center gap-1 whitespace-nowrap">
                  <Sparkles className="w-3 h-3" />
                  <span>{activeField.label}: {activeField.value}</span>
                </div>
              </div>
            )}

            <div className="pt-8 text-[9px] text-[#64748b] border-t border-[#16291e] flex justify-between">
              <span>SHA-256: {doc.sha256}</span>
              <span>Page 1 of 2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
