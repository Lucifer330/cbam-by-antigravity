import React, { useState } from 'react';
import { 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  Calculator, 
  GitBranch, 
  Download,
  ArrowRight,
  Lock
} from 'lucide-react';

interface StageDetail {
  number: number;
  label: string;
  shortDesc: string;
  icon: React.ElementType;
  heading: string;
  fullDesc: string;
  keyFeatures: string[];
  mockDataSnippet: {
    title: string;
    items: { label: string; value: string; isMono?: boolean }[];
  };
}

const STAGES: StageDetail[] = [
  {
    number: 1,
    label: 'Upload Evidence',
    shortDesc: 'Automated document ingestion & cryptographic fingerprinting.',
    icon: UploadCloud,
    heading: 'Step 1: Evidence Ingestion & SHA-256 Locking',
    fullDesc: 'Upload supplier invoices, mill test certificates, and Environmental Product Declarations (EPDs). Every file is immediately hashed locally with SHA-256 before processing, ensuring an immutable evidentiary anchor.',
    keyFeatures: [
      'Instant SHA-256 checksum generation',
      'PDF & image multi-format parser',
      'Immutable evidentiary record in audit log'
    ],
    mockDataSnippet: {
      title: 'Evidence Record',
      items: [
        { label: 'File', value: 'supplier_invoice_042.pdf' },
        { label: 'File Size', value: '1.8 MB' },
        { label: 'SHA-256', value: '4a8f9c73e1b209d845e2a6d3910c85e4...', isMono: true },
        { label: 'Status', value: 'FINGERPRINT_LOCKED' }
      ]
    }
  },
  {
    number: 2,
    label: 'AI Extraction',
    shortDesc: 'High-precision multimodal models extract candidate emission factors.',
    icon: Sparkles,
    heading: 'Step 2: AI Proposal & Bounding Box Localization',
    fullDesc: 'Specialized extraction models parse unstructured supplier documents to propose candidate fields (net mass, CN code, direct/indirect emission factors) along with exact page coordinates [x, y, width, height].',
    keyFeatures: [
      'Visual bounding box mapping',
      'Confidence score per extracted field',
      'AI only proposes — never commits unverified data'
    ],
    mockDataSnippet: {
      title: 'Extracted Field Candidates',
      items: [
        { label: 'Net Mass', value: '1,000 t (Confidence: 98%)' },
        { label: 'CN Code', value: '7208 39 00 (Confidence: 94%)' },
        { label: 'Direct Emissions', value: '1.60 tCO₂e/t (Confidence: 91%)' },
        { label: 'Location', value: 'Page 1, Box [132, 418, 160, 26]', isMono: true }
      ]
    }
  },
  {
    number: 3,
    label: 'Human Verification',
    shortDesc: 'Mandatory human gatekeeper verifies or edits proposed values.',
    icon: CheckCircle2,
    heading: 'Step 3: Human-in-the-Loop Sign-off Gate',
    fullDesc: 'No AI-generated value enters calculation without human sign-off. Compliance officers inspect the document side-by-side with proposed numbers, confirming accuracy or applying corrected values.',
    keyFeatures: [
      'Side-by-side interactive split viewer',
      'One-click field confirmation or manual override',
      'Attributed officer signature on every confirmed field'
    ],
    mockDataSnippet: {
      title: 'Gatekeeper Verification',
      items: [
        { label: 'Reviewer', value: 'E. Moreau (Lead CBAM Officer)' },
        { label: 'Action', value: '3/3 Fields Confirmed' },
        { label: 'Verification Time', value: 'Today, 09:44 CET' },
        { label: 'Status', value: 'HUMAN_CONFIRMED' }
      ]
    }
  },
  {
    number: 4,
    label: 'Deterministic Calc',
    shortDesc: 'Zero AI math: certified regulatory formulas calculate exact values.',
    icon: Calculator,
    heading: 'Step 4: Deterministic Regulatory Calculation',
    fullDesc: 'Pure, auditable arithmetic with zero AI involvement. The engine applies the locked EU CBAM Transitional Methodology (Regulation 2023/956) to human-verified parameters, guaranteeing reproducible results.',
    keyFeatures: [
      'Sandboxed arithmetic execution engine',
      'Versioned regulatory formula lock (v2026.1)',
      '100% reproducible math without hallucination'
    ],
    mockDataSnippet: {
      title: 'Engine Execution',
      items: [
        { label: 'Formula', value: 'Net Mass × (Specific Direct + Indirect)' },
        { label: 'Computation', value: '1,000 t × 1.90 tCO₂e/t = 1,900.00 tCO₂e' },
        { label: 'Rule Version', value: 'v2026.1 (Implementing Reg 2023/1773)', isMono: true },
        { label: 'Status', value: 'DETERMINISTIC_PASS' }
      ]
    }
  },
  {
    number: 5,
    label: 'Provenance Trace',
    shortDesc: 'Bi-directional cryptographic linkage between math and document.',
    icon: GitBranch,
    heading: 'Step 5: Bi-directional Provenance Trace Chain',
    fullDesc: 'Every final calculated number retains an unbreakable audit beam pointing backwards to its verified inputs, the exact rule version, the human verifier, and the source PDF coordinates.',
    keyFeatures: [
      'Click-to-trace reverse navigation',
      'Full Merkle audit trail logging',
      'End-to-end evidence transparency for auditors'
    ],
    mockDataSnippet: {
      title: 'Trace Chain Metadata',
      items: [
        { label: 'Trace Target', value: '1,900.00 tCO₂e' },
        { label: 'Lineage Depth', value: '5 Certified Layers' },
        { label: 'Audit Link', value: 'AUD-2026-TR-042', isMono: true },
        { label: 'Chain State', value: 'VERIFIED_CHAIN' }
      ]
    }
  },
  {
    number: 6,
    label: 'Export Dossier',
    shortDesc: 'Audit-ready CBAM declaration assistance packs ready for review.',
    icon: Download,
    heading: 'Step 6: Official Compliance Dossier Export',
    fullDesc: 'Generate structured CBAM declaration assistance packages, complete with audit timelines, SHA-256 document proofs, and printable calculation breakdown summaries ready for customs submission.',
    keyFeatures: [
      'EU Registry compatible XML formatting',
      'Executive summary PDF with full provenance ledger',
      'Instant print-friendly compliance reports'
    ],
    mockDataSnippet: {
      title: 'Export Package',
      items: [
        { label: 'Format', value: 'CBAM Standard XML + PDF Dossier' },
        { label: 'Included Items', value: '6 Verified Lines · 2 Calculations' },
        { label: 'Audit Proof', value: 'Included (SHA-256 Ledger)' },
        { label: 'Dossier Code', value: 'CBAM-DOSSIER-2026-Q3-DE', isMono: true }
      ]
    }
  }
];

