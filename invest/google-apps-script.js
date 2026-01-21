// INSTRUCTIONS:
// 1. Go to Google Sheets → Create new spreadsheet
// 2. Name it "First Spark Investor Submissions"
// 3. In Row 1, add these headers (columns A-H):
//    Timestamp | Name | Email | Phone | Address | Amount | Signature | Terms
// 4. Click Extensions → Apps Script
// 5. Delete everything in the editor, paste this ENTIRE script
// 6. Click Deploy → New Deployment
// 7. Select "Web app" 
// 8. Set "Execute as" = Me, "Who has access" = Anyone
// 9. Click Deploy → Copy the URL it gives you
// 10. Send that URL to Claude to update your form

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    var data = JSON.parse(e.postData.contents);
    
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
      .createTextOutput(JSON.stringify({status: 'success'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    return ContentService
      .createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput("Investor form webhook is active!")
    .setMimeType(ContentService.MimeType.TEXT);
}
