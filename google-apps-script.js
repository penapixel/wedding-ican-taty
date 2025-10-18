function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSheet();
    
    // Get form data from POST parameters
    var name = e.parameter.name || '';
    var attendance = e.parameter.attendance || '';
    var guest = e.parameter.guest || '';
    var message = e.parameter.message || '';
    var timestamp = new Date();
    
    // Convert attendance to Indonesian
    var attendanceText = '';
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
    
    // Convert guest count
    var guestText = guest ? guest + ' orang' : '1 orang';
    
    // Append data to sheet
    sheet.appendRow([
      timestamp,
      name,
      attendanceText,
      guestText,
      message
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success', 
        message: 'Data berhasil disimpan ke Google Sheets',
        data: {
          name: name,
          attendance: attendanceText,
          guest: guestText,
          message: message,
          timestamp: timestamp
        }
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error', 
        message: 'Error: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Function to handle both GET requests (for wishes and form submission)
function doGet(e) {
  try {
    var action = e.parameter.action;
    
    // Handle getting wishes for display
    if (action === 'getWishes') {
      var sheet = SpreadsheetApp.getActiveSheet();
      var data = sheet.getDataRange().getValues();
      
      // Skip header row and get last 10 wishes
      var wishes = [];
      for (var i = data.length - 1; i >= 1 && wishes.length < 10; i--) {
        var row = data[i];
        wishes.push({
          name: row[1] || '',
          attendance: row[2] || '',
          guest: row[3] || '',
          message: row[4] || '',
          timestamp: row[0] || ''
        });
      }
      
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'success',
          wishes: wishes
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Handle form submission via GET (more reliable for CORS)
    if (e.parameter.name && e.parameter.message) {
      var sheet = SpreadsheetApp.getActiveSheet();
      
      var name = e.parameter.name || '';
      var attendance = e.parameter.attendance || '';
      var guest = e.parameter.guest || '';
      var message = e.parameter.message || '';
      var timestamp = new Date();
      
      // Convert attendance to Indonesian
      var attendanceText = '';
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
      
      // Convert guest count
      var guestText = guest ? guest + ' orang' : '1 orang';
      
      // Append data to sheet
      sheet.appendRow([
        timestamp,
        name,
        attendanceText,
        guestText,
        message
      ]);
      
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'success', 
          message: 'Data berhasil disimpan ke Google Sheets'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput('RSVP Google Sheets Integration is working! Ready to receive data.');
    
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Function to setup the spreadsheet headers (run this once)
function setupSheet() {
  var sheet = SpreadsheetApp.getActiveSheet();
  
  // Clear existing content
  sheet.clear();
  
  // Add headers
  sheet.getRange(1, 1, 1, 5).setValues([
    ['Timestamp', 'Nama', 'Kehadiran', 'Jumlah Tamu', 'Ucapan']
  ]);
  
  // Format headers
  var headerRange = sheet.getRange(1, 1, 1, 5);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, 5);
  
  Logger.log('Sheet setup completed!');
}
