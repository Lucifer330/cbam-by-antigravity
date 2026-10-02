import React, { useState } from 'react';
import type { CBAMDocument, DocumentType, ComplianceStatus } from '../../types/cbam';
import { StatusBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  Upload, 
  Eye, 
  ShieldCheck, 
  Hash
} from 'lucide-react';

interface DocumentTableProps {
  documents: CBAMDocument[];
  onSelectDocument: (doc: CBAMDocument) => void;
  onOpenUpload: () => void;
  onViewProvenance?: (docId: string) => void;
}

export const DocumentTable: React.FC<DocumentTableProps> = ({
  documents,
  onSelectDocument,
  onOpenUpload,
  onViewProvenance,
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'uploadedAt' | 'traceabilityPercent' | 'supplier'>('uploadedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredDocs = documents
    .filter((doc) => {
      const matchesSearch =
        doc.filename.toLowerCase().includes(search.toLowerCase()) ||
        doc.supplier.toLowerCase().includes(search.toLowerCase()) ||
        doc.productName.toLowerCase().includes(search.toLowerCase()) ||
        doc.cnCode.includes(search);
      const matchesType = typeFilter === 'ALL' || doc.documentType === typeFilter;
      const matchesStatus = statusFilter === 'ALL' || doc.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'traceabilityPercent') {
        comparison = a.traceabilityPercent - b.traceabilityPercent;
      } else if (sortField === 'supplier') {
        comparison = a.supplier.localeCompare(b.supplier);
      } else {
        comparison = a.id.localeCompare(b.id);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const toggleSort = (field: 'uploadedAt' | 'traceabilityPercent' | 'supplier') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header and Add Action */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#e5e5de] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-[#191c1e] tracking-tight">
            Supplier Compliance Documents
          </h1>
          <p className="text-xs text-[#5a6065] mt-1">
            Registered commercial invoices, mill test certs, and EPD evidence files under active verification.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenUpload}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[4px] bg-[#191c1e] text-white text-xs font-medium hover:bg-[#2d3134] transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          Add Supplier Evidence
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#ffffff] border border-[#e5e5de] rounded-[6px]">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-[#848a90] absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by filename, supplier, product or CN code..."
            className="w-full pl-8 pr-3 py-1.5 rounded-[4px] bg-[#fbfbfa] border border-[#d8d8ce] text-xs text-[#191c1e] focus:outline-none focus:border-[#3d5042]"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-[4px] bg-[#fbfbfa] border border-[#d8d8ce] text-xs font-medium text-[#191c1e] focus:outline-none focus:border-[#3d5042]"
          >
            <option value="ALL">All Document Types</option>
            <option value="Invoice">Invoice</option>
            <option value="EPD">EPD</option>
            <option value="Emissions statement">Emissions statement</option>
            <option value="Mill test cert">Mill test cert</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-[4px] bg-[#fbfbfa] border border-[#d8d8ce] text-xs font-medium text-[#191c1e] focus:outline-none focus:border-[#3d5042]"
          >
            <option value="ALL">All Statuses</option>
            <option value="Needs verification">Needs verification</option>
            <option value="Verified">Verified</option>
            <option value="Calculated">Calculated</option>
            <option value="Flagged anomaly">Flagged anomaly</option>
          </select>
        </div>
      </div>

      {/* Main Table or Empty State */}
      {filteredDocs.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No matching documents found"
          description="No supplier invoices, mill certs or EPDs match your current search and filter criteria."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('');
            setTypeFilter('ALL');
            setStatusFilter('ALL');
          }}
          secondaryActionLabel="Add Supplier Evidence"
          onSecondaryAction={onOpenUpload}
        />
      ) : (
        <div className="bg-[#ffffff] border border-[#e5e5de] rounded-[6px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f6f6f3] border-b border-[#e5e5de] text-[11px] font-semibold text-[#5a6065] uppercase tracking-wider">
                <th className="py-3 px-4">Document</th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:text-[#191c1e]"
                  onClick={() => toggleSort('supplier')}
                >
                  <div className="flex items-center gap-1">
                    <span>Supplier</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Product / CN Code</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Verification</th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:text-[#191c1e]"
                  onClick={() => toggleSort('traceabilityPercent')}
                >
                  <div className="flex items-center gap-1">
                    <span>Traceability</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5de] text-xs">
              {filteredDocs.map((doc) => (
                <tr 
                  key={doc.id}
                  onClick={() => onSelectDocument(doc)}
                  className="hover:bg-[#fbfbfa] transition-colors cursor-pointer group"
                >
                  {/* Document Column */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-[#3d5042] shrink-0" />
                      <div>
                        <div className="font-medium text-[#191c1e] group-hover:text-[#3d5042] transition-colors">
                          {doc.filename}
                        </div>
                        <div className="text-[11px] font-mono text-[#848a90] flex items-center gap-1.5 mt-0.5">
                          <span>{doc.fileSize}</span>
                          <span>•</span>
                          <span title={doc.sha256} className="truncate max-w-[120px]">
                            {doc.sha256.slice(0, 12)}...
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Supplier Column */}
                  <td className="py-3 px-4">
                    <div className="font-medium text-[#191c1e]">{doc.supplier}</div>
                    <div className="text-[11px] text-[#5a6065]">{doc.supplierCountry}</div>
                  </td>

                  {/* Product / CN Code */}
                  <td className="py-3 px-4">
                    <div className="text-[#191c1e] font-medium truncate max-w-[200px]" title={doc.productName}>
                      {doc.productName}
                    </div>
                    <div className="font-mono text-[11px] text-[#5a6065]">{doc.cnCode}</div>
                  </td>

                  {/* Document Type */}
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded-[3px] bg-[#f0f0eb] border border-[#e2e2dc] text-[11px] font-medium text-[#5a6065]">
                      {doc.documentType}
                    </span>
                  </td>

                  {/* Verification Status */}
                  <td className="py-3 px-4">
                    <StatusBadge status={doc.status} size="sm" />
                  </td>

                  {/* Traceability */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[#ecece6] rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            doc.traceabilityPercent === 100 ? 'bg-[#1b6830]' : 'bg-[#9e5d03]'
                          }`}
                          style={{ width: `${doc.traceabilityPercent}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs font-semibold text-[#191c1e]">
                        {doc.traceabilityPercent}%
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onSelectDocument(doc)}
                        className="px-2.5 py-1 rounded-[4px] bg-white border border-[#e5e5de] text-xs font-medium text-[#191c1e] hover:bg-[#f6f6f3] transition-colors"
                        title="Open in Split Document Viewer"
                      >
                        Inspect
                      </button>

                      {doc.status === 'Calculated' && onViewProvenance && (
                        <button
                          type="button"
                          onClick={() => onViewProvenance(doc.id)}
                          className="px-2 py-1 rounded-[4px] bg-[#eaf0eb] border border-[#c8e6ce] text-xs font-medium text-[#2c3d31] hover:bg-[#dce6dd] transition-colors"
                          title="View Deterministic Provenance"
                        >
                          Trace
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  );
};
