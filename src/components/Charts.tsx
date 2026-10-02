import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import { PlanItem, PlanStatus } from '../types';
import { PieChart as PieIcon, BarChart3, TrendingUp, MapPin, Layers } from 'lucide-react';

interface ChartsProps {
  data: PlanItem[];
  onFilterChange: (key: string, value: string) => void;
  activeStatus: string;
  activeDaerah: string;
  activeKategori: string;
  activeTahun: string;
}

const STATUS_COLORS: Record<string, string> = {
  'SELESAI': '#059669', // Emerald
  'DALAM PELAKSANAAN': '#2563EB', // Blue
  'TERTUNDA': '#D97706', // Amber
  'KRITIKAL': '#DC2626', // Red
  'BELUM MULA': '#64748B' // Slate
};

const MONTH_ORDER = [
  'Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
  'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'
];

export const Charts: React.FC<ChartsProps> = ({
  data,
  onFilterChange,
  activeStatus,
  activeDaerah,
  activeKategori,
  activeTahun
}) => {
  if (data.length === 0) {
    return null;
  }

  // 1. Data for CHART 1: Progress / Status Overview (Donut Chart)
  const statusCounts: Record<string, number> = {};
  data.forEach((item) => {
    statusCounts[item.status] = (statusCounts[item.status] || 0) + 1;
  });
  const statusChartData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count
  }));

  // 2. Data for CHART 2: Prestasi Mengikut Tahun (Bar Chart)
  const yearCounts: Record<string, number> = {};
  data.forEach((item) => {
    const yr = String(item.tahun || 'Lain-lain');
    yearCounts[yr] = (yearCounts[yr] || 0) + 1;
  });
  const yearChartData = Object.entries(yearCounts)
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year.localeCompare(b.year));

  // 3. Data for CHART 3: Kemajuan Mengikut Kategori (Horizontal Bar Chart)
  const categoryStats: Record<string, { totalProgress: number; count: number }> = {};
  data.forEach((item) => {
    const cat = item.kategori || 'Umum';
    if (!categoryStats[cat]) {
      categoryStats[cat] = { totalProgress: 0, count: 0 };
    }
    categoryStats[cat].count += 1;
    categoryStats[cat].totalProgress += (item.kemajuan !== null ? item.kemajuan : 0);
  });
  const categoryChartData = Object.entries(categoryStats).map(([kategori, stats]) => ({
    kategori: kategori.length > 24 ? kategori.substring(0, 22) + '...' : kategori,
    fullName: kategori,
    purataKemajuan: Math.round(stats.totalProgress / (stats.count || 1)),
    bilanganPelan: stats.count
  })).sort((a, b) => b.purataKemajuan - a.purataKemajuan);

  // 4. Data for CHART 4: Trend Bulanan (Line Chart)
  const monthStats: Record<string, { total: number; selesai: number }> = {};
  MONTH_ORDER.forEach(m => {
    monthStats[m] = { total: 0, selesai: 0 };
  });
  data.forEach((item) => {
    const m = item.bulan || 'Januari';
    if (!monthStats[m]) monthStats[m] = { total: 0, selesai: 0 };
    monthStats[m].total += 1;
    if (item.status === 'SELESAI') {
      monthStats[m].selesai += 1;
    }
  });
  // Filter months that have records or keep calendar flow
  const monthlyChartData = MONTH_ORDER.map((month) => ({
    month: month.substring(0, 3),
    fullMonth: month,
    jumlah: monthStats[month]?.total || 0,
    selesai: monthStats[month]?.selesai || 0
  })).filter(m => m.jumlah > 0);

  // Fallback if all months were filtered out
  const finalMonthlyData = monthlyChartData.length > 0 
    ? monthlyChartData 
    : Object.entries(monthStats).slice(0, 6).map(([month, s]) => ({
        month: month.substring(0, 3),
        fullMonth: month,
        jumlah: s.total,
        selesai: s.selesai
      }));

  // 5. Data for CHART 5: Prestasi Mengikut Daerah (Bar Chart)
  const districtCounts: Record<string, { total: number; selesai: number }> = {};
  data.forEach((item) => {
    const d = item.daerah || 'Lain-lain';
    if (!districtCounts[d]) districtCounts[d] = { total: 0, selesai: 0 };
    districtCounts[d].total += 1;
    if (item.status === 'SELESAI') districtCounts[d].selesai += 1;
  });
  const districtChartData = Object.entries(districtCounts).map(([daerah, s]) => ({
    daerah,
    bilangan: s.total,
    selesai: s.selesai
  })).sort((a, b) => b.bilangan - a.bilangan);

  return (
    <div className="space-y-6 mb-6">
      
      {/* Primary Visuals Row: Status Donut & Yearly Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* CHART 1: Donut Chart - Status Overview */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-blue-50 text-blue-700">
                <PieIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Ringkasan Status Pelan
                </h3>
                <p className="text-[11px] text-slate-500">Klik segmen untuk tapis mengikut status</p>
              </div>
            </div>
            {activeStatus && (
              <span className="text-[11px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold font-mono">
                {activeStatus}
              </span>
            )}
          </div>

          <div className="h-64 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  cursor="pointer"
                  onClick={(entry) => {
                    if (entry && entry.name) {
                      onFilterChange('status', activeStatus === entry.name ? '' : entry.name);
                    }
                  }}
                >
                  {statusChartData.map((entry) => (
                    <Cell 
                      key={`cell-${entry.name}`} 
                      fill={STATUS_COLORS[entry.name] || '#64748B'}
                      stroke={activeStatus === entry.name ? '#0F172A' : '#ffffff'}
                      strokeWidth={activeStatus === entry.name ? 2 : 1}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} Pelan`, name]}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(val) => <span className="text-[11px] font-medium text-slate-700 cursor-pointer">{val}</span>}
                  onClick={(e) => {
                    if (e && e.value) {
                      onFilterChange('status', activeStatus === e.value ? '' : e.value);
                    }
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Prestasi Mengikut Tahun */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-blue-50 text-blue-700">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Agihan Pelan Mengikut Tahun
                </h3>
                <p className="text-[11px] text-slate-500">Klik palang untuk tapis data tahunan</p>
              </div>
            </div>
            {activeTahun && (
              <span className="text-[11px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold font-mono">
                Tahun {activeTahun}
              </span>
            )}
          </div>

          <div className="h-64 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={yearChartData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="year" 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  formatter={(val: any) => [`${val} Pelan`, 'Bilangan']}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#1E3A8A" 
                  radius={[4, 4, 0, 0]}
                  cursor="pointer"
                  onClick={(entry: any) => {
                    const yr = entry?.year || entry?.payload?.year;
                    if (yr) {
                      onFilterChange('tahun', activeTahun === yr ? '' : yr);
                    }
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Secondary Visuals Row: Category Progress, Monthly Trend, District Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* CHART 3: Kemajuan Mengikut Kategori (Horizontal Bar Chart) */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-blue-50 text-blue-700">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Purata Kemajuan Kategori (%)
                </h3>
                <p className="text-[11px] text-slate-500">Pencapaian fizikal mengikut teras</p>
              </div>
            </div>
            {activeKategori && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold truncate max-w-[100px]">
                {activeKategori}
              </span>
            )}
          </div>

          <div className="h-64 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={categoryChartData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis 
                  type="number" 
                  domain={[0, 100]} 
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  tickFormatter={(val) => `${val}%`}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis 
                  dataKey="kategori" 
                  type="category" 
                  tick={{ fontSize: 10, fill: '#334155' }}
                  width={90}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(val: any, _name: any, item: any) => [
                    `${val}% (${item.payload.bilanganPelan} Pelan)`,
                    item.payload.fullName
                  ]}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar 
                  dataKey="purataKemajuan" 
                  fill="#0D9488" 
                  radius={[0, 4, 4, 0]}
                  cursor="pointer"
                  onClick={(entry: any) => {
                    const cat = entry?.fullName || entry?.payload?.fullName;
                    if (cat) {
                      onFilterChange('kategori', activeKategori === cat ? '' : cat);
                    }
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 4: Trend Bulanan (Line Chart) */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-blue-50 text-blue-700">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Trend Pelaksanaan Bulanan
                </h3>
                <p className="text-[11px] text-slate-500">Taburan pelan & status selesai</p>
              </div>
            </div>
          </div>

          <div className="h-64 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={finalMonthlyData}
                margin={{ top: 10, right: 15, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    `${val} Pelan`,
                    name === 'jumlah' ? 'Jumlah Pelan' : 'Selesai'
                  ]}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="jumlah" 
                  stroke="#2563EB" 
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#2563EB' }}
                  activeDot={{ r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="selesai" 
                  stroke="#059669" 
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#059669' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={25}
                  formatter={(val) => <span className="text-[10px] text-slate-600">{val === 'jumlah' ? 'Jumlah Pelan' : 'Selesai'}</span>}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 5: Prestasi Mengikut Daerah (Bar Chart) */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-blue-50 text-blue-700">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Prestasi Mengikut Daerah
                </h3>
                <p className="text-[11px] text-slate-500">Klik bar untuk tapis mengikut daerah</p>
              </div>
            </div>
            {activeDaerah && (
              <span className="text-[11px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                {activeDaerah}
              </span>
            )}
          </div>

          <div className="h-64 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={districtChartData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="daerah" 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    `${val} Pelan`,
                    name === 'bilangan' ? 'Jumlah Pelan' : 'Selesai'
                  ]}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar 
                  dataKey="bilangan" 
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]}
                  cursor="pointer"
                  onClick={(entry: any) => {
                    const d = entry?.daerah || entry?.payload?.daerah;
                    if (d) {
                      onFilterChange('daerah', activeDaerah === d ? '' : d);
                    }
                  }}
                />
                <Bar 
                  dataKey="selesai" 
                  fill="#10B981" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
