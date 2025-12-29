import { useState, useEffect, useContext } from 'react';
import { getProducts } from '../../services/productService';
import { CartContext } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { Gift, ShoppingCart, Percent, Tag } from 'lucide-react';
import { toast } from 'react-toastify';

const Promotions = () => {
  const { addToCart } = useContext(CartContext);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      // Get products with discounts
      const response = await getProducts({ activo: true });
      const productsWithDiscounts = response.data.filter(
        p => p.precioDescuento && p.precioDescuento < p.precio
      );
      setPromotions(productsWithDiscounts);
    } catch (error) {
      toast.error('Error al cargar promociones');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscount = (precio, precioDescuento) => {
    return Math.round(((precio - precioDescuento) / precio) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-yellow-500 font-bangers text-2xl">Cargando promociones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-6 pb-12">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <Gift size={80} className="text-yellow-500 animate-bounce" />
          </div>
          <h1 className="text-6xl md:text-8xl font-bangers text-yellow-500 mb-4 neon-text">
            ¡PROMOCIONES CHUPILERAS!
          </h1>
          <p className="text-xl text-gray-300">
            Ofertas que no puedes dejar pasar, Don 🍺🔥
          </p>
        </div>

        {/* Promo Banner */}
        <div className="bg-gradient-to-r from-yellow-500/20 via-yellow-600/20 to-yellow-500/20 rounded-2xl p-8 mb-12 border-2 border-yellow-500/50 text-center">
          <h2 className="text-3xl font-bangers text-yellow-500 mb-2">
            🎉 ENVÍO GRATIS EN COMPRAS MAYORES A $300 🎉
          </h2>
          <p className="text-gray-300">
            ¡Aprovecha y llena tu carrito!
          </p>
        </div>

        {promotions.length === 0 ? (
          <div className="bg-zinc-900 rounded-2xl p-12 text-center border border-yellow-500/20">
            <Tag size={64} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400 text-xl mb-6">
              No hay promociones disponibles en este momento.
            </p>
            <Link to="/catalogo">
              <button className="px-8 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition">
                Ver Catálogo Completo
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bangers text-white mb-2">
                🔥 {promotions.length} PRODUCTOS EN OFERTA 🔥
              </h2>
              <p className="text-gray-400">¡Ahorra en grande, Don!</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {promotions.map((product) => {
                const discount = calculateDiscount(product.precio, product.precioDescuento);
                
                return (
                  <div
                    key={product._id}
                    className="bg-zinc-900 rounded-2xl overflow-hidden border-2 border-yellow-500/50 product-card group relative"
                  >
                    {/* Discount Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <div className="bg-red-500 text-white px-4 py-2 rounded-full font-black text-lg shadow-lg transform rotate-12">
                        -{discount}%
                      </div>
                    </div>

                    <div className="relative h-48 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                      <img
                        src={product.imagen || 'https://via.placeholder.com/400?text=Producto'}
                        alt={product.nombre}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/400?text=Producto'}
                      />
                      <div className="absolute bottom-2 right-2 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold z-20">
                        ¡OFERTA!
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="mb-2">
                        <span className="text-xs text-yellow-500 uppercase font-bold">{product.categoria}</span>
                      </div>
                      
                      <Link to={`/producto/${product._id}`}>
                        <h3 className="text-lg font-bold mb-2 hover:text-yellow-500 transition line-clamp-2">
                          {product.nombre}
                        </h3>
                      </Link>

                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {product.descripcion}
                      </p>

                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-gray-500 line-through text-lg">${product.precio.toFixed(2)}</span>
                          <span className="text-red-500 font-bold text-sm">-${(product.precio - product.precioDescuento).toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-500 font-black text-3xl">
                            ${product.precioDescuento.toFixed(2)}
                          </span>
                          <Percent size={20} className="text-yellow-500" />
                        </div>
                      </div>

                      {product.stock > 0 ? (
                        <button
                          onClick={() => addToCart(product, 1)}
                          className="w-full py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition flex items-center justify-center gap-2"
                        >
                          <ShoppingCart size={20} />
                          ¡Lo Quiero!
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full py-3 bg-gray-700 text-gray-500 font-bold rounded-lg cursor-not-allowed"
                        >
                          Agotado
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 rounded-2xl p-8 border border-yellow-500/20 text-center">
          <h3 className="text-3xl font-bangers text-yellow-500 mb-4">
            ¿NO ENCUENTRAS LO QUE BUSCAS?
          </h3>
          <p className="text-gray-300 mb-6">
            Checa nuestro catálogo completo con más de 100 productos
          </p>
          <Link to="/catalogo">
            <button className="px-8 py-4 bg-yellow-500 text-black font-black rounded-xl text-lg hover:bg-yellow-400 transition uppercase">
              Ver Catálogo Completo
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Promotions;