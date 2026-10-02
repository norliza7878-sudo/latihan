import React from 'react';
import { 
  FolderKanban, 
  Layers, 
  PlayCircle, 
  CheckCircle2, 
  Clock, 
  Percent,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { KPIData } from '../types';

interface KPICardsProps {
  kpi: KPIData;
  onSelectStatusFilter?: (status: string) => void;
  activeStatusFilter?: string;
}

export const KPICards: React.FC<KPICardsProps> = ({
  kpi,
  onSelectStatusFilter,
  activeStatusFilter
}) => {
  const cards = [
    {
      id: 'total_pelan',
      label: 'TOTAL PELAN',
      value: kpi.totalPelan,
      subtext: `${kpi.totalProjek} Inisiatif Terlibat`,
      icon: FolderKanban,
      colorClass: 'text-slate-900',
      borderClass: 'border-slate-200',
      bgClass: 'bg-white',
      badgeClass: 'bg-slate-100 text-slate-700',
      statusTarget: ''
    },
    {
      id: 'selesai',
      label: 'TELAH SELESAI',
      value: kpi.telahSelesai,
      percentage: kpi.totalPelan > 0 ? Math.round((kpi.telahSelesai / kpi.totalPelan) * 100) : 0,
      subtext: 'Daripada keseluruhan pelan',
      icon: CheckCircle2,
      colorClass: 'text-emerald-700',
      borderClass: 'border-emerald-200',
      bgClass: 'bg-emerald-50/40 hover:bg-emerald-50/70',
      badgeClass: 'bg-emerald-100 text-emerald-800',
      statusTarget: 'SELESAI'
    },
    {
      id: 'pelaksanaan',
      label: 'DALAM PELAKSANAAN',
      value: kpi.dalamPelaksanaan,
      percentage: kpi.totalPelan > 0 ? Math.round((kpi.dalamPelaksanaan / kpi.totalPelan) * 100) : 0,
      subtext: 'Aktif dijalankan di lapangan',
      icon: PlayCircle,
      colorClass: 'text-blue-700',
      borderClass: 'border-blue-200',
      bgClass: 'bg-blue-50/40 hover:bg-blue-50/70',
      badgeClass: 'bg-blue-100 text-blue-800',
      statusTarget: 'DALAM PELAKSANAAN'
    },
    {
      id: 'tertunda',
      label: 'TERTUNDA',
      value: kpi.tertunda,
      percentage: kpi.totalPelan > 0 ? Math.round((kpi.tertunda / kpi.totalPelan) * 100) : 0,
      subtext: 'Perlu tindakan pantas',
      icon: Clock,
      colorClass: 'text-amber-700',
      borderClass: 'border-amber-200',
      bgClass: 'bg-amber-50/40 hover:bg-amber-50/70',
      badgeClass: 'bg-amber-100 text-amber-800',
      statusTarget: 'TERTUNDA'
    },
    {
      id: 'kritikal',
      label: 'KRITIKAL / ISU',
      value: kpi.kritikal,
      percentage: kpi.totalPelan > 0 ? Math.round((kpi.kritikal / kpi.totalPelan) * 100) : 0,
      subtext: 'Perhatian jawatankuasa',
      icon: AlertTriangle,
      colorClass: 'text-rose-700',
      borderClass: 'border-rose-200',
      bgClass: 'bg-rose-50/40 hover:bg-rose-50/70',
      badgeClass: 'bg-rose-100 text-rose-800',
      statusTarget: 'KRITIKAL'
    },
    {
      id: 'kemajuan_purata',
      label: 'PURATA KEMAJUAN',
      value: `${kpi.peratusKemajuanPurata}%`,
      isPercentage: true,
      subtext: 'Pencapaian fizikal agregat',
      icon: TrendingUp,
      colorClass: 'text-indigo-700',
      borderClass: 'border-indigo-200',
      bgClass: 'bg-indigo-50/40',
      badgeClass: 'bg-indigo-100 text-indigo-800',
      statusTarget: ''
    }
  ];

  return (
    <section className="mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {cards.map((card) => {
          const Icon = card.icon;
          const isFilterable = Boolean(card.statusTarget && onSelectStatusFilter);
          const isSelected = activeStatusFilter === card.statusTarget;

          return (
            <div
              key={card.id}
              onClick={() => {
                if (isFilterable && onSelectStatusFilter) {
                  onSelectStatusFilter(isSelected ? '' : card.statusTarget);
                }
              }}
              className={`rounded-xl border p-4 transition-all duration-150 ${card.borderClass} ${card.bgClass} ${
                isFilterable ? 'cursor-pointer hover:shadow-sm' : ''
              } ${isSelected ? 'ring-2 ring-blue-600 shadow-xs' : 'shadow-2xs'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                  {card.label}
                </span>
                <div className={`p-1.5 rounded-lg bg-white border border-slate-200/80 ${card.colorClass} shadow-2xs`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-baseline justify-between gap-1">
                <span className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight ${card.colorClass}`}>
                  {card.value}
                </span>

                {card.percentage !== undefined && (
                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded font-mono ${card.badgeClass}`}>
                    {card.percentage}%
                  </span>
                )}
              </div>

              <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                <span className="truncate">{card.subtext}</span>
                {isFilterable && (
                  <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap ml-1">
                    {isSelected ? '✓ Aktif' : 'Tapisan'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
