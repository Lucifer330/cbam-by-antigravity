import type { ComplianceStatus } from '../../types/cbam';
import { CheckCircle2, Clock, AlertTriangle, Archive, ShieldAlert } from 'lucide-react';

interface StatusBadgeProps {
  status: ComplianceStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  switch (status) {
    case 'Needs verification':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-[4px] bg-[#fef8eb] text-[#9e5d03] border border-[#f8dfaa] ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 shrink-0" />
          Needs verification
        </span>
      );
    case 'Verified':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-[4px] bg-[#ecf7ef] text-[#1b6830] border border-[#c8e6ce] ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          Verified
        </span>
      );
    case 'Calculated':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-[4px] bg-[#f0f4f1] text-[#2c4032] border border-[#cfded2] ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#3d5042]" />
          Calculated
        </span>
      );
    case 'Flagged anomaly':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-[4px] bg-[#fdf2f2] text-[#a82323] border border-[#f7cece] ${sizeClasses}`}>
          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          Flagged anomaly
        </span>
      );
    case 'Archived':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-[4px] bg-[#f2f2ee] text-[#6b7280] border border-[#e2e2dc] ${sizeClasses}`}>
          <Archive className="w-3.5 h-3.5 shrink-0" />
          Archived
        </span>
      );
    default:
      return null;
  }
};

export const VerificationStateBadge: React.FC<{
  status: 'ai_proposed' | 'human_confirmed' | 'edited' | 'rejected';
  verifiedBy?: string;
}> = ({ status, verifiedBy }) => {
  switch (status) {
    case 'ai_proposed':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-[4px] bg-[#f5f5f1] text-[#5a6065] border border-[#e2e2dc]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#848a90]" />
          AI proposed (Pending review)
        </span>
      );
    case 'human_confirmed':
      return (
        <span 
          title={verifiedBy ? `Verified by ${verifiedBy}` : 'Human confirmed'}
          className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-[4px] bg-[#ecf7ef] text-[#1b6830] border border-[#c8e6ce]"
        >
          <CheckCircle2 className="w-3 h-3 text-[#1b6830]" />
          ✓ Human confirmed
        </span>
      );
    case 'edited':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-[4px] bg-[#fef8eb] text-[#9e5d03] border border-[#f8dfaa]">
          <AlertTriangle className="w-3 h-3" />
          Human corrected
        </span>
      );
    case 'rejected':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-[4px] bg-[#fdf2f2] text-[#a82323] border border-[#f7cece]">
          ✕ Rejected
        </span>
      );
  }
};
