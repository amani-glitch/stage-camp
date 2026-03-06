import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Loader2, Mic, Volume2, VolumeX } from 'lucide-react';

const GREETING = "Yo ! Ici COACH, l'assistant du Summer Camp CD84. T'as des questions sur le camp ? Je suis la. Let's go !";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: GREETING },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [listening, setListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const messagesEnd = useRef(null);
  const recognitionRef = useRef(null);
  const voiceModeRef = useRef(false);
  const loadingRef = useRef(false);

  useEffect(() => { voiceModeRef.current = voiceMode; }, [voiceMode]);
  useEffect(() => { loadingRef.current = loading; }, [loading]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Init Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (transcript.trim()) {
        sendMessage(transcript.trim());
      }
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
      // Restart if still in voice mode
      setTimeout(() => {
        if (voiceModeRef.current && !loadingRef.current) startListening();
      }, 500);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch {
      // Already started
    }
  }, []);

  const speak = useCallback((text) => {
    return new Promise((resolve) => {
      if (!ttsEnabled || !window.speechSynthesis) { resolve(); return; }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 1.05;
      utterance.pitch = 1;
      const voices = window.speechSynthesis.getVoices();
      const frVoice = voices.find((v) => v.lang.startsWith('fr'));
      if (frVoice) utterance.voice = frVoice;
      utterance.onend = resolve;
      utterance.onerror = resolve;
      window.speechSynthesis.speak(utterance);
    });
  }, [ttsEnabled]);

  const sendMessage = useCallback(async (text) => {
    if (!text || loadingRef.current) return;
    setInput('');

    const userMsg = { role: 'user', text };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: [],
        }),
      });

      const data = await res.json();
      const reply = data.reply || "Contacte Quentin Lioret : quentinlioretct84@gmail.com";
      setMessages((m) => [...m, { role: 'bot', text: reply }]);

      // Speak reply, then restart listening if in voice mode
      await speak(reply);
      if (voiceModeRef.current) {
        setTimeout(() => startListening(), 300);
      }
    } catch {
      const errMsg = "Oups, probleme technique ! Contacte direct Quentin : quentinlioretct84@gmail.com";
      setMessages((m) => [...m, { role: 'bot', text: errMsg }]);
      if (voiceModeRef.current) {
        await speak(errMsg);
        setTimeout(() => startListening(), 300);
      }
    } finally {
      setLoading(false);
    }
  }, [speak, startListening]);

  const toggleVoiceMode = () => {
    if (voiceMode) {
      // Deactivate voice mode
      setVoiceMode(false);
      if (recognitionRef.current) recognitionRef.current.stop();
      setListening(false);
      window.speechSynthesis?.cancel();
    } else {
      // Activate voice mode
      setVoiceMode(true);
      startListening();
    }
  };

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

  const hasSpeechRecognition = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-orange-primary rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(249,115,22,0.4)] hover:scale-105 transition-transform"
        style={{ animation: open ? 'none' : 'pulse 2s infinite' }}
        aria-label="Ouvrir le chat"
      >
        {open ? <X size={24} className="text-black-primary" /> : <MessageCircle size={24} className="text-black-primary" />}
      </button>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes glow-mic {
          0%, 100% { box-shadow: 0 0 0 0 rgba(249,115,22,0.5); }
          50% { box-shadow: 0 0 0 10px rgba(249,115,22,0); }
        }
      `}</style>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-[380px] h-[500px] sm:h-[550px] bg-black-secondary border border-gray-700 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
          {/* Header */}
          <div className="bg-orange-primary px-5 py-4 flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 bg-black-primary rounded-full flex items-center justify-center">
              <span className="font-bebas text-white text-lg">C</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-black-primary text-sm">COACH</p>
              <p className="text-black-primary/70 text-xs">
                {voiceMode ? (listening ? 'Ecoute...' : loading ? 'Repond...' : 'Mode vocal actif') : 'Summer Camp CD84'}
              </p>
            </div>
            <button
              onClick={() => { setTtsEnabled((v) => !v); window.speechSynthesis?.cancel(); }}
              className="text-black-primary/70 hover:text-black-primary transition-colors"
              title={ttsEnabled ? 'Desactiver la voix' : 'Activer la voix'}
            >
              {ttsEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-orange-primary text-black-primary rounded-2xl rounded-br-sm'
                      : 'bg-black-tertiary text-gray-300 rounded-2xl rounded-bl-sm border border-gray-700'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-black-tertiary text-gray-300 rounded-2xl rounded-bl-sm border border-gray-700 px-4 py-3">
                  <Loader2 size={18} className="animate-spin text-orange-primary" />
                </div>
              </div>
            )}
            <div ref={messagesEnd} />
          </div>

          {/* Input */}
          <div className="flex-shrink-0 border-t border-gray-700 p-3 flex gap-2">
            {hasSpeechRecognition && (
              <button
                onClick={toggleVoiceMode}
                className={`w-11 h-11 flex items-center justify-center rounded-lg transition-all flex-shrink-0 ${
                  voiceMode
                    ? 'bg-orange-primary text-black-primary'
                    : 'bg-black-tertiary border border-gray-700 text-gray-400 hover:text-orange-primary hover:border-orange-primary'
                }`}
                style={voiceMode && listening ? { animation: 'glow-mic 1.5s infinite' } : {}}
                title={voiceMode ? 'Quitter le mode vocal' : 'Activer le mode vocal'}
              >
                <Mic size={18} />
              </button>
            )}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder={voiceMode ? (listening ? 'Je t\'ecoute...' : 'Mode vocal actif') : 'Pose ta question...'}
              className="flex-1 bg-black-tertiary border border-gray-700 text-white text-sm px-4 py-3 rounded-lg focus:border-orange-primary focus:outline-none transition-colors placeholder:text-gray-500"
              disabled={loading || voiceMode}
            />
            <button
              onClick={send}
              disabled={loading || voiceMode}
              className="bg-orange-primary text-black-primary w-11 h-11 flex items-center justify-center rounded-lg hover:bg-orange-hover transition-colors flex-shrink-0 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
