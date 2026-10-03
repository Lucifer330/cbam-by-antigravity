import React, { Suspense, lazy, useState } from 'react';
import { ShieldCheck, Activity } from 'lucide-react';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineHeroBackdropProps {
  sceneUrl?: string;
  children: React.ReactNode;
}

export const SplineHeroBackdrop: React.FC<SplineHeroBackdropProps> = ({
  sceneUrl = 'https://prod.spline.design/rU-1iN643EB-IlsO/scene.splinecode',
  children,
}) => {
  const [is3DLoaded, setIs3DLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full min-h-screen bg-[#070b09] text-[#e8ece9] overflow-hidden">
      {/* ───────────────── LAYER 0: AMBIENT RADIAL NEON GLOWS ───────────────── */}
      <div className="absolute -top-32 left-1/4 w-[420px] h-[420px] bg-[#10b981]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[420px] h-[420px] bg-[#38bdf8]/10 rounded-full blur-[160px] pointer-events-none" />

      {/* ───────────────── LAYER 1: LAZY-LOADED 3D SPLINE CANVAS ───────────────── */}
      {!hasError && (
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-auto opacity-70 hover:opacity-100 transition-opacity duration-700">
          <Suspense
            fallback={
              <div className="flex flex-col items-center gap-2 text-xs font-mono text-[#10b981] animate-pulse">
                <Activity className="w-5 h-5 animate-spin" />
                <span>INITIALIZING 3D MERKLE ENVIRONMENT...</span>
              </div>
            }
          >
            <Spline
              scene={sceneUrl}
              onLoad={() => setIs3DLoaded(true)}
              onError={() => setHasError(true)}
              className="w-full h-full"
            />
          </Suspense>
        </div>
      )}

      {/* ───────────────── LAYER 2: FOREGROUND GLASS APPLICATION ───────────────── */}
      <div className="relative z-10 w-full min-h-screen pointer-events-none">
        <div className="pointer-events-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
