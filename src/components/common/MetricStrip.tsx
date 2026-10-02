import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle2, Calculator, ArrowUpRight } from 'lucide-react';

interface MetricStripProps {
  documentsCount: number;
  awaitingCount: number;
  verifiedCount: number;
  traceableCount: number;
  onMetricClick?: (tab: string) => void;
  onTraceClick?: () => void;
}

const AnimatedCounter: React.FC<{ value: number; duration?: number }> = ({ value, duration = 500 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startVal = displayValue;
    const endVal = value;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic function
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (endVal - startVal) * easedProgress);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [value, duration]);

  return <>{displayValue}</>;
};

export const MetricStrip: React.FC<MetricStripProps> = ({
  documentsCount,
  awaitingCount,
  verifiedCount,
  traceableCount,
  onMetricClick,
  onTraceClick,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* Metric 1: Documents */}
      <button
        type="button"
        onClick={() => onMetricClick && onMetricClick('documents')}
        className="text-left p-4 rounded-[6px] bg-[#ffffff] border border-[#e5e5de] hover:border-[#d2d2c8] transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3d5042] focus-visible:ring-offset-1"
      >
        <div className="flex items-center justify-between text-xs text-[#5a6065] mb-1">
          <span className="font-medium text-[#5a6065]">Documents</span>
          <FileText className="w-3.5 h-3.5 text-[#848a90] group-hover:text-[#191c1e] transition-colors" />
        </div>
        <div className="text-2xl font-semibold tracking-tight text-[#191c1e] font-mono">
          <AnimatedCounter value={documentsCount} />
        </div>
        <div className="text-[11px] text-[#848a90] mt-1 flex items-center gap-1">
          <span>Invoices & EPDs stored</span>
        </div>
      </button>

      {/* Metric 2: Awaiting verification */}
      <button
        type="button"
        onClick={() => onMetricClick && onMetricClick('verification')}
        className="text-left p-4 rounded-[6px] bg-[#ffffff] border border-[#e5e5de] hover:border-[#f8dfaa] transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9e5d03] focus-visible:ring-offset-1"
      >
        <div className="flex items-center justify-between text-xs text-[#5a6065] mb-1">
          <span className="font-medium text-[#5a6065]">Awaiting verification</span>
          <Clock className="w-3.5 h-3.5 text-[#9e5d03]" />
        </div>
        <div className="text-2xl font-semibold tracking-tight text-[#9e5d03] font-mono">
          <AnimatedCounter value={awaitingCount} />
        </div>
        <div className="text-[11px] text-[#9e5d03] mt-1 font-medium flex items-center gap-1">
          <span>Human review required</span>
        </div>
      </button>

      {/* Metric 3: Verified inputs */}
      <button
        type="button"
        onClick={() => onMetricClick && onMetricClick('verification')}
        className="text-left p-4 rounded-[6px] bg-[#ffffff] border border-[#e5e5de] hover:border-[#c8e6ce] transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b6830] focus-visible:ring-offset-1"
      >
        <div className="flex items-center justify-between text-xs text-[#5a6065] mb-1">
          <span className="font-medium text-[#5a6065]">Verified inputs</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-[#1b6830]" />
        </div>
        <div className="text-2xl font-semibold tracking-tight text-[#191c1e] font-mono">
          <AnimatedCounter value={verifiedCount} />
        </div>
        <div className="text-[11px] text-[#1b6830] mt-1 flex items-center gap-1">
          <span>Gatekeeper approved</span>
        </div>
      </button>

      {/* Metric 4: Traceable results */}
      <button
        type="button"
        onClick={() => {
          if (onTraceClick) onTraceClick();
          else if (onMetricClick) onMetricClick('calculations');
        }}
        className="text-left p-4 rounded-[6px] bg-[#ffffff] border border-[#e5e5de] hover:border-[#3d5042] transition-all group relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3d5042] focus-visible:ring-offset-1"
      >
        <div className="flex items-center justify-between text-xs text-[#5a6065] mb-1">
          <span className="font-medium text-[#5a6065]">Traceable results</span>
          <span className="inline-flex items-center text-[#3d5042] group-hover:translate-x-0.5 transition-transform">
            <Calculator className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold tracking-tight text-[#191c1e] font-mono">
            <AnimatedCounter value={traceableCount} />
          </span>
          <span className="text-xs font-mono text-[#3d5042] bg-[#eaf0eb] px-1.5 py-0.5 rounded border border-[#c8e6ce] flex items-center gap-0.5">
            Click to trace
            <ArrowUpRight className="w-2.5 h-2.5" />
          </span>
        </div>
        <div className="text-[11px] text-[#5a6065] mt-1">
          100% deterministic rules
        </div>
      </button>
    </div>
  );
};

