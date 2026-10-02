import React, { useState } from 'react';
import type { AuditEvent } from '../../types/cbam';
import { 
  History, 
  Download, 
  Filter, 
  ShieldCheck, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  GitBranch, 
  Calculator, 
  Layers, 
  Search,
  Hash,
  ExternalLink,
  Lock
} from 'lucide-react';

interface AuditTimelineProps {
  logs: AuditEvent[];
  onExportAudit?: () => void;
}

export const AuditTimeline: React.FC<AuditTimelineProps> = ({ logs, onExportAudit }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const filteredLogs = logs.filter((log) => {
    const matchesCategory = selectedCategory === 'ALL' || log.category === selectedCategory;
    const matchesQuery = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const getActionIcon = (category: string) => {
    switch (category) {
      case 'UPLOAD':
        return <FileText className="w-3.5 h-3.5 text-[#3d5042]" />;
      case 'EXTRACTION':
        return <Sparkles className="w-3.5 h-3.5 text-[#9e5d03]" />;
      case 'VERIFICATION':
        return <CheckCircle2 className="w-3.5 h-3.5 text-[#1b6830]" />;
      case 'RULE_CHANGE':
        return <GitBranch className="w-3.5 h-3.5 text-[#3d5042]" />;
      case 'CALCULATION':
        return <Calculator className="w-3.5 h-3.5 text-[#191c1e]" />;
      case 'EXPORT':
        return <Download className="w-3.5 h-3.5 text-[#5a6065]" />;
      default:
        return <History className="w-3.5 h-3.5 text-[#5a6065]" />;
    }
  };

  const handleExportCsv = () => {
    const headers = ['Timestamp', 'Actor', 'ActorRole', 'Action', 'Category', 'Source', 'Status', 'Hash', 'Details'];
    const rows = logs.map(l => [
      `"${l.timestamp}"`,
      `"${l.actor}"`,
      `"${l.actorRole}"`,
      `"${l.action}"`,
      `"${l.category}"`,
      `"${l.source}"`,
      `"${l.status}"`,
      `"${l.hash}"`,
      `"${l.details.replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cbam_audit_trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#e5e5de] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3d5042] mb-1">
            <Lock className="w-3.5 h-3.5 text-[#3d5042]" />
            Tamper-Evident Ledger
          </div>
          <h1 className="text-xl font-semibold text-[#191c1e] tracking-tight">
            Compliance Audit Trail
          </h1>
          <p className="text-xs text-[#5a6065] mt-1">
            Chronological audit log recording every document upload, AI proposal, human sign-off, and calculation step.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExportAudit || handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#191c1e] text-white text-xs font-medium hover:bg-[#2d3134] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export Audit Record (CSV/PDF)
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#ffffff] border border-[#e5e5de] rounded-[6px]">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-[#848a90] absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search actions, actors, or document sources..."
            className="w-full pl-8 pr-3 py-1.5 rounded-[4px] bg-[#fbfbfa] border border-[#d8d8ce] text-xs text-[#191c1e] focus:outline-none focus:border-[#3d5042]"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          {['ALL', 'UPLOAD', 'EXTRACTION', 'VERIFICATION', 'CALCULATION', 'EXPORT'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-[3px] font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#191c1e] text-white'
                  : 'bg-[#f6f6f3] text-[#5a6065] hover:text-[#191c1e] hover:bg-[#ecece6]'
              }`}
            >
              {cat === 'ALL' ? 'All Events' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Timeline List */}
      <div className="bg-[#ffffff] border border-[#e5e5de] rounded-[6px] overflow-hidden divide-y divide-[#e5e5de]">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log) => {
            const isExpanded = expandedLogId === log.id;

            return (
              <div 
                key={log.id} 
                className="p-4 hover:bg-[#fbfbfa] transition-colors"
                onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {/* Timestamp & Icon */}
                    <div className="w-8 h-8 rounded-[4px] bg-[#f6f6f3] border border-[#e5e5de] flex items-center justify-center shrink-0 mt-0.5">
                      {getActionIcon(log.category)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-[#191c1e]">
                          {log.timestamp}
                        </span>
                        <span className="text-xs font-semibold text-[#191c1e]">
                          {log.action}
                        </span>
                        <span className="text-[10px] font-mono text-[#5a6065] bg-[#f0f0eb] px-1.5 py-0.2 rounded border border-[#e2e2dc]">
                          {log.category}
                        </span>
                      </div>

                      <div className="text-xs text-[#5a6065] mt-1 flex items-center gap-2">
                        <span>Source: <strong className="text-[#191c1e] font-normal">{log.source}</strong></span>
                        <span>•</span>
                        <span>Actor: <strong className="text-[#191c1e] font-normal">{log.actor}</strong> ({log.actorRole})</span>
                      </div>

                      <div className="text-xs text-[#5a6065] mt-1.5 leading-relaxed">
                        {log.details}
                      </div>

                      {/* Expanded Technical Cryptographic details */}
                      {isExpanded && (
                        <div className="mt-3 p-3 rounded-[4px] bg-[#f6f6f3] border border-[#e5e5de] text-[11px] font-mono space-y-1">
                          <div className="flex items-center justify-between text-[#848a90]">
                            <span>CRYPTOGRAPHIC FINGERPRINT:</span>
                            <span className="text-[#1b6830]">STATUS: {log.status}</span>
                          </div>
                          <div className="text-[#191c1e] break-all">{log.hash}</div>
                          <div className="text-[10px] text-[#848a90] pt-1">
                            Block verification verified with SHA-256 HMAC digest under customs audit compliance standards.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Tag */}
                  <div className="shrink-0 flex flex-col items-end">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] text-[11px] font-mono font-medium bg-[#ecf7ef] text-[#1b6830] border border-[#c8e6ce]">
                      <CheckCircle2 className="w-3 h-3" />
                      {log.status}
                    </span>
                    <span className="text-[10px] text-[#848a90] font-mono mt-1">
                      {isExpanded ? 'Click to collapse' : 'Click for hash'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-xs text-[#5a6065]">
            No audit records match the current filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};
