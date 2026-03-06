import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { getAllRows, updateCell } from '../services/sheets.js';

const router = Router();

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
    if (!statut) return res.status(400).json({ message: 'Statut requis' });

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

router.get('/stats', async (req, res) => {
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

export default router;
