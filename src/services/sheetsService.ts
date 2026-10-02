import { CONFIG } from '../config';
import { DEFAULT_PLANS } from '../data/defaultPlans';
import { PlanItem, PlanStatus } from '../types';

export interface ParseResult {
  data: PlanItem[];
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
  headers: string[];
  sourceName: string;
  isCustomSource: boolean;
}

/**
 * Normalise status to standard Malaysian government dashboard terminology
 */
export function normalizeStatus(rawStatus: string | null | undefined): PlanStatus {
  if (!rawStatus) return 'BELUM MULA';
  const s = rawStatus.toString().trim().toUpperCase();

  if (s.includes('SELESAI') || s.includes('SIAP') || s.includes('COMPLETED') || s.includes('DONE')) {
    return 'SELESAI';
  }
  if (s.includes('KRITIKAL') || s.includes('CRITICAL') || s.includes('SAKIT') || s.includes('MASALAH')) {
    return 'KRITIKAL';
  }
  if (s.includes('TERTUNDA') || s.includes('DELAY') || s.includes('LEWAT') || s.includes('TERGENDALA')) {
    return 'TERTUNDA';
  }
  if (s.includes('LAKSANA') || s.includes('SEDANG') || s.includes('ONGOING') || s.includes('PROGRESS') || s.includes('AKTIF')) {
    return 'DALAM PELAKSANAAN';
  }
  if (s.includes('BELUM') || s.includes('RANCANG') || s.includes('NOT STARTED') || s.includes('PENDING')) {
    return 'BELUM MULA';
  }

  return 'DALAM PELAKSANAAN';
}

/**
 * Normalise percentage kemajuan
 */
export function normalizeKemajuan(val: any): number | null {
  if (val === null || val === undefined || val === '') return null;
  const str = String(val).replace(/%/g, '').trim();
  const num = parseFloat(str);
  if (isNaN(num)) return null;
  return Math.min(100, Math.max(0, Math.round(num)));
}

/**
 * Extract Spreadsheet ID from standard Google Sheets URL
 */
export function extractSpreadsheetId(urlOrId: string): string {
  const trimmed = urlOrId.trim();
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
}

/**
 * Robust CSV parser that handles quotes, escaped quotes, commas inside cells, and newlines
 */
