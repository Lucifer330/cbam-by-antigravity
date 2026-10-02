import React, { useState } from 'react';
import type { CBAMDocument, ExtractedField } from '../../types/cbam';
import { VerificationStateBadge } from '../common/StatusBadge';
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
  Filter
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
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'confirmed'>('all');
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');

  // Flatten all fields across documents
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
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#e5e5de] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3d5042] mb-1">
            <ShieldCheck className="w-4 h-4 text-[#1b6830]" />
            Compliance Gatekeeper Protocol
          </div>
          <h1 className="text-xl font-semibold text-[#191c1e] tracking-tight">
            Verify Extracted Evidence
          </h1>
          <p className="text-xs text-[#5a6065] mt-1">
            Deterministic rules require verified human sign-off on every supplier data point prior to calculation.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-[4px] bg-[#f0f0ea] p-0.5 border border-[#d8d8ce] text-xs">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-[3px] font-medium transition-colors ${
                filterMode === 'all'
                  ? 'bg-white text-[#191c1e] shadow-xs'
                  : 'text-[#5a6065] hover:text-[#191c1e]'
              }`}
            >
              All ({allFieldItems.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('pending')}
              className={`px-3 py-1 rounded-[3px] font-medium transition-colors ${
                filterMode === 'pending'
                  ? 'bg-white text-[#9e5d03] shadow-xs font-semibold'
                  : 'text-[#5a6065] hover:text-[#191c1e]'
              }`}
            >
              Awaiting Verification ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('confirmed')}
              className={`px-3 py-1 rounded-[3px] font-medium transition-colors ${
                filterMode === 'confirmed'
                  ? 'bg-white text-[#1b6830] shadow-xs font-semibold'
                  : 'text-[#5a6065] hover:text-[#191c1e]'
              }`}
            >
              Verified Inputs ({confirmedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Verification Items List */}
      <div className="space-y-4">
        {filteredItems.map(({ document, field }) => {
          const isEditing = editingFieldId === field.id;

          return (
            <div
              key={`${document.id}-${field.id}`}
              className={`p-5 rounded-[6px] border transition-all ${
                field.status === 'human_confirmed'
                  ? 'bg-[#ffffff] border-[#c8e6ce]'
                  : field.status === 'ai_proposed'
                  ? 'bg-[#ffffff] border-[#e5e5de] hover:border-[#d4d4cb]'
                  : 'bg-[#fafafa] border-[#e5e5de]'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                {/* Column 1: Field details & Label */}
                <div className="lg:col-span-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#191c1e]">{field.label}</span>
                    {field.lowConfidenceFlag && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-[#a82323] bg-[#fdf2f2] px-1.5 py-0.5 rounded border border-[#f7cece]">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        Flagged Anomaly
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#5a6065] mt-1">
                    <span className="font-mono text-[#848a90]">{field.fieldKey}</span>
                    <span>•</span>
                    <span className="font-mono">Confidence {Math.round(field.confidence * 100)}%</span>
                  </div>
                  <div className="text-[11px] text-[#848a90] mt-0.5">
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
                        className="w-full px-2.5 py-1.5 rounded-[4px] bg-white border border-[#d8d8ce] text-xs font-mono font-medium text-[#191c1e] focus:outline-none focus:border-[#3d5042]"
                      />
                      <input
                        type="text"
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="Audit justification..."
                        className="w-full px-2.5 py-1 rounded-[4px] bg-white border border-[#d8d8ce] text-[11px] text-[#191c1e] focus:outline-none focus:border-[#3d5042]"
                      />
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(document.id, field.id)}
                          className="px-2.5 py-1 rounded-[3px] bg-[#191c1e] text-white text-xs font-medium"
                        >
                          <Save className="w-3 h-3 inline mr-1" />
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingFieldId(null)}
                          className="px-2.5 py-1 rounded-[3px] bg-white border border-[#e5e5de] text-xs text-[#5a6065]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#848a90] tracking-wider mb-0.5">
                        Extracted Value
                      </div>
                      <div className="font-mono text-base font-semibold text-[#191c1e]">
                        {field.value}
                      </div>
                      {field.notes && (
                        <div className="text-[11px] text-[#5a6065] italic mt-0.5">
                          {field.notes}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Column 3: Source Location */}
                <div className="lg:col-span-2 text-xs">
                  <div className="text-[10px] uppercase font-bold text-[#848a90] tracking-wider mb-0.5">
                    Source Coordinate
                  </div>
                  <div className="font-mono text-xs text-[#3d5042] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#3d5042]" />
                    Page {field.boundingBox.page}
                  </div>
                  <div className="font-mono text-[11px] text-[#5a6065]">
                    x={field.boundingBox.x}, y={field.boundingBox.y}
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenDocumentViewer(document.id, field.fieldKey)}
                    className="inline-flex items-center gap-1 text-[11px] text-[#3d5042] hover:text-[#191c1e] font-medium mt-1"
                  >
                    <ExternalLink className="w-2.5 h-2.5" />
                    Inspect on PDF
                  </button>
                </div>

                {/* Column 4: Verification Gatekeeper Actions */}
                <div className="lg:col-span-3 flex flex-col items-end gap-2">
                  <VerificationStateBadge status={field.status} verifiedBy={field.verifiedBy} />

                  {!isEditing && (
                    <div className="flex items-center gap-1.5">
                      {field.status !== 'human_confirmed' ? (
                        <button
                          type="button"
                          onClick={() => onConfirmField(document.id, field.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[4px] text-xs font-medium bg-[#191c1e] text-white hover:bg-[#2d3134] transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#a3e635]" />
                          Confirm
                        </button>
                      ) : (
                        <span className="text-xs font-mono text-[#1b6830] font-medium bg-[#ecf7ef] px-2 py-1 rounded border border-[#c8e6ce]">
                          Verified Input
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleStartEdit(field)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[4px] text-xs font-medium bg-white text-[#5a6065] border border-[#e5e5de] hover:text-[#191c1e] hover:bg-[#f6f6f3] transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                        Edit
                      </button>

                      {field.status !== 'rejected' && (
                        <button
                          type="button"
                          onClick={() => onRejectField(document.id, field.id)}
                          className="inline-flex items-center gap-1 px-2 py-1.5 rounded-[4px] text-xs font-medium text-[#a82323] hover:bg-[#fdf2f2] transition-colors"
                          title="Reject unverified field"
                        >
                          <XCircle className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
