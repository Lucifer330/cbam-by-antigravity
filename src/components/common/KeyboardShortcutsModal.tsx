import React from 'react';
import { 
  X, 
  Keyboard, 
  Command, 
  ArrowUpDown, 
  CornerDownLeft, 
  Search, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  description: string;
  category: 'Global' | 'Navigation' | 'Actions';
}

const SHORTCUTS: ShortcutItem[] = [
  {
    keys: ['⌘ / Ctrl', 'K'],
    description: 'Open Command Palette (search documents, tabs & actions)',
    category: 'Global'
  },
  {
    keys: ['?'],
    description: 'Open Keyboard Shortcuts Help Overlay',
    category: 'Global'
  },
  {
    keys: ['Esc'],
    description: 'Close active modal, provenance drawer, or palette',
    category: 'Global'
  },
  {
    keys: ['↑', '↓'],
    description: 'Navigate up and down through list items & search results',
    category: 'Navigation'
  },
  {
    keys: ['Enter'],
    description: 'Select focused item, confirm action, or open document',
    category: 'Navigation'
  },
  {
    keys: ['Tab'],
    description: 'Cycle forward through interactive controls within active modal',
    category: 'Navigation'
  },
  {
    keys: ['Shift', 'Tab'],
    description: 'Cycle backward through interactive controls within active modal',
    category: 'Navigation'
  },
  {
    keys: ['Space'],
    description: 'Toggle expanded rows, replay trace, or confirm checkboxes',
    category: 'Actions'
  }
];

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose
}) => {
  const containerRef = useFocusTrap<HTMLDivElement>({ isOpen, onClose });

  if (!isOpen) return null;

  const categories = ['Global', 'Navigation', 'Actions'] as const;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4"
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="shortcuts-modal-title"
    >
      {/* Dimmed backdrop */}
      <div 
        className="fixed inset-0 bg-[#000000]/50 backdrop-blur-[2px] transition-opacity animate-backdrop-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div 
        ref={containerRef}
        tabIndex={-1}
        className="relative w-full max-w-lg bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-xl shadow-2xl overflow-hidden z-10 animate-toast-in focus:outline-none"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[5px] bg-[var(--accent-sage-light)] text-[var(--accent-sage)] flex items-center justify-center border border-[var(--border-subtle)]">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h2 id="shortcuts-modal-title" className="text-sm font-bold text-[var(--text-primary)]">
                Keyboard Shortcuts
              </h2>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Fast keyboard navigation across CBAM-AuditTrace
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close keyboard shortcuts modal"
            className="p-1 rounded-[4px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-panel)] transition-colors cursor-pointer focus-ring"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts List by Category */}
        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {categories.map((category) => {
            const categoryShortcuts = SHORTCUTS.filter(s => s.category === category);
            return (
              <div key={category} className="space-y-2">
                <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  {category} Shortcuts
                </div>

                <div className="space-y-1.5">
                  {categoryShortcuts.map((shortcut, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-subtle)]/60 hover:bg-[var(--bg-subtle)] border border-[var(--border-subtle)] transition-colors"
                    >
                      <span className="text-xs text-[var(--text-primary)] font-medium">
                        {shortcut.description}
                      </span>

                      <div className="flex items-center gap-1 shrink-0 ml-3">
                        {shortcut.keys.map((k, ki) => (
                          <kbd 
                            key={ki}
                            className="px-2 py-1 text-[11px] font-mono font-semibold bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-strong)] rounded shadow-2xs min-w-[24px] text-center"
                          >
                            {k}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-[var(--border-subtle)] bg-[var(--bg-subtle)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--status-verified-text)]" />
            <span>Accessible keyboard navigation enabled</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-[var(--accent-sage)] text-white hover:opacity-90 rounded-[5px] text-xs font-medium transition-colors cursor-pointer focus-ring"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