export function parseCSV(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentCell += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        currentCell += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentCell.trim());
        currentCell = '';
      } else if (char === '\r') {
        // ignore carriage return
      } else if (char === '\n') {
        currentRow.push(currentCell.trim());
        if (currentRow.some(cell => cell.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
  }

  // Push last cell/row
  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some(cell => cell.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Find index of best matching header based on aliases in CONFIG.COLUMN_MAPPING
 */
function findColumnIndex(headers: string[], aliases: string[]): number {
  const cleanHeaders = headers.map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
  
  for (const alias of aliases) {
    const cleanAlias = alias.toLowerCase().replace(/[^a-z0-9]/g, '');
    const idx = cleanHeaders.findIndex(h => h === cleanAlias);
    if (idx !== -1) return idx;
  }

  // Substring fallback
  for (const alias of aliases) {
    const cleanAlias = alias.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanAlias.length > 3) {
      const idx = cleanHeaders.findIndex(h => h.includes(cleanAlias) || cleanAlias.includes(h));
      if (idx !== -1) return idx;
    }
  }

  return -1;
}

/**
 * Transform raw CSV grid to typed PlanItem array
 */
export function transformCSVToPlans(csvText: string, sourceLabel: string = "Google Sheets"): ParseResult {
  const rows = parseCSV(csvText);
  if (rows.length < 2) {
    throw new Error("Spreadsheet tidak mengandungi data baris yang mencukupi.");
  }

  const rawHeaders = rows[0];
  const mapping = CONFIG.COLUMN_MAPPING;

  const idxKod = findColumnIndex(rawHeaders, mapping.kodPelan);
  const idxNama = findColumnIndex(rawHeaders, mapping.namaPelan);
  const idxKategori = findColumnIndex(rawHeaders, mapping.kategori);
  const idxDaerah = findColumnIndex(rawHeaders, mapping.daerah);
  const idxAgensi = findColumnIndex(rawHeaders, mapping.agensi);
  const idxJenis = findColumnIndex(rawHeaders, mapping.jenisPelan);
  const idxPic = findColumnIndex(rawHeaders, mapping.pic);
  const idxTahun = findColumnIndex(rawHeaders, mapping.tahun);
  const idxBulan = findColumnIndex(rawHeaders, mapping.bulan);
  const idxStatus = findColumnIndex(rawHeaders, mapping.status);
  const idxKemajuan = findColumnIndex(rawHeaders, mapping.kemajuan);
  const idxTarikhMula = findColumnIndex(rawHeaders, mapping.tarikhMula);
  const idxTarikhTamat = findColumnIndex(rawHeaders, mapping.tarikhTamat);
  const idxPeruntukan = findColumnIndex(rawHeaders, mapping.peruntukan);
  const idxObjektif = findColumnIndex(rawHeaders, mapping.objektif);
  const idxCatatan = findColumnIndex(rawHeaders, mapping.catatan);

  const availableFilters = {
    hasTahun: idxTahun !== -1,
    hasKategori: idxKategori !== -1,
    hasDaerah: idxDaerah !== -1,
    hasStatus: idxStatus !== -1,
    hasAgensi: idxAgensi !== -1,
    hasJenisPelan: idxJenis !== -1,
    hasPic: idxPic !== -1,
    hasBulan: idxBulan !== -1
  };

  const data: PlanItem[] = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    // Skip empty lines
    if (!row || row.length === 0 || row.every(cell => !cell || cell.trim() === '')) {
      continue;
    }

    const rawObj: Record<string, string> = {};
    rawHeaders.forEach((h, i) => {
      rawObj[h] = row[i] || '';
    });

    const kodVal = idxKod !== -1 ? row[idxKod] : `PLN-${r.toString().padStart(3, '0')}`;
    const namaVal = idxNama !== -1 && row[idxNama] ? row[idxNama] : (row[0] || `Pelan Inisiatif ${r}`);
    const kategoriVal = idxKategori !== -1 && row[idxKategori] ? row[idxKategori] : "Umum";
    const daerahVal = idxDaerah !== -1 && row[idxDaerah] ? row[idxDaerah] : "Seluruh Negeri";
    const agensiVal = idxAgensi !== -1 && row[idxAgensi] ? row[idxAgensi] : "Jabatan Negeri";
    const jenisVal = idxJenis !== -1 && row[idxJenis] ? row[idxJenis] : "Pelan Tindakan";
    const picVal = idxPic !== -1 && row[idxPic] ? row[idxPic] : "Pegawai Penyelaras";
    
    // Parse Year
    let tahunVal = new Date().getFullYear();
    if (idxTahun !== -1 && row[idxTahun]) {
      const parsedYear = parseInt(row[idxTahun], 10);
      if (!isNaN(parsedYear) && parsedYear > 1990 && parsedYear < 2100) {
        tahunVal = parsedYear;
      }
    }

    // Parse Month
    const bulanVal = idxBulan !== -1 && row[idxBulan] ? row[idxBulan] : "Januari";

    // Parse Status
    const statusRaw = idxStatus !== -1 ? row[idxStatus] : 'DALAM PELAKSANAAN';
    const statusVal = normalizeStatus(statusRaw);

    // Parse Kemajuan
    const kemajuanVal = idxKemajuan !== -1 ? normalizeKemajuan(row[idxKemajuan]) : (statusVal === 'SELESAI' ? 100 : 50);

    const plan: PlanItem = {
      id: kodVal || `ID-${r}`,
      kodPelan: kodVal,
      namaPelan: namaVal,
      kategori: kategoriVal,
      daerah: daerahVal,
      agensi: agensiVal,
      jenisPelan: jenisVal,
      pic: picVal,
      tahun: tahunVal,
      bulan: bulanVal,
      status: statusVal,
      kemajuan: kemajuanVal,
      tarikhMula: idxTarikhMula !== -1 ? row[idxTarikhMula] : `${tahunVal}-01-01`,
      tarikhTamat: idxTarikhTamat !== -1 ? row[idxTarikhTamat] : `${tahunVal}-12-31`,
      peruntukan: idxPeruntukan !== -1 ? row[idxPeruntukan] : undefined,
      objektif: idxObjektif !== -1 ? row[idxObjektif] : undefined,
      catatan: idxCatatan !== -1 ? row[idxCatatan] : undefined,
      raw: rawObj
    };

    data.push(plan);
  }

  return {
    data,
    availableFilters,
    headers: rawHeaders,
    sourceName: sourceLabel,
    isCustomSource: true
  };
}

/**
 * Fetch data from Google Sheets or fallback to authentic default plans
 */
export async function fetchPlansData(
  overrideConfig?: { spreadsheetId?: string; sheetName?: string; customCsvUrl?: string }
): Promise<ParseResult> {
  const spreadsheetId = overrideConfig?.spreadsheetId ?? CONFIG.SPREADSHEET_ID;
  const sheetName = overrideConfig?.sheetName ?? CONFIG.SHEET_NAME;
  const customCsvUrl = overrideConfig?.customCsvUrl ?? CONFIG.CUSTOM_CSV_URL;

  // 1. If explicit Custom CSV URL provided
  if (customCsvUrl && customCsvUrl.trim().length > 0) {
    try {
      const response = await fetch(customCsvUrl.trim());
      if (!response.ok) {
        throw new Error(`Gagal memuat turun CSV (${response.status}: ${response.statusText})`);
      }
      const text = await response.text();
      return transformCSVToPlans(text, "CSV Tersuai");
    } catch (err: any) {
      console.warn("Gagal fetch CSV URL:", err);
      throw err;
    }
  }

  // 2. If Google Sheets ID provided
  if (spreadsheetId && spreadsheetId.trim().length > 0) {
    const cleanId = extractSpreadsheetId(spreadsheetId);
    const encodedSheet = encodeURIComponent(sheetName || "Sheet1");
    
    // Primary URL: Google Visualization API (often allows CORS for publicly viewable sheets)
    const gvizUrl = `https://docs.google.com/spreadsheets/d/${cleanId}/gviz/tq?tqx=out:csv&sheet=${encodedSheet}`;
    // Fallback URL: Direct export
    const exportUrl = `https://docs.google.com/spreadsheets/d/${cleanId}/export?format=csv&sheet=${encodedSheet}`;

    let lastError: any = null;

    try {
      const resp = await fetch(gvizUrl);
      if (resp.ok) {
        const text = await resp.text();
        if (text && text.trim().length > 20 && !text.includes('<!DOCTYPE html>')) {
          return transformCSVToPlans(text, `Google Sheets (${sheetName})`);
        }
      }
    } catch (e) {
      lastError = e;
    }

    try {
      const resp = await fetch(exportUrl);
      if (resp.ok) {
        const text = await resp.text();
        if (text && text.trim().length > 20 && !text.includes('<!DOCTYPE html>')) {
          return transformCSVToPlans(text, `Google Sheets (${sheetName})`);
        }
      }
    } catch (e) {
      lastError = e;
    }

    throw new Error(
      lastError?.message || 
      "Gagal menyambung ke Google Sheets. Sila pastikan spreadsheet telah ditetapkan ke 'Anyone with link can view' atau gunakan 'File > Share > Publish to web'."
    );
  }

  // 3. Baseline Default Plans (Authentic Malaysian Public Sector Dataset)
  return {
    data: DEFAULT_PLANS,
    availableFilters: {
      hasTahun: true,
      hasKategori: true,
      hasDaerah: true,
      hasStatus: true,
      hasAgensi: true,
      hasJenisPelan: true,
      hasPic: true,
      hasBulan: true
    },
    headers: [
      "Kod Pelan", "Nama Pelan", "Kategori", "Daerah", "Agensi", 
      "Jenis Pelan", "PIC", "Tahun", "Bulan", "Status", "Kemajuan (%)", 
      "Tarikh Mula", "Tarikh Tamat", "Peruntukan", "Objektif", "Catatan"
    ],
    sourceName: "Dataset Piawai Pengurusan Sektor Awam",
    isCustomSource: false
  };
}
