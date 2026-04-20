import { GoogleGenAI, Modality } from '@google/genai';
import {
  floatTo16BitPCM,
  arrayBufferToBase64,
  base64ToArrayBuffer,
  pcmToAudioBuffer,
} from './audioUtils';

const SYSTEM_PROMPT = `Tu es l'assistant vocal de Quentin Lioret, Conseiller Technique Federal du Comite Departemental de Basketball du Vaucluse (CD84). Tu aides Quentin a informer les familles et les joueurs sur le Summer Camp CD84.

IDENTITE:
- Tu es un assistant informatif, au service de Quentin Lioret et du CD84.
- Tu ne te fais PAS passer pour Quentin. Tu es son assistant.
- Tu representes une institution sportive officielle. Ton ton est professionnel, clair et bienveillant.

PREMIERE INTERACTION:
Quand quelqu'un te parle pour la premiere fois, commence par te presenter brievement et demander ce qui l'amene:
"Bonjour, je suis l'assistant de Quentin Lioret du Comite Departemental de Basketball du Vaucluse. Je suis la pour vous renseigner sur le Summer Camp CD84. Vous etes parent d'un joueur, ou joueur vous-meme ?"

Adapte ensuite ton registre:
- Si c'est un PARENT: vouvoiement, ton rassurant et informatif. Mettez en avant l'encadrement, la securite, les conditions d'hebergement, le tarif et les modalites de paiement.
- Si c'est un JOUEUR: tutoiement, ton motivant mais respectueux. Mets en avant le programme, les piliers de performance, le niveau attendu.

STYLE DE COMMUNICATION:
- Francais standard, articule et clair
- Reponses concises: 2 a 4 phrases maximum
- Factuel et precis, jamais approximatif
- Ton professionnel mais accessible, ni trop familier ni trop distant
- Termine par une question de relance ou une proposition d'aide
- Pas de vocabulaire excessivement jeune ou d'anglicismes forces
- JAMAIS d'emojis

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
- Gestion des allergies alimentaires ou regimes speciaux (au-dela de "le refectoire est sur place")
- Transport ou covoiturage
- Assurance details (au-dela de "incluse dans le tarif")
- Places restantes ou disponibilites exactes
- Ne decris PAS les installations du lieu au-dela de ce qui est indique ci-dessus

REGLES STRICTES:
- Ne JAMAIS inventer d'informations. Si une question depasse ce que tu sais, dis-le clairement et redirige vers Quentin.
- Ne jamais promettre une place. Les inscriptions sont soumises a validation.
- Ne jamais donner de conseils medicaux.
- Si la question est hors sujet: "Je suis l'assistant du Summer Camp CD84. Je ne suis pas en mesure de repondre a cette question, mais je peux vous renseigner sur le camp. Qu'aimeriez-vous savoir ?"`;

export { SYSTEM_PROMPT };

class GeminiLiveService {
  constructor() {
    this.client = null;
    this.session = null;
    this.audioContext = null;
    this.inputAudioContext = null;
    this.inputSource = null;
    this.processor = null;
    this.activeSources = [];
    this.audioQueue = [];
    this.isPlaying = false;
    this.nextStartTime = 0;
    this.isConnected = false;
    this.stream = null;
    this.analyser = null;
    this.outputVolumeRaf = null;
    this.onVolumeCallback = null;
    this.onOutputVolumeCallback = null;
  }

