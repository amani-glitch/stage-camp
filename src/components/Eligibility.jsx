import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check, AlertTriangle } from 'lucide-react';

const criteria = [
  'Joueurs/joueuses U11, U12, U13 en selections departementales Vaucluse',
  'Joueurs/joueuses U13 et U15 evoluant au niveau regional',
  'Profils engages, investis dans un projet de progression',
];

export default function Eligibility() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 px-6 bg-black-secondary">
      <div ref={ref} className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-orange-primary text-sm uppercase tracking-[0.3em] mb-4">
            Qui peut
          </p>
          <h2 className="font-bebas text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-wider mb-12">
            PARTICIPER ?
          </h2>

          <div className="space-y-6 mb-8">
            {criteria.map((c, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              >
                <Check className="text-orange-primary mt-1 flex-shrink-0" size={22} />
                <p className="text-gray-300 text-lg">{c}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="flex items-start gap-4 bg-orange-primary/10 border border-orange-primary/30 p-5 mb-12"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <AlertTriangle className="text-orange-primary mt-0.5 flex-shrink-0" size={22} />
            <p className="text-orange-hover font-medium">
              Ce n'est pas un stage decouverte. Niveau minimum requis.
            </p>
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <p className="font-bebas text-2xl tracking-wider mb-6">
              Tu as le niveau ? Rejoins l'elite.
            </p>
            <button
              onClick={() =>
                document.getElementById('inscription')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="bg-orange-primary text-black-primary font-bold uppercase tracking-widest px-8 py-4 text-sm hover:bg-white transition-all duration-300 hover:-translate-y-0.5"
            >
              Verifier mon eligibilite
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
