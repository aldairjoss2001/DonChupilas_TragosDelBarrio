import { Outlet, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import AdminSidebar from '../admin/AdminSidebar';

const AdminLayout = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
      <div className="text-yellow-500 text-2xl font-bangers">Cargando...</div>
    </div>;
  }

  if (!user || user.rol !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <AdminSidebar />
      <main className="flex-1 p-8 ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
