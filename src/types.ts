export type PlanStatus = 
  | 'SELESAI' 
  | 'DALAM PELAKSANAAN' 
  | 'TERTUNDA' 
  | 'KRITIKAL' 
  | 'BELUM MULA';

export interface PlanItem {
  id: string;
  kodPelan: string;
  namaPelan: string;
  kategori: string;
  daerah: string;
  agensi: string;
  jenisPelan: string;
  pic: string;
  tahun: number;
  bulan: string; // e.g. "Januari", "Februari", etc.
  status: PlanStatus;
  kemajuan: number | null; // percentage 0-100 or null
  tarikhMula: string;
  tarikhTamat: string;
  peruntukan?: string;
  objektif?: string;
  catatan?: string;
  pencapaianTerkini?: string;
  // Raw additional fields from custom sheets
  raw?: Record<string, string | number | null | undefined>;
}

export interface FilterState {
  search: string;
  tahun: string;
  kategori: string;
  daerah: string;
  status: string;
  agensi: string;
  jenisPelan: string;
  pic: string;
  bulan: string;
}

export interface ColumnMappingConfig {
  id?: string[];
  kodPelan?: string[];
  namaPelan: string[];
  kategori: string[];
  daerah: string[];
  agensi: string[];
  jenisPelan?: string[];
  pic: string[];
  tahun: string[];
  bulan?: string[];
  status: string[];
  kemajuan: string[];
  tarikhMula?: string[];
  tarikhTamat?: string[];
  peruntukan?: string[];
  objektif?: string[];
  catatan?: string[];
}

export interface SheetSourceConfig {
  spreadsheetId: string;
  sheetName: string;
  customCsvUrl?: string;
  apiKey?: string;
}

export interface KPIData {
  totalPelan: number;
  totalProjek: number;
  dalamPelaksanaan: number;
  telahSelesai: number;
  tertunda: number;
  kritikal: number;
  belumMula: number;
  peratusKemajuanPurata: number;
}
