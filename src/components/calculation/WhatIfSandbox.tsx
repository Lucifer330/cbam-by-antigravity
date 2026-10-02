import React, { useState, useEffect } from 'react';
import type { CalculationTrace } from '../../types/cbam';
import { 
  Sparkles, 
  RotateCcw, 
  Sliders, 
  Calculator, 
  ArrowRight,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface WhatIfSandboxProps {
  trace: CalculationTrace;
}

export const WhatIfSandbox: React.FC<WhatIfSandboxProps> = ({ trace }) => {
  // Parse initial values from trace
  const initialDirectFactor = trace.directEmissionsTonnes > 0 && trace.resultValue > 0
    ? (trace.verifiedInputs.find((i) => i.label.toLowerCase().includes('direct'))?.value 
        ? parseFloat(trace.verifiedInputs.find((i) => i.label.toLowerCase().includes('direct'))!.value)
        : trace.directEmissionsTonnes / (trace.resultValue / (trace.directEmissionsTonnes / 1.6 || 1)))
    : 1.60;

  // Derive initial net mass safely
  const netMassInput = trace.verifiedInputs.find((i) => i.label.toLowerCase().includes('mass'));
  const initialNetMass = netMassInput 
    ? parseFloat(netMassInput.value.replace(/,/g, '')) 
    : 1000;

  const initialDirect = trace.verifiedInputs.find((i) => i.label.toLowerCase().includes('direct'))
    ? parseFloat(trace.verifiedInputs.find((i) => i.label.toLowerCase().includes('direct'))!.value)
    : (trace.directEmissionsTonnes / (initialNetMass || 1)) || 1.60;

  const initialIndirect = trace.verifiedInputs.find((i) => i.label.toLowerCase().includes('indirect'))
    ? parseFloat(trace.verifiedInputs.find((i) => i.label.toLowerCase().includes('indirect'))!.value)
    : (trace.indirectEmissionsTonnes / (initialNetMass || 1)) || 0.30;

  const [netMass, setNetMass] = useState<number>(initialNetMass || 1000);
  const [directFactor, setDirectFactor] = useState<number>(initialDirect || 1.60);
  const [indirectFactor, setIndirectFactor] = useState<number>(initialIndirect || 0.30);

  // Sync when trace changes
  useEffect(() => {
    setNetMass(initialNetMass || 1000);
    setDirectFactor(initialDirect || 1.60);
    setIndirectFactor(initialIndirect || 0.30);
  }, [trace.id, initialNetMass, initialDirect, initialIndirect]);

  const handleReset = () => {
    setNetMass(initialNetMass || 1000);
    setDirectFactor(initialDirect || 1.60);
    setIndirectFactor(initialIndirect || 0.30);
  };

  const totalSpecificFactor = (directFactor || 0) + (indirectFactor || 0);
  const simulatedTotalEmissions = (netMass || 0) * totalSpecificFactor;
  const verifiedTotal = trace.resultValue;
  const delta = simulatedTotalEmissions - verifiedTotal;
  const deltaPercent = verifiedTotal > 0 ? (delta / verifiedTotal) * 100 : 0;

  return (
    <div className="w-full bg-white border-2 border-dashed border-[#d8d8ce] rounded-[8px] p-5 shadow-2xs space-y-4 my-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5e5de] pb-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#fef8eb] text-[#9e5d03] border border-[#f8dfaa] text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#9e5d03]" />
            What-If Sandbox
          </span>
          <span className="text-xs text-[#5a6065] hidden sm:inline">
            Interactive scenario modeling · Unsaved local simulation
          </span>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#f0f0eb] border border-[#d8d8ce] text-xs font-medium text-[#191c1e] hover:bg-[#e4e4dc] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3d5042]"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#3d5042]" />
          <span>Reset to Verified Values</span>
        </button>
      </div>

      {/* Input Sliders & Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Input 1: Net Mass */}
        <div className="p-3.5 rounded-[6px] bg-[#fbfbfa] border border-[#e5e5de] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="sandbox-mass-input" className="font-semibold text-[#191c1e]">
              1. Net Shipment Mass (t)
            </label>
            <span className="font-mono font-bold text-[#3d5042] text-xs">
              {netMass.toLocaleString()} t
            </span>
          </div>

          <input
            id="sandbox-mass-input"
            type="number"
            min="1"
            max="100000"
            value={netMass}
            onChange={(e) => setNetMass(Math.max(1, parseFloat(e.target.value) || 0))}
            className="w-full px-2.5 py-1 rounded-[4px] bg-white border border-[#d8d8ce] text-xs font-mono font-semibold text-[#191c1e] focus:outline-none focus:border-[#3d5042]"
          />

          <input
            type="range"
            min="50"
            max="10000"
            step="50"
            value={netMass}
            onChange={(e) => setNetMass(parseFloat(e.target.value))}
            className="w-full accent-[#3d5042] cursor-pointer"
          />
        </div>

        {/* Input 2: Direct Emissions Factor */}
        <div className="p-3.5 rounded-[6px] bg-[#fbfbfa] border border-[#e5e5de] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="sandbox-direct-input" className="font-semibold text-[#191c1e]">
              2. Direct Factor (tCO₂e/t)
            </label>
            <span className="font-mono font-bold text-[#3d5042] text-xs">
              {directFactor.toFixed(2)} tCO₂e/t
            </span>
          </div>

          <input
            id="sandbox-direct-input"
            type="number"
            min="0"
            max="50"
            step="0.01"
            value={directFactor}
            onChange={(e) => setDirectFactor(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full px-2.5 py-1 rounded-[4px] bg-white border border-[#d8d8ce] text-xs font-mono font-semibold text-[#191c1e] focus:outline-none focus:border-[#3d5042]"
          />

          <input
            type="range"
            min="0"
            max="6.00"
            step="0.05"
            value={directFactor}
            onChange={(e) => setDirectFactor(parseFloat(e.target.value))}
            className="w-full accent-[#3d5042] cursor-pointer"
          />
        </div>

        {/* Input 3: Indirect Emissions Factor */}
        <div className="p-3.5 rounded-[6px] bg-[#fbfbfa] border border-[#e5e5de] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="sandbox-indirect-input" className="font-semibold text-[#191c1e]">
              3. Indirect Factor (tCO₂e/t)
            </label>
            <span className="font-mono font-bold text-[#3d5042] text-xs">
              {indirectFactor.toFixed(2)} tCO₂e/t
            </span>
          </div>

          <input
            id="sandbox-indirect-input"
            type="number"
            min="0"
            max="50"
            step="0.01"
            value={indirectFactor}
            onChange={(e) => setIndirectFactor(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full px-2.5 py-1 rounded-[4px] bg-white border border-[#d8d8ce] text-xs font-mono font-semibold text-[#191c1e] focus:outline-none focus:border-[#3d5042]"
          />

          <input
            type="range"
            min="0"
            max="6.00"
            step="0.05"
            value={indirectFactor}
            onChange={(e) => setIndirectFactor(parseFloat(e.target.value))}
            className="w-full accent-[#3d5042] cursor-pointer"
          />
        </div>
      </div>

      {/* Live Formula Display & Comparison Banner */}
      <div className="p-4 rounded-[6px] bg-[#f6f6f3] border border-[#e5e5de] flex flex-wrap items-center justify-between gap-4">
        {/* Live Recomputing Formula */}
        <div className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#848a90]">
            Live Deterministic Recomputation Formula
          </div>
          <div className="font-mono text-sm md:text-base font-bold text-[#191c1e]">
            {netMass.toLocaleString()} t × ({directFactor.toFixed(2)} + {indirectFactor.toFixed(2)} tCO₂e/t) ={' '}
            <span className="text-[#3d5042] underline">
              {simulatedTotalEmissions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} tCO₂e
            </span>
          </div>
        </div>

        {/* Delta vs Verified Record */}
        <div className="flex items-center gap-3">
          <div className="text-right text-xs">
            <div className="text-[10px] text-[#848a90] uppercase font-bold">Verified Baseline</div>
            <div className="font-mono font-medium text-[#5a6065]">
              {verifiedTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} tCO₂e
            </div>
          </div>

          <div className="h-8 w-px bg-[#d8d8ce]" />

          {/* Variance Badge */}
          <div className="text-xs">
            <div className="text-[10px] text-[#848a90] uppercase font-bold">Simulated Delta</div>
            {Math.abs(delta) < 0.01 ? (
              <span className="inline-flex items-center gap-1 font-mono font-semibold text-[#1b6830]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                0.00 t (Exact Match)
              </span>
            ) : delta > 0 ? (
              <span className="inline-flex items-center gap-1 font-mono font-semibold text-[#a82323]">
                <TrendingUp className="w-3.5 h-3.5" />
                +{delta.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} t ({deltaPercent > 0 ? `+${deltaPercent.toFixed(1)}%` : ''})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-mono font-semibold text-[#1b6830]">
                <TrendingDown className="w-3.5 h-3.5" />
                {delta.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} t ({deltaPercent.toFixed(1)}%)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
