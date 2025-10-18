// Google Apps Script Code untuk Wedding Form
// Copy paste kode ini ke Google Apps Script

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

// Function untuk testing - bisa dihapus setelah deploy
function testFunction() {
  const testData = {
    parameter: {
      name: 'Test User',
      attendance: 'present',
      guest: '2',
      message: 'Test message dari Apps Script'
    }
  };
  
  const result = doGet(testData);
  console.log(result.getContent());
}
