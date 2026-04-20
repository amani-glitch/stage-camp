import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useSpots } from '../context/SpotsContext';

const initialState = {
  playerLastName: '',
  playerFirstName: '',
  birthDate: '',
  category: '',
  club: '',
  level: '',
  position: '',
  parentLastName: '',
  parentFirstName: '',
  email: '',
  phone: '',
  address: '',
  postalCode: '',
  city: '',
  allergies: '',
  medical: '',
  source: '',
  acceptParticipation: false,
  acceptConditions: false,
  acceptMedia: false,
};

export default function InscriptionForm() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const { remaining, decrement } = useSpots();

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    if (!form.acceptParticipation || !form.acceptConditions) {
      setStatus('error');
      setErrorMsg('Veuillez accepter les conditions obligatoires.');
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';

      const res = await fetch(`${apiUrl}/api/inscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Erreur lors de l\'inscription');
      }

      setStatus('success');
      decrement();
      setForm(initialState);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Une erreur est survenue. Reessayez.');
    }
  };

  const inputCls =
    'w-full bg-white border border-gray-300 text-gray-900 px-4 py-3 focus:border-orange-primary focus:outline-none transition-colors placeholder:text-gray-400';
  const labelCls = 'block text-xs text-gray-500 uppercase tracking-widest mb-2';

  if (status === 'success') {
    return (
      <section id="inscription" className="py-24 px-6 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(232,121,43,0.06),transparent_60%)]" />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <CheckCircle className="text-green-500 mx-auto mb-6" size={64} />
          <h2 className="font-bebas text-4xl tracking-wider mb-4">PRE-INSCRIPTION ENVOYEE</h2>
          <p className="text-gray-600">
            Tu vas recevoir un email de confirmation avec le dossier complet.
            On se retrouve sur le parquet !
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="inscription" className="py-24 px-6 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(232,121,43,0.06),transparent_60%)]" />
      <div ref={ref} className="max-w-4xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-orange-primary text-sm uppercase tracking-[0.3em] mb-4">Rejoins</p>
          <h2 className="font-bebas text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-wider mb-4">
            L'ELITE
          </h2>
          <div className="inline-flex items-center gap-4 bg-orange-primary/10 border border-orange-primary/40 px-8 py-4 mb-4">
            <span className="font-bebas text-5xl sm:text-6xl text-orange-primary leading-none">{remaining}</span>
            <div className="text-left">
              <p className="text-gray-900 text-base font-bold uppercase tracking-wider leading-tight">Places restantes</p>
              <p className="text-gray-500 text-xs uppercase tracking-widest">sur 40 — inscription prioritaire</p>
            </div>
          </div>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Cette communication est reservee aux joueurs cibles. L'annonce publique sera
            diffusee dans 2-3 semaines. Tu beneficies d'une priorite d'inscription.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-[#FAF9F7] border border-gray-200 p-8 sm:p-12 mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Joueur */}
          <h3 className="font-bebas text-xl tracking-wider text-orange-primary mb-6">
            Informations du joueur
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div>
              <label htmlFor="playerLastName" className={labelCls}>Nom *</label>
              <input id="playerLastName" name="playerLastName" className={inputCls} required value={form.playerLastName} onChange={set('playerLastName')} />
            </div>
            <div>
              <label htmlFor="playerFirstName" className={labelCls}>Prenom *</label>
              <input id="playerFirstName" name="playerFirstName" className={inputCls} required value={form.playerFirstName} onChange={set('playerFirstName')} />
            </div>
            <div>
              <label htmlFor="birthDate" className={labelCls}>Date de naissance *</label>
              <input id="birthDate" name="birthDate" className={inputCls} type="date" required value={form.birthDate} onChange={set('birthDate')} />
            </div>
            <div>
              <label htmlFor="category" className={labelCls}>Categorie *</label>
              <select id="category" name="category" className={inputCls} required value={form.category} onChange={set('category')}>
                <option value="">Selectionner</option>
                <option>U11</option>
                <option>U12</option>
                <option>U13</option>
                <option>U15</option>
              </select>
            </div>
            <div>
              <label htmlFor="club" className={labelCls}>Club actuel *</label>
              <input id="club" name="club" className={inputCls} required value={form.club} onChange={set('club')} />
            </div>
            <div>
              <label htmlFor="level" className={labelCls}>Niveau *</label>
              <select id="level" name="level" className={inputCls} required value={form.level} onChange={set('level')}>
                <option value="">Selectionner</option>
                <option>Selection departementale</option>
                <option>Niveau regional</option>
                <option>Autre</option>
              </select>
            </div>
            <div>
              <label htmlFor="position" className={labelCls}>Poste</label>
              <select id="position" name="position" className={inputCls} value={form.position} onChange={set('position')}>
                <option value="">Selectionner</option>
                <option>Meneur</option>
                <option>Arriere</option>
                <option>Ailier</option>
                <option>Ailier fort</option>
                <option>Pivot</option>
              </select>
            </div>
          </div>

          {/* Responsable */}
          <h3 className="font-bebas text-xl tracking-wider text-orange-primary mb-6">
            Responsable legal
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div>
              <label htmlFor="parentLastName" className={labelCls}>Nom *</label>
              <input id="parentLastName" name="parentLastName" className={inputCls} required value={form.parentLastName} onChange={set('parentLastName')} />
            </div>
            <div>
              <label htmlFor="parentFirstName" className={labelCls}>Prenom *</label>
              <input id="parentFirstName" name="parentFirstName" className={inputCls} required value={form.parentFirstName} onChange={set('parentFirstName')} />
            </div>
            <div>
              <label htmlFor="email" className={labelCls}>Email *</label>
              <input id="email" name="email" className={inputCls} type="email" required value={form.email} onChange={set('email')} />
            </div>
            <div>
              <label htmlFor="phone" className={labelCls}>Telephone *</label>
              <input id="phone" name="phone" className={inputCls} type="tel" required value={form.phone} onChange={set('phone')} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="address" className={labelCls}>Adresse *</label>
              <input id="address" name="address" className={inputCls} required value={form.address} onChange={set('address')} />
            </div>
            <div>
              <label htmlFor="postalCode" className={labelCls}>Code postal *</label>
              <input id="postalCode" name="postalCode" className={inputCls} required value={form.postalCode} onChange={set('postalCode')} />
            </div>
            <div>
              <label htmlFor="city" className={labelCls}>Ville *</label>
              <input id="city" name="city" className={inputCls} required value={form.city} onChange={set('city')} />
            </div>
          </div>

          {/* Complementaire */}
          <h3 className="font-bebas text-xl tracking-wider text-orange-primary mb-6">
            Informations complementaires
          </h3>
          <div className="space-y-4 mb-8">
            <div>
              <label htmlFor="allergies" className={labelCls}>Allergies / Regime alimentaire</label>
              <textarea id="allergies" name="allergies" className={inputCls + ' min-h-[80px] resize-y'} value={form.allergies} onChange={set('allergies')} />
            </div>
            <div>
              <label htmlFor="medical" className={labelCls}>Informations medicales</label>
              <textarea id="medical" name="medical" className={inputCls + ' min-h-[80px] resize-y'} value={form.medical} onChange={set('medical')} />
            </div>
            <div>
              <label htmlFor="source" className={labelCls}>Comment avez-vous connu le camp ?</label>
              <select id="source" name="source" className={inputCls} value={form.source} onChange={set('source')}>
                <option value="">Selectionner</option>
                <option>Comite departemental</option>
                <option>Club</option>
                <option>Bouche a oreille</option>
                <option>Reseaux sociaux</option>
                <option>Autre</option>
              </select>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-4 mb-8">
            <label htmlFor="acceptParticipation" className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                id="acceptParticipation"
                name="acceptParticipation"
                checked={form.acceptParticipation}
                onChange={set('acceptParticipation')}
                className="mt-1 accent-orange-primary w-4 h-4 flex-shrink-0"
              />
              <span className="text-gray-600 text-sm group-hover:text-gray-900 transition-colors">
                J'accepte que mon enfant participe au Summer Camp CD84 *
              </span>
            </label>
            <label htmlFor="acceptConditions" className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                id="acceptConditions"
                name="acceptConditions"
                checked={form.acceptConditions}
                onChange={set('acceptConditions')}
                className="mt-1 accent-orange-primary w-4 h-4 flex-shrink-0"
              />
              <span className="text-gray-600 text-sm group-hover:text-gray-900 transition-colors">
                J'accepte les conditions generales *
              </span>
            </label>
            <label htmlFor="acceptMedia" className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                id="acceptMedia"
                name="acceptMedia"
                checked={form.acceptMedia}
                onChange={set('acceptMedia')}
                className="mt-1 accent-orange-primary w-4 h-4 flex-shrink-0"
              />
              <span className="text-gray-600 text-sm group-hover:text-gray-900 transition-colors">
                J'autorise l'utilisation des photos/videos
              </span>
            </label>
          </div>

          {status === 'error' && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 p-4 mb-6">
              <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
              <p className="text-red-500 text-sm">{errorMsg}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-orange-primary text-white font-bold uppercase tracking-widest py-4 text-sm hover:bg-orange-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                ENVOI EN COURS...
              </>
            ) : (
              <>
                <Send size={18} />
                ENVOYER MA PRE-INSCRIPTION
              </>
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
