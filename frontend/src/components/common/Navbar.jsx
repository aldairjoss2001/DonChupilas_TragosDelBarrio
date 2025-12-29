import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { ShoppingCart, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);
  const cartCount = getCartCount();

  return (
    <nav className="fixed w-full z-50 glass px-6 py-3 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <img 
          src="/logoprincipal_1.png" 
          alt="Logo Don Chupilas" 
          className="h-14 w-auto animate__animated animate__fadeInLeft"
          onError={(e) => e.target.src = 'https://via.placeholder.com/60?text=DC'}
        />
        <Link to="/">
          <span className="text-3xl font-bangers text-yellow-400 tracking-widest hidden sm:block">
            DON CHUPILAS
          </span>
        </Link>
      </div>
      
      <div className="hidden md:flex space-x-8 font-bold text-sm uppercase tracking-tighter">
        <Link to="/" className="hover:text-yellow-400 transition">
          Inicio
        </Link>
        <Link to="/catalogo" className="hover:text-yellow-400 transition">
          Licores
        </Link>
        <Link to="/promociones" className="hover:text-yellow-400 transition">
          🎁 Promociones
        </Link>
        {user && (
          <Link to="/pedidos" className="hover:text-yellow-400 transition">
            Mis Pedidos
          </Link>
        )}
      </div>

      <div className="flex gap-4 items-center">
        <Link to="/carrito" className="relative text-yellow-500 hover:text-yellow-400 transition">
          <ShoppingCart size={24} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
        
        {user ? (
          <>
            <Link to={user.rol === 'admin' ? '/admin' : user.rol === 'repartidor' ? '/delivery' : '/perfil'}>
              <button className="px-5 py-2 text-xs font-black uppercase border-2 border-yellow-500 text-yellow-500 rounded-lg hover:bg-yellow-500 hover:text-black transition flex items-center gap-2">
                <User size={16} />
                {user.nombre}
              </button>
            </Link>
            <button
              onClick={logout}
              className="px-5 py-2 text-xs font-black uppercase bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2"
            >
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="px-5 py-2 text-xs font-black uppercase border-2 border-yellow-500 text-yellow-500 rounded-lg hover:bg-yellow-500 hover:text-black transition">
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className="px-5 py-2 text-xs font-black uppercase bg-yellow-500 text-black rounded-lg btn-chupilas">
                Registro
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
