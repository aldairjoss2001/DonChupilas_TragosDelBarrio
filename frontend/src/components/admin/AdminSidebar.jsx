import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users } from 'lucide-react';

const AdminSidebar = () => {
  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/productos', icon: Package, label: 'Productos' },
    { path: '/admin/pedidos', icon: ShoppingBag, label: 'Pedidos' },
    { path: '/admin/usuarios', icon: Users, label: 'Usuarios' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-zinc-900 border-r border-yellow-500/20 p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bangers text-yellow-500">PANEL ADMIN</h2>
        <p className="text-gray-400 text-sm">Don Chupilas</p>
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

export default AdminSidebar;
