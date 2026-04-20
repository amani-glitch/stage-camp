import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Loader2, Mic, MicOff } from 'lucide-react';
import geminiLiveService from '../services/geminiLiveService';

const GREETING = "Bonjour, je suis l'assistant de Quentin Lioret du Comite Departemental de Basketball du Vaucluse. Je suis la pour vous renseigner sur le Summer Camp CD84. Vous etes parent d'un joueur, ou joueur vous-meme ?";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState('text');
  const [messages, setMessages] = useState([
    { role: 'bot', text: GREETING },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('idle');
  const [inputVolume, setInputVolume] = useState(0);
  const [outputVolume, setOutputVolume] = useState(0);
  const [apiKey, setApiKey] = useState(null);
  const [blinking, setBlinking] = useState(false);
  const messagesEnd = useRef(null);
  const messagesRef = useRef(messages);

  useEffect(() => {
    if (voiceStatus !== 'active') return;
    const scheduleBlink = () => {
      const delay = 2000 + Math.random() * 4000;
      return setTimeout(() => {
        setBlinking(true);
        setTimeout(() => setBlinking(false), 150);
        timerId = scheduleBlink();
      }, delay);
    };
    let timerId = scheduleBlink();
    return () => clearTimeout(timerId);
  }, [voiceStatus]);

  useEffect(() => {
    messagesRef.current = messages;
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchApiKey = useCallback(async () => {
    if (apiKey) return apiKey;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiUrl}/api/voice-config`);
      const data = await res.json();
      setApiKey(data.key);
      return data.key;
    } catch {
      return null;
    }
  }, [apiKey]);

  const startVoice = useCallback(async () => {
    const key = await fetchApiKey();
    if (!key) {
      setVoiceStatus('error');
      return;
    }
    setView('voice');
    await geminiLiveService.connect(
      key,
      (status) => setVoiceStatus(status),
      (vol) => setInputVolume(vol),
      (vol) => setOutputVolume(vol),
    );
  }, [fetchApiKey]);

  const stopVoice = useCallback(() => {
    geminiLiveService.disconnect();
    setVoiceStatus('idle');
    setInputVolume(0);
    setOutputVolume(0);
    setView('text');
  }, []);

  const sendMessage = useCallback(async (text) => {
    if (!text || loading) return;
    setInput('');

    const userMsg = { role: 'user', text };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const history = messagesRef.current.filter((m) => m.role !== 'system').slice(-10);
      const res = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await res.json();
      const reply = data.reply || "Contacte Quentin Lioret : quentinlioretct84@gmail.com";
      setMessages((m) => [...m, { role: 'bot', text: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'bot', text: "Oups, probleme technique ! Contacte direct Quentin : quentinlioretct84@gmail.com" },
      ]);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const send = () => {
    const text = input.trim();
    if (!text || loading) return;
    sendMessage(text);
  };

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleClose = () => {
    if (view === 'voice') stopVoice();
    setOpen(false);
  };

  const mouthOpen = Math.min(1, outputVolume / 60);
  const mouthHeight = mouthOpen * 14;
  const eyeRy = blinking ? 1 : (outputVolume > 50 ? 11 : 9);
  const eyebrowLift = Math.min(4, outputVolume / 25);

  const statusLabel = {
    idle: 'Pret',
    connecting: 'Connexion...',
    active: 'Parle-moi du camp !',
    error: 'Micro indisponible',
  };

  return (
    <>
      <button
        onClick={() => (open ? handleClose() : setOpen(true))}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-orange-primary rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(232,121,43,0.4)] hover:scale-105 transition-transform"
        style={{ animation: open ? 'none' : 'chatPulse 2s infinite' }}
        aria-label="Ouvrir le chat"
      >
        {open ? <X size={24} className="text-white" /> : <MessageCircle size={24} className="text-white" />}
      </button>

      <style>{`
        @keyframes chatPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes coachBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-[380px] h-[500px] sm:h-[550px] bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
          {/* Header */}
          <div className="bg-orange-primary px-5 py-4 flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
              <span className="font-bebas text-orange-primary text-lg">C</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-white text-sm">ASSISTANT CD84</p>
              <p className="text-white/70 text-xs">
                {view === 'voice' ? statusLabel[voiceStatus] : 'Summer Camp CD84'}
              </p>
            </div>
          </div>

          {view === 'text' ? (
            <>
              {/* Text Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-orange-primary text-white rounded-2xl rounded-br-sm'
                          : 'bg-[#FAF9F7] text-gray-700 rounded-2xl rounded-bl-sm border border-gray-200'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-[#FAF9F7] text-gray-700 rounded-2xl rounded-bl-sm border border-gray-200 px-4 py-3">
                      <Loader2 size={18} className="animate-spin text-orange-primary" />
                    </div>
                  </div>
                )}
                <div ref={messagesEnd} />
              </div>

              {/* Text Input */}
              <div className="flex-shrink-0 border-t border-gray-200 p-3 flex gap-2">
                <button
                  onClick={startVoice}
                  className="w-11 h-11 flex items-center justify-center rounded-lg bg-[#FAF9F7] border border-gray-200 text-gray-500 hover:text-orange-primary hover:border-orange-primary transition-all flex-shrink-0"
                  title="Activer le mode vocal"
                >
                  <Mic size={18} />
                </button>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKey}
                  placeholder="Pose ta question..."
                  className="flex-1 bg-[#FAF9F7] border border-gray-200 text-gray-900 text-sm px-4 py-3 rounded-lg focus:border-orange-primary focus:outline-none transition-colors placeholder:text-gray-400"
                  disabled={loading}
                />
                <button
                  onClick={send}
                  disabled={loading}
                  className="bg-orange-primary text-white w-11 h-11 flex items-center justify-center rounded-lg hover:bg-orange-dark transition-colors flex-shrink-0 disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Voice Mode */}
              <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6">
                {voiceStatus === 'connecting' && (
                  <Loader2 size={48} className="animate-spin text-orange-primary" />
                )}

                {voiceStatus === 'active' && (
                  <>
                    <div style={{ animation: 'coachBob 3s ease-in-out infinite' }}>
                      <svg viewBox="0 0 180 180" width="160" height="160">
                        <defs>
                          <radialGradient id="ballGrad" cx="40%" cy="35%" r="60%">
                            <stop offset="0%" stopColor="#F0A060" />
                            <stop offset="100%" stopColor="#E8792B" />
                          </radialGradient>
                          <clipPath id="ballClip">
                            <circle cx="90" cy="90" r="85" />
                          </clipPath>
                        </defs>
                        <circle cx="90" cy="90" r="85" fill="url(#ballGrad)" />
                        <g clipPath="url(#ballClip)" stroke="#C4621A" strokeWidth="2.5" fill="none" opacity="0.35">
                          <line x1="5" y1="90" x2="175" y2="90" />
                          <line x1="90" y1="5" x2="90" y2="175" />
                          <path d="M 30 20 Q 90 80, 30 160" />
                          <path d="M 150 20 Q 90 80, 150 160" />
                        </g>
                        {/* Eyes */}
                        <ellipse cx="62" cy="78" rx="12" ry={eyeRy} fill="white" className="transition-all duration-100" />
                        <ellipse cx="118" cy="78" rx="12" ry={eyeRy} fill="white" className="transition-all duration-100" />
                        <ellipse cx="64" cy="78" rx="5" ry={Math.min(5, eyeRy)} fill="#1a1a1a" className="transition-all duration-100" />
                        <ellipse cx="120" cy="78" rx="5" ry={Math.min(5, eyeRy)} fill="#1a1a1a" className="transition-all duration-100" />
                        <circle cx="67" cy="74" r="2" fill="white" opacity="0.8" />
                        <circle cx="123" cy="74" r="2" fill="white" opacity="0.8" />
                        {/* Eyebrows */}
                        <path d={`M 48 ${66 - eyebrowLift} Q 62 ${58 - eyebrowLift}, 76 ${66 - eyebrowLift}`} stroke="#8B4513" strokeWidth="3" fill="none" strokeLinecap="round" className="transition-all duration-100" />
                        <path d={`M 104 ${66 - eyebrowLift} Q 118 ${58 - eyebrowLift}, 132 ${66 - eyebrowLift}`} stroke="#8B4513" strokeWidth="3" fill="none" strokeLinecap="round" className="transition-all duration-100" />
                        {/* Mouth */}
                        {mouthOpen < 0.05 ? (
                          <path d="M 68 115 Q 90 128, 112 115" stroke="#8B4513" strokeWidth="3" fill="none" strokeLinecap="round" />
                        ) : (
                          <>
                            <ellipse cx="90" cy="118" rx={12 + mouthOpen * 8} ry={Math.max(2, mouthHeight)} fill="#5C1A00" className="transition-all duration-75" />
                            {mouthHeight > 6 && (
                              <ellipse cx="90" cy={120 + mouthHeight * 0.2} rx={6 + mouthOpen * 4} ry={mouthHeight * 0.4} fill="#3D0E00" className="transition-all duration-75" />
                            )}
                          </>
                        )}
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm text-center">
                      Je t'ecoute...
                    </p>
                  </>
                )}

                {voiceStatus === 'error' && (
                  <div className="text-center">
                    <MicOff size={48} className="text-red-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">
                      Micro indisponible. Verifie les permissions de ton navigateur.
                    </p>
                  </div>
                )}
              </div>

              {/* Voice Controls */}
              <div className="flex-shrink-0 border-t border-gray-200 p-4 flex flex-col items-center gap-3">
                <button
                  onClick={stopVoice}
                  className="w-full bg-red-500 text-white font-bold uppercase tracking-widest py-3 text-sm rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <MicOff size={18} />
                  Arreter la voix
                </button>
                <button
                  onClick={stopVoice}
                  className="text-gray-500 text-xs hover:text-orange-primary transition-colors"
                >
                  Revenir au chat texte
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
