import { Router } from 'express';
import { requireAdmin, createSession, validatePassword } from '../middleware/auth.js';
import { getAllRows, updateCell } from '../services/sheets.js';

const router = Router();

router.post('/admin/login', (req, res) => {
  const { password } = req.body;
  if (!validatePassword(password)) {
    return res.status(401).json({ message: 'Mot de passe incorrect' });
  }
  const token = createSession();
  res.json({ token });
});

router.get('/inscriptions', requireAdmin, async (req, res) => {
  try {
    const rows = await getAllRows();
    res.json(rows);
  } catch (err) {
    console.error('Get inscriptions error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.patch('/inscriptions/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;
    const allowedStatuses = ['en_attente', 'confirme', 'refuse'];
    if (!statut || !allowedStatuses.includes(statut)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }

    const rows = await getAllRows();
    const idx = rows.findIndex((r) => r.ID === id || r.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Inscription non trouvee' });

    await updateCell(idx, 'W', statut);
    res.json({ message: 'Statut mis a jour' });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const rows = await getAllRows();
    const categories = {};
    rows.forEach((r) => {
      const cat = r.Categorie || r.categorie || 'Autre';
      categories[cat] = (categories[cat] || 0) + 1;
    });
    res.json({
      total: rows.length,
      remaining: 40 - rows.length,
      categories,
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/spots', async (req, res) => {
  try {
    const rows = await getAllRows();
    res.json({ total: rows.length, remaining: 40 - rows.length });
  } catch (err) {
    console.error('Spots error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
