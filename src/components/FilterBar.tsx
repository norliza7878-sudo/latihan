import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  Search, 
  X, 
  ChevronDown,
  Building2,
  MapPin,
  Tag,
  Calendar,
  CheckCircle,
  User,
  Layers
} from 'lucide-react';
import { FilterState, PlanItem } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onReset: () => void;
  availableFilters: {
    hasTahun: boolean;
    hasKategori: boolean;
    hasDaerah: boolean;
    hasStatus: boolean;
    hasAgensi: boolean;
    hasJenisPelan: boolean;
    hasPic: boolean;
    hasBulan: boolean;
  };
  allData: PlanItem[];
  filteredData: PlanItem[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  availableFilters,
  allData,
  filteredData
}) => {
  // Cascading options derived from current data context
  // To cascade: get options from data that matches all OTHER active filters
  const getOptionsFor = (key: keyof PlanItem) => {
    // Collect unique non-empty values from allData
    const set = new Set<string>();
    allData.forEach(item => {
      const val = item[key];
      if (val !== undefined && val !== null && String(val).trim() !== '') {
        set.add(String(val).trim());
      }
    });
    return Array.from(set).sort((a, b) => {
      // Sort numeric strings numerically
      const numA = Number(a);
      const numB = Number(b);
      if (!isNaN(numA) && !isNaN(numB)) return numB - numA;
      return a.localeCompare(b);
    });
  };

  const years = availableFilters.hasTahun ? getOptionsFor('tahun') : [];
  const categories = availableFilters.hasKategori ? getOptionsFor('kategori') : [];
  const districts = availableFilters.hasDaerah ? getOptionsFor('daerah') : [];
  const statuses = availableFilters.hasStatus ? getOptionsFor('status') : [];
  const agencies = availableFilters.hasAgensi ? getOptionsFor('agensi') : [];
  const planTypes = availableFilters.hasJenisPelan ? getOptionsFor('jenisPelan') : [];
  const pics = availableFilters.hasPic ? getOptionsFor('pic') : [];
  const months = availableFilters.hasBulan ? getOptionsFor('bulan') : [];

  const activeFilterCount = Object.entries(filters).filter(
    ([k, v]) => k !== 'search' && Boolean(v)
  ).length;

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-2xs no-print">
      {/* Top row: Label, Search, Reset */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3.5 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-slate-100 text-slate-700">
            <Filter className="w-4 h-4 text-blue-700" />
          </div>
          <div>
            <span className="text-sm font-bold text-slate-900">PENAPIS DATA INTERAKTIF</span>
            <span className="text-xs text-slate-500 ml-2 font-mono">
              ({filteredData.length} daripada {allData.length} rekod dipaparkan)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari pelan, PIC, kod..."
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-600 focus:bg-white text-slate-800 placeholder:text-slate-400 transition-colors"
            />
            {filters.search && (
              <button
                onClick={() => onFilterChange('search', '')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Reset Filter Button */}
          <button
            onClick={onReset}
            disabled={activeFilterCount === 0 && !filters.search}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border shadow-2xs whitespace-nowrap ${
              activeFilterCount > 0 || filters.search
                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
            }`}
            title="Kembalikan semua penapis kepada asal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Penapis</span>
          </button>
        </div>
      </div>

      {/* Filter Selectors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2.5 pt-3.5">
        
        {/* 1. Tahun */}
        {availableFilters.hasTahun && years.length > 0 && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Tahun
            </label>
            <div className="relative">
              <select
                value={filters.tahun}
                onChange={(e) => onFilterChange('tahun', e.target.value)}
                className={`w-full appearance-none pl-2.5 pr-6 py-1.5 text-xs rounded-lg border font-medium transition-colors bg-white truncate ${
                  filters.tahun ? 'border-blue-600 text-blue-900 bg-blue-50/30' : 'border-slate-300 text-slate-700'
                }`}
              >
                <option value="">Semua Tahun</option>
                {years.map((yr) => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        )}

        {/* 2. Kategori */}
        {availableFilters.hasKategori && categories.length > 0 && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Kategori
            </label>
            <div className="relative">
              <select
                value={filters.kategori}
                onChange={(e) => onFilterChange('kategori', e.target.value)}
                className={`w-full appearance-none pl-2.5 pr-6 py-1.5 text-xs rounded-lg border font-medium transition-colors bg-white truncate ${
                  filters.kategori ? 'border-blue-600 text-blue-900 bg-blue-50/30' : 'border-slate-300 text-slate-700'
                }`}
              >
                <option value="">Semua Kategori</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        )}

        {/* 3. Daerah */}
        {availableFilters.hasDaerah && districts.length > 0 && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Daerah
            </label>
            <div className="relative">
              <select
                value={filters.daerah}
                onChange={(e) => onFilterChange('daerah', e.target.value)}
                className={`w-full appearance-none pl-2.5 pr-6 py-1.5 text-xs rounded-lg border font-medium transition-colors bg-white truncate ${
                  filters.daerah ? 'border-blue-600 text-blue-900 bg-blue-50/30' : 'border-slate-300 text-slate-700'
                }`}
              >
                <option value="">Semua Daerah</option>
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        )}

        {/* 4. Status */}
        {availableFilters.hasStatus && statuses.length > 0 && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Status
            </label>
            <div className="relative">
              <select
                value={filters.status}
                onChange={(e) => onFilterChange('status', e.target.value)}
                className={`w-full appearance-none pl-2.5 pr-6 py-1.5 text-xs rounded-lg border font-medium transition-colors bg-white truncate ${
                  filters.status ? 'border-blue-600 text-blue-900 bg-blue-50/30' : 'border-slate-300 text-slate-700'
                }`}
              >
                <option value="">Semua Status</option>
                {statuses.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        )}

        {/* 5. Agensi / Jabatan */}
        {availableFilters.hasAgensi && agencies.length > 0 && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Agensi / Jabatan
            </label>
            <div className="relative">
              <select
                value={filters.agensi}
                onChange={(e) => onFilterChange('agensi', e.target.value)}
                className={`w-full appearance-none pl-2.5 pr-6 py-1.5 text-xs rounded-lg border font-medium transition-colors bg-white truncate ${
                  filters.agensi ? 'border-blue-600 text-blue-900 bg-blue-50/30' : 'border-slate-300 text-slate-700'
                }`}
              >
                <option value="">Semua Agensi</option>
                {agencies.map((ag) => (
                  <option key={ag} value={ag}>{ag}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        )}

        {/* 6. Jenis Pelan */}
        {availableFilters.hasJenisPelan && planTypes.length > 0 && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Jenis Pelan
            </label>
            <div className="relative">
              <select
                value={filters.jenisPelan}
                onChange={(e) => onFilterChange('jenisPelan', e.target.value)}
                className={`w-full appearance-none pl-2.5 pr-6 py-1.5 text-xs rounded-lg border font-medium transition-colors bg-white truncate ${
                  filters.jenisPelan ? 'border-blue-600 text-blue-900 bg-blue-50/30' : 'border-slate-300 text-slate-700'
                }`}
              >
                <option value="">Semua Jenis</option>
                {planTypes.map((jp) => (
                  <option key={jp} value={jp}>{jp}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        )}

        {/* 7. PIC / Pegawai */}
        {availableFilters.hasPic && pics.length > 0 && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              PIC / Pegawai
            </label>
            <div className="relative">
              <select
                value={filters.pic}
                onChange={(e) => onFilterChange('pic', e.target.value)}
                className={`w-full appearance-none pl-2.5 pr-6 py-1.5 text-xs rounded-lg border font-medium transition-colors bg-white truncate ${
                  filters.pic ? 'border-blue-600 text-blue-900 bg-blue-50/30' : 'border-slate-300 text-slate-700'
                }`}
              >
                <option value="">Semua PIC</option>
                {pics.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        )}

        {/* 8. Bulan */}
        {availableFilters.hasBulan && months.length > 0 && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Bulan
            </label>
            <div className="relative">
              <select
                value={filters.bulan}
                onChange={(e) => onFilterChange('bulan', e.target.value)}
                className={`w-full appearance-none pl-2.5 pr-6 py-1.5 text-xs rounded-lg border font-medium transition-colors bg-white truncate ${
                  filters.bulan ? 'border-blue-600 text-blue-900 bg-blue-50/30' : 'border-slate-300 text-slate-700'
                }`}
              >
                <option value="">Semua Bulan</option>
                {months.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        )}

      </div>

      {/* Active Filter Chips bar */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-3 mt-3 border-t border-slate-100 text-xs">
          <span className="text-slate-400 text-[11px] font-medium mr-1">Penapis Aktif:</span>
          {Object.entries(filters).map(([k, v]) => {
            if (k === 'search' || !v) return null;
            return (
              <span
                key={k}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-medium"
              >
                <span className="capitalize text-blue-500">{k}:</span>
                <span>{v}</span>
                <button
                  onClick={() => onFilterChange(k as keyof FilterState, '')}
                  className="hover:text-blue-900 ml-0.5"
                  title="Buang penapis ini"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </section>
  );
};
