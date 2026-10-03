import React, { useState, useEffect } from 'react';
import type { CBAMDocument, DocumentType } from '../../types/cbam';
import { 
  X, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ShieldCheck
} from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentAdded: (newDoc: CBAMDocument) => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onDocumentAdded,
}) => {
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
    type: DocumentType;
    supplier: string;
    cnCode: string;
    productName: string;
  } | null>(null);

  const [uploadStage, setUploadStage] = useState<'idle' | 'received' | 'extracting' | 'preparing' | 'completed'>('idle');
  const [stageProgress, setStageProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useFocusTrap<HTMLDivElement>({ isOpen, onClose });

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setUploadStage('idle');
      setStageProgress(0);
      setIsDragging(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleSimulateUpload(0);
  };

  const handleSimulateUpload = (presetIndex: number) => {
    const presets = [
      {
        name: 'tata_steel_plate_inv992.pdf',
        size: '2.4 MB',
        type: 'Invoice' as DocumentType,
        supplier: 'Tata Steel Nederland BV',
        cnCode: '7208 51 20',
        productName: 'Heavy flat-rolled structural steel plate'
      },
      {
        name: 'alunorte_alumina_epd_2026.pdf',
        size: '3.1 MB',
        type: 'EPD' as DocumentType,
        supplier: 'Hydro Alunorte Refineries',
        cnCode: '2818 20 00',
        productName: 'Calcined metallurgical alumina'
      },
      {
        name: 'cemex_clinker_emissions_cert.pdf',
        size: '1.6 MB',
        type: 'Emissions statement' as DocumentType,
        supplier: 'CEMEX Mediterranean Clinker Works',
        cnCode: '2523 10 00',
        productName: 'Grey Portland cement clinker'
      }
    ];

    const file = presets[presetIndex];
    setSelectedFile(file);
    setUploadStage('received');
    setStageProgress(25);

    // Stage 1 -> Stage 2
    setTimeout(() => {
      setUploadStage('extracting');
      setStageProgress(65);
    }, 1200);

    // Stage 2 -> Stage 3
    setTimeout(() => {
      setUploadStage('preparing');
      setStageProgress(90);
    }, 2400);

    // Stage 3 -> Completed
    setTimeout(() => {
      setUploadStage('completed');
      setStageProgress(100);

      // Create new document
      const newDoc: CBAMDocument = {
        id: `doc-${Date.now()}`,
        filename: file.name,
        fileSize: file.size,
        sha256: 'e8b417c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6',
        supplier: file.supplier,
        supplierCountry: 'NL / EU Border Gate',
        importer: 'ThyssenKrupp Euro-Import S.A. [DE94827103]',
        productName: file.productName,
        cnCode: file.cnCode,
        goodsCategory: 'Iron & Steel',
        documentType: file.type,
        uploadedAt: 'Just now',
        updatedAt: 'Just now',
        status: 'Needs verification',
        traceabilityPercent: 50,
        installationName: 'IJmuiden Oxygen Steel Works #2',
        installationCountry: 'NL',
        productionRoute: 'BF-BOF route with scrap optimization',
        extractedFields: [
          {
            id: `f-${Date.now()}-1`,
            fieldKey: 'net_mass',
            label: 'Net mass',
            value: '1,250 t',
            numericValue: 1250,
            unit: 't',
            confidence: 0.98,
            boundingBox: { page: 1, x: 140, y: 360, width: 140, height: 26 },
            status: 'ai_proposed',
            notes: 'Verified against consignment manifest weight note'
          },
          {
            id: `f-${Date.now()}-2`,
            fieldKey: 'cn_code',
            label: 'CN code',
            value: file.cnCode,
            confidence: 0.95,
            boundingBox: { page: 1, x: 120, y: 240, width: 130, height: 24 },
            status: 'ai_proposed',
            notes: 'TARIC goods code matched'
          },
          {
            id: `f-${Date.now()}-3`,
            fieldKey: 'emissions_direct',
            label: 'Direct specific emissions',
            value: '1.74 tCO₂e/t',
            numericValue: 1.74,
            unit: 'tCO₂e/t',
            confidence: 0.91,
            boundingBox: { page: 1, x: 132, y: 430, width: 160, height: 26 },
            status: 'ai_proposed',
            notes: 'Calculated at supplier installation boundary'
          },
          {
            id: `f-${Date.now()}-4`,
            fieldKey: 'emissions_indirect',
            label: 'Indirect specific emissions',
            value: '0.22 tCO₂e/t',
            numericValue: 0.22,
            unit: 'tCO₂e/t',
            confidence: 0.89,
            boundingBox: { page: 1, x: 132, y: 465, width: 160, height: 26 },
            status: 'ai_proposed',
            notes: 'Electricity grid factor applied'
          }
        ]
      };

      setTimeout(() => {
        onDocumentAdded(newDoc);
        onClose();
      }, 900);
    }, 3600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="upload-modal-title">
      {/* Dimmed backdrop */}
      <div 
        className="fixed inset-0 bg-[#000000]/50 transition-opacity backdrop-blur-[2px] animate-backdrop-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          ref={containerRef}
          tabIndex={-1}
          className="relative w-full max-w-xl rounded-xl bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-2xl overflow-hidden animate-toast-in focus:outline-none"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)] flex items-center justify-between">
            <div>
              <h2 id="upload-modal-title" className="text-sm font-semibold text-[var(--text-primary)] tracking-tight">
                Add Supplier Evidence
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Supported: Commercial Invoices, EPDs, and Accredited Emissions Statements
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close upload modal"
              className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-panel)] transition-colors focus-ring cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {uploadStage === 'idle' ? (
              <>
                {/* Drag and Drop Box */}
                <div 
                  onClick={() => handleSimulateUpload(0)}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  role="button"
                  tabIndex={0}
                  aria-label="Click to browse or drop supplier document here"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSimulateUpload(0);
                    }
                  }}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer group focus-ring ${
                    isDragging
                      ? 'border-[var(--accent-sage)] bg-[var(--status-verified-bg)] scale-[1.01] ring-4 ring-[var(--status-verified-border)]'
                      : 'border-[var(--border-strong)] hover:border-[var(--accent-sage)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-panel)]'
                  }`}
                >
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center transition-transform ${
                    isDragging ? 'bg-[var(--accent-sage)] text-white scale-110' : 'bg-[var(--accent-sage-light)] border border-[var(--border-subtle)] text-[var(--accent-sage)] group-hover:scale-105'
                  }`}>
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-semibold text-[var(--text-primary)]">
                    {isDragging ? 'Drop file now to ingest & fingerprint' : 'Click to browse or drop supplier document here'}
                  </div>
                  <div className="text-[11px] text-[var(--text-secondary)] mt-1">
                    Accepts PDF, XML (TARIC declaration), or EPD files up to 25 MB
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--text-secondary)]">
                    <ShieldCheck className="w-3 h-3 text-[var(--status-verified-text)]" />
                    Automatic SHA-256 evidence fingerprinting on ingestion
                  </div>
                </div>

                {/* Preset Fast-Test Demonstrations */}
                <div>
                  <div className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                    Or select pre-staged supplier evidence file:
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      type="button"
                      onClick={() => handleSimulateUpload(0)}
                      aria-label="Simulate ingest for Tata Steel Plate"
                      className="p-3 text-left rounded-[6px] bg-[var(--bg-subtle)] border border-[var(--border-subtle)] hover:border-[var(--accent-sage)] hover:bg-[var(--bg-surface)] transition-all text-xs flex items-center justify-between focus-ring cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-[var(--accent-sage)]" />
                        <div>
                          <div className="font-medium text-[var(--text-primary)]">Tata Steel Plate (Heavy Structural)</div>
                          <div className="text-[11px] text-[var(--text-secondary)]">Invoice · CN 7208 51 20 · 1,250 t</div>
                        </div>
                      </div>
                      <span className="font-mono text-[11px] text-[var(--accent-sage)] font-semibold">Simulate Ingest →</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSimulateUpload(1)}
                      aria-label="Simulate ingest for Hydro Alunorte Alumina EPD"
                      className="p-3 text-left rounded-[6px] bg-[var(--bg-subtle)] border border-[var(--border-subtle)] hover:border-[var(--accent-sage)] hover:bg-[var(--bg-surface)] transition-all text-xs flex items-center justify-between focus-ring cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-[var(--accent-sage)]" />
                        <div>
                          <div className="font-medium text-[var(--text-primary)]">Hydro Alunorte Alumina EPD 2026</div>
                          <div className="text-[11px] text-[var(--text-secondary)]">EPD · CN 2818 20 00 · 850 t</div>
                        </div>
                      </div>
                      <span className="font-mono text-[11px] text-[var(--accent-sage)] font-semibold">Simulate Ingest →</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* PROGRESS STAGES VIEW */
              <div className="space-y-6 py-4">
                {/* Uploaded File Info */}
                {selectedFile && (
                  <div className="p-4 rounded-[6px] bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[var(--accent-sage)]" />
                      <div>
                        <div className="font-semibold text-[var(--text-primary)]">{selectedFile.name}</div>
                        <div className="text-[11px] text-[var(--text-secondary)]">
                          {selectedFile.size} · Uploaded 09:42 CET · {selectedFile.supplier}
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-[var(--status-verified-text)] bg-[var(--status-verified-bg)] px-2 py-0.5 rounded border border-[var(--status-verified-border)]">
                      SHA-256 Generated
                    </span>
                  </div>
                )}

                {/* Progress bar */}
                <div className="w-full bg-[var(--bg-panel)] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[var(--accent-sage)] h-full transition-all duration-500 ease-out"
                    style={{ width: `${stageProgress}%` }}
                  />
                </div>

                {/* Stages List */}
                <div className="space-y-3 text-xs">
                  {/* Stage 1 */}
                  <div className="flex items-center justify-between p-3 rounded-[6px] bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2.5">
                      {stageProgress >= 25 ? (
                        <CheckCircle2 className="w-4 h-4 text-[var(--status-verified-text)]" />
                      ) : (
                        <Clock className="w-4 h-4 text-[var(--text-muted)]" />
                      )}
                      <span className="font-medium text-[var(--text-primary)]">1. Document received & hash locked</span>
                    </div>
                    <span className="font-mono text-[11px] text-[var(--text-muted)]">
                      {stageProgress >= 25 ? 'Complete' : 'Pending'}
                    </span>
                  </div>

                  {/* Stage 2 */}
                  <div className="flex items-center justify-between p-3 rounded-[6px] bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2.5">
                      {stageProgress >= 65 ? (
                        <CheckCircle2 className="w-4 h-4 text-[var(--status-verified-text)]" />
                      ) : uploadStage === 'extracting' ? (
                        <Sparkles className="w-4 h-4 text-[var(--status-warning-text)] animate-pulse" />
                      ) : (
                        <Clock className="w-4 h-4 text-[var(--text-muted)]" />
                      )}
                      <span className="font-medium text-[var(--text-primary)]">2. Extracting fields & coordinate mapping</span>
                    </div>
                    <span className="font-mono text-[11px] text-[var(--text-muted)]">
                      {stageProgress >= 65 ? 'Complete (4 fields proposed)' : uploadStage === 'extracting' ? 'Extracting...' : 'Waiting'}
                    </span>
                  </div>

                  {/* Stage 3 */}
                  <div className="flex items-center justify-between p-3 rounded-[6px] bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2.5">
                      {stageProgress >= 100 ? (
                        <CheckCircle2 className="w-4 h-4 text-[var(--status-verified-text)]" />
                      ) : uploadStage === 'preparing' ? (
                        <Clock className="w-4 h-4 text-[var(--accent-sage)] animate-spin" />
                      ) : (
                        <Clock className="w-4 h-4 text-[var(--text-muted)]" />
                      )}
                      <span className="font-medium text-[var(--text-primary)]">3. Preparing human verification queue</span>
                    </div>
                    <span className="font-mono text-[11px] text-[var(--text-muted)]">
                      {stageProgress >= 100 ? 'Ready for Auditor' : uploadStage === 'preparing' ? 'Finalizing...' : 'Waiting'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
