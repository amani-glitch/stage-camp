import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { v4 as uuid } from 'uuid';
import { appendRow } from '../services/sheets.js';
import { notifyViaAppsScript } from '../services/email.js';

const router = Router();

const inscriptionRateLimit = new Map();

function rateLimit(req, res, next) {
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 300000;
  const requests = (inscriptionRateLimit.get(ip) || []).filter((t) => now - t < windowMs);
  if (requests.length >= 3) {
    return res.status(429).json({ message: 'Trop de tentatives. Reessayez dans quelques minutes.' });
  }
  requests.push(now);
  inscriptionRateLimit.set(ip, requests);
  next();
}

const validate = [
  body('playerLastName').trim().notEmpty().isLength({ max: 100 }),
  body('playerFirstName').trim().notEmpty().isLength({ max: 100 }),
  body('birthDate').trim().notEmpty().isISO8601(),
  body('category').trim().notEmpty().isIn(['U11', 'U12', 'U13', 'U15']),
  body('club').trim().notEmpty().isLength({ max: 200 }),
  body('level').trim().notEmpty().isIn(['Selection departementale', 'Niveau regional', 'Autre']),
  body('parentLastName').trim().notEmpty().isLength({ max: 100 }),
  body('parentFirstName').trim().notEmpty().isLength({ max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('phone').trim().notEmpty().isLength({ max: 20 }).matches(/^[\d\s+()-]+$/),
  body('address').trim().notEmpty().isLength({ max: 300 }),
  body('postalCode').trim().notEmpty().isLength({ max: 10 }).matches(/^[\d\s]+$/),
  body('city').trim().notEmpty().isLength({ max: 100 }),
  body('allergies').optional().trim().isLength({ max: 1000 }),
  body('medical').optional().trim().isLength({ max: 1000 }),
  body('source').optional().trim().isLength({ max: 200 }),
  body('acceptParticipation').equals('true'),
  body('acceptConditions').equals('true'),
];

router.post('/inscription', rateLimit, validate, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Champs obligatoires manquants', errors: errors.array() });
  }

  try {
    const d = req.body;
    const id = `SC-${uuid().slice(0, 8).toUpperCase()}`;
    const date = new Date().toISOString().slice(0, 10);

    const row = [
      id, date,
      d.playerLastName, d.playerFirstName, d.birthDate, d.category, d.club, d.level, d.position || '',
      d.parentLastName, d.parentFirstName, d.email, d.phone, d.address, d.postalCode, d.city,
      d.allergies || '', d.medical || '', d.source || '',
      String(d.acceptParticipation), String(d.acceptConditions), String(d.acceptMedia || false),
      'en_attente',
    ];

    await appendRow(row);

    notifyViaAppsScript(d).catch(console.error);

    res.status(201).json({ id, message: 'Inscription enregistree' });
  } catch (err) {
    console.error('Inscription error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
