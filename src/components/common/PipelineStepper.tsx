import React from 'react';
import type { ComplianceStatus } from '../../types/cbam';
import { 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  Calculator, 
  GitBranch, 
  Download,
  AlertTriangle
} from 'lucide-react';

interface PipelineStepperProps {
  currentStage?: number; // 1 to 6
  documentStatus?: ComplianceStatus;
  compact?: boolean;
  onStageClick?: (stageNumber: number) => void;
}

export const STAGES = [
  { number: 1, label: 'Upload Evidence', icon: UploadCloud, detail: 'SHA-256 fingerprinted' },
  { number: 2, label: 'AI Extraction', icon: Sparkles, detail: 'Candidate fields proposed' },
  { number: 3, label: 'Human Verification', icon: CheckCircle2, detail: 'Gatekeeper sign-off' },
  { number: 4, label: 'Deterministic Calc', icon: Calculator, detail: 'Rule v2026.1 execution' },
  { number: 5, label: 'Provenance Trace', icon: GitBranch, detail: 'Cryptographic lineage' },
  { number: 6, label: 'Export Dossier', icon: Download, detail: 'CBAM declaration ready' },
];

export const PipelineStepper: React.FC<PipelineStepperProps> = ({
  currentStage: explicitStage,
  documentStatus,
  compact = false,
  onStageClick
}) => {
  // Infer active stage from document status if explicitStage is not provided
  let activeStage = explicitStage || 1;
  if (!explicitStage && documentStatus) {
    switch (documentStatus) {
      case 'Needs verification':
        activeStage = 3;
        break;
      case 'Verified':
        activeStage = 4;
        break;
      case 'Calculated':
        activeStage = 6;
        break;
      case 'Flagged anomaly':
        activeStage = 3;
        break;
      default:
        activeStage = 1;
    }
  }

  const isFlagged = documentStatus === 'Flagged anomaly';

  return (
    <div className="w-full bg-white border border-[#e5e5de] rounded-[6px] p-3 md:p-3.5 shadow-2xs">
      <div className="flex items-center justify-between gap-1 overflow-x-auto scrollbar-none">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isCompleted = stage.number < activeStage;
          const isActive = stage.number === activeStage;
          const isLast = idx === STAGES.length - 1;

          let circleClasses = 'bg-[#f4f4f0] text-[#848a90] border-[#d8d8ce]';
          let titleClasses = 'text-[#5a6065] font-medium';
          let lineClasses = 'bg-[#e5e5de]';

          if (isCompleted) {
            circleClasses = 'bg-[#ecf7ef] text-[#1b6830] border-[#c8e6ce]';
            titleClasses = 'text-[#1b6830] font-medium';
            lineClasses = 'bg-[#c8e6ce]';
          } else if (isActive) {
            if (isFlagged && stage.number === 3) {
              circleClasses = 'bg-[#fdf2f2] text-[#a82323] border-[#f7cece] ring-2 ring-[#f7cece]';
              titleClasses = 'text-[#a82323] font-semibold';
            } else {
              circleClasses = 'bg-[#3d5042] text-white border-[#3d5042] ring-2 ring-[#eaf0eb]';
              titleClasses = 'text-[#191c1e] font-semibold';
            }
          }

          return (
            <React.Fragment key={stage.number}>
              <div 
                onClick={() => onStageClick && onStageClick(stage.number)}
                className={`flex items-center gap-2 shrink-0 ${onStageClick ? 'cursor-pointer hover:opacity-80' : ''}`}
                title={`Stage ${stage.number}: ${stage.label} — ${stage.detail}`}
              >
                {/* Stage Circle */}
                <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs transition-all ${circleClasses}`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-[#1b6830]" />
                  ) : isFlagged && isActive && stage.number === 3 ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-[#a82323]" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Stage Label & Details */}
                <div className="flex flex-col text-xs leading-tight">
                  <span className={`text-[11px] md:text-xs tracking-tight ${titleClasses}`}>
                    {stage.number}. {stage.label}
                  </span>
                  {!compact && (
                    <span className="text-[10px] text-[#848a90] hidden xl:inline font-mono">
                      {isFlagged && isActive && stage.number === 3 ? 'Flagged anomaly' : stage.detail}
                    </span>
                  )}
                </div>
              </div>

              {/* Connecting Line */}
              {!isLast && (
                <div className="flex-1 min-w-[16px] md:min-w-[28px] max-w-[60px] mx-1 md:mx-2 h-0.5 rounded-full transition-colors hidden sm:block">
                  <div className={`h-full w-full rounded-full ${lineClasses}`} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
