import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Dumbbell, Target, Brain, Heart } from 'lucide-react';

const pillars = [
  {
    num: '01',
    title: 'PHYSIQUE',
    icon: Dumbbell,
    desc: "Developper les qualites physiques essentielles : force, vitesse, endurance, explosivite.",
  },
  {
    num: '02',
    title: 'TECHNIQUE',
    icon: Target,
    desc: "Renforcer les fondamentaux individuels et la precision gestuelle pour une efficacite maximale en match.",
  },
  {
    num: '03',
    title: 'MENTAL',
    icon: Brain,
    desc: "Developper la concentration, la confiance en soi et la gestion des emotions. Attitude competitive et resiliente.",
  },
  {
    num: '04',
    title: 'HYGIENE DE VIE',
    icon: Heart,
    desc: "Nutrition, hydratation, sommeil, recuperation. Les bases d'une performance durable.",
  },
];

export default function Pillars() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 px-6 bg-black-primary">
      <div ref={ref} className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-orange-primary text-sm uppercase tracking-[0.3em] mb-4">
            Les 4 piliers
          </p>
          <h2 className="font-bebas text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-wider">
            DE LA PERFORMANCE
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.num}
                className="bg-black-secondary border border-gray-700 p-8 group hover:border-orange-primary transition-all duration-300 hover:-translate-y-2"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                <Icon
                  className="text-orange-primary mb-6 group-hover:scale-110 transition-transform duration-300"
                  size={36}
                  strokeWidth={1.5}
                />
                <span className="text-gray-700 font-bebas text-5xl">{p.num}</span>
                <h3 className="font-bebas text-2xl tracking-wider mt-2 mb-4">
                  {p.title}
                </h3>
                <div className="w-8 h-0.5 bg-orange-primary mb-4" />
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