  async connect(apiKey, onStatusChange, onVolume, onOutputVolume) {
    try {
      onStatusChange('connecting');
      this.onVolumeCallback = onVolume;
      this.onOutputVolumeCallback = onOutputVolume;

      this.client = new GoogleGenAI({ apiKey });
      this.audioContext = new AudioContext();

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.connect(this.audioContext.destination);
      this.startOutputVolumePolling();

      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
        },
      });

      this.session = await this.client.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            this.isConnected = true;
            this.startAudioInput(this.stream);
            onStatusChange('active');
          },
          onmessage: (message) => {
            this.handleServerMessage(message);
          },
          onerror: (e) => {
            console.error('Live session error:', e);
            onStatusChange('error');
          },
          onclose: () => {
            this.isConnected = false;
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: 'Achird',
              },
            },
          },
          contextWindowCompression: {
            triggerTokens: 104857,
            slidingWindow: { targetTokens: 52428 },
          },
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        },
      });
    } catch (error) {
      console.error('Gemini Live connection error:', error);
      onStatusChange('error');
    }
  }

  async startAudioInput(stream) {
    this.inputAudioContext = new AudioContext({ sampleRate: 16000 });
    await this.inputAudioContext.audioWorklet.addModule('/audio-processor.js');

    this.inputSource = this.inputAudioContext.createMediaStreamSource(stream);
    this.processor = new AudioWorkletNode(this.inputAudioContext, 'pcm-processor');

    this.processor.port.onmessage = (e) => {
      if (!this.isConnected || !this.session) return;

      const inputData = e.data;

      if (this.onVolumeCallback) {
        let sum = 0;
        for (let i = 0; i < inputData.length; i += 4) {
          sum += Math.abs(inputData[i]);
        }
        const average = sum / (inputData.length / 4);
        this.onVolumeCallback(Math.min(100, average * 500));
      }

      const pcm = floatTo16BitPCM(inputData);
      const base64 = arrayBufferToBase64(pcm);

      try {
        this.session.sendRealtimeInput({
          audio: {
            data: base64,
            mimeType: 'audio/pcm;rate=16000',
          },
        });
      } catch {
        // Session not ready
      }
    };

    this.inputSource.connect(this.processor);
    this.processor.connect(this.inputAudioContext.destination);
  }

  parseSampleRate(mimeType) {
    if (!mimeType) return 24000;
    const match = mimeType.match(/rate=(\d+)/);
    return match ? parseInt(match[1], 10) : 24000;
  }

  startOutputVolumePolling() {
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    const poll = () => {
      if (!this.isConnected || !this.analyser) return;
      this.analyser.getByteTimeDomainData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const v = (dataArray[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / dataArray.length);
      const volume = Math.min(100, rms * 500);
      if (this.onOutputVolumeCallback) {
        this.onOutputVolumeCallback(volume);
      }
      this.outputVolumeRaf = requestAnimationFrame(poll);
    };
    poll();
  }

  async handleServerMessage(message) {
    if (message.serverContent?.interrupted) {
      this.stopAllPlayback();
      return;
    }

    if (message.serverContent?.audioChunks?.length > 0) {
      for (const chunk of message.serverContent.audioChunks) {
        if (chunk.data) {
          const rate = this.parseSampleRate(chunk.mimeType);
          this.queueAudioChunk(chunk.data, rate);
        }
      }
    }

    const parts = message.serverContent?.modelTurn?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData?.data && part.inlineData.mimeType?.startsWith('audio/')) {
          const rate = this.parseSampleRate(part.inlineData.mimeType);
          this.queueAudioChunk(part.inlineData.data, rate);
        }
      }
    }
  }

  queueAudioChunk(base64Data, sampleRate = 24000) {
    this.audioQueue.push({ base64Data, sampleRate });
    if (!this.isPlaying) {
      this.playNextChunk();
    }
  }

  async playNextChunk() {
    if (this.audioQueue.length === 0) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;
    const { base64Data, sampleRate } = this.audioQueue.shift();

    try {
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      const pcmData = base64ToArrayBuffer(base64Data);
      const audioBuffer = await pcmToAudioBuffer(pcmData, this.audioContext, sampleRate);

      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.analyser);

      const now = this.audioContext.currentTime;
      const startTime = Math.max(now, this.nextStartTime);
      source.start(startTime);
      this.nextStartTime = startTime + audioBuffer.duration;

      this.activeSources.push(source);
      source.onended = () => {
        this.activeSources = this.activeSources.filter((s) => s !== source);
      };

      this.playNextChunk();
    } catch (e) {
      console.error('Audio playback error:', e);
      this.playNextChunk();
    }
  }

  stopAllPlayback() {
    this.audioQueue.length = 0;
    this.isPlaying = false;
    for (const source of this.activeSources) {
      try { source.stop(); } catch {}
    }
    this.activeSources = [];
    this.nextStartTime = 0;
  }

  disconnect() {
    this.isConnected = false;
    this.stopAllPlayback();

    if (this.outputVolumeRaf) {
      cancelAnimationFrame(this.outputVolumeRaf);
      this.outputVolumeRaf = null;
    }

    if (this.processor) {
      this.processor.disconnect();
    }
    if (this.inputSource) {
      this.inputSource.disconnect();
    }

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }

    if (this.audioContext) {
      this.audioContext.close().catch(() => {});
    }
    if (this.inputAudioContext) {
      this.inputAudioContext.close().catch(() => {});
    }

    if (this.session) {
      try { this.session.close(); } catch {}
    }

    this.client = null;
    this.session = null;
    this.audioContext = null;
    this.inputAudioContext = null;
    this.inputSource = null;
    this.processor = null;
    this.analyser = null;
    this.outputVolumeRaf = null;
    this.activeSources = [];
    this.audioQueue = [];
    this.isPlaying = false;
    this.nextStartTime = 0;
    this.stream = null;
    this.onVolumeCallback = null;
    this.onOutputVolumeCallback = null;
  }
}

export default new GeminiLiveService();
