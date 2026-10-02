import React, { useState, useEffect, useCallback } from 'react';

interface HighlightBeamOverlayProps {
  highlightedFieldKey: string | null;
}

export const HighlightBeamOverlay: React.FC<HighlightBeamOverlayProps> = ({
  highlightedFieldKey,
}) => {
  const [coords, setCoords] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const updateCoordinates = useCallback(() => {
    if (!highlightedFieldKey || window.innerWidth < 1024) {
      setIsVisible(false);
      return;
    }

    const bboxEl = document.getElementById(`bbox-${highlightedFieldKey}`);
    const rowEl = document.getElementById(`row-${highlightedFieldKey}`);

    if (bboxEl && rowEl) {
      const rectA = bboxEl.getBoundingClientRect();
      const rectB = rowEl.getBoundingClientRect();

      // Check if both elements are visible on screen
      if (rectA.width > 0 && rectB.width > 0 && rectA.bottom > 0 && rectB.bottom > 0) {
        setCoords({
          x1: rectA.right,
          y1: rectA.top + rectA.height / 2,
          x2: rectB.left,
          y2: rectB.top + rectB.height / 2,
        });
        setIsVisible(true);
        return;
      }
    }

    setIsVisible(false);
  }, [highlightedFieldKey]);

  useEffect(() => {
    updateCoordinates();

    const handleScrollOrResize = () => {
      requestAnimationFrame(updateCoordinates);
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [updateCoordinates]);

  if (!isVisible || !coords) return null;

  const { x1, y1, x2, y2 } = coords;
  const dx = Math.max(40, Math.abs(x2 - x1) * 0.4);
  const pathD = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

  return (
    <svg className="fixed inset-0 w-full h-full pointer-events-none z-40 overflow-visible transition-opacity duration-300">
      <defs>
        <linearGradient id="splitBeamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3d5042" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#34d399" stopOpacity="1" />
          <stop offset="100%" stopColor="#1b6830" stopOpacity="0.9" />
        </linearGradient>

        <filter id="splitBeamGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Underlay Glow Path */}
      <path
        d={pathD}
        fill="none"
        stroke="#34d399"
        strokeWidth="5"
        strokeOpacity="0.3"
        filter="url(#splitBeamGlow)"
      />

      {/* Main Animated Dash Flow Beam */}
      <path
        d={pathD}
        fill="none"
        stroke="url(#splitBeamGrad)"
        strokeWidth="2.5"
        strokeDasharray="6 4"
        className="animate-beam-dash"
      />

      {/* Start Anchor Pulse Ring (Bounding Box side) */}
      <circle cx={x1} cy={y1} r="4.5" fill="#34d399" className="animate-pulse" />
      <circle cx={x1} cy={y1} r="2" fill="#3d5042" />

      {/* End Anchor Pulse Ring (Extraction Row side) */}
      <circle cx={x2} cy={y2} r="4.5" fill="#1b6830" className="animate-pulse" />
      <circle cx={x2} cy={y2} r="2" fill="#a3e635" />
    </svg>
  );
};
