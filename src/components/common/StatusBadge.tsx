import React from 'react';
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
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-[4px] bg-[var(--status-warning-bg)] text-[var(--status-warning-text)] border border-[var(--status-warning-border)] ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 shrink-0" />
          Needs verification
        </span>
      );
    case 'Verified':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-[4px] bg-[var(--status-verified-bg)] text-[var(--status-verified-text)] border border-[var(--status-verified-border)] ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          Verified
        </span>
      );
    case 'Calculated':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-[4px] bg-[var(--accent-sage-light)] text-[var(--accent-sage-dark)] border border-[var(--border-strong)] ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-sage)]" />
          Calculated
        </span>
      );
    case 'Flagged anomaly':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-[4px] bg-[var(--status-error-bg)] text-[var(--status-error-text)] border border-[var(--status-error-border)] ${sizeClasses}`}>
          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          Flagged anomaly
        </span>
      );
    case 'Archived':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-[4px] bg-[var(--bg-panel)] text-[var(--text-secondary)] border border-[var(--border-subtle)] ${sizeClasses}`}>
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
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-[4px] bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]" />
          AI proposed (Pending review)
        </span>
      );
    case 'human_confirmed':
      return (
        <span 
          title={verifiedBy ? `Verified by ${verifiedBy}` : 'Human confirmed'}
          className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-[4px] bg-[var(--status-verified-bg)] text-[var(--status-verified-text)] border border-[var(--status-verified-border)]"
        >
          <CheckCircle2 className="w-3 h-3 text-[var(--status-verified-text)]" />
          ✓ Human confirmed
        </span>
      );
    case 'edited':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-[4px] bg-[var(--status-warning-bg)] text-[var(--status-warning-text)] border border-[var(--status-warning-border)]">
          <AlertTriangle className="w-3 h-3" />
          Human corrected
        </span>
      );
    case 'rejected':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-[4px] bg-[var(--status-error-bg)] text-[var(--status-error-text)] border border-[var(--status-error-border)]">
          ✕ Rejected
        </span>
      );
  }
};
