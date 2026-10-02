import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-3 bg-slate-200 rounded w-20"></div>
              <div className="h-6 w-6 bg-slate-200 rounded-lg"></div>
            </div>
            <div className="h-7 bg-slate-200 rounded w-16"></div>
            <div className="h-2 bg-slate-100 rounded w-full"></div>
          </div>
        ))}
      </div>

      {/* Filter Bar Skeleton */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
        <div className="h-4 bg-slate-200 rounded w-48"></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-8 bg-slate-100 rounded-lg"></div>
          ))}
        </div>
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-4 h-72 flex items-center justify-center">
          <div className="w-36 h-36 rounded-full border-8 border-slate-100 border-t-blue-500 animate-spin"></div>
        </div>
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-4 h-72 space-y-4">
          <div className="h-4 bg-slate-200 rounded w-40"></div>
          <div className="h-52 bg-slate-50 rounded-lg flex items-end gap-3 p-4">
            {[40, 75, 55, 90, 60, 80].map((h, i) => (
              <div key={i} className="flex-1 bg-slate-200 rounded-t" style={{ height: `${h}%` }}></div>
            ))}
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="h-5 bg-slate-200 rounded w-52"></div>
        <div className="space-y-2 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-slate-50 rounded border border-slate-100"></div>
          ))}
        </div>
      </div>
    </div>
  );
};
