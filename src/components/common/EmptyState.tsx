import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}) => {
  return (
    <div className="w-full p-8 md:p-12 bg-white border border-[#e5e5de] rounded-[8px] flex flex-col items-center justify-center text-center space-y-3 my-4">
      <div className="w-12 h-12 rounded-full bg-[#f6f6f3] border border-[#e5e5de] flex items-center justify-center text-[#3d5042] shadow-2xs">
        <Icon className="w-6 h-6" />
      </div>

      <div className="max-w-md space-y-1">
        <h3 className="text-sm font-semibold text-[#191c1e] tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-[#5a6065] leading-relaxed">
          {description}
        </p>
      </div>

      {(actionLabel || secondaryActionLabel) && (
        <div className="flex items-center gap-2 pt-2">
          {actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[4px] bg-[#191c1e] text-white text-xs font-medium hover:bg-[#2d3134] transition-colors shadow-2xs"
            >
              {actionLabel}
            </button>
          )}

          {secondaryActionLabel && onSecondaryAction && (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[4px] bg-white border border-[#e5e5de] text-[#191c1e] text-xs font-medium hover:bg-[#f6f6f3] transition-colors"
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
