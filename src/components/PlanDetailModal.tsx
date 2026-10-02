import React from 'react';
import { PlanItem, PlanStatus } from '../types';
import { 
  X, 
  Building, 
  MapPin, 
  Calendar, 
  User, 
  Target, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Wallet,
  Printer,
  Copy
} from 'lucide-react';

interface PlanDetailModalProps {
  plan: PlanItem | null;
  onClose: () => void;
}

export const PlanDetailModal: React.FC<PlanDetailModalProps> = ({ plan, onClose }) => {
  if (!plan) return null;

  const renderStatusBadge = (status: PlanStatus) => {
    switch (status) {
      case 'SELESAI':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            SELESAI
          </span>
        );
      case 'DALAM PELAKSANAAN':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            DALAM PELAKSANAAN
          </span>
        );
      case 'TERTUNDA':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            TERTUNDA
          </span>
        );
      case 'KRITIKAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            KRITIKAL
          </span>
        );
      case 'BELUM MULA':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            BELUM MULA
          </span>
        );
    }
  };

  const progress = plan.kemajuan !== null ? plan.kemajuan : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                {plan.kodPelan}
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {plan.jenisPelan || 'Pelan Pengurusan'}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug">
              {plan.namaPelan}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Section 1: MAKLUMAT ASAS */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-blue-600" />
              <span>Maklumat Asas</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <div>
                <span className="block text-[11px] font-semibold text-slate-500 uppercase">Kategori / Teras</span>
                <span className="text-xs font-medium text-slate-800">{plan.kategori || 'Umum'}</span>
              </div>
              <div>
                <span className="block text-[11px] font-semibold text-slate-500 uppercase">Daerah / Lokasi</span>
                <span className="text-xs font-medium text-slate-800 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {plan.daerah || '-'}
                </span>
              </div>
              <div>
                <span className="block text-[11px] font-semibold text-slate-500 uppercase">Tahun Pelaksanaan</span>
                <span className="text-xs font-mono font-medium text-slate-800">{plan.tahun}</span>
              </div>
              <div>
                <span className="block text-[11px] font-semibold text-slate-500 uppercase">Agensi / Jabatan</span>
                <span className="text-xs font-medium text-slate-800">{plan.agensi || '-'}</span>
              </div>
              <div>
                <span className="block text-[11px] font-semibold text-slate-500 uppercase">Pegawai Bertanggungjawab (PIC)</span>
                <span className="text-xs font-medium text-slate-800 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {plan.pic || '-'}
                </span>
              </div>
              <div>
                <span className="block text-[11px] font-semibold text-slate-500 uppercase">Peruntukan / Kos</span>
                <span className="text-xs font-mono font-semibold text-slate-900 flex items-center gap-1">
                  <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                  {plan.peruntukan || 'Tiada maklumat bajet'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: STATUS & TEMPOH */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Status & Tempoh Masa</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <div>
                <span className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Status Terkini</span>
                <div>{renderStatusBadge(plan.status)}</div>
              </div>
              <div>
                <span className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Tarikh Mula</span>
                <span className="text-xs font-mono text-slate-800 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {plan.tarikhMula || 'N/A'}
                </span>
              </div>
              <div>
                <span className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Sasaran Siap / Tamat</span>
                <span className="text-xs font-mono text-slate-800 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {plan.tarikhTamat || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: KEMAJUAN & TIMELINE */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-blue-600" />
              <span>Kemajuan Fizikal & Garis Masa</span>
            </h4>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-slate-700">Peratus Kemajuan Sebenar:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {plan.kemajuan !== null ? `${plan.kemajuan}%` : 'N/A'}
                  </span>
                </div>
                <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      progress === 100 
                        ? 'bg-emerald-600' 
                        : progress < 40 
                        ? 'bg-rose-500' 
                        : progress < 70 
                        ? 'bg-amber-500' 
                        : 'bg-blue-600'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Objektif Pelan */}
              {plan.objektif && (
                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                    Objektif & Sasaran Pelan:
                  </span>
                  <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                    {plan.objektif}
                  </p>
                </div>
              )}

              {/* Pencapaian Terkini & Catatan */}
              {(plan.pencapaianTerkini || plan.catatan) && (
                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                    Catatan Perkembangan & Status Isu:
                  </span>
                  <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                    {plan.pencapaianTerkini || plan.catatan}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Raw Fields if custom spreadsheet has extra columns */}
          {plan.raw && Object.keys(plan.raw).length > 10 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Maklumat Tambahan Spreadsheet</span>
              </h4>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 grid grid-cols-2 gap-2 text-xs">
                {Object.entries(plan.raw).map(([key, value]) => {
                  if (!value || typeof value === 'object') return null;
                  return (
                    <div key={key} className="p-1.5 bg-white rounded border border-slate-200/60">
                      <span className="text-[10px] text-slate-500 block truncate">{key}</span>
                      <span className="text-slate-800 font-medium truncate block">{String(value)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            ID Rujukan: {plan.id}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
            >
              Cetak Pelan Ini
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-2xs"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
