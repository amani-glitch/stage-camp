import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useSpots } from '../context/SpotsContext';

export default function Hero() {
  const { remaining } = useSpots();
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black-primary/80 via-black-primary/70 to-black-primary z-10" />

      {/* Geometric accents */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.08),transparent_60%)]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-primary/5 blur-3xl rounded-full" />
      </div>

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block border border-orange-primary/50 text-orange-primary text-xs uppercase tracking-[0.3em] px-4 py-2 mb-8">
            Saison 2026/2027
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Orange accent line */}
          <div className="flex items-center justify-center gap-6 mb-2">
            <div className="hidden sm:block w-16 h-0.5 bg-orange-primary" />
            <h1 className="font-bebas text-[clamp(4rem,12vw,10rem)] leading-[0.85] tracking-wider">
              SUMMER<br />CAMP<br />
              <span className="text-white">CD</span>
              <span className="text-orange-primary">84</span>
            </h1>
            <div className="hidden sm:block w-16 h-0.5 bg-orange-primary" />
          </div>
        </motion.div>

        <motion.p
          className="text-gray-300 text-sm sm:text-base uppercase tracking-[0.4em] mt-6 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Travail &bull; Rigueur &bull; Excellence
        </motion.p>

        <motion.div
          className="flex flex-col items-center gap-2 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <p className="font-bebas text-2xl sm:text-3xl tracking-wider text-white">
            16 &mdash; 22 AOUT 2026
          </p>
          <p className="text-gray-500 text-sm uppercase tracking-widest">
            Sainte-Tulle (04)
          </p>
        </motion.div>

        {/* Places restantes badge */}
        <motion.div
          className="flex items-center justify-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.85 }}
        >
          <div className="bg-orange-primary/10 border border-orange-primary/40 px-6 py-3 flex items-center gap-3">
            <span className="font-bebas text-4xl sm:text-5xl text-orange-primary leading-none">{remaining}</span>
            <div className="text-left">
              <p className="text-white text-sm font-bold uppercase tracking-wider leading-tight">Places restantes</p>
              <p className="text-gray-400 text-xs uppercase tracking-widest">sur 40</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <button
            onClick={() => scrollTo('inscription')}
            className="bg-orange-primary text-black-primary font-bold uppercase tracking-widest px-8 py-4 text-sm hover:bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(249,115,22,0.3)]"
          >
            S'inscrire maintenant
          </button>
          <button
            onClick={() => scrollTo('camp')}
            className="border-2 border-orange-primary text-white font-bold uppercase tracking-widest px-8 py-4 text-sm hover:bg-orange-primary hover:text-black-primary transition-all duration-300"
          >
            Decouvrir le camp
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={() => scrollTo('camp')}
      >
        <ChevronDown className="text-orange-primary" size={32} />
      </motion.div>
    </section>
  );
}
