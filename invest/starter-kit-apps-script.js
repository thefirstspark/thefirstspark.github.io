// STARTER KIT EMAIL CAPTURE — Google Apps Script
//
// SETUP:
// 1. Create a NEW Google Sheet called "Spark Starter Kit Emails"
// 2. In Row 1, add these headers (columns A-G):
//    Timestamp | Email | Archetype | Track | Streak | Referral Code | Source
// 3. Click Extensions → Apps Script
// 4. Delete everything, paste this script
// 5. Click Deploy → New Deployment
// 6. Select "Web app"
// 7. Set "Execute as" = Me, "Who has access" = Anyone
// 8. Click Deploy → Copy the URL
// 9. Give that URL to Claude to update starter-kit.html

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    var archetype = data.archetype || {};
    var referral = data.referral || {};

    sheet.appendRow([
      new Date(),
      data.email || '',
      archetype.primary || 'not taken',
      archetype.track || '',
      data.streak || 0,
      referral.myCode || '',
      data.source || 'starter-kit'
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({status: 'success'}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(error) {
    return ContentService
      .createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Handle data via GET (iframe method to avoid CORS)
  if (e && e.parameter && e.parameter.data) {
    try {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      var data = JSON.parse(e.parameter.data);

      var archetype = data.archetype || {};
      var referral = data.referral || {};

      sheet.appendRow([
        new Date(),
        data.email || '',
        archetype.primary || 'not taken',
        archetype.track || '',
        data.streak || 0,
        referral.myCode || '',
        data.source || 'starter-kit'
      ]);

      return ContentService
        .createTextOutput(JSON.stringify({status: 'success'}))
        .setMimeType(ContentService.MimeType.JSON);
    } catch(error) {
      return ContentService
        .createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService
    .createTextOutput("Starter Kit email capture is active!")
    .setMimeType(ContentService.MimeType.TEXT);
}
