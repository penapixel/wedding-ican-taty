# 🎯 LANGKAH SETUP GOOGLE SHEETS INTEGRATION

## STEP 1: Buat Google Sheets
1. Buka https://sheets.google.com
2. Buat spreadsheet baru
3. Rename menjadi "Wedding Ucapan - Hasan & Surati"
4. Di baris pertama (header), isi:
   - A1: `Timestamp`
   - B1: `Nama` 
   - C1: `Kehadiran`
   - D1: `Jumlah Tamu`
   - E1: `Ucapan`

## STEP 2: Setup Google Apps Script
1. Di Google Sheets, klik **Extensions** → **Apps Script**
2. Hapus semua kode default
3. Copy paste kode dari file `wedding-google-sheets-integration.js`
4. Save dengan nama "Wedding Form Handler"

## STEP 3: Deploy Apps Script
1. Klik **Deploy** → **New deployment**
2. Pilih type: **Web app**
3. Description: `Wedding Form API`
4. Execute as: **Me (your email)**
5. Who has access: **Anyone**
6. Klik **Deploy**
7. **COPY URL yang muncul** (contoh: https://script.google.com/macros/s/ABC123.../exec)

## STEP 4: Update HTML
1. Buka file `wedding-form-javascript.js`
2. Copy semua kode JavaScript
3. Di file HTML, cari bagian `<script>` yang berisi form handling
4. Ganti semua JavaScript form dengan kode dari `wedding-form-javascript.js`
5. **PENTING**: Ganti `PASTE_URL_GOOGLE_APPS_SCRIPT_DISINI` dengan URL dari Step 3

## STEP 5: Test
1. Buka website
2. Isi form ucapan
3. Submit
4. Cek Google Sheets apakah data masuk
5. Refresh halaman untuk lihat ucapan muncul

## ⚠️ TROUBLESHOOTING

### Jika ucapan tidak muncul:
- Pastikan URL Google Apps Script benar
- Cek browser console (F12) untuk error
- Pastikan Google Sheets tidak private

### Jika form tidak bisa submit:
- Pastikan Apps Script di-deploy dengan akses "Anyone"
- Cek apakah ada typo di URL
- Pastikan internet connection stabil

### Jika data tidak masuk ke Google Sheets:
- Cek log di Google Apps Script (Executions tab)
- Pastikan header di Google Sheets sesuai
- Cek permission Google Apps Script

## 🔧 KONFIGURASI TAMBAHAN

### Untuk membatasi jumlah ucapan yang ditampilkan:
Edit di Apps Script, ganti:
```javascript
for (let i = 1; i < data.length; i++) {
```
Menjadi:
```javascript
for (let i = Math.max(1, data.length - 50); i < data.length; i++) {
```

### Untuk filter kata-kata tidak pantas:
Tambahkan di fungsi `addWish()`:
```javascript
const badWords = ['kata1', 'kata2'];
if (badWords.some(word => message.toLowerCase().includes(word))) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'error',
    message: 'Ucapan mengandung kata yang tidak pantas'
  })).setMimeType(ContentService.MimeType.JSON);
}
```
