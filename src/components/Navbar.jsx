import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-200'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => scrollTo('hero')} className="flex items-center gap-3">
          <img src="/Logo_CD84.jpeg" alt="CD84" className="h-10 w-auto" />
          <span className="font-bebas text-3xl tracking-wider text-gray-900">CD</span>
          <span className="font-bebas text-3xl tracking-wider text-orange-primary">84</span>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollTo('hero')} className="text-sm uppercase tracking-widest text-gray-600 hover:text-orange-primary transition-colors">
            Accueil
          </button>
          <button onClick={() => scrollTo('camp')} className="text-sm uppercase tracking-widest text-gray-600 hover:text-orange-primary transition-colors">
            Le Camp
          </button>
          <button onClick={() => scrollTo('programme')} className="text-sm uppercase tracking-widest text-gray-600 hover:text-orange-primary transition-colors">
            Programme
          </button>
          <button onClick={() => scrollTo('inscription')} className="bg-orange-primary text-white font-bold text-sm uppercase tracking-widest px-6 py-3 hover:bg-orange-dark transition-all duration-300 hover:-translate-y-0.5">
            S'inscrire
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-gray-900"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu de navigation"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-md border-t border-gray-200">
          <div className="flex flex-col items-center gap-6 py-8">
            <button onClick={() => scrollTo('hero')} className="text-sm uppercase tracking-widest text-gray-600 hover:text-orange-primary transition-colors">
              Accueil
            </button>
            <button onClick={() => scrollTo('camp')} className="text-sm uppercase tracking-widest text-gray-600 hover:text-orange-primary transition-colors">
              Le Camp
            </button>
            <button onClick={() => scrollTo('programme')} className="text-sm uppercase tracking-widest text-gray-600 hover:text-orange-primary transition-colors">
              Programme
            </button>
            <button onClick={() => scrollTo('inscription')} className="bg-orange-primary text-white font-bold text-sm uppercase tracking-widest px-6 py-3 hover:bg-orange-dark transition-all duration-300">
              S'inscrire
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
