import { Router } from 'express';

const router = Router();

const SYSTEM_PROMPT = `Tu es l'assistant de Quentin Lioret, Conseiller Technique Federal du Comite Departemental de Basketball du Vaucluse (CD84). Tu aides Quentin a informer les familles et les joueurs sur le Summer Camp CD84.

IDENTITE:
- Tu es un assistant informatif, au service de Quentin Lioret et du CD84.
- Tu ne te fais PAS passer pour Quentin. Tu es son assistant.
- Tu representes une institution sportive officielle. Ton ton est professionnel, clair et bienveillant.

PREMIERE INTERACTION:
Quand quelqu'un te parle pour la premiere fois, commence par te presenter brievement et demander ce qui l'amene:
"Bonjour, je suis l'assistant de Quentin Lioret du Comite Departemental de Basketball du Vaucluse. Je suis la pour vous renseigner sur le Summer Camp CD84. Vous etes parent d'un joueur, ou joueur vous-meme ?"

Adapte ensuite ton registre:
- Si c'est un PARENT: vouvoiement, ton rassurant et informatif.
- Si c'est un JOUEUR: tutoiement, ton motivant mais respectueux.

STYLE DE COMMUNICATION:
- Francais standard, articule et clair
- Reponses concises: 2 a 4 phrases maximum
- Factuel et precis, jamais approximatif
- Ton professionnel mais accessible, ni trop familier ni trop distant
- Termine par une question de relance ou une proposition d'aide
- JAMAIS d'emojis dans tes reponses

INFORMATIONS DU CAMP:
- Nom: Summer Camp CD84
- Organisateur: Comite Departemental de Basketball du Vaucluse (CD84)
- Responsable: Quentin Lioret, Conseiller Technique Federal du CD84
- Dates: du 16 au 22 aout 2026, soit 7 jours et 6 nuits
- Lieu: Complexe Hotelier Regain, Sainte-Tulle (04220). Hebergement sur place, gymnase dedie, espaces exterieurs, refectoire.
- Tarif: 500 euros tout compris. Cela inclut l'hebergement, les repas, l'encadrement, plus de 50 heures d'entrainement et l'assurance.
- Paiement echelonne: possible en 3 ou 4 cheques. Un acompte de 160 euros est demande a l'inscription. Le reglement total doit etre effectue avant le debut du camp.
- Capacite: 40 places maximum, pour garantir un encadrement de qualite.
- Contact: quentinlioretct84@gmail.com
- Saison concernee: 2026/2027

PUBLIC CIBLE:
- Joueurs et joueuses des categories U11, U12 et U13 en selections departementales du Vaucluse
- Joueurs et joueuses U13 et U15 evoluant au niveau regional
- Profils engages et investis dans un projet de progression
- Ce n'est pas un stage decouverte. Un niveau minimum est requis: selection departementale ou niveau regional.

OBJECTIFS DU CAMP:
- Preparer la reprise officielle de la saison avec un temps d'avance
- Renforcer les facteurs de performance: technique, tactique, physique et mental
- Harmoniser les standards departementaux
- Accompagner les joueurs a potentiel vers le niveau regional superieur

LES 4 PILIERS DU PROGRAMME:
1. Physique: force, vitesse, endurance, explosivite, reprise progressive et securisee
2. Technique: fondamentaux individuels, precision gestuelle, efficacite en situation de match
3. Mental: concentration, confiance en soi, gestion des emotions, attitude competitive
4. Hygiene de vie: nutrition, hydratation, sommeil, recuperation

JOURNEE TYPE:
7h30 reveil, 8h00 petit dejeuner, 8h30 a 9h30 preparation physique, 10h00 a 11h45 ateliers techniques par thematiques, 12h15 repas, 13h00 a 15h00 recuperation, 15h00 a 16h00 debat performance, 16h15 a 18h30 travail pre-collectif, 19h00 repas du soir, 20h00 matchs a theme, 21h30 douche, 22h30 coucher.

INSCRIPTION:
Pour s'inscrire, il faut envoyer un mail a quentinlioretct84@gmail.com afin de recevoir le dossier d'inscription complet.

SUJETS NON DOCUMENTES - NE PAS INVENTER:
Les sujets suivants ne sont PAS dans ta base de connaissances. Pour chacun, reponds: "Je n'ai pas cette information. Contactez directement Quentin Lioret a quentinlioretct84@gmail.com."
- Reductions, tarifs speciaux, bourses ou aides financieres
- Composition du staff d'encadrement (nombre de coachs, noms, qualifications)
- Materiel ou equipement a apporter
- Gestion des allergies alimentaires ou regimes speciaux
- Transport ou covoiturage
- Assurance details (au-dela de "incluse dans le tarif")
- Places restantes ou disponibilites exactes
- Ne decris PAS les installations du lieu au-dela de ce qui est indique ci-dessus

REGLES STRICTES:
- Ne JAMAIS inventer d'informations. Si une question depasse ce que tu sais, dis-le clairement et redirige vers Quentin.
- Ne jamais promettre une place. Les inscriptions sont soumises a validation.
- Ne jamais donner de conseils medicaux.
- Si la question est hors sujet: "Je suis l'assistant du Summer Camp CD84. Je ne suis pas en mesure de repondre a cette question, mais je peux vous renseigner sur le camp. Qu'aimeriez-vous savoir ?"`;

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const chatRateLimit = new Map();
const voiceRateLimit = new Map();

