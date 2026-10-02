import React, { useState } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { CONFIG } from '../config';

interface SheetsConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveConfig: (config: { spreadsheetId: string; sheetName: string; customCsvUrl: string }) => Promise<void>;
  onResetToDefault: () => void;
  currentSpreadsheetId: string;
  currentSheetName: string;
  currentCsvUrl: string;
  isCustomSource: boolean;
}

export const SheetsConfigModal: React.FC<SheetsConfigModalProps> = ({
  isOpen,
  onClose,
  onSaveConfig,
  onResetToDefault,
  currentSpreadsheetId,
  currentSheetName,
  currentCsvUrl,
  isCustomSource
}) => {
  const [spreadsheetId, setSpreadsheetId] = useState(currentSpreadsheetId || CONFIG.SPREADSHEET_ID);
  const [sheetName, setSheetName] = useState(currentSheetName || CONFIG.SHEET_NAME);
  const [csvUrl, setCsvUrl] = useState(currentCsvUrl || CONFIG.CUSTOM_CSV_URL);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'connect' | 'guide'>('connect');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      await onSaveConfig({
        spreadsheetId: spreadsheetId.trim(),
        sheetName: sheetName.trim() || 'Sheet1',
        customCsvUrl: csvUrl.trim()
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menyambung ke sumber Google Sheets.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseBaseline = () => {
    setSpreadsheetId('');
    setSheetName('Sheet1');
    setCsvUrl('');
    onResetToDefault();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Konfigurasi Sumber Data Google Sheets
              </h3>
              <p className="text-xs text-slate-400">
                Pautkan spreadsheet rasmi organisasi anda atau gunakan dataset piawai
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('connect')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'connect'
                ? 'border-blue-600 text-blue-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sambungan Spreadsheet
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'guide'
                ? 'border-blue-600 text-blue-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Panduan & Struktur Lajur
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'connect' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Gagal Menyambung:</strong>
                    <span>{errorMsg}</span>
                  </div>
                </div>
              )}

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Kaedah Pantas:</strong> Anda hanya perlu tampal (paste) URL penuh Google Sheets anda atau ID spreadsheet. Pastikan spreadsheet ditetapkan kepada <strong>"Anyone with the link can view"</strong> (Siapa sahaja dengan pautan boleh lihat).
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL Google Sheets ATAU Spreadsheet ID
                </label>
                <input
                  type="text"
                  placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5.../edit atau SPREADSHEET_ID"
                  value={spreadsheetId}
                  onChange={(e) => setSpreadsheetId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-600 text-slate-800 font-mono"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Contoh: https://docs.google.com/spreadsheets/d/1ABC123xyz/edit
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Helaian (Sheet Name)
                  </label>
                  <input
                    type="text"
                    placeholder="Sheet1 atau Pelan"
                    value={sheetName}
                    onChange={(e) => setSheetName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-600 text-slate-800"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Nama tab di bahagian bawah Google Sheets anda (lalai: Sheet1).
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    URL CSV Tersuai (Pilihan)
                  </label>
                  <input
                    type="text"
                    placeholder="https://.../export?format=csv"
                    value={csvUrl}
                    onChange={(e) => setCsvUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-600 text-slate-800 font-mono"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Isi hanya jika menggunakan endpoint CSV khusus.
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleUseBaseline}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Gunakan Dataset Piawai Kerajaan</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || (!spreadsheetId && !csvUrl)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors ${
                      isLoading || (!spreadsheetId && !csvUrl)
                        ? 'bg-blue-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isLoading ? 'Menyambung...' : 'Sambung & Muat Data'}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-xs text-slate-700 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  1. Bagaimana Menghubungkan Google Sheets Anda?
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-600 pl-1">
                  <li>Buka dokumen Google Sheets anda di pelayar.</li>
                  <li>Klik butang <strong>Share</strong> (Kongsi) di penjuru atas kanan.</li>
                  <li>Di bahagian <em>General access</em>, tukar kepada <strong>"Anyone with the link"</strong> dengan peranan <strong>Viewer</strong>.</li>
                  <li>Salin (copy) pautan penuh dari bar URL pelayar dan tampal ke ruangan URL di tab Sambungan.</li>
                  <li>Dashboard akan membaca dan memetakan lajur secara automatik!</li>
                </ol>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  2. Senarai Lajur (Headers) Yang Disyorkan:
                </h4>
                <p className="text-slate-600 mb-2">
                  Sistem kami mempunyai enjin pemetaan pintar (auto-aliasing). Anda boleh menggunakan mana-mana nama lajur sinonim di bawah:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <strong className="block text-slate-900">Nama Pelan (Wajib):</strong>
                    <span className="text-[11px] text-slate-500">Nama Pelan, Nama Projek, Tajuk, Inisiatif, Pelan</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <strong className="block text-slate-900">Status (Wajib):</strong>
                    <span className="text-[11px] text-slate-500">Status, Keadaan, Status Pelaksanaan</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <strong className="block text-slate-900">Kemajuan (%):</strong>
                    <span className="text-[11px] text-slate-500">Kemajuan, Peratus, %, % Siap, Progress</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <strong className="block text-slate-900">Tahun:</strong>
                    <span className="text-[11px] text-slate-500">Tahun, Year, Tahun Pelaksanaan</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <strong className="block text-slate-900">Daerah:</strong>
                    <span className="text-[11px] text-slate-500">Daerah, Lokasi, Kawasan, Wilayah</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <strong className="block text-slate-900">Kategori:</strong>
                    <span className="text-[11px] text-slate-500">Kategori, Teras, Sektor, Kluster, Bidang</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <strong className="block text-slate-900">Agensi / Jabatan:</strong>
                    <span className="text-[11px] text-slate-500">Agensi, Jabatan, Kementerian, Bahagian</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <strong className="block text-slate-900">PIC / Pegawai:</strong>
                    <span className="text-[11px] text-slate-500">PIC, Pegawai, Pegawai Bertanggungjawab, Lead</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-xs">
                <strong>Nota Fleksibiliti:</strong> Jika spreadsheet anda tidak mempunyai lajur tertentu (contohnya tiada lajur Daerah atau Bulan), dashboard secara automatik <em>menyembunyikan</em> penapis tersebut tanpa sebarang ralat!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
