import React, { useState } from 'react';
import type { CBAMDocument, ExtractedField } from '../../types/cbam';
import { VerificationStateBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';
import { SplitPaneAuditViewer } from '../split/SplitPaneAuditViewer';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Edit3, 
  MapPin, 
  FileText, 
  AlertTriangle, 
  ArrowRight,
  ExternalLink,
  Save,
  X,
  XCircle,
  Filter,
  Columns,
  List
} from 'lucide-react';

interface HumanVerificationViewProps {
  documents: CBAMDocument[];
  onConfirmField: (documentId: string, fieldId: string) => void;
  onEditField: (documentId: string, fieldId: string, newValue: string, notes: string) => void;
  onRejectField: (documentId: string, fieldId: string) => void;
  onOpenDocumentViewer: (documentId: string, fieldKey?: string) => void;
}

export const HumanVerificationView: React.FC<HumanVerificationViewProps> = ({
  documents,
  onConfirmField,
  onEditField,
  onRejectField,
  onOpenDocumentViewer,
}) => {
  const [viewLayout, setViewLayout] = useState<'split' | 'table'>('split');
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || '');
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'confirmed'>('all');
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');

  const activeDoc = documents.find(d => d.id === selectedDocId) || documents[0];

  // Flatten all fields across documents for table view
  const allFieldItems: { document: CBAMDocument; field: ExtractedField }[] = [];
  documents.forEach((doc) => {
    doc.extractedFields.forEach((field) => {
      allFieldItems.push({ document: doc, field });
    });
  });

  const filteredItems = allFieldItems.filter((item) => {
    if (filterMode === 'pending') return item.field.status === 'ai_proposed';
    if (filterMode === 'confirmed') return item.field.status === 'human_confirmed' || item.field.status === 'edited';
    return true;
  });

  const pendingCount = allFieldItems.filter((i) => i.field.status === 'ai_proposed').length;
  const confirmedCount = allFieldItems.filter(
    (i) => i.field.status === 'human_confirmed' || i.field.status === 'edited'
  ).length;

  const handleStartEdit = (field: ExtractedField) => {
    setEditingFieldId(field.id);
    setEditValue(field.value);
    setEditNotes(field.notes || '');
  };

  const handleSaveEdit = (documentId: string, fieldId: string) => {
    onEditField(documentId, fieldId, editValue, editNotes);
    setEditingFieldId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--accent-sage)] mb-1">
            <ShieldCheck className="w-4 h-4 text-[var(--status-verified-text)]" />
            Compliance Gatekeeper Protocol
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
            Verify Extracted Evidence
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Deterministic rules require verified human sign-off on every supplier data point prior to calculation.
          </p>
        </div>

        {/* View Layout Switcher & Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Dual-Pane vs Table Toggle */}
          <div className="inline-flex rounded-[6px] bg-[var(--bg-subtle)] p-0.5 border border-[var(--border-strong)] text-xs">
            <button
              type="button"
              onClick={() => setViewLayout('split')}
              aria-label="Split Screen Inspector Mode"
              className={`px-3 py-1 rounded-[4px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewLayout === 'split'
                  ? 'bg-[var(--accent-sage)] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Dual-Pane Split</span>
            </button>
            <button
              type="button"
              onClick={() => setViewLayout('table')}
              aria-label="Table Checklist Mode"
              className={`px-3 py-1 rounded-[4px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewLayout === 'table'
                  ? 'bg-[var(--accent-sage)] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table View</span>
            </button>
          </div>

          {/* Filter controls (for table view) */}
          {viewLayout === 'table' && (
            <div className="inline-flex rounded-[6px] bg-[var(--bg-subtle)] p-0.5 border border-[var(--border-strong)] text-xs">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-[4px] font-medium transition-colors cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                All ({allFieldItems.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('pending')}
                className={`px-3 py-1 rounded-[4px] font-medium transition-colors cursor-pointer ${
                  filterMode === 'pending'
                    ? 'bg-[var(--bg-surface)] text-[var(--status-warning-text)] shadow-xs font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Awaiting ({pendingCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('confirmed')}
                className={`px-3 py-1 rounded-[4px] font-medium transition-colors cursor-pointer ${
                  filterMode === 'confirmed'
                    ? 'bg-[var(--bg-surface)] text-[var(--status-verified-text)] shadow-xs font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Verified ({confirmedCount})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ───────────────── VIEW MODE 1: DUAL-PANE SPLIT SCREEN ───────────────── */}
      {viewLayout === 'split' ? (
        <div className="space-y-4">
          {/* Document Switcher Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-semibold text-[var(--text-secondary)] shrink-0">
              Active Document:
            </span>
            {documents.map((doc) => {
              const isSelected = doc.id === activeDoc.id;
              return (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`px-3 py-1.5 rounded-[6px] text-xs font-medium transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--text-primary)] text-[var(--bg-main)] shadow-xs'
                      : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                  }`}
                >
                  {doc.filename} ({doc.extractedFields.filter(f => f.status === 'human_confirmed').length}/{doc.extractedFields.length})
                </button>
              );
            })}
          </div>

          <SplitPaneAuditViewer
            document={activeDoc}
            onConfirmField={(fieldId) => onConfirmField(activeDoc.id, fieldId)}
            onRunCalculation={() => onOpenDocumentViewer(activeDoc.id)}
          />
        </div>
      ) : (
        /* ───────────────── VIEW MODE 2: TABLE LIST CHECKLIST ───────────────── */
        filteredItems.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="All evidence fields verified!"
            description="There are no pending extraction fields requiring human gatekeeper sign-off under your active filter."
            actionLabel="View All Extracted Fields"
            onAction={() => setFilterMode('all')}
          />
        ) : (
          <div className="space-y-3">
            {filteredItems.map(({ document, field }) => {
              const isEditing = editingFieldId === field.id;

              return (
                <div
                  key={`${document.id}-${field.id}`}
                  className={`p-4 rounded-lg border transition-all ${
                    field.status === 'human_confirmed'
                      ? 'bg-[var(--bg-surface)] border-[var(--status-verified-border)]'
                      : field.status === 'ai_proposed'
                      ? 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--accent-sage)]'
                      : 'bg-[var(--bg-subtle)] border-[var(--border-subtle)]'
                  }`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    {/* Column 1: Field details & Label */}
                    <div className="lg:col-span-4 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[var(--text-primary)]">{field.label}</span>
                        {field.lowConfidenceFlag && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-[var(--status-error-text)] bg-[var(--status-error-bg)] px-1.5 py-0.5 rounded border border-[var(--status-error-border)]">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            Flagged Anomaly
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                        <span className="font-mono text-[var(--text-muted)]">{field.fieldKey}</span>
                        <span>•</span>
                        <span className="font-mono">Confidence {Math.round(field.confidence * 100)}%</span>
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)]">
                        {document.productName} · {document.supplier}
                      </div>
                    </div>

                    {/* Column 2: Extracted Value / Edit form */}
                    <div className="lg:col-span-3">
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            placeholder="Value"
                            className="w-full px-2.5 py-1.5 rounded-[4px] bg-[var(--bg-surface)] border border-[var(--border-strong)] text-xs font-mono font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-sage)]"
                          />
                          <input
                            type="text"
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            placeholder="Audit justification..."
                            className="w-full px-2.5 py-1 rounded-[4px] bg-[var(--bg-surface)] border border-[var(--border-strong)] text-[11px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-sage)]"
                          />
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(document.id, field.id)}
                              className="px-2.5 py-1 rounded-[3px] bg-[var(--accent-sage)] text-white text-xs font-medium cursor-pointer"
                            >
                              <Save className="w-3 h-3 inline mr-1" />
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingFieldId(null)}
                              className="px-2.5 py-1 rounded-[3px] bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider mb-0.5">
                            Extracted Value
                          </div>
                          <div className="font-mono text-base font-semibold text-[var(--text-primary)]">
                            {field.value}
                          </div>
                          {field.notes && (
                            <div className="text-[11px] text-[var(--text-secondary)] italic mt-0.5">
                              {field.notes}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Column 3: Source Location */}
                    <div className="lg:col-span-2 text-xs">
                      <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider mb-0.5">
                        Source Coordinate
                      </div>
                      <div className="font-mono text-xs text-[var(--accent-sage)] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[var(--accent-sage)]" />
                        Page {field.boundingBox.page}
                      </div>
                      <div className="font-mono text-[11px] text-[var(--text-secondary)]">
                        x={field.boundingBox.x}, y={field.boundingBox.y}
                      </div>
                      <button
                        type="button"
                        onClick={() => onOpenDocumentViewer(document.id, field.fieldKey)}
                        className="inline-flex items-center gap-1 text-[11px] text-[var(--accent-sage)] hover:text-[var(--text-primary)] font-medium mt-1 cursor-pointer"
                      >
                        <ExternalLink className="w-2.5 h-2.5" />
                        Inspect on PDF
                      </button>
                    </div>

                    {/* Column 4: Verification Actions */}
                    <div className="lg:col-span-3 flex flex-col items-end gap-2">
                      <VerificationStateBadge status={field.status} verifiedBy={field.verifiedBy} />

                      {field.status === 'ai_proposed' && !isEditing && (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onConfirmField(document.id, field.id)}
                            className="px-3 py-1 rounded-[4px] bg-[var(--accent-sage)] text-white text-xs font-medium hover:opacity-90 transition-all cursor-pointer shadow-2xs"
                          >
                            ✓ Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStartEdit(field)}
                            className="p-1 rounded-[4px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] border border-[var(--border-subtle)] cursor-pointer"
                            title="Edit value"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onRejectField(document.id, field.id)}
                            className="p-1 rounded-[4px] text-[var(--status-error-text)] hover:bg-[var(--status-error-bg)] border border-[var(--status-error-border)] cursor-pointer"
                            title="Reject value"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
};
