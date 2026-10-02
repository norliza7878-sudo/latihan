import React from 'react';
import { AlertCircle, RotateCcw, RefreshCw, FolderSearch } from 'lucide-react';

interface EmptyStateProps {
  type: 'filter' | 'error';
  errorMessage?: string;
  onAction: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type, errorMessage, onAction }) => {
  if (type === 'error') {
    return (
      <div className="bg-white rounded-xl border border-rose-200 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs my-8">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Data Tidak Dapat Dimuatkan
        </h3>
        <p className="text-xs text-slate-500 mb-5 leading-relaxed">
          {errorMessage || "Terdapat masalah semasa mengambil data daripada Google Sheets. Sila semak pautan atau kebenaran perkongsian spreadsheet anda."}
        </p>
        <button
          onClick={onAction}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-2xs"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Cuba Lagi (Retry)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs my-8">
      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
        <FolderSearch className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-1">
        Tiada Rekod Ditemui
      </h3>
      <p className="text-xs text-slate-500 mb-5 leading-relaxed">
        Tiada rekod pelan yang sepadan dengan kombinasi penapis atau carian semasa.
      </p>
      <button
        onClick={onAction}
        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Reset Penapis</span>
      </button>
    </div>
  );
};
