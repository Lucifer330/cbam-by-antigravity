import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { App as DashboardApp } from './App';

export function AppRouter() {
  const getInitialRoute = (): 'landing' | 'app' => {
    if (typeof window === 'undefined') return 'landing';
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path.includes('/app') || hash.includes('app')) {
      return 'app';
    }
    return 'landing';
  };

  const [currentRoute, setCurrentRoute] = useState<'landing' | 'app'>(getInitialRoute);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('/app') || hash.includes('app')) {
        setCurrentRoute('app');
      } else {
        setCurrentRoute('landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigateTo = (route: 'landing' | 'app') => {
    setCurrentRoute(route);
    if (route === 'app') {
      try {
        window.history.pushState({ route: 'app' }, '', '/app');
      } catch {
        window.location.hash = '#/app';
      }
    } else {
      try {
        window.history.pushState({ route: 'landing' }, '', '/');
      } catch {
        window.location.hash = '#/';
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentRoute === 'app') {
    return (
      <div className="relative">
        {/* Back to marketing navigation bar */}
        <div className="bg-[#1e2722] text-[#c5d3c8] px-4 py-1 text-[11px] flex items-center justify-between border-b border-[#2c3a30] sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            <span className="font-semibold text-white">CBAM-AuditTrace Workspace</span>
            <span className="text-[#64748b] hidden sm:inline">|</span>
            <span className="text-[#94a3b8] hidden sm:inline">Active Importer Session</span>
          </div>
          <button
            onClick={() => navigateTo('landing')}
            className="text-white hover:text-[#a7f3d0] font-medium flex items-center gap-1.5 transition-colors cursor-pointer bg-[#2c3a30] hover:bg-[#3d5042] px-2.5 py-0.5 rounded-[4px] border border-[#3d5042]"
            title="Return to the marketing landing page"
          >
            <span>← Home / Overview</span>
          </button>
        </div>
        <DashboardApp />
      </div>
    );
  }

  return <LandingPage onLaunchApp={() => navigateTo('app')} />;
}

export default AppRouter;
