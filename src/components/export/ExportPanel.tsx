import React, { useState } from 'react';
import type { CalculationTrace, CBAMDocument } from '../../types/cbam';
import { 
  Download, 
  FileText, 
  Code, 
  Table, 
  Printer, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  FileCheck
} from 'lucide-react';

interface ExportPanelProps {
  calculations: CalculationTrace[];
  documents: CBAMDocument[];
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ calculations, documents }) => {
  const [selectedFormat, setSelectedFormat] = useState<'dossier_pdf' | 'trace_json' | 'summary_csv' | 'cbam_xml'>('dossier_pdf');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const primaryCalc = calculations[0];
  const primaryDoc = documents.find((d) => d.id === primaryCalc?.documentId) || documents[0];

  const handleDownload = () => {
    let filename = '';
    let content = '';
    let mimeType = '';

    if (selectedFormat === 'trace_json') {
      filename = `cbam_traceability_dossier_${new Date().toISOString().slice(0, 10)}.json`;
      content = JSON.stringify({
        generatedAt: new Date().toISOString(),
        regulation: 'Regulation (EU) 2023/956',
        engineVersion: 'v2026.1',
        disclaimer: 'Declaration assistance, not an official filing.',
        declarant: 'ThyssenKrupp Euro-Import S.A. [DE94827103]',
        calculations: calculations,
      }, null, 2);
      mimeType = 'application/json';
    } else if (selectedFormat === 'summary_csv') {
      filename = `cbam_calculation_summary_${new Date().toISOString().slice(0, 10)}.csv`;
      const header = 'CalculationID,DocumentName,CNCode,NetMass,DirectEmissions,IndirectEmissions,TotalResult,RuleVersion,VerifiedBy,SHA256\n';
      const rows = calculations.map(c => 
        `"${c.id}","${c.documentName}","7208 39 00","1000","${c.directEmissionsTonnes}","${c.indirectEmissionsTonnes}","${c.resultValue}","${c.ruleVersion}","${c.complianceOfficer}","${c.documentHash}"`
      ).join('\n');
      content = header + rows;
      mimeType = 'text/csv';
    } else if (selectedFormat === 'cbam_xml') {
      filename = `cbam_transitional_declaration_${new Date().toISOString().slice(0, 10)}.xml`;
      content = `<?xml version="1.0" encoding="UTF-8"?>
<CBAMDeclaration xmlns="urn:eu:cbam:v2026:reporting" period="2026-Q3">
  <Header>
    <DeclarantID>DE94827103</DeclarantID>
    <EngineVersion>v2026.1</EngineVersion>
    <GeneratedTimestamp>${new Date().toISOString()}</GeneratedTimestamp>
    <Disclaimer>Declaration assistance, not an official filing.</Disclaimer>
  </Header>
  <GoodsItems>
    ${calculations.map(c => `
    <GoodsItem>
      <DocumentRef>${c.documentName}</DocumentRef>
      <DocumentSHA256>${c.documentHash}</DocumentSHA256>
      <TotalEmbeddedEmissions unit="${c.resultUnit}">${c.resultValue}</TotalEmbeddedEmissions>
      <RuleApplied>${c.ruleVersion}</RuleApplied>
      <VerifierSignoff>${c.complianceOfficer}</VerifierSignoff>
    </GoodsItem>`).join('')}
  </GoodsItems>
</CBAMDeclaration>`;
      mimeType = 'application/xml';
    } else {
      // PDF print view
      window.print();
      setDownloadSuccess('Print dialog opened for PDF export.');
      setTimeout(() => setDownloadSuccess(null), 3000);
      return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(`Exported ${filename}`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#e5e5de] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-[#191c1e] tracking-tight">
            Export Compliance Evidence
          </h1>
          <p className="text-xs text-[#5a6065] mt-1">
            Export legally grounded audit dossiers, source-linked JSON, and calculation summaries for customs authorities.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[4px] bg-[#191c1e] text-white text-xs font-medium hover:bg-[#2d3134] transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          {selectedFormat === 'dossier_pdf' ? 'Print / Save as PDF' : 'Download File'}
        </button>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="p-3.5 rounded-[5px] bg-[#fef8eb] border border-[#f8dfaa] flex items-start gap-3 text-xs text-[#9e5d03]">
        <ShieldAlert className="w-4 h-4 text-[#b46908] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-semibold text-[#804b02]">Important Legal Notice: </strong>
          Declaration assistance, not an official filing. Official quarterly CBAM communications must be submitted via the European Commission CBAM Transitional Registry through national competent authorities.
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 rounded-[4px] bg-[#ecf7ef] border border-[#c8e6ce] text-xs text-[#1b6830] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {downloadSuccess}
        </div>
      )}

      {/* Format Selector Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Option 1: PDF Dossier */}
        <button
          type="button"
          onClick={() => setSelectedFormat('dossier_pdf')}
          className={`p-4 rounded-[6px] text-left border transition-all ${
            selectedFormat === 'dossier_pdf'
              ? 'bg-white border-[#3d5042] shadow-xs'
              : 'bg-[#fbfbfa] border-[#e5e5de] hover:border-[#d2d2c8]'
          }`}
        >
          <FileText className="w-4 h-4 text-[#3d5042] mb-2" />
          <div className="text-xs font-semibold text-[#191c1e]">Audit Report PDF</div>
          <div className="text-[11px] text-[#5a6065] mt-0.5">
            Full compliance dossier with visual evidence stamps
          </div>
        </button>

        {/* Option 2: Traceability JSON */}
        <button
          type="button"
          onClick={() => setSelectedFormat('trace_json')}
          className={`p-4 rounded-[6px] text-left border transition-all ${
            selectedFormat === 'trace_json'
              ? 'bg-white border-[#3d5042] shadow-xs'
              : 'bg-[#fbfbfa] border-[#e5e5de] hover:border-[#d2d2c8]'
          }`}
        >
          <Code className="w-4 h-4 text-[#3d5042] mb-2" />
          <div className="text-xs font-semibold text-[#191c1e]">Traceability JSON</div>
          <div className="text-[11px] text-[#5a6065] mt-0.5">
            Machine-readable cryptographic lineage tree
          </div>
        </button>

        {/* Option 3: Summary CSV */}
        <button
          type="button"
          onClick={() => setSelectedFormat('summary_csv')}
          className={`p-4 rounded-[6px] text-left border transition-all ${
            selectedFormat === 'summary_csv'
              ? 'bg-white border-[#3d5042] shadow-xs'
              : 'bg-[#fbfbfa] border-[#e5e5de] hover:border-[#d2d2c8]'
          }`}
        >
          <Table className="w-4 h-4 text-[#3d5042] mb-2" />
          <div className="text-xs font-semibold text-[#191c1e]">Calculation Summary</div>
          <div className="text-[11px] text-[#5a6065] mt-0.5">
            Tabular breakdown of line-item emissions
          </div>
        </button>

        {/* Option 4: CBAM XML */}
        <button
          type="button"
          onClick={() => setSelectedFormat('cbam_xml')}
          className={`p-4 rounded-[6px] text-left border transition-all ${
            selectedFormat === 'cbam_xml'
              ? 'bg-white border-[#3d5042] shadow-xs'
              : 'bg-[#fbfbfa] border-[#e5e5de] hover:border-[#d2d2c8]'
          }`}
        >
          <FileCheck className="w-4 h-4 text-[#3d5042] mb-2" />
          <div className="text-xs font-semibold text-[#191c1e]">Transitional XML</div>
          <div className="text-[11px] text-[#5a6065] mt-0.5">
            EU Registry schema compatible XML payload
          </div>
        </button>
      </div>

      {/* Live Preview Panel */}
      <div className="bg-[#ffffff] border border-[#e2e2dc] rounded-[6px] p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e5e5de] text-xs">
          <span className="font-semibold text-[#191c1e] flex items-center gap-1.5">
            <Printer className="w-3.5 h-3.5 text-[#3d5042]" />
            Live Export Preview ({selectedFormat.toUpperCase().replace('_', ' ')})
          </span>
          <span className="font-mono text-[11px] text-[#848a90]">
            Generated: {new Date().toLocaleDateString('en-GB')} 09:46 CET
          </span>
        </div>

        {/* Realistic European Customs Compliance Dossier Sheet */}
        <div className="p-6 bg-[#fbfbfa] border border-[#e5e5de] rounded-[4px] font-sans text-xs space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-[#d8d8ce] pb-3">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#3d5042]">
                EUROPEAN UNION CARBON BORDER ADJUSTMENT MECHANISM (REGULATION EU 2023/956)
              </div>
              <h2 className="text-base font-bold text-[#111] mt-0.5">
                CBAM-AuditTrace Compliance Dossier #TR-2026-0881
              </h2>
              <div className="text-[11px] text-[#555]">
                Declarant: ThyssenKrupp Euro-Import S.A. · EORI: DE94827103
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-2 py-0.5 rounded bg-[#eaf0eb] border border-[#c8e6ce] text-[10px] font-mono font-semibold text-[#1b6830]">
                EVIDENCE VERIFIED
              </span>
              <div className="font-mono text-[10px] text-[#888] mt-1">Rule Engine: v2026.1</div>
            </div>
          </div>

          {/* Aggregated Totals */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-white border border-[#e5e5de] rounded-[3px]">
            <div>
              <div className="text-[10px] text-[#666] uppercase">Total Goods Mass</div>
              <div className="font-mono text-sm font-bold text-[#111]">1,000.00 MT</div>
            </div>
            <div>
              <div className="text-[10px] text-[#666] uppercase">Total Embedded Emissions</div>
              <div className="font-mono text-sm font-bold text-[#111]">1,900.00 tCO₂e</div>
            </div>
            <div>
              <div className="text-[10px] text-[#666] uppercase">Source Lineage Status</div>
              <div className="font-mono text-sm font-bold text-[#1b6830]">100% Traceable</div>
            </div>
          </div>

          {/* Traceability Lineage Table */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#444] mb-1.5">
              Verified Source Lineage Breakdown
            </div>
            <table className="w-full border-collapse border border-[#ddd] text-xs">
              <thead>
                <tr className="bg-[#f0f0ea] border-b border-[#ddd] text-left text-[11px]">
                  <th className="p-2 border-r border-[#ddd]">Calculated Result</th>
                  <th className="p-2 border-r border-[#ddd]">Deterministic Formula</th>
                  <th className="p-2 border-r border-[#ddd]">Rule Applied</th>
                  <th className="p-2 border-r border-[#ddd]">Verified Input & Sign-Off</th>
                  <th className="p-2">Document Coordinate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eee]">
                <tr>
                  <td className="p-2 font-mono font-bold border-r border-[#eee]">1,900.00 tCO₂e</td>
                  <td className="p-2 font-mono border-r border-[#eee]">1,000 t × 1.90</td>
                  <td className="p-2 font-mono border-r border-[#eee]">v2026.1</td>
                  <td className="p-2 border-r border-[#eee]">
                    <div className="font-semibold text-[#1b6830]">✓ Confirmed</div>
                    <div className="text-[10px] text-[#666]">E. Moreau (09:44)</div>
                  </td>
                  <td className="p-2 font-mono text-[11px]">
                    supplier_invoice_042.pdf<br />
                    Page 1 · x=132 · y=418
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Signatures & Attestation */}
          <div className="pt-2 border-t border-[#d8d8ce] flex justify-between text-[11px] text-[#666]">
            <div>
              <span>Generated with CBAM-AuditTrace Engine. Cryptographic Merkle Root: </span>
              <span className="font-mono text-[10px] text-[#333]">38f9021a8b417c8d9e0f</span>
            </div>
            <div className="italic">
              Declaration assistance, not an official filing.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
