// SPARK STATION LIVE — Google Sheets Webhook
// =============================================
// 1. Create a Google Sheet named "Spark Station Submissions"
// 2. Add THREE tabs with these headers:
//
//    Tab "Tour" (row 1):
//    Timestamp | Name | Email | Tour Type | Preferred Window | City | Message
//
//    Tab "Sponsor" (row 1):
//    Timestamp | Company | Contact Name | Email | Partnership Type | Proposal
//
//    Tab "Fuel" (row 1):
//    Timestamp | Amount | Email | Note | Source
//
// 3. Extensions → Apps Script → paste this file
// 4. Deploy → New deployment → Web app
//    Execute as: Me | Who has access: Anyone
// 5. Copy the deployment URL into spark-station-live.html CONFIG.googleSheetWebhook

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    return handleSubmission(data);
  } catch (error) {
    return jsonResponse({ status: 'error', message: error.toString() });
  }
}

function doGet(e) {
  if (e.parameter && e.parameter.data) {
    try {
      var data = JSON.parse(e.parameter.data);
      return handleSubmission(data);
    } catch (error) {
      return jsonResponse({ status: 'error', message: error.toString() });
    }
  }
  return ContentService
    .createTextOutput('Spark Station webhook is active!')
    .setMimeType(ContentService.MimeType.TEXT);
}

function handleSubmission(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var formType = (data.formType || '').toLowerCase();
  var sheet;

  if (formType === 'tour') {
    sheet = ss.getSheetByName('Tour') || ss.getActiveSheet();
    sheet.appendRow([
      new Date(),
      data.name || '',
      data.email || '',
      data.tourType || '',
      data.preferredWindow || '',
      data.city || '',
      data.message || ''
    ]);
  } else if (formType === 'sponsor') {
    sheet = ss.getSheetByName('Sponsor') || ss.getActiveSheet();
    sheet.appendRow([
      new Date(),
      data.company || '',
      data.name || '',
      data.email || '',
      data.partnershipType || '',
      data.message || ''
    ]);
  } else if (formType === 'fuel') {
    sheet = ss.getSheetByName('Fuel') || ss.getActiveSheet();
    sheet.appendRow([
      new Date(),
      data.amount || '',
      data.email || '',
      data.note || '',
      data.source || 'spark-station-live'
    ]);
  } else {
    return jsonResponse({ status: 'error', message: 'Unknown formType: ' + formType });
  }

  return jsonResponse({ status: 'success', formType: formType });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}