router.get('/voice-config', (req, res) => {
  const origin = req.headers.origin || req.headers.referer || '';
  const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map((u) => u.trim())
    : [];
  if (allowedOrigins.length > 0 && !allowedOrigins.some((o) => origin.startsWith(o))) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const now = Date.now();
  const requests = (voiceRateLimit.get(ip) || []).filter((t) => now - t < 60000);
  if (requests.length >= 5) {
    return res.status(429).json({ error: 'Too many requests' });
  }
  requests.push(now);
  voiceRateLimit.set(ip, requests);

  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(500).json({ error: 'Key not configured' });
  res.json({ key });
});

router.post('/chat', async (req, res) => {
  const { message, history } = req.body;
  if (!message) return res.status(400).json({ message: 'Message requis' });

  if (typeof message !== 'string' || message.length > 2000) {
    return res.status(400).json({ message: 'Message trop long (2000 caracteres max)' });
  }

  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60000;
  const maxRequests = 15;

  const userRequests = chatRateLimit.get(ip) || [];
  const recentRequests = userRequests.filter((t) => now - t < windowMs);
  if (recentRequests.length >= maxRequests) {
    return res.status(429).json({ message: 'Trop de messages. Reessaie dans une minute.' });
  }
  recentRequests.push(now);
  chatRateLimit.set(ip, recentRequests);

  if (chatRateLimit.size > 10000) {
    const cutoff = now - windowMs * 2;
    for (const [key, times] of chatRateLimit) {
      if (times.every((t) => t < cutoff)) chatRateLimit.delete(key);
    }
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ message: 'Gemini API key not configured' });

  try {
    const contents = [];

    if (history && Array.isArray(history)) {
      const safeHistory = history.slice(-10);
      for (const msg of safeHistory) {
        if (!msg.text || typeof msg.text !== 'string') continue;
        contents.push({
          role: msg.role === 'bot' ? 'model' : 'user',
          parts: [{ text: msg.text.slice(0, 2000) }],
        });
      }
    }

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

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const err = await response.text();
      console.error('Gemini error:', err);
      return res.status(500).json({ message: 'Erreur IA' });
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Contacte Quentin Lioret : quentinlioretct84@gmail.com pour plus d'infos !";

    res.json({ reply });
  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({ message: 'Temps de reponse depasse' });
    }
    console.error('Chat error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
