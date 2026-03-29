/*
 * ═══════════════════════════════════════════════════════════════
 *  COSMIC STAIRWAY — Google Sheets Lead Capture Backend
 *  Receives form submissions and logs them to a Google Sheet
 *  + sends you an email notification for each new lead.
 * ═══════════════════════════════════════════════════════════════
 *
 *  SETUP INSTRUCTIONS (takes ~5 minutes):
 *
 *  1. Go to https://sheets.google.com and create a new spreadsheet
 *     - Name it: "Sparkverse Leads"
 *     - In Row 1, add these headers:
 *       A1: Timestamp | B1: Type | C1: Name | D1: Email
 *       E1: Company   | F1: Range | G1: Interest | H1: Message | I1: Source
 *
 *  2. Go to Extensions → Apps Script
 *     - Delete the default code in Code.gs
 *     - Paste everything from this file (ONLY the code below the instructions)
 *     - Update YOUR_EMAIL below to: kate@thefirstspark.shop
 *
 *  3. Click Deploy → New Deployment
 *     - Type: Web app
 *     - Execute as: Me
 *     - Who has access: Anyone
 *     - Click Deploy
 *     - Authorize when prompted (click Advanced → Go to Sparkverse Leads)
 *     - Copy the Web App URL
 *
 *  4. Back in cosmic-stairway.html, replace:
 *     const GOOGLE_SHEET_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
 *     with your actual URL, e.g.:
 *     const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/ABC.../exec';
 *
 *  5. That's it. Every form submission now:
 *     - Adds a row to your Google Sheet
 *     - Sends you an email notification
 *     - Shows up in real-time
 *
 * ═══════════════════════════════════════════════════════════════
 *  PASTE THE CODE BELOW INTO APPS SCRIPT (Code.gs):
 * ═══════════════════════════════════════════════════════════════
 */

// ─── CONFIG ───
var NOTIFICATION_EMAIL = 'kate@thefirstspark.shop';

// ─── Handle POST requests from the form ───
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // Get the active spreadsheet (the one this script is attached to)
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Append a new row with the lead data
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.type || '',
      data.name || '',
      data.email || '',
      data.company || '',
      data.range || '',
      data.interest || '',
      data.message || '',
      data.source || 'cosmic-stairway'
    ]);

    // Send email notification
    var subject = data.type === 'invest'
      ? '◇ NEW INVESTOR LEAD — ' + data.name
      : '◇ NEW MEMBER LEAD — ' + data.name;

    var body = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
             + '  THE COSMIC STAIRWAY — NEW LEAD\n'
             + '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n'
             + 'Type: ' + (data.type || 'N/A') + '\n'
             + 'Name: ' + (data.name || 'N/A') + '\n'
             + 'Email: ' + (data.email || 'N/A') + '\n'
             + 'Company: ' + (data.company || 'N/A') + '\n'
             + 'Investment Range: ' + (data.range || 'N/A') + '\n'
             + 'Interest: ' + (data.interest || 'N/A') + '\n'
             + 'Message: ' + (data.message || 'N/A') + '\n\n'
             + 'Source: ' + (data.source || 'N/A') + '\n'
             + 'Time: ' + (data.timestamp || 'N/A') + '\n\n'
             + '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
             + 'View all leads in your Google Sheet.\n';

    MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);

    // Return success
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: 'Lead captured' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─── Handle GET requests (for testing) ───
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'online',
      service: 'Cosmic Stairway Lead Capture',
      message: 'POST form data to this URL to capture leads.'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
