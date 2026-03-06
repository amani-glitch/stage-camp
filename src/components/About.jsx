import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const stats = [
  { value: '7', label: "JOURS D'INTENSITE" },
  { value: '40', label: 'JOUEURS MAXIMUM' },
  { value: '6', label: 'COACHS QUALIFIES' },
  { value: '+50H', label: "D'ENTRAINEMENT" },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="camp" className="py-24 px-6 bg-black-primary">
      <div ref={ref} className="max-w-7xl mx-auto">
        <motion.div
          className="grid lg:grid-cols-5 gap-16 items-start"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Text */}
          <div className="lg:col-span-3">
            <p className="text-orange-primary text-sm uppercase tracking-[0.3em] mb-4">
              Bienvenue dans
            </p>
            <h2 className="font-bebas text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-wider mb-8">
              L'ELITE
            </h2>
            <div className="w-16 h-0.5 bg-orange-primary mb-8" />
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p>
                Le CD84 affirme une ambition technique forte : structurer, harmoniser
                et elever le niveau de jeu sur l'ensemble du territoire departemental.
              </p>
              <p>
                Notre priorite est de proposer un cadre d'exigence aligne avec les
                standards regionaux, en developpant la maitrise technique individuelle,
                l'intelligence tactique et la capacite d'adaptation en situation reelle.
              </p>
              <p>
                A travers ce camp, le CD84 souhaite accompagner les joueurs et joueuses
                vers un niveau de performance superieur.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="bg-black-secondary border border-gray-700 p-6 hover:border-orange-primary transition-all duration-300 hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              >
                <p className="font-bebas text-4xl sm:text-5xl text-orange-primary tracking-wider">
                  {stat.value}
                </p>
                <p className="text-gray-500 text-xs uppercase tracking-widest mt-2">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
