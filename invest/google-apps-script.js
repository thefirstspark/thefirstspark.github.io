// INSTRUCTIONS:
// 1. Go to your existing "First Spark Investor Submissions" spreadsheet
// 2. Add a second sheet tab called "Starter Kit Emails"
// 3. In Row 1 of that tab, add these headers (columns A-G):
//    Timestamp | Email | Archetype | Track | Streak | Referral Code | Source
// 4. Click Extensions → Apps Script
// 5. Replace the ENTIRE script with this updated version
// 6. Click Deploy → Manage Deployments → Edit → New Version → Deploy
//    (This updates your existing URL — no need for a new one)
//
// The script now handles BOTH investor submissions AND starter kit emails.
// It routes to the correct sheet based on the "source" field in the payload.

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);

    // Route to correct sheet based on source
    if (data.source === 'starter-kit') {
      return handleStarterKit(ss, data);
    } else {
      return handleInvestor(ss, data);
    }

  } catch(error) {
    return ContentService
      .createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleInvestor(ss, data) {
  var sheet = ss.getSheetByName('Sheet1') || ss.getActiveSheet();

  sheet.appendRow([
    new Date(),
    data.investorName || '',
    data.investorEmail || '',
    data.investorPhone || '',
    data.investorAddress || '',
    data.investmentAmount || '',
    data.signature ? 'Signed ✓' : 'No signature',
    data.termsAgreed ? 'Agreed ✓' : 'Not agreed'
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({status: 'success', type: 'investor'}))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleStarterKit(ss, data) {
  var sheet = ss.getSheetByName('Starter Kit Emails');

  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet('Starter Kit Emails');
    sheet.appendRow(['Timestamp', 'Email', 'Archetype', 'Track', 'Streak', 'Referral Code', 'Source']);
  }

  // Parse archetype data
  var archetype = data.archetype || {};
  var referral = data.referral || {};

  sheet.appendRow([
    new Date(),
    data.email || '',
    archetype.primary || 'not taken',
    archetype.track || '',
    data.streak || 0,
    referral.myCode || '',
    'starter-kit'
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({status: 'success', type: 'starter-kit'}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService
    .createTextOutput("First Spark webhook is active! Handles: investor, starter-kit")
    .setMimeType(ContentService.MimeType.TEXT);
}
