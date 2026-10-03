import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { CBAMDocument } from '../../types/cbam';
import { 
  Search, 
  Command, 
  Layers, 
  FileText, 
  CheckCircle2, 
  Calculator, 
  History, 
  Download, 
  Settings, 
  Upload, 
  ShieldCheck, 
  CornerDownLeft, 
  X
} from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';

export interface CommandItem {
  id: string;
  category: 'Navigate' | 'Documents' | 'Actions';
  label: string;
  description?: string;
  icon: React.ElementType;
  shortcut?: string;
  action: () => void;
  keywords?: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  documents: CBAMDocument[];
  onNavigateTab: (tabId: string) => void;
  onSelectDocument: (docId: string) => void;
  onOpenUpload: () => void;
  onReplayTrace?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  documents,
  onNavigateTab,
  onSelectDocument,
  onOpenUpload,
  onReplayTrace,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const containerRef = useFocusTrap<HTMLDivElement>({
    isOpen,
    onClose,
    initialFocusRef: inputRef
  });

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [isOpen]);

  // Build commands list dynamically
  const allCommands = useMemo(() => {
    const navCommands: CommandItem[] = [
      {
        id: 'nav-overview',
        category: 'Navigate',
        label: 'Overview & Workspace',
        description: 'Dashboard metrics, 3D emblem, and pipeline overview',
        icon: Layers,
        shortcut: 'Shift+1',
        action: () => onNavigateTab('overview'),
        keywords: ['home', 'dashboard', 'metrics']
      },
      {
        id: 'nav-documents',
        category: 'Navigate',
        label: 'Supplier Documents',
        description: 'View all registered invoices, EPDs, and mill certs',
        icon: FileText,
        shortcut: 'Shift+2',
        action: () => onNavigateTab('documents'),
        keywords: ['invoices', 'epd', 'files', 'table']
      },
      {
        id: 'nav-verification',
        category: 'Navigate',
        label: 'Human Verification Queue',
        description: 'Compliance gatekeeper sign-off on extracted fields',
        icon: CheckCircle2,
        shortcut: 'Shift+3',
        action: () => onNavigateTab('verification'),
        keywords: ['gatekeeper', 'audit', 'confirm', 'review']
      },
      {
        id: 'nav-calculations',
        category: 'Navigate',
        label: 'Calculations & Provenance',
        description: 'Deterministic rule engine traces & What-If Sandbox',
        icon: Calculator,
        shortcut: 'Shift+4',
        action: () => onNavigateTab('calculations'),
        keywords: ['trace', 'emissions', 'tco2e', 'sandbox', 'formula']
      },
      {
        id: 'nav-audit',
        category: 'Navigate',
        label: 'Audit Trail & Logs',
        description: 'Cryptographic ledger of all human and engine events',
        icon: History,
        shortcut: 'Shift+5',
        action: () => onNavigateTab('audit'),
        keywords: ['ledger', 'merkle', 'sha256', 'history']
      },
      {
        id: 'nav-exports',
        category: 'Navigate',
        label: 'Declaration Exports',
        description: 'Download CBAM transitional reporting dossier (PDF/JSON)',
        icon: Download,
        shortcut: 'Shift+6',
        action: () => onNavigateTab('exports'),
        keywords: ['pdf', 'json', 'report', 'dossier']
      },
      {
        id: 'nav-settings',
        category: 'Navigate',
        label: 'Rule Engine Settings',
        description: 'Active rule versions & 3D hero scene URL configuration',
        icon: Settings,
        shortcut: 'Shift+7',
        action: () => onNavigateTab('settings'),
        keywords: ['rule', 'config', 'spline']
      }
    ];

    const actionCommands: CommandItem[] = [
      {
        id: 'act-upload',
        category: 'Actions',
        label: 'Add Supplier Evidence',
        description: 'Upload invoice, EPD, or mill test cert for fingerprinting',
        icon: Upload,
        shortcut: 'Cmd+U',
        action: () => onOpenUpload(),
        keywords: ['ingest', 'pdf', 'fingerprint', 'file', 'evidence']
      }
    ];

    if (onReplayTrace) {
      actionCommands.push({
        id: 'act-replay-trace',
        category: 'Actions',
        label: 'Replay Trace Animation',
        description: 'Trigger visual beam trace flow from calculation to source document',
        icon: ShieldCheck,
        shortcut: 'Cmd+R',
        action: () => onReplayTrace(),
        keywords: ['beam', 'provenance', 'flow', 'animation', 'replay', 'trace']
      });
    }

    const docCommands: CommandItem[] = documents.map((doc) => ({
      id: `doc-${doc.id}`,
      category: 'Documents',
      label: `${doc.filename}`,
      description: `${doc.supplier} · ${doc.productName} (${doc.cnCode}) · ${doc.status}`,
      icon: FileText,
      action: () => onSelectDocument(doc.id),
      keywords: [doc.filename, doc.supplier, doc.productName, doc.cnCode, doc.supplierCountry, doc.status]
    }));

    return [...navCommands, ...actionCommands, ...docCommands];
  }, [documents, onNavigateTab, onSelectDocument, onOpenUpload, onReplayTrace]);

  // Filter commands by query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return allCommands;
    const q = query.toLowerCase();
    return allCommands.filter((cmd) => {
      if (cmd.label.toLowerCase().includes(q)) return true;
      if (cmd.description && cmd.description.toLowerCase().includes(q)) return true;
      if (cmd.keywords && cmd.keywords.some((kw) => kw.toLowerCase().includes(q))) return true;
      return false;
    });
  }, [allCommands, query]);

  // Keep selected index within range
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation within the list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  // Group commands by category for neat display
  const grouped: Record<string, { item: CommandItem; globalIndex: number }[]> = {};
  filteredCommands.forEach((item, globalIndex) => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push({ item, globalIndex });
  });

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
    >
      {/* Dimmed backdrop */}
      <div 
        className="fixed inset-0 bg-[#000000]/50 backdrop-blur-[2px] transition-opacity animate-backdrop-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="flex min-h-screen items-start justify-center pt-16 sm:pt-24 p-4">
        <div 
          ref={containerRef}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          className="relative w-full max-w-xl rounded-xl bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-2xl overflow-hidden z-10 animate-toast-in focus:outline-none"
        >
          {/* Search Input Bar */}
          <div className="px-4 py-3.5 border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)] flex items-center gap-3">
            <Search className="w-4 h-4 text-[var(--accent-sage)] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search commands, tabs, and documents"
              placeholder="Type a command or search documents (e.g. 'Tata', 'Verify', 'Calculations')..."
              className="w-full bg-transparent text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none font-medium"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search input"
                className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <span className="font-mono text-[10px] text-[var(--text-secondary)] bg-[var(--bg-panel)] px-1.5 py-0.5 rounded border border-[var(--border-strong)] shrink-0">
              ESC
            </span>
          </div>

          {/* Results List */}
          <div className="max-h-[380px] overflow-y-auto p-2 space-y-4 text-xs">
            {filteredCommands.length === 0 ? (
              <div className="p-8 text-center text-xs text-[var(--text-secondary)]">
                No commands or documents found matching &ldquo;{query}&rdquo;
              </div>
            ) : (
              Object.entries(grouped).map(([category, items]) => (
                <div key={category} className="space-y-1">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    {category}
                  </div>
                  {items.map(({ item, globalIndex }) => {
                    const Icon = item.icon;
                    const isSelected = globalIndex === selectedIndex;

                    return (
                      <div
                        key={item.id}
                        role="option"
                        aria-selected={isSelected}
                        tabIndex={0}
                        onClick={() => {
                          item.action();
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-[6px] cursor-pointer transition-colors focus-ring ${
                          isSelected
                            ? 'bg-[var(--text-primary)] text-[var(--bg-main)] shadow-2xs'
                            : 'text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
                        }`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className={`w-7 h-7 rounded-[4px] flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-[var(--accent-sage)] text-white' : 'bg-[var(--accent-sage-light)] text-[var(--accent-sage)] border border-[var(--border-subtle)]'
                          }`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="truncate">
                            <div className="font-semibold text-xs truncate">{item.label}</div>
                            {item.description && (
                              <div className={`text-[11px] truncate ${isSelected ? 'opacity-80' : 'text-[var(--text-secondary)]'}`}>
                                {item.description}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {item.shortcut && (
                            <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${
                              isSelected ? 'bg-black/30 border-white/20 text-white' : 'bg-[var(--bg-panel)] text-[var(--text-secondary)] border-[var(--border-subtle)]'
                            }`}>
                              {item.shortcut}
                            </span>
                          )}
                          {isSelected && (
                            <CornerDownLeft className="w-3.5 h-3.5 text-[var(--status-verified-text)]" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer Bar with Keyboard Cap Badges */}
          <div className="px-4 py-2 bg-[var(--bg-subtle)] border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="font-mono bg-[var(--bg-surface)] border border-[var(--border-strong)] px-1.5 py-0.2 rounded text-[10px] text-[var(--text-primary)] shadow-2xs">↑</kbd>
                <kbd className="font-mono bg-[var(--bg-surface)] border border-[var(--border-strong)] px-1.5 py-0.2 rounded text-[10px] text-[var(--text-primary)] shadow-2xs">↓</kbd>
                <span>navigate</span>
              </span>

              <span className="flex items-center gap-1">
                <kbd className="font-mono bg-[var(--bg-surface)] border border-[var(--border-strong)] px-1.5 py-0.2 rounded text-[10px] text-[var(--text-primary)] shadow-2xs">↵</kbd>
                <span>select</span>
              </span>

              <span className="flex items-center gap-1">
                <kbd className="font-mono bg-[var(--bg-surface)] border border-[var(--border-strong)] px-1.5 py-0.2 rounded text-[10px] text-[var(--text-primary)] shadow-2xs">esc</kbd>
                <span>close</span>
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 font-mono text-[10px] text-[var(--accent-sage)]">
              <Command className="w-3 h-3 text-[var(--accent-sage)]" />
              <span>CBAM Command Palette</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
