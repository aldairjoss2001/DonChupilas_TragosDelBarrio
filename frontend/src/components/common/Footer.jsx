const Footer = () => {
  return (
    <footer className="bg-black pt-20 pb-10 border-t border-yellow-500/20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-10 mb-16 text-center lg:text-left">
          <div className="max-w-md">
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
              <img 
                src="/logoprincipal_1.png" 
                alt="Logo" 
                className="h-16 w-auto"
                onError={(e) => e.target.style.display = 'none'}
              />
              <span className="text-4xl font-bangers text-yellow-500">DON CHUPILAS</span>
            </div>
            <p className="text-gray-400 text-lg">
              La licorería de confianza. Bebidas frías, entregas rápidas y el mejor ambiente para tu reunión.
            </p>
          </div>

          <div className="flex gap-4">
            <a href="#" className="w-14 h-14 rounded-xl bg-zinc-900 border border-yellow-500/30 flex items-center justify-center text-2xl hover:bg-yellow-500 hover:text-black transition-all">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="#" className="w-14 h-14 rounded-xl bg-zinc-900 border border-yellow-500/30 flex items-center justify-center text-2xl hover:bg-yellow-500 hover:text-black transition-all">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="#" className="w-14 h-14 rounded-xl bg-zinc-900 border border-yellow-500/30 flex items-center justify-center text-2xl hover:bg-yellow-500 hover:text-black transition-all">
              <i className="fa-brands fa-tiktok"></i>
            </a>
            <a href="#" className="w-14 h-14 rounded-xl bg-zinc-900 border border-yellow-500/30 flex items-center justify-center text-2xl hover:bg-yellow-500 hover:text-black transition-all">
              <i className="fa-brands fa-whatsapp"></i>
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 text-center text-gray-600 text-[10px] uppercase tracking-widest">
          <p className="mb-2">El exceso de alcohol es perjudicial para la salud. Venta prohibida a menores de 18 años.</p>
          <p>&copy; 2024 DON CHUPILAS. TODOS LOS DERECHOS RESERVADOS.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
