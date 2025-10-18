# Panduan Setup Google Sheets untuk Form Ucapan Wedding

## Langkah 1: Buat Google Sheets

1. Buka [Google Sheets](https://sheets.google.com)
2. Buat spreadsheet baru dengan nama "Wedding Ucapan - Hasan & Surati"
3. Di Sheet1, buat header di baris pertama:
   - A1: `Timestamp`
   - B1: `Nama`
   - C1: `Kehadiran`
   - D1: `Jumlah Tamu`
   - E1: `Ucapan`

## Langkah 2: Setup Google Apps Script

1. Di Google Sheets, klik **Extensions** > **Apps Script**
2. Hapus kode default dan paste kode berikut:

```javascript
function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Handle different actions
    const action = e.parameter.action;
    
    if (action === 'getWishes') {
      return getWishes(sheet);
    } else {
      return addWish(e, sheet);
    }
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function addWish(e, sheet) {
  const timestamp = e.parameter.timestamp || new Date().toISOString();
  const name = e.parameter.name || '';
  const attendance = e.parameter.attendance || '';
  const guest = e.parameter.guest || '1';
  const message = e.parameter.message || '';
  
  // Convert attendance to Indonesian
  let attendanceText = '';
  switch(attendance) {
    case 'present':
      attendanceText = 'Hadir';
      break;
    case 'notpresent':
      attendanceText = 'Tidak Hadir';
      break;
    case 'notsure':
      attendanceText = 'Masih Ragu';
      break;
    default:
      attendanceText = attendance;
  }
  
  // Add row to sheet
  sheet.appendRow([timestamp, name, attendanceText, guest, message]);
  
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Ucapan berhasil disimpan'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getWishes(sheet) {
  const data = sheet.getDataRange().getValues();
  const wishes = [];
  
  // Skip header row, get last 20 wishes
  for (let i = Math.max(1, data.length - 20); i < data.length; i++) {
    if (data[i][1]) { // Check if name exists
      wishes.push({
        timestamp: data[i][0],
        name: data[i][1],
        attendance: data[i][2],
        guest: data[i][3],
        message: data[i][4]
      });
    }
  }
  
  // Reverse to show newest first
  wishes.reverse();
  
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      wishes: wishes
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Langkah 3: Deploy Apps Script

1. Klik **Deploy** > **New deployment**
2. Pilih type: **Web app**
3. Description: `Wedding Form Handler`
4. Execute as: **Me**
5. Who has access: **Anyone**
6. Klik **Deploy**
7. **Copy URL yang diberikan** - ini yang akan digunakan di website

## Langkah 4: Update Website

Ganti URL di file HTML dengan URL yang didapat dari step 3.

## Langkah 5: Test

1. Submit form di website
2. Cek Google Sheets apakah data masuk
3. Refresh halaman untuk melihat ucapan terbaru

## Troubleshooting

- Jika error "Authorization required", pastikan script di-deploy dengan akses "Anyone"
- Jika data tidak masuk, cek log di Apps Script dengan **Executions**
- Pastikan header di Google Sheets sesuai dengan yang dibutuhkan
