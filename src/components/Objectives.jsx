import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Objectives() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 px-6 bg-black-secondary">
      <div ref={ref} className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-orange-primary text-sm uppercase tracking-[0.3em] mb-4">
            Un seul objectif
          </p>
          <h2 className="font-bebas text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-wider mb-8">
            LA PERFORMANCE
          </h2>
          <div className="w-16 h-0.5 bg-orange-primary mx-auto mb-8" />
          <p className="text-xl text-gray-300 mb-6 font-medium">
            Permettre a chaque participant d'aborder la saison avec un temps d'avance.
          </p>
          <p className="text-gray-500 leading-relaxed max-w-3xl mx-auto">
            Le camp d'ete du CD84 a pour objectif principal d'optimiser la preparation
            des joueurs et joueuses avant la reprise officielle de la saison. Il vise a
            renforcer l'ensemble des facteurs de performance — techniques, tactiques,
            physiques et mentaux — dans un cadre structure et exigeant.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
