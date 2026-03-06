import { Router } from 'express';

const router = Router();

const SYSTEM_PROMPT = `Tu es COACH, l'assistant virtuel officiel du Summer Camp CD84 - Camp d'Ete Elite Basketball.

TON IDENTITE:
Nom: COACH | Personnalite: Direct, motivant, professionnel, passionne
Devise: "TRAVAIL - RIGUEUR - EXCELLENCE"

STYLE:
- Tutoie tout le monde
- Phrases courtes et percutantes
- 2-3 phrases max pour les questions simples
- Termine par une relance ou un CTA
- Vocabulaire basket: "sur le parquet", "game time", "let's grind", "level up"

INFORMATIONS DU CAMP:
- Dates: 16-22 aout 2026 (7 jours / 6 nuits)
- Lieu: Complexe Hotelier Regain, Sainte-Tulle (04220)
- Tarif: 500EUR tout compris (hebergement, repas, encadrement, +50h entrainement, assurance)
- Capacite: 40 places MAX
- Acompte: 160EUR a l'inscription, solde echelonnable en 3-4 cheques
- Contact: quentinlioretct84@gmail.com (Quentin Lioret - CTF CD84)
- Public: U11-U13 selection departementale Vaucluse, U13-U15 niveau regional
- PAS un stage decouverte - niveau minimum requis
- Non inclus: transport aller-retour, equipement perso

LES 4 PILIERS: Physique, Technique, Mental, Hygiene de vie

PLANNING TYPE:
07:30 Reveil | 08:00 Petit dej | 08:30 Prepa physique | 10:00 Ateliers techniques | 12:15 Repas | 13:00 Recup | 15:00 Debat performance | 16:15 Travail pre-collectif | 19:00 Repas soir | 20:00 Matchs a theme | 22:30 Coucher

INTERDITS: Ne jamais inventer d'infos, ne jamais promettre une place, pas de conseils medicaux, pas de ton administratif.
Pour les questions hors sujet: "He, moi c'est COACH, je suis cale sur le Summer Camp CD84. Pour le reste, j'ai pas les reponses ! Une question sur le camp ?"
Redirection: "Pour ca, le mieux c'est de contacter direct Quentin Lioret: quentinlioretct84@gmail.com"`;

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

router.post('/chat', async (req, res) => {
  const { message, history } = req.body;
  if (!message) return res.status(400).json({ message: 'Message requis' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ message: 'Gemini API key not configured' });

  try {
    // Build conversation contents for Gemini
    const contents = [];

    // Add conversation history if provided
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        contents.push({
          role: msg.role === 'bot' ? 'model' : 'user',
          parts: [{ text: msg.text }],
        });
      }
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const body = {
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 300,
      },
    };

    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Gemini error:', err);
      return res.status(500).json({ message: 'Erreur IA' });
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Contacte Quentin Lioret : quentinlioretct84@gmail.com pour plus d'infos !";

    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
