import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { v4 as uuid } from 'uuid';
import { appendRow } from '../services/sheets.js';
import { notifyViaAppsScript } from '../services/email.js';

const router = Router();

const validate = [
  body('playerLastName').trim().notEmpty(),
  body('playerFirstName').trim().notEmpty(),
  body('birthDate').trim().notEmpty(),
  body('category').trim().notEmpty(),
  body('club').trim().notEmpty(),
  body('level').trim().notEmpty(),
  body('parentLastName').trim().notEmpty(),
  body('parentFirstName').trim().notEmpty(),
  body('email').isEmail(),
  body('phone').trim().notEmpty(),
  body('address').trim().notEmpty(),
  body('postalCode').trim().notEmpty(),
  body('city').trim().notEmpty(),
  body('acceptParticipation').equals('true'),
  body('acceptConditions').equals('true'),
];

router.post('/inscription', validate, async (req, res) => {
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

    // Send emails via Apps Script (non-blocking)
    notifyViaAppsScript(d).catch(console.error);

    res.status(201).json({ id, message: 'Inscription enregistree' });
  } catch (err) {
    console.error('Inscription error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
