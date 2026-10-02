/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PlanItem, FilterState, KPIData } from './types';
import { CONFIG } from './config';
import { fetchPlansData, ParseResult } from './services/sheetsService';
import { Header } from './components/Header';
import { KPICards } from './components/KPICards';
import { FilterBar } from './components/FilterBar';
import { Charts } from './components/Charts';
import { PlanTable } from './components/PlanTable';
import { PlanDetailModal } from './components/PlanDetailModal';
import { SheetsConfigModal } from './components/SheetsConfigModal';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { EmptyState } from './components/EmptyState';
import { ToastContainer, ToastMessage } from './components/Toast';

export default function App() {
  // Raw and Parsed Data State
  const [allPlans, setAllPlans] = useState<PlanItem[]>([]);
  const [availableFilters, setAvailableFilters] = useState<ParseResult['availableFilters']>({
    hasTahun: true,
    hasKategori: true,
    hasDaerah: true,
    hasStatus: true,
    hasAgensi: true,
    hasJenisPelan: true,
    hasPic: true,
    hasBulan: true
  });
  const [sourceName, setSourceName] = useState<string>("Dataset Piawai");
  const [isCustomSource, setIsCustomSource] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Loading & Error States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Runtime Google Sheets Configuration (persisted in localStorage if edited in UI)
  const [customSheetConfig, setCustomSheetConfig] = useState(() => {
    const saved = localStorage.getItem('app_sheets_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      spreadsheetId: CONFIG.SPREADSHEET_ID,
      sheetName: CONFIG.SHEET_NAME,
      customCsvUrl: CONFIG.CUSTOM_CSV_URL
    };
  });

  // UI Modals & Interaction States
  const [selectedPlan, setSelectedPlan] = useState<PlanItem | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Filter State
  const initialFilterState: FilterState = {
    search: '',
    tahun: '',
    kategori: '',
    daerah: '',
    status: '',
    agensi: '',
    jenisPelan: '',
    pic: '',
    bulan: ''
  };
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  // Helper to trigger toast
  const addToast = useCallback((text: string, type: 'success' | 'info' | 'error' = 'success') => {
    const newToast: ToastMessage = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      text
    };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Central Data Fetcher
  const loadData = useCallback(async (isRefresh = false, configToUse = customSheetConfig) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setLoadError(null);

    try {
      const result = await fetchPlansData(configToUse);
      setAllPlans(result.data);
      setAvailableFilters(result.availableFilters);
      setSourceName(result.sourceName);
      setIsCustomSource(result.isCustomSource);
      setLastUpdated(new Date());

      if (isRefresh) {
        addToast("Data berjaya dikemaskini!", "success");
      }
    } catch (err: any) {
      console.error("Ralat memuat data:", err);
      setLoadError(err.message || "Gagal memuatkan data dari Google Sheets.");
      addToast("Gagal menyambung ke data Google Sheets", "error");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [customSheetConfig, addToast]);

  // Initial load
  useEffect(() => {
    loadData(false);
  }, []);

  // Filter Change Handler
  const handleFilterChange = (key: keyof FilterState | string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // Reset Filter
  const handleResetFilters = () => {
    setFilters(initialFilterState);
    addToast("Semua penapis telah di-reset.", "info");
  };

  // Save new Sheet Config from modal
  const handleSaveSheetConfig = async (newConfig: { spreadsheetId: string; sheetName: string; customCsvUrl: string }) => {
    localStorage.setItem('app_sheets_config', JSON.stringify(newConfig));
    setCustomSheetConfig(newConfig);
    await loadData(false, newConfig);
    addToast("Konfigurasi Google Sheets berjaya disimpan & dimuat!", "success");
  };

  // Reset to Baseline dataset
  const handleResetToBaseline = () => {
    const emptyConfig = { spreadsheetId: '', sheetName: 'Sheet1', customCsvUrl: '' };
    localStorage.removeItem('app_sheets_config');
    setCustomSheetConfig(emptyConfig);
    loadData(false, emptyConfig);
    addToast("Menggunakan Dataset Piawai Kerajaan.", "info");
  };

  // Reactive Pipeline: Filtered Data
  const filteredData = useMemo(() => {
    const searchLower = filters.search.toLowerCase().trim();

    return allPlans.filter((plan) => {
      // 1. Search filter
      if (searchLower) {
        const matchTitle = plan.namaPelan?.toLowerCase().includes(searchLower);
        const matchCode = plan.kodPelan?.toLowerCase().includes(searchLower);
        const matchPic = plan.pic?.toLowerCase().includes(searchLower);
        const matchAgensi = plan.agensi?.toLowerCase().includes(searchLower);
        const matchDaerah = plan.daerah?.toLowerCase().includes(searchLower);
        const matchKat = plan.kategori?.toLowerCase().includes(searchLower);

        if (!matchTitle && !matchCode && !matchPic && !matchAgensi && !matchDaerah && !matchKat) {
          return false;
        }
      }

      // 2. Tahun
      if (filters.tahun && String(plan.tahun) !== filters.tahun) {
        return false;
      }

      // 3. Kategori
      if (filters.kategori && plan.kategori !== filters.kategori) {
        return false;
      }

      // 4. Daerah
      if (filters.daerah && plan.daerah !== filters.daerah) {
        return false;
      }

      // 5. Status
      if (filters.status && plan.status !== filters.status) {
        return false;
      }

      // 6. Agensi
      if (filters.agensi && plan.agensi !== filters.agensi) {
        return false;
      }

      // 7. Jenis Pelan
      if (filters.jenisPelan && plan.jenisPelan !== filters.jenisPelan) {
        return false;
      }

      // 8. PIC
      if (filters.pic && plan.pic !== filters.pic) {
        return false;
      }

      // 9. Bulan
      if (filters.bulan && plan.bulan !== filters.bulan) {
        return false;
      }

      return true;
    });
  }, [allPlans, filters]);

  // Reactive Pipeline: Automatic Dynamic KPI Calculation
  const kpiData: KPIData = useMemo(() => {
    const total = filteredData.length;
    let selesai = 0;
    let pelaksanaan = 0;
    let tertunda = 0;
    let kritikal = 0;
    let belumMula = 0;
    let totalProgressSum = 0;
    let validProgressCount = 0;

    filteredData.forEach((item) => {
      if (item.status === 'SELESAI') selesai++;
      else if (item.status === 'DALAM PELAKSANAAN') pelaksanaan++;
      else if (item.status === 'TERTUNDA') tertunda++;
      else if (item.status === 'KRITIKAL') kritikal++;
      else if (item.status === 'BELUM MULA') belumMula++;

      if (item.kemajuan !== null && item.kemajuan !== undefined) {
        totalProgressSum += item.kemajuan;
        validProgressCount++;
      }
    });

    const peratusKemajuanPurata = validProgressCount > 0 
      ? Math.round(totalProgressSum / validProgressCount) 
      : 0;

    return {
      totalPelan: total,
      totalProjek: total,
      dalamPelaksanaan: pelaksanaan,
      telahSelesai: selesai,
      tertunda: tertunda,
      kritikal: kritikal,
      belumMula: belumMula,
      peratusKemajuanPurata
    };
  }, [filteredData]);

  // Export to CSV Function
  const handleExportCSV = () => {
    if (filteredData.length === 0) {
      addToast("Tiada data untuk dieksport.", "error");
      return;
    }

    const headers = [
      "Kod Pelan",
      "Nama Pelan",
      "Kategori",
      "Daerah",
      "Agensi",
      "PIC",
      "Tahun",
      "Bulan",
      "Status",
      "Kemajuan (%)",
      "Tarikh Mula",
      "Tarikh Tamat",
      "Peruntukan",
      "Objektif"
    ];

    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '""';
      const clean = String(str).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = filteredData.map((p) => [
      escapeCsv(p.kodPelan),
      escapeCsv(p.namaPelan),
      escapeCsv(p.kategori),
      escapeCsv(p.daerah),
      escapeCsv(p.agensi),
      escapeCsv(p.pic),
      escapeCsv(p.tahun),
      escapeCsv(p.bulan),
      escapeCsv(p.status),
      escapeCsv(p.kemajuan !== null ? `${p.kemajuan}%` : 'N/A'),
      escapeCsv(p.tarikhMula),
      escapeCsv(p.tarikhTamat),
      escapeCsv(p.peruntukan || ''),
      escapeCsv(p.objektif || '')
    ]);

    const csvContent = "\uFEFF" + [
      headers.join(","),
      ...rows.map((r) => r.join(","))
    ].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStr = new Date().toISOString().split("T")[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `Laporan_Prestasi_Pelan_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addToast("Data berjaya dieksport ke fail CSV!", "success");
  };

  // Print Function
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* 1. Header */}
      <Header
        lastUpdated={lastUpdated}
        isRefreshing={isRefreshing}
        onRefresh={() => loadData(true)}
        onOpenConfig={() => setIsConfigModalOpen(true)}
        onExportCSV={handleExportCSV}
        onPrint={handlePrint}
        sourceName={sourceName}
        isCustomSource={isCustomSource}
        totalFiltered={filteredData.length}
        totalAll={allPlans.length}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        
        {/* Loading State */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : loadError ? (
          /* Error State */
          <EmptyState
            type="error"
            errorMessage={loadError}
            onAction={() => loadData(false)}
          />
        ) : (
          <>
            {/* 2. KPI Cards */}
            <KPICards
              kpi={kpiData}
              onSelectStatusFilter={(status) => handleFilterChange('status', status)}
              activeStatusFilter={filters.status}
            />

            {/* 3. Filter Bar */}
            <FilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
              availableFilters={availableFilters}
              allData={allPlans}
              filteredData={filteredData}
            />

            {/* If zero records match filters */}
            {filteredData.length === 0 ? (
              <EmptyState
                type="filter"
                onAction={handleResetFilters}
              />
            ) : (
              <>
                {/* 4. Charts */}
                <Charts
                  data={filteredData}
                  onFilterChange={handleFilterChange}
                  activeStatus={filters.status}
                  activeDaerah={filters.daerah}
                  activeKategori={filters.kategori}
                  activeTahun={filters.tahun}
                />

                {/* 5. Plan Table */}
                <PlanTable
                  data={filteredData}
                  onSelectPlan={(plan) => setSelectedPlan(plan)}
                  onExportCSV={handleExportCSV}
                />
              </>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-8 text-center text-xs text-slate-500 no-print mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Hak Cipta Terpelihara &copy; 2026 Dashboard Pengurusan Pelan Strategik Sektor Awam.
          </span>
          <span className="text-[11px] text-slate-400">
            Sumber Data: {sourceName}
          </span>
        </div>
      </footer>

      {/* 6. Detail View Modal */}
      {selectedPlan && (
        <PlanDetailModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}

      {/* 7. Sheets Configuration Modal */}
      <SheetsConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onSaveConfig={handleSaveSheetConfig}
        onResetToDefault={handleResetToBaseline}
        currentSpreadsheetId={customSheetConfig.spreadsheetId}
        currentSheetName={customSheetConfig.sheetName}
        currentCsvUrl={customSheetConfig.customCsvUrl}
        isCustomSource={isCustomSource}
      />

      {/* Toast Notifications */}
      <ToastContainer
        toasts={toasts}
        onDismiss={dismissToast}
      />

    </div>
  );
}
