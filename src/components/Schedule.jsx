import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const schedule = [
  { time: '07:30', label: 'REVEIL' },
  { time: '08:00', label: 'PETIT DEJEUNER' },
  { time: '08:30', label: 'PREPARATION PHYSIQUE' },
  { time: '10:00', label: 'ATELIERS TECHNIQUES' },
  { time: '12:15', label: 'REPAS' },
  { time: '13:00', label: 'RECUPERATION' },
  { time: '15:00', label: 'DEBAT PERFORMANCE' },
  { time: '16:15', label: 'TRAVAIL PRE-COLLECTIF' },
  { time: '19:00', label: 'REPAS DU SOIR' },
  { time: '20:00', label: 'MATCHS A THEME' },
  { time: '22:30', label: 'COUCHER' },
];

export default function Schedule() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="programme" className="py-24 px-6 bg-black-primary">
      <div ref={ref} className="max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-orange-primary text-sm uppercase tracking-[0.3em] mb-4">
            Une journee
          </p>
          <h2 className="font-bebas text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-wider">
            AU CAMP
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[4.5rem] sm:left-24 top-0 bottom-0 w-px bg-gray-700" />

          <div className="space-y-0">
            {schedule.map((item, i) => (
              <motion.div
                key={item.time}
                className="flex items-center gap-4 sm:gap-6 py-4 group"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <span className="font-bebas text-xl sm:text-2xl text-gray-500 w-16 sm:w-20 text-right tracking-wider group-hover:text-orange-primary transition-colors">
                  {item.time}
                </span>
                <div className="relative z-10 w-3 h-3 bg-orange-primary rounded-full ring-4 ring-black-primary flex-shrink-0 group-hover:scale-125 transition-transform" />
                <span className="text-sm sm:text-base text-gray-300 uppercase tracking-widest group-hover:text-white transition-colors">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.p
          className="text-center mt-12 font-bebas text-2xl text-orange-primary tracking-wider"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
        >
          +50 HEURES D'ENTRAINEMENT SUR 7 JOURS
        </motion.p>
      </div>
    </section>
  );
}
