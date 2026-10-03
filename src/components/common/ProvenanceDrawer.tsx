import React, { useState, useEffect } from 'react';
import type { CalculationTrace } from '../../types/cbam';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  Check, 
  Binary,
  MapPin
} from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface ProvenanceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  trace: CalculationTrace | null;
  onOpenDocument?: (documentId: string, focusFieldKey?: string) => void;
}

export const ProvenanceDrawer: React.FC<ProvenanceDrawerProps> = ({
  isOpen,
  onClose,
  trace,
  onOpenDocument
}) => {
  const [copied, setCopied] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animateIn, setAnimateIn] = useState(false);
  const activeTraceRef = React.useRef<CalculationTrace | null>(trace);

  if (trace) {
    activeTraceRef.current = trace;
  }

  const containerRef = useFocusTrap<HTMLDivElement>({ isOpen, onClose });

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => setAnimateIn(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimateIn(false);
      const timer = setTimeout(() => setShouldRender(false), 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const currentTrace = trace || activeTraceRef.current;

  if (!shouldRender || !currentTrace) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(currentTrace, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const primaryInput = currentTrace.verifiedInputs[1] || currentTrace.verifiedInputs[0];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="provenance-title">
      {/* Dimmed backdrop with light-dismiss & fade transition */}
      <div 
        className={`fixed inset-0 bg-[#000000]/50 backdrop-blur-[1px] transition-opacity duration-250 ease-out ${
          animateIn ? 'opacity-100 animate-backdrop-in' : 'opacity-0 animate-backdrop-out'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-auto">
        <div 
          ref={containerRef}
          tabIndex={-1}
          className={`w-screen max-w-lg bg-[var(--bg-surface)] text-[var(--text-primary)] border-l border-[var(--border-subtle)] shadow-2xl flex flex-col transform transition-transform duration-250 ease-out focus:outline-none ${
            animateIn ? 'translate-x-0 animate-drawer-in' : 'translate-x-full animate-drawer-out'
          }`}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-[4px] bg-[var(--accent-sage-light)] border border-[var(--status-verified-border)] flex items-center justify-center text-[var(--status-verified-text)]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h2 id="provenance-title" className="text-sm font-semibold text-[var(--text-primary)] tracking-tight">
                  Cryptographic Provenance
                </h2>
                <p className="text-xs text-[var(--text-secondary)]">
                  Full audit lineage for calculated value
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-[4px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-panel)] transition-colors focus-ring cursor-pointer"
              aria-label="Close provenance drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Subheader Banner */}
          <div className="px-6 py-2.5 bg-[var(--bg-subtle)]/70 border-b border-[var(--border-subtle)] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[var(--text-secondary)]">Trace ID:</span>
              <span className="font-mono text-[var(--text-primary)] font-medium">{currentTrace.id}</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[var(--status-verified-text)] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Fully Verified
            </span>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Step 1: The Result */}
            <div className="p-4 rounded-[6px] bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-1">
                <span className="font-medium uppercase tracking-wider text-[11px] text-[var(--text-muted)]">Step 1 · Traceable Result</span>
                <span className="text-[11px] font-mono text-[var(--accent-sage)] bg-[var(--accent-sage-light)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]">EU Reg 2023/956 Art. 7</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold tracking-tight text-[var(--text-primary)] font-mono">
                  {currentTrace.resultValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-sm font-medium text-[var(--text-secondary)] font-mono">
                  {currentTrace.resultUnit}
                </span>
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-1 font-sans">{currentTrace.resultLabel}</div>
            </div>

            {/* Step 2: The Formula Applied */}
            <div className="relative pl-6 border-l-2 border-[var(--accent-sage)] space-y-2">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[var(--accent-sage)] flex items-center justify-center text-[9px] font-bold text-white">
                2
              </div>
              <div className="text-xs font-medium text-[var(--text-muted)]">DETERMINISTIC FORMULA & RULE ENGINE</div>
              <div className="p-3 rounded-[4px] bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-1.5">
                <div className="font-mono text-xs text-[var(--text-primary)] font-medium">{currentTrace.formulaDisplay}</div>
                <div className="text-xs text-[var(--text-secondary)]">{currentTrace.formula}</div>
                <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px]">
                  <span className="text-[var(--text-muted)]">Locked Rule Version:</span>
                  <span className="font-mono font-medium text-[var(--accent-sage)] bg-[var(--accent-sage-light)] px-1.5 py-0.2 rounded border border-[var(--border-subtle)]">{currentTrace.ruleVersion}</span>
                </div>
              </div>
            </div>

            {/* Step 3: Verified Inputs (Human Sign-off) */}
            <div className="relative pl-6 border-l-2 border-[var(--accent-sage)] space-y-2">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[var(--accent-sage)] flex items-center justify-center text-[9px] font-bold text-white">
                3
              </div>
              <div className="text-xs font-medium text-[var(--text-muted)]">VERIFIED INPUT PARAMETERS</div>
              <div className="space-y-2">
                {currentTrace.verifiedInputs.map((input, idx) => (
                  <div key={idx} className="p-3 rounded-[4px] bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[var(--text-primary)]">{input.label}</span>
                      <span className="font-mono font-semibold text-[var(--text-primary)]">{input.value}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[var(--status-verified-text)] pt-1 border-t border-[var(--border-subtle)]">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {input.verifiedBy}
                      </span>
                      <span className="text-[var(--text-muted)] font-mono">{input.verifiedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 4: Source Evidence & Coordinates */}
            <div className="relative pl-6 border-l-2 border-[var(--accent-sage)] space-y-2">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[var(--accent-sage)] flex items-center justify-center text-[9px] font-bold text-white">
                4
              </div>
              <div className="text-xs font-medium text-[var(--text-muted)]">SOURCE DOCUMENT COORDINATES</div>
              <div className="p-3 rounded-[4px] bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-primary)] font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[var(--accent-sage)] shrink-0" />
                  <span>Page {primaryInput.boundingBox.page} · Bounding Box</span>
                </div>
                <div className="font-mono text-xs text-[var(--accent-sage)] bg-[var(--bg-surface)] p-2 rounded border border-[var(--border-subtle)]">
                  x: {primaryInput.boundingBox.x}px, y: {primaryInput.boundingBox.y}px, w: {primaryInput.boundingBox.width}px, h: {primaryInput.boundingBox.height}px
                </div>
              </div>
            </div>

            {/* Step 5: Document & SHA-256 Fingerprint */}
            <div className="relative pl-6 space-y-2">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[var(--accent-sage)] flex items-center justify-center">
                <FileText className="w-2.5 h-2.5 text-white" />
              </div>
              <div className="text-xs font-medium text-[var(--text-muted)]">SUPPLIER DOCUMENT & CRYPTOGRAPHIC HASH</div>
              <div className="mt-1 p-3 rounded-[4px] bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[var(--accent-sage)] shrink-0" />
                  <span className="text-xs font-medium text-[var(--text-primary)] truncate">{currentTrace.documentName}</span>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-0.5">SHA-256 Evidence Hash</div>
                  <div className="font-mono text-[10px] text-[var(--text-secondary)] break-all bg-[var(--bg-surface)] p-1.5 rounded border border-[var(--border-subtle)]">
                    {currentTrace.documentHash}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action to Document Viewer */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenDocument) {
                    onOpenDocument(currentTrace.documentId, primaryInput.sourceFieldKey);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium rounded-[4px] bg-[var(--text-primary)] text-[var(--bg-main)] hover:opacity-90 transition-opacity focus-ring cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Inspect Exact Coordinates in Document Viewer
              </button>
            </div>
          </div>

          {/* Footer with JSON copy */}
          <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-subtle)] flex items-center justify-between text-xs">
            <span className="text-[var(--text-secondary)] flex items-center gap-1.5">
              <Binary className="w-3.5 h-3.5 text-[var(--accent-sage)]" />
              Immutable provenance record
            </span>
            <button
              type="button"
              onClick={handleCopyJson}
              aria-label="Copy audit JSON provenance record to clipboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[4px] bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--bg-panel)] transition-colors focus-ring cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[var(--status-verified-text)]" />
                  <span>Copied JSON</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <span>Copy Audit JSON</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
