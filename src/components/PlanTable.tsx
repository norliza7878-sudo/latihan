import React, { useState, useMemo } from 'react';
import { 
  PlanItem, 
  PlanStatus 
} from '../types';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal,
  Download,
  Building,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface PlanTableProps {
  data: PlanItem[];
  onSelectPlan: (plan: PlanItem) => void;
  onExportCSV: () => void;
}

type SortField = 'kodPelan' | 'namaPelan' | 'kategori' | 'daerah' | 'agensi' | 'pic' | 'tahun' | 'status' | 'kemajuan';
type SortOrder = 'asc' | 'desc';

interface ColumnDef {
  key: string;
  label: string;
  visible: boolean;
}

export const PlanTable: React.FC<PlanTableProps> = ({
  data,
  onSelectPlan,
  onExportCSV
}) => {
  const [sortField, setSortField] = useState<SortField>('tahun');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [showColumnDropdown, setShowColumnDropdown] = useState<boolean>(false);

  // Column visibility configuration
  const [columns, setColumns] = useState<ColumnDef[]>([
    { key: 'kodPelan', label: 'Kod Pelan', visible: true },
    { key: 'namaPelan', label: 'Nama Pelan / Inisiatif', visible: true },
    { key: 'kategori', label: 'Kategori', visible: true },
    { key: 'daerah', label: 'Daerah', visible: true },
    { key: 'agensi', label: 'Agensi / Jabatan', visible: true },
    { key: 'pic', label: 'PIC / Pegawai', visible: true },
    { key: 'tahun', label: 'Tahun', visible: true },
    { key: 'status', label: 'Status', visible: true },
    { key: 'kemajuan', label: 'Kemajuan (%)', visible: true },
  ]);

  const toggleColumnVisibility = (key: string) => {
    setColumns(cols => cols.map(c => c.key === key ? { ...c, visible: !c.visible } : c));
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  // Sort data
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        const cmp = aVal.localeCompare(bVal);
        return sortOrder === 'asc' ? cmp : -cmp;
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }, [data, sortField, sortOrder]);

  // Pagination calculation
  const totalRecords = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  // Render Status Badge
  const renderStatusBadge = (status: PlanStatus) => {
    switch (status) {
      case 'SELESAI':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            SELESAI
          </span>
        );
      case 'DALAM PELAKSANAAN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            DALAM PELAKSANAAN
          </span>
        );
      case 'TERTUNDA':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            TERTUNDA
          </span>
        );
      case 'KRITIKAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            KRITIKAL
          </span>
        );
      case 'BELUM MULA':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            BELUM MULA
          </span>
        );
    }
  };

  // Render Progress Bar
  const renderProgressBar = (val: number | null) => {
    if (val === null || val === undefined) {
      return <span className="text-slate-400 font-mono text-xs">N/A</span>;
    }

    let barColor = 'bg-blue-600';
    if (val === 100) barColor = 'bg-emerald-600';
    else if (val < 40) barColor = 'bg-rose-500';
    else if (val < 70) barColor = 'bg-amber-500';

    return (
      <div className="flex items-center gap-2 w-32">
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${barColor}`}
            style={{ width: `${val}%` }}
          />
        </div>
        <span className="font-mono text-xs font-semibold text-slate-700 w-8 text-right tabular-nums">
          {val}%
        </span>
      </div>
    );
  };

  const isVisible = (colKey: string) => columns.find(c => c.key === colKey)?.visible ?? true;

  const renderSortHeader = (label: string, field: SortField) => (
    <button
      onClick={() => handleSort(field)}
      className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 uppercase tracking-wider hover:text-blue-900 transition-colors"
    >
      <span>{label}</span>
      {sortField === field ? (
        sortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-700" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-700" />
      ) : (
        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
      )}
    </button>
  );

  return (
    <section className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
      
      {/* Table Action Bar */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Jadual Pelan & Status Kemajuan
          </h2>
          <p className="text-xs text-slate-500">
            Klik baris untuk melihat maklumat terperinci & garis masa projek
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Column Visibility Menu */}
          <div className="relative">
            <button
              onClick={() => setShowColumnDropdown(!showColumnDropdown)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
              <span>Pilihan Lajur</span>
            </button>

            {showColumnDropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-40 text-xs">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Tunjuk / Sembunyi Lajur
                </div>
                {columns.map(col => (
                  <label key={col.key} className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={col.visible}
                      onChange={() => toggleColumnVisibility(col.key)}
                      className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                    />
                    <span className="text-slate-700">{col.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Export CSV button */}
          <button
            onClick={onExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Eksport Jadual</span>
          </button>
        </div>
      </div>

      {/* Main Table Container with Sticky Header */}
      <div className="overflow-x-auto max-h-[580px] overflow-y-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 sticky top-0 z-10 shadow-xs">
            <tr>
              {isVisible('kodPelan') && (
                <th className="py-3 px-3.5 font-semibold">{renderSortHeader('Kod', 'kodPelan')}</th>
              )}
              {isVisible('namaPelan') && (
                <th className="py-3 px-3.5 font-semibold min-w-[240px]">{renderSortHeader('Nama Pelan / Projek', 'namaPelan')}</th>
              )}
              {isVisible('kategori') && (
                <th className="py-3 px-3.5 font-semibold">{renderSortHeader('Kategori', 'kategori')}</th>
              )}
              {isVisible('daerah') && (
                <th className="py-3 px-3.5 font-semibold">{renderSortHeader('Daerah', 'daerah')}</th>
              )}
              {isVisible('agensi') && (
                <th className="py-3 px-3.5 font-semibold">{renderSortHeader('Agensi / Jabatan', 'agensi')}</th>
              )}
              {isVisible('pic') && (
                <th className="py-3 px-3.5 font-semibold">{renderSortHeader('PIC', 'pic')}</th>
              )}
              {isVisible('tahun') && (
                <th className="py-3 px-3.5 font-semibold">{renderSortHeader('Tahun', 'tahun')}</th>
              )}
              {isVisible('status') && (
                <th className="py-3 px-3.5 font-semibold">{renderSortHeader('Status', 'status')}</th>
              )}
              {isVisible('kemajuan') && (
                <th className="py-3 px-3.5 font-semibold">{renderSortHeader('Kemajuan', 'kemajuan')}</th>
              )}
              <th className="py-3 px-3.5 font-semibold text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-500">
                  <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                  Tiada rekod ditemui untuk pilihan penapis semasa.
                </td>
              </tr>
            ) : (
              paginatedData.map((plan) => (
                <tr
                  key={plan.id}
                  onClick={() => onSelectPlan(plan)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  {isVisible('kodPelan') && (
                    <td className="py-2.5 px-3.5 font-mono text-slate-600 whitespace-nowrap">
                      {plan.kodPelan}
                    </td>
                  )}
                  {isVisible('namaPelan') && (
                    <td className="py-2.5 px-3.5 font-medium text-slate-900 group-hover:text-blue-700 transition-colors">
                      <div className="line-clamp-2">{plan.namaPelan}</div>
                      {plan.jenisPelan && (
                        <span className="text-[10px] text-slate-400 font-normal">
                          {plan.jenisPelan}
                        </span>
                      )}
                    </td>
                  )}
                  {isVisible('kategori') && (
                    <td className="py-2.5 px-3.5 text-slate-600 whitespace-nowrap">
                      {plan.kategori}
                    </td>
                  )}
                  {isVisible('daerah') && (
                    <td className="py-2.5 px-3.5 text-slate-700 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {plan.daerah}
                      </span>
                    </td>
                  )}
                  {isVisible('agensi') && (
                    <td className="py-2.5 px-3.5 text-slate-600 max-w-[180px] truncate" title={plan.agensi}>
                      {plan.agensi}
                    </td>
                  )}
                  {isVisible('pic') && (
                    <td className="py-2.5 px-3.5 text-slate-600 max-w-[150px] truncate" title={plan.pic}>
                      {plan.pic}
                    </td>
                  )}
                  {isVisible('tahun') && (
                    <td className="py-2.5 px-3.5 font-mono text-slate-600 whitespace-nowrap">
                      {plan.tahun}
                    </td>
                  )}
                  {isVisible('status') && (
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      {renderStatusBadge(plan.status)}
                    </td>
                  )}
                  {isVisible('kemajuan') && (
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      {renderProgressBar(plan.kemajuan)}
                    </td>
                  )}
                  <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPlan(plan);
                      }}
                      className="p-1 rounded hover:bg-blue-50 text-slate-400 hover:text-blue-700 transition-colors"
                      title="Lihat Maklumat Terperinci"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span>
            Menunjukkan <strong className="font-mono text-slate-800">{totalRecords > 0 ? startIndex + 1 : 0}</strong>–
            <strong className="font-mono text-slate-800">{Math.min(startIndex + pageSize, totalRecords)}</strong> daripada{' '}
            <strong className="font-mono text-slate-800">{totalRecords}</strong> rekod
          </span>
          <span className="text-slate-300">|</span>
          <label className="flex items-center gap-1.5 text-slate-600">
            <span>Papar:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-300 rounded px-1.5 py-0.5 text-xs text-slate-800 focus:outline-hidden"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </label>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={validCurrentPage <= 1}
            className={`p-1.5 rounded border ${
              validCurrentPage <= 1
                ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
            title="Halaman Terdahulu"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-2 font-mono text-xs">
            Halaman {validCurrentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={validCurrentPage >= totalPages}
            className={`p-1.5 rounded border ${
              validCurrentPage >= totalPages
                ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
            title="Halaman Seterusnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </section>
  );
};
