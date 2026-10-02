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
  ArrowRight,
  ShieldCheck,
  CornerDownLeft,
  X
} from 'lucide-react';

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
      const matchLabel = cmd.label.toLowerCase().includes(q);
      const matchDesc = cmd.description?.toLowerCase().includes(q) || false;
      const matchCategory = cmd.category.toLowerCase().includes(q);
      const matchKeywords = cmd.keywords?.some((k) => k.toLowerCase().includes(q)) || false;
      return matchLabel || matchDesc || matchCategory || matchKeywords;
    });
  }, [allCommands, query]);

  // Keep selected index within bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Group commands by category
  const grouped = useMemo(() => {
    const groups: { [key: string]: { item: CommandItem; globalIndex: number }[] } = {};
    let globalCounter = 0;

    filteredCommands.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push({ item, globalIndex: globalCounter });
      globalCounter += 1;
    });

    return groups;
  }, [filteredCommands]);

  // Keyboard navigation inside modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredCommands.length > 0 ? (prev + 1) % filteredCommands.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredCommands.length > 0 ? (prev - 1 + filteredCommands.length) % filteredCommands.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-label="Command Palette">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#121614]/50 backdrop-blur-[2px] transition-opacity animate-backdrop-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="flex min-h-screen items-start justify-center pt-16 sm:pt-24 px-4 pb-6 pointer-events-none">
        <div 
          className="relative w-full max-w-xl bg-white border border-[#e2e2dc] rounded-[8px] shadow-2xl overflow-hidden pointer-events-auto flex flex-col animate-toast-in focus-ring"
          onKeyDown={handleKeyDown}
        >
          {/* Top Search Input Bar */}
          <div className="px-4 py-3.5 border-b border-[#e5e5de] bg-[#fbfbfa] flex items-center gap-3">
            <Search className="w-4 h-4 text-[#3d5042] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search documents (e.g. 'Tata', 'Verify', 'Calculations')..."
              className="w-full bg-transparent text-xs text-[#191c1e] placeholder-[#848a90] focus:outline-none font-medium"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 rounded text-[#848a90] hover:text-[#191c1e]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <span className="font-mono text-[10px] text-[#5a6065] bg-[#ecece6] px-1.5 py-0.5 rounded border border-[#d8d8ce] shrink-0">
              ESC
            </span>
          </div>

          {/* Results List */}
          <div className="max-h-[380px] overflow-y-auto p-2 space-y-4 text-xs">
            {filteredCommands.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#5a6065]">
                No commands or documents found matching &ldquo;{query}&rdquo;
              </div>
            ) : (
              Object.entries(grouped).map(([category, items]) => (
                <div key={category} className="space-y-1">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#848a90]">
                    {category}
                  </div>
                  {items.map(({ item, globalIndex }) => {
                    const Icon = item.icon;
                    const isSelected = globalIndex === selectedIndex;

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          item.action();
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-[5px] cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#191c1e] text-white shadow-2xs'
                            : 'text-[#191c1e] hover:bg-[#f6f6f3]'
                        }`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className={`w-7 h-7 rounded-[4px] flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-[#3d5042] text-white' : 'bg-[#eaf0eb] text-[#3d5042] border border-[#c8e6ce]'
                          }`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="truncate">
                            <div className="font-semibold text-xs truncate">{item.label}</div>
                            {item.description && (
                              <div className={`text-[11px] truncate ${isSelected ? 'text-[#c5d3c8]' : 'text-[#5a6065]'}`}>
                                {item.description}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {item.shortcut && (
                            <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${
                              isSelected ? 'bg-[#2d3134] text-[#c5d3c8] border-[#444]' : 'bg-[#f0f0eb] text-[#5a6065] border-[#e2e2dc]'
                            }`}>
                              {item.shortcut}
                            </span>
                          )}
                          {isSelected && (
                            <CornerDownLeft className="w-3.5 h-3.5 text-[#34d399]" />
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
          <div className="px-4 py-2 bg-[#fbfbfa] border-t border-[#e5e5de] flex items-center justify-between text-[11px] text-[#5a6065]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="font-mono bg-white border border-[#d8d8ce] px-1.5 py-0.2 rounded text-[10px] text-[#191c1e] shadow-2xs">↑</kbd>
                <kbd className="font-mono bg-white border border-[#d8d8ce] px-1.5 py-0.2 rounded text-[10px] text-[#191c1e] shadow-2xs">↓</kbd>
                <span>navigate</span>
              </span>

              <span className="flex items-center gap-1">
                <kbd className="font-mono bg-white border border-[#d8d8ce] px-1.5 py-0.2 rounded text-[10px] text-[#191c1e] shadow-2xs">↵</kbd>
                <span>select</span>
              </span>

              <span className="flex items-center gap-1">
                <kbd className="font-mono bg-white border border-[#d8d8ce] px-1.5 py-0.2 rounded text-[10px] text-[#191c1e] shadow-2xs">esc</kbd>
                <span>close</span>
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 font-mono text-[10px] text-[#3d5042]">
              <Command className="w-3 h-3 text-[#3d5042]" />
              <span>CBAM Command Palette</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
