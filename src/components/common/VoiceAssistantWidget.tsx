import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  X, 
  Volume2, 
  Activity, 
  CheckCircle2, 
  HelpCircle,
  Play
} from 'lucide-react';

export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

interface VoiceQueryPreset {
  prompt: string;
  response: string;
  fieldTarget?: string;
}

const VOICE_PRESETS: VoiceQueryPreset[] = [
  {
    prompt: 'Check direct emissions for Tata Steel consignment',
    response: 'Tata Steel (CN 7208 51 20): Direct specific emission is 1.74 tCO₂e/t. Bounding box locked on Page 1 [132, 430].',
    fieldTarget: 'emissions_direct'
  },
  {
    prompt: 'Verify Regulation (EU) 2023/956 Art. 7 rules',
    response: 'Implementing Regulation 2023/1773 active. Default electricity grid factor applied for TR-MAR region.',
    fieldTarget: 'emissions_indirect'
  },
  {
    prompt: 'Audit Net Mass quantity on active invoice',
    response: 'Net mass extracted: 1,000 tonnes. Confidence score 98%, verified against consignment manifest Line Item 1.',
    fieldTarget: 'net_mass'
  }
];

export const VoiceAssistantWidget: React.FC = () => {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [queryIndex, setQueryIndex] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const startVoiceInteraction = (presetIdx?: number) => {
    const idx = presetIdx !== undefined ? presetIdx : (queryIndex % VOICE_PRESETS.length);
    const selected = VOICE_PRESETS[idx];
    setQueryIndex(idx + 1);

    setVoiceState('listening');
    setTranscript(`“${selected.prompt}”`);
    setIsExpanded(true);

    // Transition: Listening -> Processing
    setTimeout(() => {
      setVoiceState('processing');
      setTranscript('Processing cryptographic audit trace against Regulation (EU) 2023/956...');
    }, 1800);

    // Transition: Processing -> Speaking
    setTimeout(() => {
      setVoiceState('speaking');
      setTranscript(selected.response);
    }, 3600);
  };

  const handleToggle = () => {
    if (voiceState === 'idle') {
      startVoiceInteraction();
    } else {
      setVoiceState('idle');
      setTranscript('');
      setIsExpanded(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5 pointer-events-auto">
      {/* Voice Assistant Dialogue Box */}
      {isExpanded && (
        <div className="w-80 sm:w-96 bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-2xl p-4 shadow-2xl animate-toast-in backdrop-blur-md">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[var(--accent-sage-light)] text-[var(--accent-sage)] flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                CBAM Voice Assistant
                <span className={`w-2 h-2 rounded-full ${
                  voiceState === 'listening' ? 'bg-[#3b82f6] animate-ping' :
                  voiceState === 'processing' ? 'bg-[#fbbf24] animate-spin' :
                  voiceState === 'speaking' ? 'bg-[#10b981] animate-pulse' : 'bg-[#94a3b8]'
                }`} />
              </div>
            </div>

            <button
              onClick={() => {
                setVoiceState('idle');
                setIsExpanded(false);
              }}
              className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-panel)] transition-colors cursor-pointer"
              aria-label="Close voice assistant"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Assistant State & Transcript Readout */}
          <div className="py-3 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
              <span>Status: {voiceState.toUpperCase()}</span>
              {voiceState === 'speaking' && (
                <span className="text-[var(--status-verified-text)] flex items-center gap-1">
                  <Volume2 className="w-3 h-3" /> Audio Feed Active
                </span>
              )}
            </div>

            <p className="text-xs font-medium text-[var(--text-primary)] leading-relaxed bg-[var(--bg-subtle)] p-3 rounded-lg border border-[var(--border-subtle)] min-h-[54px] flex items-center">
              {transcript || 'Say a command or select a compliance prompt below...'}
            </p>
          </div>

          {/* Quick Voice Prompt Chips */}
          <div className="pt-2 border-t border-[var(--border-subtle)] space-y-1.5">
            <div className="text-[10px] font-semibold uppercase text-[var(--text-muted)]">
              Quick Audit Queries:
            </div>
            <div className="space-y-1">
              {VOICE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => startVoiceInteraction(idx)}
                  className="w-full text-left p-1.5 px-2 rounded-[5px] bg-[var(--bg-subtle)]/60 hover:bg-[var(--bg-subtle)] border border-[var(--border-subtle)] hover:border-[var(--accent-sage)] text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] truncate transition-all flex items-center justify-between group cursor-pointer"
                >
                  <span className="truncate">“{preset.prompt}”</span>
                  <Play className="w-2.5 h-2.5 text-[var(--accent-sage)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Pill & Live Waveform Visualizer */}
      <div className="flex items-center gap-2 p-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl backdrop-blur-md">
        {/* Dynamic Frequency Waveform */}
        {(voiceState === 'listening' || voiceState === 'speaking') && (
          <div className="flex items-center gap-1 px-3 py-1 bg-[var(--bg-subtle)] rounded-full border border-[var(--border-subtle)]">
            <span className="w-1 h-3 bg-[var(--accent-sage)] rounded-full animate-waveform-1" />
            <span className="w-1 h-5 bg-[var(--accent-sage)] rounded-full animate-waveform-2" />
            <span className="w-1 h-7 bg-[var(--accent-sage)] rounded-full animate-waveform-3" />
            <span className="w-1 h-4 bg-[var(--accent-sage)] rounded-full animate-waveform-4" />
            <span className="w-1 h-6 bg-[var(--accent-sage)] rounded-full animate-waveform-5" />
          </div>
        )}

        {/* Processing Spinner State */}
        {voiceState === 'processing' && (
          <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono text-[var(--status-warning-text)] bg-[var(--status-warning-bg)] rounded-full border border-[var(--status-warning-border)]">
            <Activity className="w-3.5 h-3.5 animate-spin" />
            <span>Analyzing...</span>
          </div>
        )}

        {/* Action Trigger Button */}
        <button
          type="button"
          onClick={handleToggle}
          aria-label={voiceState === 'idle' ? 'Activate CBAM Voice Assistant' : 'Mute Voice Assistant'}
          title={voiceState === 'idle' ? 'Activate Voice AI Assistant' : 'Mute Voice Assistant'}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer focus-ring ${
            voiceState === 'idle'
              ? 'bg-[var(--accent-sage)] text-white hover:scale-105 active:scale-95'
              : voiceState === 'listening'
              ? 'bg-[#3b82f6] text-white ring-4 ring-[#3b82f6]/30 animate-pulse'
              : voiceState === 'speaking'
              ? 'bg-[#10b981] text-white ring-4 ring-[#10b981]/30'
              : 'bg-[#fbbf24] text-[#191c1e]'
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