export const PipelineInteractive: React.FC = () => {
  const [activeStageNumber, setActiveStageNumber] = useState<number>(1);
  const activeStage = STAGES.find(s => s.number === activeStageNumber) || STAGES[0];
  const Icon = activeStage.icon;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* 6-Stage Interactive Navigation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {STAGES.map((stage) => {
          const StageIcon = stage.icon;
          const isSelected = stage.number === activeStageNumber;

          return (
            <button
              key={stage.number}
              onClick={() => setActiveStageNumber(stage.number)}
              className={`text-left p-3.5 rounded-lg border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-[#3d5042] ring-2 ring-[#3d5042]/15 shadow-sm'
                  : 'bg-[#f6f6f3]/60 hover:bg-white border-[#e5e5de] hover:border-[#d2d2c8]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-7 h-7 rounded-[5px] flex items-center justify-center text-xs font-semibold ${
                  isSelected ? 'bg-[#3d5042] text-white' : 'bg-[#e5e5de] text-[#5a6065]'
                }`}>
                  {stage.number}
                </div>
                <StageIcon className={`w-4 h-4 ${isSelected ? 'text-[#3d5042]' : 'text-[#848a90]'}`} />
              </div>
              <div>
                <div className={`text-xs font-semibold tracking-tight ${isSelected ? 'text-[#191c1e]' : 'text-[#5a6065]'}`}>
                  {stage.label}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Stage Detail Card */}
      <div className="bg-white border border-[#e5e5de] rounded-xl p-6 md:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
          {/* Left Column: Stage Explanation */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#3d5042] bg-[#eaf0eb] px-2.5 py-0.5 rounded-[4px] border border-[#c8e6ce]">
                Stage 0{activeStage.number} of 06
              </span>
              <span className="text-xs text-[#848a90]">
                Continuous Compliance Pipeline
              </span>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-bold text-[#191c1e] tracking-tight">
                {activeStage.heading}
              </h3>
              <p className="mt-2 text-sm text-[#5a6065] leading-relaxed">
                {activeStage.fullDesc}
              </p>
            </div>

            {/* Key Features Bullet List */}
            <div className="space-y-2 pt-1">
              <div className="text-xs font-semibold text-[#191c1e] uppercase tracking-wider">
                Key Protocol Guarantees:
              </div>
              {activeStage.keyFeatures.map((feat, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-[#191c1e]">
                  <CheckCircle2 className="w-4 h-4 text-[#1b6830] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Quick Navigation Controls */}
            <div className="pt-3 flex items-center gap-3">
              {activeStageNumber > 1 && (
                <button
                  onClick={() => setActiveStageNumber(prev => prev - 1)}
                  className="text-xs font-medium text-[#5a6065] hover:text-[#191c1e] px-3 py-1.5 rounded border border-[#e5e5de] hover:bg-[#f6f6f3] transition-colors cursor-pointer"
                >
                  ← Previous Stage
                </button>
              )}
              {activeStageNumber < 6 && (
                <button
                  onClick={() => setActiveStageNumber(prev => prev + 1)}
                  className="text-xs font-medium text-white bg-[#3d5042] hover:bg-[#2c3a30] px-3.5 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Next: {STAGES[activeStageNumber].label}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Live Data Payload Mockup */}
          <div className="lg:col-span-5 bg-[#f6f6f3] border border-[#e5e5de] rounded-lg p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5e5de] mb-4">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-[#3d5042]" />
                <span className="text-xs font-bold text-[#191c1e]">
                  {activeStage.mockDataSnippet.title}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#848a90]">
                LIVE PROTOCOL DATA
              </span>
            </div>

            <div className="space-y-3">
              {activeStage.mockDataSnippet.items.map((item, idx) => (
                <div key={idx} className="bg-white p-2.5 rounded border border-[#e5e5de]/80 space-y-0.5">
                  <div className="text-[10px] uppercase font-semibold text-[#848a90] tracking-wider">
                    {item.label}
                  </div>
                  <div className={`text-xs text-[#191c1e] ${item.isMono ? 'font-mono text-[11px] break-all text-[#3d5042]' : 'font-medium'}`}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-[#e5e5de] flex items-center justify-between text-[10px] text-[#848a90]">
              <span className="flex items-center gap-1 font-mono">
                <Lock className="w-3 h-3 text-[#1b6830]" />
                Cryptographically Sealed
              </span>
              <span>Reg (EU) 2023/956</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
