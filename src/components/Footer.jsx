export default function Footer() {
  return (
    <footer className="bg-black-primary border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <span className="font-bebas text-2xl tracking-wider text-white">CD</span>
              <span className="font-bebas text-2xl tracking-wider text-orange-primary">84</span>
            </div>
            <p className="text-gray-500 text-sm">CAMP D'ETE ELITE</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Contact</p>
            <a
              href="mailto:quentinlioretct84@gmail.com"
              className="text-gray-300 text-sm hover:text-orange-primary transition-colors"
            >
              quentinlioretct84@gmail.com
            </a>
          </div>
        </div>
        <div className="w-full h-px bg-gray-700 mb-6" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            &copy; 2026 CD84 - Comite Departemental de Basketball du Vaucluse. Tous droits reserves.
          </p>
          <p className="text-gray-500 text-xs uppercase tracking-widest">
            Travail &bull; Rigueur &bull; Excellence
          </p>
        </div>
      </div>
    </footer>
  );
}
