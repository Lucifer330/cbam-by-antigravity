import React, { useState } from 'react';
import type { CBAMDocument } from '../../types/cbam';
import { DocumentViewer } from '../document/DocumentViewer';
import { ExtractionPanel } from '../extraction/ExtractionPanel';
import { PipelineStepper } from '../common/PipelineStepper';
import { HighlightBeamOverlay } from './HighlightBeamOverlay';
import { 
  ArrowLeft, 
  FileText, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Layers, 
  ShieldCheck, 
  Sparkles,
  Search,
  ExternalLink
} from 'lucide-react';

interface DocumentSplitViewProps {
  documents: CBAMDocument[];
  currentDocumentId: string;
  onSelectDocumentId: (id: string) => void;
  onBack: () => void;
  onConfirmField: (documentId: string, fieldId: string) => void;
  onEditField: (documentId: string, fieldId: string, newValue: string, notes: string) => void;
  onRejectField: (documentId: string, fieldId: string) => void;
  onRunCalculation: (documentId: string) => void;
  initialFocusedFieldKey?: string | null;
}

export const DocumentSplitView: React.FC<DocumentSplitViewProps> = ({
  documents,
  currentDocumentId,
  onSelectDocumentId,
  onBack,
  onConfirmField,
  onEditField,
  onRejectField,
  onRunCalculation,
  initialFocusedFieldKey,
}) => {
  const currentDoc = documents.find((d) => d.id === currentDocumentId) || documents[0];
  const [highlightedFieldKey, setHighlightedFieldKey] = useState<string | null>(initialFocusedFieldKey || null);

  const verifiedCount = currentDoc.extractedFields.filter(f => f.status === 'human_confirmed').length;
  const totalCount = currentDoc.extractedFields.length;

  return (
    <div className="flex flex-col lg:h-[calc(100vh-130px)] min-h-[640px] space-y-3 font-sans">
      {/* Sub-header with document switcher & navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--bg-surface)] px-4 py-2.5 border border-[var(--border-subtle)] rounded-[8px] shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to overview workspace"
            className="p-1.5 rounded-[4px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] flex items-center gap-1.5 text-xs font-semibold transition-colors focus-ring cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Workspace</span>
          </button>

          <span className="text-[var(--border-strong)]">|</span>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-secondary)] font-medium">Evidence Dossier:</span>
            <select
              value={currentDoc.id}
              onChange={(e) => onSelectDocumentId(e.target.value)}
              aria-label="Select active evidence document"
              className="px-2.5 py-1 rounded-[4px] bg-[var(--bg-subtle)] border border-[var(--border-strong)] text-xs font-semibold text-[var(--text-primary)] focus-ring cursor-pointer"
            >
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.filename} — {doc.supplier} ({doc.status})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-[var(--text-secondary)]">
            Verified Fields: <strong className="text-[var(--status-verified-text)] font-semibold">{verifiedCount}/{totalCount}</strong>
          </span>
          <span className="font-mono text-[11px] bg-[var(--accent-sage-light)] text-[var(--accent-sage-dark)] px-2 py-0.5 rounded border border-[var(--border-strong)] font-semibold">
            CN {currentDoc.cnCode}
          </span>
        </div>
      </div>

      {/* Active Document 6-Stage Pipeline Stepper Bar */}
      <PipelineStepper documentStatus={currentDoc.status} compact />

      {/* Dual-Pane Split-Screen Container: 7 cols document canvas / 5 cols verified checklist */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-y-auto lg:overflow-hidden">
        {/* Left / Right Panel 1: Document Viewer Canvas (7 cols on lg) */}
        <div className="lg:col-span-7 min-h-[520px] lg:min-h-0 lg:h-full overflow-hidden flex flex-col">
          <DocumentViewer
            document={currentDoc}
            highlightedFieldKey={highlightedFieldKey}
            onSelectField={(fieldKey) => setHighlightedFieldKey(fieldKey)}
          />
        </div>

        {/* Panel 2: Audit Checklist & Extraction Queue (5 cols on lg) */}
        <div className="lg:col-span-5 min-h-[520px] lg:min-h-0 lg:h-full overflow-hidden flex flex-col">
          <ExtractionPanel
            document={currentDoc}
            highlightedFieldKey={highlightedFieldKey}
            onHoverField={(fieldKey) => setHighlightedFieldKey(fieldKey)}
            onSelectField={(fieldKey) => setHighlightedFieldKey(fieldKey)}
            onConfirmField={(fieldId) => onConfirmField(currentDoc.id, fieldId)}
            onEditField={(fieldId, val, notes) => onEditField(currentDoc.id, fieldId, val, notes)}
            onRejectField={(fieldId) => onRejectField(currentDoc.id, fieldId)}
            onRunCalculation={onRunCalculation}
          />
        </div>
      </div>

      {/* Signature Animated SVG Highlight Beam Overlay connecting PDF bbox to Extraction field */}
      <HighlightBeamOverlay highlightedFieldKey={highlightedFieldKey} />
    </div>
  );
};
