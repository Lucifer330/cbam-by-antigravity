import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Eye, 
  CheckCircle2, 
  GitBranch, 
  Calculator, 
  Lock, 
  History, 
  Download, 
  ChevronRight, 
  Menu, 
  X, 
  Info,
  Sun,
  Moon
} from 'lucide-react';
import { HeroProvenancePreview } from './HeroProvenancePreview';
import { PipelineInteractive } from './PipelineInteractive';
import { InteractiveTraceDemo } from './InteractiveTraceDemo';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useTheme } from '../../hooks/useTheme';

interface LandingPageProps {
  onLaunchApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  // Scroll reveal refs for each section
  const heroRevealRef = useScrollReveal<HTMLDivElement>();
  const statsRevealRef = useScrollReveal<HTMLDivElement>();
  const pipelineRevealRef = useScrollReveal<HTMLDivElement>();
  const featuresRevealRef = useScrollReveal<HTMLDivElement>();
  const demoRevealRef = useScrollReveal<HTMLDivElement>();
  const trustRevealRef = useScrollReveal<HTMLDivElement>();
  const ctaRevealRef = useScrollReveal<HTMLDivElement>();

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const featureCards = [
    {
      title: 'Evidence-linked provenance',
      tagline: 'Cryptographic document lineage',
      desc: 'Every calculated number traces directly back to its original supplier document, page number, and exact bounding box coordinates [x, y, w, h].',
      icon: GitBranch,
      badge: 'Pixel Precision',
      badgeColor: 'bg-[#eaf0eb] text-[#3d5042]'
    },
    {
      title: 'Human-in-the-loop verification',
      tagline: 'Mandatory gatekeeper approval',
      desc: 'AI proposes extracted candidates; a human customs officer confirms or corrects every emission factor before any arithmetic execution occurs.',
      icon: CheckCircle2,
      badge: 'Zero Auto-Commit',
      badgeColor: 'bg-[#ecf7ef] text-[#1b6830]'
    },
    {
      title: 'Deterministic calculation engine',
      tagline: 'Pure auditable arithmetic',
      desc: 'Zero AI interference in the actual math. Identical input parameters will always produce identical, mathematically proven emissions output.',
      icon: Calculator,
      badge: 'No Hallucinations',
      badgeColor: 'bg-[#f6f6f3] text-[#191c1e]'
    },
    {
      title: 'Versioned rule engine',
      tagline: 'EU regulatory framework tracking',
      desc: 'Regulatory rule sets (v2025.4, v2026.1 transitional, v2027.0 definitive) are version-tracked, immutable, and locked per calculation record.',
      icon: Lock,
      badge: 'Reg (EU) 2023/956',
      badgeColor: 'bg-[#f4f4f0] text-[#5a6065]'
    },
    {
      title: 'Full audit trail',
      tagline: 'Attributable action log',
      desc: 'Every user confirmation, edit, and calculation is cryptographically timestamped, hashed, and attributed in an immutable audit ledger.',
      icon: History,
      badge: 'SHA-256 Merkle Ledger',
      badgeColor: 'bg-[#f5f3ff] text-[#6d28d9]'
    },
    {
      title: 'Export-ready reports',
      tagline: 'Customs-ready documentation',
      desc: 'Generate complete CBAM declaration assistance dossiers, XML payloads for the EU Registry, and executive printable audit summaries.',
      icon: Download,
      badge: 'Audit Ready',
      badgeColor: 'bg-[#eef2ff] text-[#4338ca]'
    }
  ];

