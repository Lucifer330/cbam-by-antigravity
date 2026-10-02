import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Calculator, 
  History, 
  Download, 
  Settings, 
  ChevronDown, 
  Building2, 
  User, 
  GitBranch,
  Layers,
  Upload
} from 'lucide-react';

interface AppShellProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  awaitingVerificationCount: number;
  onOpenUpload: () => void;
  activeRuleVersion: string;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  activeTab,
  onTabChange,
  awaitingVerificationCount,
  onOpenUpload,
  activeRuleVersion,
  children,
}) => {
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState('ThyssenKrupp Euro-Import S.A. [DE94827103]');

  const workspaces = [
    'ThyssenKrupp Euro-Import S.A. [DE94827103]',
    'ArcelorMittal Distribution Europe [LU10928341]',
    'Salzgitter AG Trading [DE29103847]'
  ];

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'documents', label: 'Documents', icon: FileText },
    { 
      id: 'verification', 
      label: 'Verification', 
      icon: CheckCircle2,
      badge: awaitingVerificationCount > 0 ? awaitingVerificationCount : null
    },
    { id: 'calculations', label: 'Calculations', icon: Calculator },
    { id: 'audit', label: 'Audit Trail', icon: History },
    { id: 'exports', label: 'Exports', icon: Download },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-[#191c1e] flex flex-col">
      {/* Topmost Official Compliance Ribbon */}
      <div className="bg-[#191c1e] text-white px-6 py-1.5 text-[11px] flex flex-wrap items-center justify-between border-b border-[#2d3134]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium text-[#c5d3c8]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a3e635]" />
            EU Regulation (EU) 2023/956 — Declaration Assistance Tool
          </span>
          <span className="text-[#848a90] hidden md:inline">|</span>
          <span className="text-[#a0a5aa] hidden md:inline">
            Transitional Period Reporting Engine · Implementing Reg (EU) 2023/1773
          </span>
        </div>

        <div className="flex items-center gap-4 text-[#c5d3c8]">
          <span className="font-mono text-[10px]">
            Engine: {activeRuleVersion}
          </span>
          <span className="text-[#848a90]">|</span>
          <span className="text-[10px] text-[#a0a5aa]">
            Non-Filing Assistance Dossier
          </span>
        </div>
      </div>

      {/* Main Enterprise Header */}
      <header className="bg-white border-b border-[#e5e5de] px-6 py-3.5 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Brand & Tagline */}
          <div className="flex items-center gap-3.5">
            <div className="w-8 h-8 rounded-[4px] bg-[#2c3d31] flex items-center justify-center text-white shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-[#c8e6ce]" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-base font-bold tracking-tight text-[#191c1e] uppercase font-sans">
                  CBAM-AuditTrace
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#eaf0eb] text-[#2c3d31] border border-[#c8e6ce]">
                  v2.6 Enterprise
                </span>
              </div>
              <p className="text-xs text-[#5a6065] font-normal">
                “Trace every CBAM number back to its source.”
              </p>
            </div>
          </div>

          {/* Top-Right: Workspace Selector, Primary Action & User Profile */}
          <div className="flex items-center gap-3">
            {/* Quick Upload Button */}
            <button
              type="button"
              onClick={onOpenUpload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#191c1e] text-white text-xs font-medium hover:bg-[#2d3134] transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Evidence</span>
            </button>

            {/* Workspace Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-[#fbfbfa] border border-[#d8d8ce] text-xs font-medium text-[#191c1e] hover:bg-[#f4f4f0] transition-colors max-w-[220px] truncate"
              >
                <Building2 className="w-3.5 h-3.5 text-[#3d5042] shrink-0" />
                <span className="truncate">{selectedWorkspace.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 text-[#5a6065] shrink-0" />
              </button>

              {workspaceMenuOpen && (
                <div className="absolute right-0 mt-1 w-72 rounded-[4px] bg-white border border-[#e5e5de] shadow-lg py-1 z-50 text-xs">
                  <div className="px-3 py-1.5 font-semibold text-[#848a90] text-[10px] uppercase tracking-wider">
                    Select Active Declarant Workspace
                  </div>
                  {workspaces.map((ws) => (
                    <button
                      key={ws}
                      type="button"
                      onClick={() => {
                        setSelectedWorkspace(ws);
                        setWorkspaceMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-[#f6f6f3] flex items-center justify-between ${
                        selectedWorkspace === ws ? 'font-semibold text-[#3d5042] bg-[#f0f4f1]' : 'text-[#191c1e]'
                      }`}
                    >
                      <span className="truncate">{ws}</span>
                      {selectedWorkspace === ws && <span className="w-1.5 h-1.5 rounded-full bg-[#1b6830]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#e5e5de]">
              <div className="w-7 h-7 rounded-full bg-[#ecece6] border border-[#d4d4cb] flex items-center justify-center text-xs font-medium text-[#2c3d31]">
                EM
              </div>
              <div className="hidden lg:block text-left text-xs leading-tight">
                <div className="font-medium text-[#191c1e]">E. Moreau</div>
                <div className="text-[10px] text-[#5a6065]">Lead CBAM Officer</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="max-w-7xl mx-auto mt-3 pt-1 border-t border-[#f0f0eb]">
          <nav className="flex items-center gap-1 overflow-x-auto text-xs" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] font-medium transition-colors shrink-0 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#191c1e] text-white shadow-2xs'
                      : 'text-[#5a6065] hover:text-[#191c1e] hover:bg-[#f4f4f0]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-semibold ${
                      isActive ? 'bg-white text-[#191c1e]' : 'bg-[#f8dfaa] text-[#9e5d03]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        {children}
      </main>

      {/* Enterprise Compliance Footer */}
      <footer className="bg-white border-t border-[#e5e5de] px-6 py-4 text-xs text-[#5a6065] mt-auto">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-[#191c1e]">CBAM-AuditTrace</span>
            <span>·</span>
            <span>Regulation (EU) 2023/956 Compliance Suite</span>
            <span>·</span>
            <span className="font-mono text-[11px] text-[#3d5042]">Rule Engine {activeRuleVersion}</span>
          </div>

          <div className="text-[11px] text-[#848a90]">
            Audit Trail & Cryptographic Provenance Architecture · Declaration Assistance Only
          </div>
        </div>
      </footer>
    </div>
  );
};
