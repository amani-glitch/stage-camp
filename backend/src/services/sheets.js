import { google } from 'googleapis';

let sheets;

function getSheets() {
  if (sheets) return sheets;
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  sheets = google.sheets({ version: 'v4', auth });
  return sheets;
}

const SHEET_ID = () => process.env.GOOGLE_SHEETS_ID;
const RANGE = 'Inscriptions!A:W';

export async function appendRow(row) {
  const api = getSheets();
  await api.spreadsheets.values.append({
    spreadsheetId: SHEET_ID(),
    range: RANGE,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [row] },
  });
}

export async function getAllRows() {
  const api = getSheets();
  const res = await api.spreadsheets.values.get({
    spreadsheetId: SHEET_ID(),
    range: RANGE,
  });
  const rows = res.data.values || [];
  if (rows.length < 2) return [];
  const headers = rows[0];
  return rows.slice(1).map((r) => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = r[i] || ''; });
    return obj;
  });
}

export async function updateCell(rowIndex, col, value) {
  const api = getSheets();
  const cell = `Inscriptions!${col}${rowIndex + 2}`;
  await api.spreadsheets.values.update({
    spreadsheetId: SHEET_ID(),
    range: cell,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [[value]] },
  });
}