  const statItems = [
    {
      stat: '50 tonnes',
      label: 'CBAM de minimis threshold',
      detail: 'Consignments below 50t exempt from transitional certificate quotas (2026 rules)',
      category: 'Regulatory Scope'
    },
    {
      stat: '2027',
      label: 'Definitive regime start',
      detail: 'Mandatory surrender of purchased CBAM certificates begins for all EU importers',
      category: 'Timeline'
    },
    {
      stat: '6',
      label: 'Regulated goods categories',
      detail: 'Iron & steel, aluminium, cement, fertilizers, hydrogen, electricity',
      category: 'Coverage'
    },
    {
      stat: '100%',
      label: 'Deterministic calculation',
      detail: 'Sandboxed formula execution with zero mathematical hallucination risk',
      category: 'Accuracy'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-[#191c1e] selection:bg-[#3d5042]/15 selection:text-[#191c1e] overflow-x-hidden font-sans">
      {/* ---------------------------------------------------- */}
      {/* TOP REGULATORY BANNER                                 */}
      {/* ---------------------------------------------------- */}
      <div className="bg-[#191c1e] text-white px-4 py-2 text-xs flex items-center justify-between border-b border-[#2c3033]">
        <div className="max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="font-mono text-[11px] text-[#c5d3c8]">
              REGULATION (EU) 2023/956 & IMPLEMENTING REG (EU) 2023/1773
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[11px] text-[#848a90]">
            <span>Deterministic Provenance Architecture</span>
            <span>•</span>
            <span className="text-[#c5d3c8] font-medium">Transitional CBAM Engine v2026.1</span>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 1. STICKY NAV                                        */}
      {/* ---------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-[#fbfbfa]/90 backdrop-blur-md border-b border-[#e5e5de] shadow-2xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          {/* Logo & Wordmark */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-[6px] bg-[#2c3a30] text-[#c8e6ce] flex items-center justify-center shadow-xs group-hover:bg-[#1f2c23] transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-[#191c1e] uppercase font-sans">
                CBAM-AuditTrace
              </span>
              <span className="text-[10px] text-[#5a6065] -mt-0.5 tracking-tight font-mono">
                Provenance Engine
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-[#5a6065]">
            <button 
              onClick={() => scrollToSection('features')}
              className="hover:text-[#191c1e] transition-colors cursor-pointer py-1"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-[#191c1e] transition-colors cursor-pointer py-1"
            >
              How it works
            </button>
            <button 
              onClick={() => scrollToSection('trace-demo')}
              className="hover:text-[#191c1e] transition-colors cursor-pointer py-1"
            >
              Trace Demo
            </button>
            <button 
              onClick={() => scrollToSection('regulatory-context')}
              className="hover:text-[#191c1e] transition-colors cursor-pointer py-1"
            >
              Regulatory Context
            </button>
          </nav>

          {/* Nav Right CTA & Theme Toggle */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              className="p-2 rounded-[6px] border border-[#d2d2c8] bg-white text-[#5a6065] hover:text-[#191c1e] hover:bg-[#f6f6f3] transition-colors cursor-pointer shadow-2xs"
            >
              {isDark ? <Sun className="w-4 h-4 text-[#fbbf24]" /> : <Moon className="w-4 h-4 text-[#4b5563]" />}
            </button>

            <button
              onClick={onLaunchApp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[6px] bg-[#2c3a30] hover:bg-[#1f2c23] text-white text-xs md:text-sm font-medium shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Launch App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="md:hidden p-1.5 rounded-[6px] border border-[#e5e5de] text-[#5a6065] hover:text-[#191c1e] hover:bg-[#f6f6f3]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#e5e5de] bg-[#fbfbfa] px-6 py-4 space-y-3 shadow-lg">
            <button 
              onClick={() => scrollToSection('features')}
              className="block w-full text-left text-sm font-medium text-[#5a6065] py-2"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="block w-full text-left text-sm font-medium text-[#5a6065] py-2"
            >
              How it works
            </button>
            <button 
              onClick={() => scrollToSection('trace-demo')}
              className="block w-full text-left text-sm font-medium text-[#5a6065] py-2"
            >
              Trace Demo
            </button>
            <button 
              onClick={() => scrollToSection('regulatory-context')}
              className="block w-full text-left text-sm font-medium text-[#5a6065] py-2"
            >
              Regulatory Context
            </button>
            <div className="pt-2 border-t border-[#e5e5de]">
              <button
                onClick={onLaunchApp}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[6px] bg-[#2c3a30] text-white text-sm font-medium"
              >
                <span>Launch App</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ---------------------------------------------------- */}
      {/* 2. HERO SECTION                                      */}
      {/* ---------------------------------------------------- */}
      <section className="relative pt-12 md:pt-20 pb-16 md:pb-24 px-4 sm:px-6">
        {/* Subtle background ambient blur */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#3d5042]/10 via-[#ecf7ef]/40 to-transparent blur-3xl pointer-events-none -z-10 rounded-full" />

        <div ref={heroRevealRef} className="reveal-on-scroll max-w-5xl mx-auto text-center space-y-6">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eaf0eb] border border-[#c8e6ce] text-[#3d5042] text-xs font-medium shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#1b6830]" />
            <span>EU Carbon Border Adjustment Mechanism · 100% Deterministic Lineage</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#191c1e] max-w-4xl mx-auto leading-[1.12]">
            Trace every CBAM number <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#2c3a30] via-[#3d5042] to-[#1b6830] bg-clip-text text-transparent">
              back to its source.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-[#5a6065] max-w-3xl mx-auto leading-relaxed font-normal">
            An evidence-linked compliance workflow for CBAM declarants — AI proposes, humans verify, deterministic rules calculate. Every number traceable to its source document.
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onLaunchApp}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-[8px] bg-[#2c3a30] hover:bg-[#1f2c23] text-white text-sm font-semibold shadow-md shadow-[#2c3a30]/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Launch App</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => scrollToSection('trace-demo')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[8px] bg-white hover:bg-[#f6f6f3] text-[#191c1e] border border-[#d2d2c8] text-sm font-medium shadow-xs transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-[#3d5042]" />
              <span>Watch the Trace</span>
            </button>
          </div>

          {/* Real Product Provenance Hero Preview Visual */}
          <div className="pt-8 md:pt-12">
            <HeroProvenancePreview onLaunchApp={onLaunchApp} />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 3. PROBLEM STATEMENT (STATS ROW)                     */}
      {/* ---------------------------------------------------- */}
      <section id="regulatory-context" className="py-16 md:py-20 bg-white border-y border-[#e5e5de] px-4 sm:px-6">
        <div ref={statsRevealRef} className="reveal-on-scroll max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#3d5042] font-semibold">
              Regulatory Realities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#191c1e]">
              EU CBAM transitional period is ending.
            </h2>
            <p className="text-sm text-[#5a6065]">
              Penalties for misreported emissions reach €10 to €50 per tonne of unreported emissions. Unauditable AI calculations are an unacceptable compliance liability.
            </p>
          </div>

          {/* 4 Stat Callout Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statItems.map((item, idx) => (
              <div 
                key={idx}
                className="bg-[#fbfbfa] border border-[#e5e5de] rounded-xl p-6 flex flex-col justify-between hover:border-[#d2d2c8] transition-all shadow-2xs hover:shadow-sm"
              >
                <div>
                  <span className="text-[10px] font-mono font-semibold uppercase text-[#848a90] tracking-wider">
                    {item.category}
                  </span>
                  <div className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#191c1e] tracking-tight font-sans">
                    {item.stat}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-[#3d5042]">
                    {item.label}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#e5e5de] text-xs text-[#5a6065] leading-relaxed">
                  {item.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 4. HOW IT WORKS (THE 6-STAGE PIPELINE)                */}
      {/* ---------------------------------------------------- */}
      <section id="how-it-works" className="py-20 md:py-28 px-4 sm:px-6">
        <div ref={pipelineRevealRef} className="reveal-on-scroll max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#3d5042] font-semibold">
              The Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#191c1e]">
              How CBAM-AuditTrace Works
            </h2>
            <p className="text-sm sm:text-base text-[#5a6065]">
              A 6-stage protocol designed for mathematical verifiability: from raw PDF evidence to certified customs declaration dossiers.
            </p>
          </div>

          {/* 6-Stage Interactive Stepper Component */}
          <PipelineInteractive />
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 5. FEATURE GRID (3x2 CARDS)                          */}
      {/* ---------------------------------------------------- */}
      <section id="features" className="py-20 md:py-28 bg-[#f6f6f3] border-y border-[#e5e5de] px-4 sm:px-6">
        <div ref={featuresRevealRef} className="reveal-on-scroll max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#3d5042] font-semibold">
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#191c1e]">
              Engineered for Enterprise Compliance Teams
            </h2>
            <p className="text-sm sm:text-base text-[#5a6065]">
              Every architectural decision is optimized for customs auditability, regulatory stability, and complete defensibility against European Commission verifier audits.
            </p>
          </div>

          {/* 3x2 Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-[#e5e5de] rounded-xl p-6 md:p-7 flex flex-col justify-between hover:border-[#3d5042] hover:shadow-md transition-all duration-200 group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-[#eaf0eb] group-hover:bg-[#3d5042] text-[#3d5042] group-hover:text-white flex items-center justify-center transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-[4px] font-semibold ${card.badgeColor}`}>
                        {card.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#191c1e] group-hover:text-[#3d5042] transition-colors">
                        {card.title}
                      </h3>
                      <div className="text-xs font-medium text-[#848a90] mt-0.5">
                        {card.tagline}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#5a6065] leading-relaxed">
                      {card.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#f0f0eb] flex items-center justify-between text-xs text-[#3d5042] font-medium">
                    <span>Protocol Standard</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 6. INTERACTIVE TRACE DEMO SECTION                   */}
      {/* ---------------------------------------------------- */}
      <section id="trace-demo" className="py-20 md:py-28 px-4 sm:px-6">
        <div ref={demoRevealRef} className="reveal-on-scroll max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#3d5042] font-semibold">
              Live Demonstration
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#191c1e]">
              Watch the Trace in Real Time
            </h2>
            <p className="text-sm sm:text-base text-[#5a6065]">
              Experience how any calculated emissions figure resolves in milliseconds to its exact document coordinate, gatekeeper confirmation, and applied EU formula.
            </p>
          </div>

          <InteractiveTraceDemo onLaunchApp={onLaunchApp} />
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 7. TRUST / POSITIONING STRIP                         */}
      {/* ---------------------------------------------------- */}
      <section className="py-12 bg-white border-y border-[#e5e5de] px-4 sm:px-6">
        <div ref={trustRevealRef} className="reveal-on-scroll max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#5a6065]">
            <Info className="w-4 h-4 text-[#3d5042]" />
            <span>Official Declarants Notice & Disclaimer</span>
          </div>
          <p className="text-sm md:text-base text-[#191c1e] font-medium leading-relaxed">
            “Declaration assistance tool — not a substitute for legal or customs advice.”
          </p>
          <p className="text-xs text-[#848a90] max-w-2xl mx-auto">
            CBAM-AuditTrace assists authorized declarants and importers by organizing evidence and executing deterministic calculations according to Regulation (EU) 2023/956. Official submission remains the responsibility of the reporting declarant.
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 8. FINAL CTA                                         */}
      {/* ---------------------------------------------------- */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-[#fbfbfa] to-[#f0f0eb] px-4 sm:px-6">
        <div ref={ctaRevealRef} className="reveal-on-scroll max-w-4xl mx-auto bg-[#2c3a30] text-white rounded-2xl p-8 sm:p-12 md:p-16 text-center space-y-6 shadow-xl shadow-[#2c3a30]/15 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#1b6830]/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-[#a7f3d0]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold tracking-widest text-[#a7f3d0] uppercase">
              Ready for CBAM Compliance?
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              See CBAM-AuditTrace in action.
            </h2>
            <p className="text-sm sm:text-base text-[#c5d3c8] leading-relaxed">
              Explore the full interactive dashboard, upload supplier documents, verify proposed parameters, and audit the complete cryptographic lineage chain.
            </p>
            <div className="pt-4">
              <button
                onClick={onLaunchApp}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-[8px] bg-white hover:bg-[#f6f6f3] text-[#2c3a30] text-sm font-bold shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Launch App</span>
                <ArrowRight className="w-4 h-4 text-[#2c3a30]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 9. FOOTER                                            */}
      {/* ---------------------------------------------------- */}
      <footer className="bg-white border-t border-[#e5e5de] py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-[5px] bg-[#2c3a30] text-[#c8e6ce] flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-[#191c1e] tracking-tight uppercase">
                CBAM-AuditTrace
              </span>
              <p className="text-xs text-[#848a90]">
                Cryptographic provenance & deterministic calculation for EU CBAM compliance.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-[#5a6065]">
            <button 
              onClick={() => scrollToSection('features')}
              className="hover:text-[#191c1e] transition-colors cursor-pointer"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-[#191c1e] transition-colors cursor-pointer"
            >
              How it works
            </button>
            <button 
              onClick={() => scrollToSection('trace-demo')}
              className="hover:text-[#191c1e] transition-colors cursor-pointer"
            >
              Trace Demo
            </button>
            <button
              onClick={onLaunchApp}
              className="text-[#3d5042] font-semibold hover:underline cursor-pointer"
            >
              Open Dashboard
            </button>
          </div>

          <div className="text-right text-xs text-[#848a90] space-y-0.5">
            <div>Built for <span className="font-semibold text-[#191c1e]">CodeBlitz 2.0</span></div>
            <div>Team Antigravity · Regulation (EU) 2023/956</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
