const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-4xl font-bangers text-yellow-500 mb-8">DASHBOARD ADMIN</h1>
      <p className="text-gray-400 mb-8">Próximamente: Gráficas de ventas y estadísticas</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-900 p-6 rounded-xl border border-yellow-500/20">
          <h3 className="text-gray-400 text-sm mb-2">Ventas del Día</h3>
          <p className="text-3xl font-bold text-yellow-500">$1,250.00</p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-xl border border-yellow-500/20">
          <h3 className="text-gray-400 text-sm mb-2">Pedidos Activos</h3>
          <p className="text-3xl font-bold text-yellow-500">12</p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-xl border border-yellow-500/20">
          <h3 className="text-gray-400 text-sm mb-2">Productos</h3>
          <p className="text-3xl font-bold text-yellow-500">87</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
