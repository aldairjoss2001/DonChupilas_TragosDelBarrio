const DeliveryDashboard = () => {
  return (
    <div>
      <h1 className="text-4xl font-bangers text-yellow-500 mb-8">DASHBOARD REPARTIDOR</h1>
      <p className="text-gray-400 mb-8">Próximamente: Vista de pedidos disponibles y estadísticas</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-zinc-900 p-6 rounded-xl border border-yellow-500/20">
          <h3 className="text-gray-400 text-sm mb-2">Entregas de Hoy</h3>
          <p className="text-3xl font-bold text-yellow-500">8</p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-xl border border-yellow-500/20">
          <h3 className="text-gray-400 text-sm mb-2">Pedidos Disponibles</h3>
          <p className="text-3xl font-bold text-yellow-500">5</p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
