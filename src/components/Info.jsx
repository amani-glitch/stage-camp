import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Banknote, MapPin, Users } from 'lucide-react';

export default function Info() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [inscriptions, setInscriptions] = useState(12);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${apiUrl}/api/spots`);
        if (res.ok) {
          const data = await res.json();
          if (data.total != null) setInscriptions(data.total);
        }
      } catch {
        // keep default
      }
    };
    fetchCount();
  }, []);

  const pct = Math.min((inscriptions / 40) * 100, 100);

  return (
    <section className="py-24 px-6 bg-[#FAF9F7]">
      <div ref={ref} className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-orange-primary text-sm uppercase tracking-[0.3em] mb-4">
            Infos
          </p>
          <h2 className="font-bebas text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-wider">
            PRATIQUES
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Tarif */}
          <motion.div
            className="bg-white border border-gray-200 p-8 hover:border-orange-primary transition-all duration-300 hover:-translate-y-1"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Banknote className="text-orange-primary mb-4" size={32} strokeWidth={1.5} />
            <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">Tarif</p>
            <p className="font-bebas text-5xl text-gray-900 tracking-wider">500&euro;</p>
            <p className="font-bebas text-xl text-orange-primary tracking-wider mb-4">
              TOUT COMPRIS
            </p>
            <div className="w-8 h-0.5 bg-orange-primary mb-4" />
            <ul className="text-gray-500 text-sm space-y-1">
              <li>Hebergement &bull; Repas &bull; Encadrement &bull; Assurance</li>
            </ul>
            <p className="text-gray-600 text-sm mt-4">
              Paiement echelonne possible (3-4 cheques)
            </p>
            <p className="text-gray-500 text-xs mt-1">Acompte : 160&euro; a l'inscription</p>
          </motion.div>

          {/* Lieu */}
          <motion.div
            className="bg-white border border-gray-200 p-8 hover:border-orange-primary transition-all duration-300 hover:-translate-y-1"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <MapPin className="text-orange-primary mb-4" size={32} strokeWidth={1.5} />
            <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">Lieu</p>
            <p className="font-bebas text-3xl text-gray-900 tracking-wider">
              Complexe Hotelier Regain
            </p>
            <p className="font-bebas text-xl text-orange-primary tracking-wider mb-4">
              SAINTE-TULLE (04220)
            </p>
            <div className="w-8 h-0.5 bg-orange-primary mb-4" />
            <ul className="text-gray-500 text-sm space-y-2">
              <li>&bull; Hebergement sur place</li>
              <li>&bull; Gymnase dedie</li>
              <li>&bull; Espaces exterieurs</li>
              <li>&bull; Refectoire</li>
            </ul>
          </motion.div>

          {/* Capacite */}
          <motion.div
            className="bg-white border border-gray-200 p-8 hover:border-orange-primary transition-all duration-300 hover:-translate-y-1"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Users className="text-orange-primary mb-4" size={32} strokeWidth={1.5} />
            <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">Capacite</p>
            <p className="font-bebas text-5xl text-gray-900 tracking-wider">40 PLACES</p>
            <p className="font-bebas text-xl text-orange-primary tracking-wider mb-4">
              MAXIMUM
            </p>
            <div className="w-8 h-0.5 bg-orange-primary mb-4" />
            <p className="text-gray-500 text-sm mb-4">
              Places limitees pour garantir un encadrement de qualite
            </p>
            {/* Progress bar */}
            <div className="bg-gray-200 h-3 w-full">
              <div
                className="h-full bg-orange-primary transition-all duration-1000"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-gray-500 text-xs mt-2">
              {inscriptions}/40 inscrits
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
