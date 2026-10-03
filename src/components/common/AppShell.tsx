import React, { useState, useEffect } from 'react';
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
  Layers, 
  Upload, 
  Command,
  Sun,
  Moon,
  HelpCircle
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';
import { VoiceAssistantWidget } from './VoiceAssistantWidget';

interface AppShellProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  awaitingVerificationCount: number;
  onOpenUpload: () => void;
  onOpenCommandPalette?: () => void;
  activeRuleVersion: string;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  activeTab,
  onTabChange,
  awaitingVerificationCount,
  onOpenUpload,
  onOpenCommandPalette,
  activeRuleVersion,
  children,
}) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
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

  // Global listener for "?" key to open shortcuts help (if not typing in input)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput = target && (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable
      );
      if (isInput) return;

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col transition-colors duration-200">
      {/* Topmost Official Compliance Ribbon */}
      <div className="bg-[#191c1e] text-white px-6 py-1.5 text-[11px] flex flex-wrap items-center justify-between border-b border-[#2d3134]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium text-[#c5d3c8]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
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
      <header className="bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] px-6 py-3.5 sticky top-0 z-30 shadow-2xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Brand & Tagline */}
          <div className="flex items-center gap-3.5">
            <div className="w-8 h-8 rounded-[4px] bg-[#2c3d31] flex items-center justify-center text-white shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-[#c8e6ce]" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-base font-bold tracking-tight text-[var(--text-primary)] uppercase font-sans">
                  CBAM-AuditTrace
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--accent-sage-light)] text-[var(--accent-sage-dark)] border border-[var(--border-strong)]">
                  v2.6 Enterprise
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] font-normal">
                “Trace every CBAM number back to its source.”
              </p>
            </div>
          </div>

          {/* Top-Right: Controls, Theme Toggle, Shortcuts, Workspace Selector & Profile */}
          <div className="flex items-center gap-2">
            {/* Command Palette Trigger Button */}
            <button
              type="button"
              onClick={onOpenCommandPalette}
              aria-label="Open Command Palette (Cmd+K)"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[4px] bg-[var(--bg-subtle)] border border-[var(--border-strong)] text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-panel)] transition-colors focus-ring"
              title="Open Command Palette (Cmd+K / Ctrl+K)"
            >
              <Command className="w-3.5 h-3.5 text-[var(--accent-sage)]" />
              <span className="font-semibold text-[var(--text-primary)]">⌘K</span>
            </button>

            {/* Quick Upload Button */}
            <button
              type="button"
              onClick={onOpenUpload}
              aria-label="Add Evidence Document"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[var(--text-primary)] text-[var(--bg-main)] text-xs font-medium hover:opacity-90 transition-opacity focus-ring"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Evidence</span>
            </button>

            {/* Dark / Light Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              className="p-1.5 rounded-[4px] bg-[var(--bg-subtle)] border border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-panel)] transition-colors cursor-pointer focus-ring"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-[#fbbf24]" />
              ) : (
                <Moon className="w-4 h-4 text-[#4b5563]" />
              )}
            </button>

            {/* Keyboard Shortcuts Help Button */}
            <button
              type="button"
              onClick={() => setIsShortcutsOpen(true)}
              aria-label="View keyboard shortcuts help"
              title="Keyboard shortcuts (?)"
              className="p-1.5 rounded-[4px] bg-[var(--bg-subtle)] border border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-panel)] transition-colors cursor-pointer focus-ring"
            >
              <HelpCircle className="w-4 h-4 text-[var(--text-muted)]" />
            </button>

            {/* Workspace Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
                aria-label={`Select workspace. Current: ${selectedWorkspace}`}
                aria-expanded={workspaceMenuOpen}
                className="flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-[var(--bg-subtle)] border border-[var(--border-strong)] text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-panel)] transition-colors max-w-[200px] truncate focus-ring cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-[var(--accent-sage)] shrink-0" />
                <span className="truncate">{selectedWorkspace.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
              </button>

              {workspaceMenuOpen && (
                <div 
                  className="absolute right-0 mt-1 w-72 rounded-[6px] bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl py-1 z-50 text-xs"
                  role="menu"
                >
                  <div className="px-3 py-1.5 font-semibold text-[var(--text-muted)] text-[10px] uppercase tracking-wider border-b border-[var(--border-subtle)]">
                    Select Active Declarant Workspace
                  </div>
                  {workspaces.map((ws) => (
                    <button
                      key={ws}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setSelectedWorkspace(ws);
                        setWorkspaceMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-[var(--bg-subtle)] flex items-center justify-between cursor-pointer ${
                        selectedWorkspace === ws ? 'font-semibold text-[var(--accent-sage)] bg-[var(--accent-sage-light)]' : 'text-[var(--text-primary)]'
                      }`}
                    >
                      <span className="truncate">{ws}</span>
                      {selectedWorkspace === ws && <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-verified-text)]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-[var(--border-subtle)]">
              <div className="w-7 h-7 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-strong)] flex items-center justify-center text-xs font-medium text-[var(--text-primary)]">
                EM
              </div>
              <div className="hidden lg:block text-left text-xs leading-tight">
                <div className="font-medium text-[var(--text-primary)]">E. Moreau</div>
                <div className="text-[10px] text-[var(--text-muted)]">Lead CBAM Officer</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="max-w-7xl mx-auto mt-3 pt-1 border-t border-[var(--border-subtle)]">
          <nav className="flex items-center gap-1 overflow-x-auto text-xs" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  aria-label={`Navigate to ${item.label} tab${item.badge ? ` (${item.badge} pending)` : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] font-medium transition-colors shrink-0 whitespace-nowrap focus-ring ${
                    isActive
                      ? 'bg-[var(--text-primary)] text-[var(--bg-main)] shadow-2xs'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-semibold ${
                      isActive ? 'bg-[var(--bg-main)] text-[var(--text-primary)]' : 'bg-[var(--status-warning-bg)] text-[var(--status-warning-text)] border border-[var(--status-warning-border)]'
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
      <footer className="bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] px-6 py-4 text-xs text-[var(--text-secondary)] mt-auto transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-[var(--text-primary)]">CBAM-AuditTrace</span>
            <span>·</span>
            <span>Regulation (EU) 2023/956 Compliance Suite</span>
            <span>·</span>
            <span className="font-mono text-[11px] text-[var(--accent-sage)]">Rule Engine {activeRuleVersion}</span>
          </div>

          <div className="text-[11px] text-[var(--text-muted)]">
            Audit Trail & Cryptographic Provenance Architecture · Declaration Assistance Only
          </div>
        </div>
      </footer>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal 
        isOpen={isShortcutsOpen} 
        onClose={() => setIsShortcutsOpen(false)} 
      />

      {/* Floating Voice AI Assistant Widget */}
      <VoiceAssistantWidget />
    </div>
  );
};
