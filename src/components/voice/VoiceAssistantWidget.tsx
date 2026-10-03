import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  X, 
  MapPin, 
  Play, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

interface VoiceAssistantWidgetProps {
  onHighlightField?: (fieldKey: string) => void;
  onOpenTraceDrawer?: () => void;
}

export const VoiceAssistantWidget: React.FC<VoiceAssistantWidgetProps> = ({
  onHighlightField,
  onOpenTraceDrawer
}) => {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [spokenText, setSpokenText] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const presetQueries = [
    { label: 'Trace direct emissions', fieldKey: 'emissions_direct', text: 'Trace direct emissions for invoice 042' },
    { label: 'Audit net mass', fieldKey: 'net_mass', text: 'Verify net mass coordinate on document' },
    { label: 'Check EU rule version', fieldKey: 'emissions_indirect', text: 'Check locked CBAM regulation version' }
  ];

  const handleSpeak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.onend = () => {
        setVoiceState('idle');
      };
      utterance.onerror = () => {
        setVoiceState('idle');
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setVoiceState('idle'), 3500);
    }
  };

  const handleTriggerVoice = (customQuery?: { text: string; fieldKey?: string }) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    setIsExpanded(true);
    setVoiceState('listening');
    const queryText = customQuery?.text || 'Trace direct specific emissions intensity';
    setTranscript(`"${queryText}"`);

    // Stage 1: Processing
    timeoutRef.current = setTimeout(() => {
      setVoiceState('processing');
      setTranscript('Analyzing Regulation (EU) 2023/956 Annex IV & document coordinates...');

      // Stage 2: Speaking & executing action
      timeoutRef.current = setTimeout(() => {
        setVoiceState('speaking');
        const responseMessage = 'Direct specific emissions verified: 1.60 tCO2e per tonne anchored at coordinate box 132, 418 on Page 1.';
        setSpokenText(responseMessage);
        
        if (customQuery?.fieldKey && onHighlightField) {
          onHighlightField(customQuery.fieldKey);
        } else if (onHighlightField) {
          onHighlightField('emissions_direct');
        }

        handleSpeak(responseMessage);
      }, 1400);
    }, 1200);
  };

  const handleClose = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVoiceState('idle');
    setIsExpanded(false);
    setTranscript('');
    setSpokenText('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5 pointer-events-auto select-none font-sans">
      {/* Dynamic Voice Speech & Visualizer Bubble */}
      {isExpanded && (
        <div className="w-80 max-w-[calc(100vw-32px)] bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-xl p-4 shadow-2xl animate-toast-in backdrop-blur-md">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[var(--accent-sage-light)] text-[var(--accent-sage)] flex items-center justify-center">
                <Sparkles className="w-3 h-3" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                CBAM Voice Auditor
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--accent-sage-light)] text-[var(--accent-sage-dark)] font-semibold border border-[var(--border-strong)]">
                {voiceState.toUpperCase()}
              </span>
              <button
                type="button"
                onClick={handleClose}
                className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                aria-label="Close voice assistant dialog"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Transcript / Content */}
          <div className="space-y-2 py-1">
            <div className="text-xs text-[var(--text-secondary)] font-medium">
              {transcript || 'Say a query or click a quick prompt below:'}
            </div>

            {spokenText && voiceState === 'speaking' && (
              <div className="p-2.5 rounded-lg bg-[var(--status-verified-bg)] border border-[var(--status-verified-border)] text-xs text-[var(--status-verified-text)] font-medium flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{spokenText}</span>
              </div>
            )}

            {/* Quick Demo Voice Queries */}
            <div className="pt-2 border-t border-[var(--border-subtle)] space-y-1.5">
              <div className="text-[10px] uppercase font-semibold text-[var(--text-muted)] tracking-wider">
                Auditor Voice Prompts:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {presetQueries.map((pq, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleTriggerVoice(pq)}
                    className="text-[11px] px-2.5 py-1 rounded-[5px] bg-[var(--bg-subtle)] hover:bg-[var(--accent-sage-light)] text-[var(--text-primary)] hover:text-[var(--accent-sage-dark)] border border-[var(--border-subtle)] transition-colors text-left flex items-center gap-1 cursor-pointer"
                  >
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span>{pq.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Floating Trigger & Waveform Bar */}
      <div className="flex items-center gap-2 p-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-strong)] shadow-xl backdrop-blur-lg">
        {/* Real-time Frequency Waveform Visualizer */}
        {voiceState !== 'idle' && (
          <div className="flex items-center gap-1 px-3 py-1">
            <span className="w-1 h-3 bg-[var(--accent-sage)] rounded-full animate-waveform-1" />
            <span className="w-1 h-5 bg-[var(--accent-sage)] rounded-full animate-waveform-2" />
            <span className="w-1 h-7 bg-[var(--accent-sage)] rounded-full animate-waveform-3" />
            <span className="w-1 h-5 bg-[var(--accent-sage)] rounded-full animate-waveform-4" />
            <span className="w-1 h-6 bg-[var(--accent-sage)] rounded-full animate-waveform-5" />
            <span className="w-1 h-3 bg-[var(--accent-sage)] rounded-full animate-waveform-6" />
          </div>
        )}

        {/* Action Button */}
        <button
          type="button"
          onClick={() => {
            if (voiceState === 'idle') {
              handleTriggerVoice();
            } else {
              handleClose();
            }
          }}
          aria-label={voiceState === 'idle' ? 'Activate CBAM Voice AI Auditor' : 'Stop Voice AI Assistant'}
          title="CBAM Voice AI Auditor"
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer ${
            voiceState === 'idle'
              ? 'bg-[var(--accent-sage)] text-white hover:scale-105 active:scale-95'
              : 'bg-[#a82323] text-white animate-pulse'
          }`}
        >
          {voiceState === 'idle' ? (
            <Mic className="w-5 h-5" />
          ) : (
            <MicOff className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};
