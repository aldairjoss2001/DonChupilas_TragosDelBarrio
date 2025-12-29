import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import ClientLayout from './components/layouts/ClientLayout';
import AdminLayout from './components/layouts/AdminLayout';
import DeliveryLayout from './components/layouts/DeliveryLayout';

// Pages - Cliente
import Home from './pages/client/Home';
import Catalog from './pages/client/Catalog';
import ProductDetail from './pages/client/ProductDetail';
import Cart from './pages/client/Cart';
import Checkout from './pages/client/Checkout';
import OrderTracking from './pages/client/OrderTracking';
import MyOrders from './pages/client/MyOrders';
import Profile from './pages/client/Profile';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Pages - Admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminUsers from './pages/admin/Users';

// Pages - Repartidor
import DeliveryDashboard from './pages/delivery/Dashboard';
import DeliveryOrders from './pages/delivery/Orders';
import DeliveryRoute from './pages/delivery/Route';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas de Cliente */}
          <Route path="/" element={<ClientLayout />}>
            <Route index element={<Home />} />
            <Route path="catalogo" element={<Catalog />} />
            <Route path="producto/:id" element={<ProductDetail />} />
            <Route path="carrito" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="pedidos" element={<MyOrders />} />
            <Route path="tracking/:id" element={<OrderTracking />} />
            <Route path="perfil" element={<Profile />} />
          </Route>

          {/* Rutas de Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="productos" element={<AdminProducts />} />
            <Route path="pedidos" element={<AdminOrders />} />
            <Route path="usuarios" element={<AdminUsers />} />
          </Route>

          {/* Rutas de Repartidor */}
          <Route path="/delivery" element={<DeliveryLayout />}>
            <Route index element={<DeliveryDashboard />} />
            <Route path="pedidos" element={<DeliveryOrders />} />
            <Route path="ruta/:id" element={<DeliveryRoute />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
