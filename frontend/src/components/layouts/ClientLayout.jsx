import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const ClientLayout = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default ClientLayout;
