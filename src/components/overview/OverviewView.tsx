import type { CBAMDocument, CalculationTrace } from '../../types/cbam';
import { MetricStrip } from '../common/MetricStrip';
import { StatusBadge } from '../common/StatusBadge';
import { SplineHeroContainer } from '../common/SplineHeroContainer';
import { PipelineStepper } from '../common/PipelineStepper';
import { 
  FileText, 
  ArrowUpRight, 
  Upload, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Calculator,
  ArrowRight
} from 'lucide-react';

interface OverviewViewProps {
  documents: CBAMDocument[];
  calculations: CalculationTrace[];
  onNavigateTab: (tab: string) => void;
  onSelectDocument: (doc: CBAMDocument) => void;
  onOpenUpload: () => void;
  onTraceClick: (trace: CalculationTrace) => void;
  splineUrl: string;
  onUpdateSplineUrl: (url: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  documents,
  calculations,
  onNavigateTab,
  onSelectDocument,
  onOpenUpload,
  onTraceClick,
  splineUrl,
  onUpdateSplineUrl,
}) => {
  const awaitingCount = documents.filter((d) => d.status === 'Needs verification').length;
  const verifiedInputsCount = documents.reduce(
    (acc, d) => acc + d.extractedFields.filter((f) => f.status === 'human_confirmed' || f.status === 'edited').length,
    0
  );
  const traceableCount = calculations.length;

  const featuredCalculation = calculations[0];

  return (
    <div className="space-y-6">
      {/* Workspace Title & Purposeful Summary */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#e5e5de] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3d5042] mb-1">
            <ShieldCheck className="w-4 h-4 text-[#1b6830]" />
            EU Customs Compliance Portal
          </div>
          <h1 className="text-2xl font-bold text-[#191c1e] tracking-tight">
            Compliance Workspace
          </h1>
          <p className="text-xs text-[#5a6065] mt-1 max-w-2xl leading-relaxed">
            Every embedded emission calculation must be bi-directionally traceable to supplier invoices, mill test certs, and EPD coordinate locators. AI proposes fields; deterministic rules calculate.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenUpload}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[4px] bg-[#191c1e] text-white text-xs font-medium hover:bg-[#2d3134] transition-colors shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            Add Supplier Evidence
          </button>
        </div>
      </div>

      {/* Persistent 6-Stage CBAM Pipeline Stepper */}
      <PipelineStepper 
        onStageClick={(stage) => {
          if (stage === 1) onOpenUpload();
          else if (stage === 2 || stage === 3) onNavigateTab('verification');
          else if (stage === 4 || stage === 5) onNavigateTab('calculations');
          else if (stage === 6) onNavigateTab('exports');
        }} 
      />

      {/* Flexible Hero Section (with Spline 3D slot or interactive topology) */}
      <SplineHeroContainer
        splineUrl={splineUrl}
        onUpdateSplineUrl={onUpdateSplineUrl}
        onNavigateToTrace={() => onNavigateTab('calculations')}
      />

      {/* Realistic Metric Strip */}
      <MetricStrip
        documentsCount={documents.length}
        awaitingCount={awaitingCount}
        verifiedCount={verifiedInputsCount}
        traceableCount={traceableCount}
        onMetricClick={onNavigateTab}
        onTraceClick={() => featuredCalculation && onTraceClick(featuredCalculation)}
      />

      {/* Featured Provenance Spotlight (Click-to-Trace Demonstration) */}
      {featuredCalculation && (
        <div className="p-4 rounded-[6px] bg-[#fbfbfa] border border-[#d2d2c8] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[4px] bg-[#eaf0eb] border border-[#c8e6ce] flex items-center justify-center text-[#1b6830] shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#191c1e]">
                  Active Traceable Result:
                </span>
                <span className="font-mono text-sm font-bold text-[#191c1e]">
                  {featuredCalculation.resultValue.toLocaleString('en-US', { minimumFractionDigits: 2 })} {featuredCalculation.resultUnit}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white text-[#3d5042] border border-[#e5e5de]">
                  {featuredCalculation.ruleVersion}
                </span>
              </div>
              <div className="text-[11px] text-[#5a6065] mt-0.5">
                Formula: <code className="font-mono text-[#191c1e] bg-white px-1 rounded border">{featuredCalculation.formulaDisplay}</code> · Linked to <span className="font-medium text-[#191c1e]">{featuredCalculation.documentName}</span> (Page 1 · x=132, y=418)
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onTraceClick(featuredCalculation)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#191c1e] text-white text-xs font-medium hover:bg-[#2d3134] transition-colors"
          >
            <span>Trace Provenance</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Recent Compliance Activity Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#191c1e] tracking-tight">
            Recent Compliance Activity
          </h2>
          <button
            type="button"
            onClick={() => onNavigateTab('documents')}
            className="text-xs text-[#3d5042] hover:text-[#191c1e] font-medium inline-flex items-center gap-1"
          >
            <span>View All Documents</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-[#ffffff] border border-[#e5e5de] rounded-[6px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f6f6f3] border-b border-[#e5e5de] text-[11px] font-semibold text-[#5a6065] uppercase tracking-wider">
                  <th className="py-2.5 px-4">Document</th>
                  <th className="py-2.5 px-4">Supplier</th>
                  <th className="py-2.5 px-4">Product</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Updated</th>
                  <th className="py-2.5 px-4">Traceability</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e5de] text-xs">
                {documents.slice(0, 5).map((doc) => (
                  <tr 
                    key={doc.id}
                    onClick={() => onSelectDocument(doc)}
                    className="hover:bg-[#fbfbfa] transition-colors cursor-pointer group"
                  >
                    {/* Document */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#3d5042] shrink-0" />
                        <div>
                          <span className="font-medium text-[#191c1e] group-hover:text-[#3d5042]">
                            {doc.filename}
                          </span>
                          <span className="text-[11px] text-[#848a90] ml-2">
                            {doc.fileSize}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Supplier */}
                    <td className="py-3 px-4 font-medium text-[#191c1e]">
                      {doc.supplier}
                    </td>

                    {/* Product */}
                    <td className="py-3 px-4 text-[#5a6065]">
                      <span>{doc.goodsCategory}</span>
                      <span className="text-[11px] font-mono text-[#848a90] block">{doc.cnCode}</span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <StatusBadge status={doc.status} size="sm" />
                    </td>

                    {/* Updated */}
                    <td className="py-3 px-4 text-[#5a6065] font-mono text-[11px]">
                      {doc.updatedAt}
                    </td>

                    {/* Traceability */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5 bg-[#ecece6] rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${doc.traceabilityPercent === 100 ? 'bg-[#1b6830]' : 'bg-[#9e5d03]'}`}
                            style={{ width: `${doc.traceabilityPercent}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-semibold text-[#191c1e]">
                          {doc.traceabilityPercent}% complete
                        </span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => onSelectDocument(doc)}
                        className="px-2.5 py-1 rounded-[4px] bg-white border border-[#e5e5de] text-xs font-medium text-[#191c1e] hover:bg-[#f6f6f3]"
                      >
                        Verify / View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
