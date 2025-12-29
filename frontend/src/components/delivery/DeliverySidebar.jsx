import { NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { LayoutDashboard, Package, LogOut } from 'lucide-react';

const DeliverySidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/delivery', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/delivery/pedidos', icon: Package, label: 'Pedidos' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-zinc-900 border-r border-yellow-500/20 p-6 flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bangers text-yellow-500">REPARTIDOR</h2>
        <p className="text-gray-400 text-sm">Don Chupilas Delivery</p>
      </div>

      <nav className="space-y-2 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-yellow-500 text-black font-bold'
                  : 'text-gray-300 hover:bg-zinc-800'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/20 transition w-full mt-4"
      >
        <LogOut size={20} />
        <span>Cerrar Sesión</span>
      </button>
    </aside>
  );
};

export default DeliverySidebar;
