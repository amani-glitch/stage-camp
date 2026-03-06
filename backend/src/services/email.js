const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

export async function sendConfirmation(to, playerName) {
  // Handled by notifyViaAppsScript
}

export async function notifyAdmin(data) {
  // Handled by notifyViaAppsScript
}

export async function notifyViaAppsScript(data) {
  if (!APPS_SCRIPT_URL) {
    console.warn('APPS_SCRIPT_URL not set, skipping email');
    return;
  }

  const payload = {
    email: data.email,
    playerName: `${data.playerFirstName} ${data.playerLastName}`,
    playerFirstName: data.playerFirstName,
    playerLastName: data.playerLastName,
    category: data.category,
    club: data.club,
    level: data.level,
    parentFirstName: data.parentFirstName,
    parentLastName: data.parentLastName,
    phone: data.phone,
  };

  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Apps Script error: ${res.status}`);
  }
}
