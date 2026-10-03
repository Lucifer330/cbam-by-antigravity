import React, { useState, useRef, useEffect } from 'react';
import type { CBAMDocument, ExtractedField } from '../../types/cbam';
import { 
  FileText, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ZoomIn, 
  ZoomOut, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  ArrowRight,
  Calculator,
  Lock
} from 'lucide-react';

interface SplitPaneAuditViewerProps {
  document: CBAMDocument;
  onConfirmField?: (fieldId: string) => void;
  onRunCalculation?: (documentId: string) => void;
  initialFocusedFieldKey?: string | null;
}

export const SplitPaneAuditViewer: React.FC<SplitPaneAuditViewerProps> = ({
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

  const documentCanvasRef = useRef<HTMLDivElement>(null);
  const targetHighlightRef = useRef<HTMLDivElement>(null);

  const activeField = doc.extractedFields.find(f => f.id === activeFieldId) || doc.extractedFields[0];

  // Auto-scroll the document container to bring the targeted bounding box into view smoothly
  useEffect(() => {
    if (targetHighlightRef.current && documentCanvasRef.current) {
      targetHighlightRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
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
    <div className="w-full flex flex-col space-y-3">
      {/* Dual Pane Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-surface)] text-[var(--text-primary)] overflow-hidden shadow-xl min-h-[580px]">
        
        {/* ───────────────── LEFT PANEL: AUDIT METRICS & CHECKLIST (5 Cols) ───────────────── */}
        <div className="lg:col-span-5 border-r border-[var(--border-subtle)] flex flex-col bg-[var(--bg-surface)]">
          {/* Header */}
          <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[var(--accent-sage)]" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Audit Metrics Checklist
                </h3>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  {doc.productName} (CN {doc.cnCode})
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--accent-sage-light)] text-[var(--accent-sage-dark)] font-semibold border border-[var(--border-strong)]">
              {doc.extractedFields.filter(f => getFieldStatus(f) === 'verified').length}/{doc.extractedFields.length} Verified
            </span>
          </div>

          {/* Metric Cards List */}
          <div className="p-3 space-y-2.5 overflow-y-auto flex-1 max-h-[520px]">
            {doc.extractedFields.map((field) => {
              const isActive = field.id === activeFieldId;
              const status = getFieldStatus(field);

              return (
                <div
                  key={field.id}
                  onClick={() => setActiveFieldId(field.id)}
                  className={`group p-3.5 rounded-lg border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[var(--bg-panel)] border-[var(--accent-sage)] ring-1 ring-[var(--accent-sage)]/30 shadow-sm'
                      : 'bg-[var(--bg-subtle)]/60 hover:bg-[var(--bg-subtle)] border-[var(--border-subtle)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="text-[11px] font-medium text-[var(--text-secondary)]">
                        {field.label}
                      </div>
                      <div className="text-sm font-bold text-[var(--text-primary)] font-mono flex items-baseline gap-1.5">
                        {field.value}
                        {field.confidence && (
                          <span className="text-[10px] font-normal text-[var(--text-muted)]">
                            ({Math.round(field.confidence * 100)}% AI Conf)
                          </span>
                        )}
                      </div>
                      {field.notes && (
                        <div className="text-[10px] text-[var(--text-secondary)] line-clamp-1">
                          {field.notes}
                        </div>
                      )}
                    </div>

                    {/* Micro-Badges */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      {status === 'verified' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-[4px] bg-[#ecf7ef] dark:bg-[#0d2916] text-[#1b6830] dark:text-[#4ade80] border border-[#c8e6ce] dark:border-[#166534]">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                      {status === 'discrepancy' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-[4px] bg-[#fdf2f2] dark:bg-[#300f0f] text-[#a82323] dark:text-[#f87171] border border-[#f7cece] dark:border-[#991b1b]">
                          <XCircle className="w-3 h-3" />
                          Discrepancy
                        </span>
                      )}
                      {status === 'needs_review' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-[4px] bg-[#fef8eb] dark:bg-[#2d1f03] text-[#9e5d03] dark:text-[#fbbf24] border border-[#f8dfaa] dark:border-[#854d0e]">
                          <AlertTriangle className="w-3 h-3" />
                          Needs Review
                        </span>
                      )}

                      {/* High-visibility Trace Trigger Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveFieldId(field.id);
                        }}
                        aria-label={`Trace source coordinates for ${field.label}`}
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold transition-colors px-2 py-0.5 rounded-[4px] cursor-pointer ${
                          isActive 
                            ? 'bg-[var(--accent-sage)] text-white shadow-2xs' 
                            : 'text-[var(--accent-sage)] group-hover:bg-[var(--accent-sage-light)]'
                        }`}
                      >
                        <MapPin className="w-3 h-3" />
                        <span>Trace Source</span>
                      </button>
                    </div>
                  </div>

                  {/* Inline Verification Action */}
                  {status !== 'verified' && (
                    <div className="mt-2.5 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">
                        Requires Gatekeeper Sign-off
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConfirm(field.id);
                        }}
                        className="px-2.5 py-1 rounded-[4px] bg-[var(--accent-sage)] hover:opacity-90 text-white text-[10px] font-semibold transition-all cursor-pointer"
                      >
                        ✓ Confirm Value
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Execution Bar */}
          {onRunCalculation && (
            <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-subtle)] flex items-center justify-between">
              <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[var(--status-verified-text)]" />
                Rule Engine v2026.1
              </span>
              <button
                type="button"
                onClick={() => onRunCalculation(doc.id)}
                className="px-3.5 py-1.5 rounded-[6px] bg-[var(--accent-sage)] hover:opacity-90 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Run Calculation Engine</span>
              </button>
            </div>
          )}
        </div>

        {/* ───────────────── RIGHT PANEL: DOCUMENT & PROVENANCE CANVAS (7 Cols) ───────────────── */}
        <div className="lg:col-span-7 flex flex-col bg-[var(--bg-main)]">
          {/* Document Header Bar */}
          <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)] flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <FileText className="w-4 h-4 text-[var(--accent-sage)] shrink-0" />
              <span className="text-xs font-mono font-semibold text-[var(--text-primary)] truncate" title={doc.filename}>
                {doc.filename} · Page {activeField?.boundingBox?.page || 1}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Zoom controls */}
              <div className="flex items-center rounded-[4px] bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.max(prev - 10, 80))}
                  aria-label="Zoom out"
                  className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>
                <span className="px-1.5 font-mono text-[10px] text-[var(--text-primary)]">
                  {zoomLevel}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.min(prev + 10, 140))}
                  aria-label="Zoom in"
                  className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
              </div>

              <span className="text-[10px] font-mono bg-[var(--status-verified-bg)] text-[var(--status-verified-text)] px-2 py-0.5 rounded border border-[var(--status-verified-border)] hidden sm:inline">
                SHA-256 Verified
              </span>
            </div>
          </div>

          {/* Scrollable Document Canvas Viewport */}
          <div 
            ref={documentCanvasRef}
            className="relative flex-1 p-6 overflow-y-auto max-h-[520px] select-none bg-[var(--bg-surface)]"
          >
            {/* Mock Document Render with Coordinates */}
            <div 
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
              className="relative border border-[var(--border-strong)] rounded-lg p-6 bg-[var(--bg-subtle)]/50 shadow-inner font-mono text-xs text-[var(--text-secondary)] space-y-4 min-h-[460px] transition-transform duration-150"
            >
              <div className="flex justify-between border-b border-[var(--border-subtle)] pb-2 text-[var(--text-primary)] font-bold">
                <span>COMMERCIAL INVOICE & EMISSIONS MANIFEST</span>
                <span>NO. {doc.id.toUpperCase()}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-[11px]">
                <div>Supplier: {doc.supplier} ({doc.supplierCountry})</div>
                <div>Installation: {doc.installationName}</div>
                <div>Product: {doc.productName}</div>
                <div>CN Code: {doc.cnCode}</div>
              </div>

              <div className="py-2 border-y border-[var(--border-subtle)] space-y-2 text-[11px]">
                <div className="font-bold text-[var(--text-primary)]">Line Items & Extracted Intensity:</div>
                <div className="flex justify-between">
                  <span>Net Consignment Mass:</span>
                  <span className="font-bold text-[var(--text-primary)]">1,000.00 Metric Tonnes</span>
                </div>
                <div className="flex justify-between">
                  <span>Specific Direct Emissions:</span>
                  <span className="font-bold text-[var(--text-primary)]">1.60 tCO₂e / t</span>
                </div>
                <div className="flex justify-between">
                  <span>Specific Indirect Emissions:</span>
                  <span className="font-bold text-[var(--text-primary)]">0.30 tCO₂e / t</span>
                </div>
              </div>

              {/* High-Contrast Target Pulse Highlight Overlay */}
              {activeField?.boundingBox && (
                <div
                  ref={targetHighlightRef}
                  style={{
                    top: `${activeField.boundingBox.y}px`,
                    left: `${activeField.boundingBox.x}px`,
                    width: `${activeField.boundingBox.width}px`,
                    height: `${activeField.boundingBox.height}px`
                  }}
                  className="absolute border-2 border-[var(--accent-sage)] bg-[var(--accent-sage)]/15 rounded-md transition-all duration-300 pointer-events-none source-highlight-active ring-4 ring-[var(--accent-sage)]/25"
                >
                  <div className="absolute -top-6 left-0 bg-[var(--accent-sage)] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1 whitespace-nowrap font-sans">
                    <MapPin className="w-3 h-3" />
                    <span>{activeField.label}: {activeField.value}</span>
                  </div>
                </div>
              )}

              <div className="pt-6 text-[9px] text-[var(--text-muted)] border-t border-[var(--border-subtle)] flex justify-between">
                <span>SHA-256: {doc.sha256}</span>
                <span>Page 1 of 2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
