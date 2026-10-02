/**
 * Konfigurasi Sumber Data Google Sheets & Pemetaan Lajur (Column Mapping)
 * 
 * Pengguna boleh menukar SPREADSHEET_ID dan SHEET_NAME di bawah.
 * Pastikan Google Sheets tersebut sama ada:
 * 1. "Publish to web" sebagai CSV (File > Share > Publish to web > CSV), ATAU
 * 2. Tetapan kebenaran pautan ditetapkan kepada "Anyone with the link can view".
 */

export const CONFIG = {
  // Masukkan Google Spreadsheet ID anda di sini (cth: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms")
  // Dapatkan dari URL: https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
  SPREADSHEET_ID: "",

  // Nama Sheet / Helaian (cth: "Sheet1", "Data_Pelan", "Pelan Tindakan")
  SHEET_NAME: "Sheet1",

  // URL CSV tersuai pilihan (jika menggunakan endpoint CSV alternatif)
  CUSTOM_CSV_URL: "",

  // Kunci API (Pilihan sekiranya menggunakan Google Sheets API v4 rasmi)
  API_KEY: import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || "",

  // Auto-refresh interval (minit), 0 untuk manual sahaja
  AUTO_REFRESH_MINUTES: 0,

  /**
   * Pemetaan Lajur (Column Aliasing):
   * Membenarkan spreadsheet dengan nama header yang sedikit berbeza
   * dipetakan secara automatik tanpa perlu ubah kod teras.
   */
  COLUMN_MAPPING: {
    kodPelan: [
      "kod", "kod pelan", "kod_pelan", "kod projek", "id pelan", 
      "plan code", "project id", "reference", "no rujukan"
    ],
    namaPelan: [
      "nama pelan", "nama projek", "tajuk", "nama program", "tajuk projek", 
      "inisiatif", "projek", "pelan", "nama_pelan", "plan name", "title"
    ],
    kategori: [
      "kategori", "teras", "sektor", "kluster", "bidang", "category", "pillar"
    ],
    daerah: [
      "daerah", "lokasi", "kawasan", "wilayah", "parlimen", "dun", "district", "location"
    ],
    agensi: [
      "agensi", "jabatan", "kementerian", "bahagian", "unit", "agency", "department"
    ],
    jenisPelan: [
      "jenis pelan", "jenis", "peringkat", "fasa", "jenis_pelan", "plan type", "type"
    ],
    pic: [
      "pic", "pegawai", "pegawai bertanggungjawab", "penyelaras", 
      "nama pegawai", "person in charge", "owner", "lead"
    ],
    tahun: [
      "tahun", "year", "tahun pelaksanaan", "tahun mula"
    ],
    bulan: [
      "bulan", "month", "bulan sasaran", "bulan laporan"
    ],
    status: [
      "status", "keadaan", "status pelaksanaan", "status terkini"
    ],
    kemajuan: [
      "kemajuan", "peratus", "peratus kemajuan", "peratusan", "%", "% siap", 
      "progress", "% progress", "kemajuan (%)"
    ],
    tarikhMula: [
      "tarikh mula", "mula", "start date", "tarikh_mula"
    ],
    tarikhTamat: [
      "tarikh tamat", "tamat", "tarikh siap", "end date", "tarikh_tamat", "deadline"
    ],
    peruntukan: [
      "peruntukan", "kos", "belanjawan", "bajet", "anggaran kos", "budget", "cost"
    ],
    objektif: [
      "objektif", "matlamat", "sasaran", "kpi", "outcome", "objective"
    ],
    catatan: [
      "catatan", "isu", "cabaran", "nota", "remarks", "notes", "status isu"
    ]
  }
};
