import React, { useState } from 'react';
import type { CBAMDocument } from '../../types/cbam';
import { DocumentViewer } from '../document/DocumentViewer';
import { ExtractionPanel } from '../extraction/ExtractionPanel';
import { ArrowLeft, FileText, ChevronDown, CheckCircle2 } from 'lucide-react';

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

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[640px] space-y-3">
      {/* Sub-header with document switcher & navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-2.5 border border-[#e5e5de] rounded-[6px]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1 rounded text-[#5a6065] hover:text-[#191c1e] hover:bg-[#f0f0eb] flex items-center gap-1 text-xs font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Workspace</span>
          </button>

          <span className="text-[#848a90]">/</span>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#5a6065]">Active Evidence:</span>
            <select
              value={currentDoc.id}
              onChange={(e) => onSelectDocumentId(e.target.value)}
              className="px-2.5 py-1 rounded-[4px] bg-[#fbfbfa] border border-[#d8d8ce] text-xs font-medium text-[#191c1e] focus:outline-none focus:border-[#3d5042]"
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
          <span className="text-[#5a6065]">
            Product: <strong className="text-[#191c1e] font-medium">{currentDoc.productName}</strong>
          </span>
          <span className="font-mono text-[11px] bg-[#f0f0eb] text-[#3d5042] px-2 py-0.5 rounded border border-[#e2e2dc]">
            CN {currentDoc.cnCode}
          </span>
        </div>
      </div>

      {/* Split-screen container: Left = Document Viewer, Right = Extraction Panel */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
        {/* Left Side: Document Viewer (7 cols on lg) */}
        <div className="lg:col-span-7 h-full overflow-hidden">
          <DocumentViewer
            document={currentDoc}
            highlightedFieldKey={highlightedFieldKey}
            onSelectField={(fieldKey) => setHighlightedFieldKey(fieldKey)}
          />
        </div>

        {/* Right Side: Extraction Panel (5 cols on lg) */}
        <div className="lg:col-span-5 h-full overflow-hidden">
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
    </div>
  );
};
