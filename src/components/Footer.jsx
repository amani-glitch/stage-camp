export default function Footer() {
  return (
    <footer className="bg-[#FAF9F7] border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <img src="/Logo_CD84.jpeg" alt="CD84" className="h-16 w-auto" />
              <span className="font-bebas text-2xl tracking-wider text-gray-900">CD</span>
              <span className="font-bebas text-2xl tracking-wider text-orange-primary">84</span>
            </div>
            <p className="text-gray-500 text-sm">CAMP D'ETE ELITE</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Contact</p>
            <a
              href="mailto:quentinlioretct84@gmail.com"
              className="text-gray-600 text-sm hover:text-orange-primary transition-colors"
            >
              quentinlioretct84@gmail.com
            </a>
          </div>
        </div>
        <div className="w-full h-px bg-gray-200 mb-6" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            &copy; 2026 CD84 - Comite Departemental de Basketball du Vaucluse. Tous droits reserves.
          </p>
          <p className="text-gray-500 text-xs uppercase tracking-widest">
            Travail &bull; Rigueur &bull; Excellence
          </p>
        </div>
        <div className="mt-4 text-center">
          <p className="text-gray-400 text-xs">
            Site cree par <span className="text-gray-500 font-medium">Botler360</span> &bull; Licence Botler360
          </p>
        </div>
      </div>
    </footer>
  );
}
