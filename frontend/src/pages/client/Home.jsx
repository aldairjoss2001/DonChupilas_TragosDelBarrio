import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20" 
        style={{
          background: 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
        <div className="container mx-auto px-6 text-center">
          <div className="mb-6 inline-block p-4 rounded-full bg-yellow-500/10 border border-yellow-500/30 animate__animated animate__zoomIn">
            <img 
              src="/logoprincipal_1.png" 
              alt="Don Chupilas" 
              className="w-48 md:w-64 float"
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>
          <h1 className="text-7xl md:text-9xl font-bangers mb-2 animate__animated animate__fadeInDown leading-none text-white">
            TU SED ES <span className="text-yellow-500">LO PRIMERO</span>
          </h1>
          <p className="text-lg md:text-2xl mb-10 max-w-3xl mx-auto text-gray-200 font-light animate__animated animate__fadeInUp animate__delay-1s">
            En <span className="font-bold border-b-2 border-yellow-500">DON CHUPILAS</span> tenemos todo para que la fiesta no pare. Licores, snacks y envíos rápidos.
          </p>
          <div className="flex flex-wrap justify-center gap-6 animate__animated animate__fadeInUp animate__delay-1s">
            <Link to="/catalogo">
              <button className="px-10 py-5 bg-yellow-500 text-black font-black rounded-xl text-xl btn-chupilas uppercase shadow-xl">
                Ver Catálogo
              </button>
            </Link>
            <button className="px-10 py-5 bg-white/10 backdrop-blur-md border-2 border-white/20 font-black rounded-xl text-xl hover:bg-white hover:text-black transition uppercase">
              Promociones
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <i className="fa-solid fa-chevron-down text-yellow-500 text-2xl"></i>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-[#050505] relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-bangers text-white mb-4">
              ¿QUÉ TE <span className="text-yellow-500">OFRECEMOS?</span>
            </h2>
            <p className="text-gray-400 uppercase tracking-[0.3em] text-sm">Directo, rápido y confiable</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-zinc-900/50 p-10 rounded-3xl border border-white/5 hover:border-yellow-500/50 transition-all group text-center">
              <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mb-8 mx-auto transform group-hover:scale-110 transition">
                <i className="fa-solid fa-cart-shopping text-black text-3xl"></i>
              </div>
              <h3 className="text-3xl font-bangers mb-4 text-white uppercase">Compra Online</h3>
              <p className="text-gray-400 leading-relaxed">
                Elige tus botellas favoritas, snacks y hielos. Todo desde tu celular en un par de clics.
              </p>
            </div>

            <div className="bg-zinc-900/50 p-10 rounded-3xl border border-yellow-500/30 shadow-[0_0_30px_rgba(250,204,21,0.1)] group text-center">
              <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mb-8 mx-auto transform group-hover:scale-110 transition">
                <i className="fa-solid fa-truck-fast text-black text-3xl"></i>
              </div>
              <h3 className="text-3xl font-bangers mb-4 text-yellow-500 uppercase">Envío a Domicilio</h3>
              <p className="text-gray-300 leading-relaxed font-semibold">
                Te lo llevamos donde estés. Entregas rápidas para que no tengas que salir de la fiesta.
              </p>
            </div>

            <div className="bg-zinc-900/50 p-10 rounded-3xl border border-white/5 hover:border-yellow-500/50 transition-all group text-center">
              <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mb-8 mx-auto transform group-hover:scale-110 transition">
                <i className="fa-solid fa-tags text-black text-3xl"></i>
              </div>
              <h3 className="text-3xl font-bangers mb-4 text-white uppercase">Mejores Precios</h3>
              <p className="text-gray-400 leading-relaxed">
                Accede a ofertas exclusivas y descuentos por cantidad. Ahorra más mientras más compras.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
