import { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getSubtotal,
    getTax,
    getShipping,
    getTotal
  } = useContext(CartContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-24 px-6 pb-12">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-5xl font-bangers text-yellow-500 mb-8">CARRITO DE COMPRAS</h1>
          
          <div className="bg-zinc-900 rounded-2xl p-12 text-center border border-yellow-500/20">
            <ShoppingBag size={80} className="mx-auto mb-6 text-gray-600" />
            <p className="text-gray-400 text-xl mb-2">Tu carrito está vacío, Don.</p>
            <p className="text-gray-500 mb-8">¡Agrega algunos productos para empezar!</p>
            <Link to="/catalogo">
              <button className="px-8 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition">
                Ver Catálogo
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-6 pb-12">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bangers text-yellow-500 mb-2">CARRITO DE COMPRAS</h1>
            <p className="text-gray-400">{cartItems.length} producto(s) en tu carrito</p>
          </div>
          <Link to="/catalogo">
            <button className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition flex items-center gap-2">
              <ArrowLeft size={20} />
              Seguir Comprando
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="bg-zinc-900 rounded-xl border border-yellow-500/20 p-6">
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.imagen || 'https://via.placeholder.com/100'}
                      alt={item.nombre}
                      className="w-24 h-24 rounded-lg object-cover"
                      onError={(e) => e.target.src = 'https://via.placeholder.com/100'}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{item.nombre}</h3>
                        <p className="text-gray-400 text-sm capitalize">{item.categoria}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition"
                        title="Eliminar"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center hover:bg-zinc-700 transition"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-white font-bold text-lg w-12 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center hover:bg-zinc-700 transition"
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus size={16} />
                        </button>
                        <span className="text-gray-400 text-sm ml-2">
                          (Stock: {item.stock})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        {item.precioOriginal > item.precio && (
                          <p className="text-gray-500 line-through text-sm">
                            ${(item.precioOriginal * item.quantity).toFixed(2)}
                          </p>
                        )}
                        <p className="text-yellow-500 font-black text-2xl">
                          ${(item.precio * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <button
              onClick={clearCart}
              className="w-full py-3 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition font-bold"
            >
              Vaciar Carrito
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 rounded-xl border border-yellow-500/20 p-6 sticky top-24">
              <h2 className="text-2xl font-bangers text-yellow-500 mb-6">RESUMEN DEL PEDIDO</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${getSubtotal().toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>IVA (16%):</span>
                  <span className="font-semibold">${getTax().toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Envío:</span>
                  <span className="font-semibold">
                    {getShipping() === 0 ? (
                      <span className="text-green-500">¡GRATIS!</span>
                    ) : (
                      `$${getShipping().toFixed(2)}`
                    )}
                  </span>
                </div>

                {getSubtotal() < 300 && (
                  <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                    <p className="text-blue-400 text-xs">
                      💡 Agrega ${(300 - getSubtotal()).toFixed(2)} más para envío gratis
                    </p>
                  </div>
                )}

                <div className="border-t border-zinc-800 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold text-xl">Total:</span>
                    <span className="text-yellow-500 font-black text-3xl">
                      ${getTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-yellow-500 text-black font-black rounded-lg hover:bg-yellow-400 transition uppercase text-lg"
              >
                Proceder al Pago
              </button>

              <Link to="/catalogo">
                <button className="w-full mt-3 py-3 bg-zinc-800 text-white font-bold rounded-lg hover:bg-zinc-700 transition">
                  Continuar Comprando
                </button>
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-zinc-800">
                <p className="text-gray-400 text-xs text-center mb-3">¿Por qué comprar con nosotros?</p>
                <div className="space-y-2 text-gray-400 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Entrega en 30 minutos o menos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Productos siempre frescos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Pago seguro y confiable</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
