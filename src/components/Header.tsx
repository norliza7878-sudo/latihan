import React from 'react';
import { 
  RefreshCw, 
  FileSpreadsheet, 
  Printer, 
  Download, 
  Calendar, 
  Clock, 
  ShieldCheck,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';

interface HeaderProps {
  lastUpdated: Date;
  isRefreshing: boolean;
  onRefresh: () => void;
  onOpenConfig: () => void;
  onExportCSV: () => void;
  onPrint: () => void;
  sourceName: string;
  isCustomSource: boolean;
  totalFiltered: number;
  totalAll: number;
}

export const Header: React.FC<HeaderProps> = ({
  lastUpdated,
  isRefreshing,
  onRefresh,
  onOpenConfig,
  onExportCSV,
  onPrint,
  sourceName,
  isCustomSource,
  totalFiltered,
  totalAll
}) => {
  // Format current date in Malay
  const formattedDate = new Intl.DateTimeFormat('ms-MY', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const formattedTime = new Intl.DateTimeFormat('ms-MY', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(lastUpdated);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Banner Ribbon */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1 px-4 sm:px-8 flex justify-between items-center no-print">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium text-slate-200">PORTAL PENGURUSAN & KEMAJUAN STRATEGIK</span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-400">Penyelarasan Pelaksanaan & Pemantauan Prestasi</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formattedDate}</span>
          </span>
          <span className="hidden md:flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Kemaskini: {formattedTime}</span>
          </span>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Brand & Title */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 shadow-sm border border-slate-800">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-tight">
                  DASHBOARD PENGURUSAN PELAN
                </h1>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium ${
                  isCustomSource 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  <FileSpreadsheet className="w-3 h-3" />
                  {isCustomSource ? 'Google Sheets Aktif' : 'Dataset Piawai'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Paparan Prestasi, Kemajuan dan Status Pelaksanaan
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 no-print">
            
            {/* Google Sheets Config Trigger */}
            <button
              onClick={onOpenConfig}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs whitespace-nowrap"
              title="Konfigurasi URL Google Sheets atau ID Spreadsheet"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Sumber Data</span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors shadow-2xs whitespace-nowrap ${
                isRefreshing 
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:text-slate-900'
              }`}
              title="Muat semula data daripada Google Sheets"
            >
              <RefreshCw className={`w-4 h-4 text-blue-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Memuat...' : 'Refresh Data'}</span>
            </button>

            {/* Export CSV */}
            <button
              onClick={onExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs whitespace-nowrap"
              title="Eksport data tapisan semasa ke fail CSV"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Eksport CSV</span>
            </button>

            {/* Print Dashboard */}
            <button
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-2xs whitespace-nowrap"
              title="Cetak paparan dashboard ini atau simpan sebagai PDF"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span>Cetak Dashboard</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
