import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, MapPin } from 'lucide-react';

const DeliverySidebar = () => {
  const navItems = [
    { path: '/delivery', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/delivery/pedidos', icon: Package, label: 'Pedidos' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-zinc-900 border-r border-yellow-500/20 p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bangers text-yellow-500">REPARTIDOR</h2>
        <p className="text-gray-400 text-sm">Don Chupilas Delivery</p>
      </div>

      <nav className="space-y-2">
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
    </aside>
  );
};

export default DeliverySidebar;
