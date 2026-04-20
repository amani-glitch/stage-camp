import { randomUUID } from 'node:crypto';

const sessions = new Map();
const SESSION_TTL = 8 * 60 * 60 * 1000;

export function createSession() {
  // Clean expired sessions
  const now = Date.now();
  for (const [token, expiry] of sessions) {
    if (expiry < now) sessions.delete(token);
  }

  const token = randomUUID();
  sessions.set(token, now + SESSION_TTL);
  return token;
}

export function validatePassword(password) {
  return typeof password === 'string' && password.length > 0 && password === process.env.ADMIN_KEY;
}

export function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    const expiry = sessions.get(token);
    if (expiry && expiry > Date.now()) {
      return next();
    }
  }

  const key = req.headers['x-admin-key'];
  if (key && key === process.env.ADMIN_KEY) {
    return next();
  }

  return res.status(401).json({ message: 'Unauthorized' });
}
