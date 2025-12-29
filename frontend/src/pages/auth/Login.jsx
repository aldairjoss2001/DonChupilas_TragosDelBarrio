import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      toast.success('¡Bienvenido de vuelta, Don!');
      // Redirigir según el rol
      if (result.user.rol === 'admin') {
        navigate('/admin');
      } else if (result.user.rol === 'repartidor') {
        navigate('/delivery');
      } else {
        navigate('/');
      }
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-6">
      <div className="max-w-md w-full bg-zinc-900 rounded-2xl p-8 border border-yellow-500/20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bangers text-yellow-500 mb-2">¡BIENVENIDO!</h1>
          <p className="text-gray-400">Entra para seguir la fiesta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-yellow-500 text-black font-black rounded-lg hover:bg-yellow-400 transition uppercase"
          >
            Entrar
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-yellow-500 font-bold hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
