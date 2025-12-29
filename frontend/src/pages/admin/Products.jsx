import { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService';
import { Plus, Edit2, Trash2, Package, DollarSign, Image as ImageIcon, X } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    precioDescuento: '',
    categoria: 'cervezas',
    subcategoria: '',
    imagen: '',
    stock: '',
    stockMinimo: '5',
    marca: '',
    volumen: '',
    graduacionAlcoholica: '',
    destacado: false,
    activo: true
  });

  const categories = ['cervezas', 'destilados', 'vinos', 'snacks', 'hielos', 'mezcladores', 'combos'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts({ activo: undefined }); // Get all products
      setProducts(response.data || []);
    } catch (error) {
      toast.error('Error al cargar productos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const productData = {
        ...formData,
        precio: parseFloat(formData.precio),
        precioDescuento: formData.precioDescuento ? parseFloat(formData.precioDescuento) : undefined,
        stock: parseInt(formData.stock),
        stockMinimo: parseInt(formData.stockMinimo),
        graduacionAlcoholica: formData.graduacionAlcoholica ? parseFloat(formData.graduacionAlcoholica) : undefined
      };

      if (editingProduct) {
        await updateProduct(editingProduct._id, productData);
        toast.success('¡Producto actualizado, Don!');
      } else {
        await createProduct(productData);
        toast.success('¡Producto agregado al catálogo, Don!');
      }

      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error(error.message || 'Error al guardar producto');
      console.error(error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio.toString(),
      precioDescuento: product.precioDescuento?.toString() || '',
      categoria: product.categoria,
      subcategoria: product.subcategoria || '',
      imagen: product.imagen,
      stock: product.stock.toString(),
      stockMinimo: product.stockMinimo.toString(),
      marca: product.marca || '',
      volumen: product.volumen || '',
      graduacionAlcoholica: product.graduacionAlcoholica?.toString() || '',
      destacado: product.destacado,
      activo: product.activo
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este producto?')) return;

    try {
      await deleteProduct(id);
      toast.success('¡Producto eliminado!');
      fetchProducts();
    } catch (error) {
      toast.error('Error al eliminar producto');
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      precioDescuento: '',
      categoria: 'cervezas',
      subcategoria: '',
      imagen: '',
      stock: '',
      stockMinimo: '5',
      marca: '',
      volumen: '',
      graduacionAlcoholica: '',
      destacado: false,
      activo: true
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-yellow-500 text-2xl font-bangers">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bangers text-yellow-500 mb-2">GESTIÓN DE PRODUCTOS</h1>
          <p className="text-gray-400">Total: {products.length} productos</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            resetForm();
            setShowModal(true);
          }}
          className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition flex items-center gap-2"
        >
          <Plus size={20} />
          Agregar Producto
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-zinc-900 rounded-xl border border-yellow-500/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-800 border-b border-yellow-500/20">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-yellow-500">Producto</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-yellow-500">Categoría</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-yellow-500">Precio</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-yellow-500">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-yellow-500">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-yellow-500">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.imagen || 'https://via.placeholder.com/60'}
                        alt={product.nombre}
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/60'}
                      />
                      <div>
                        <p className="font-semibold text-white">{product.nombre}</p>
                        <p className="text-xs text-gray-400">{product.marca}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded uppercase font-bold">
                      {product.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white font-bold">${product.precio.toFixed(2)}</p>
                      {product.precioDescuento && (
                        <p className="text-xs text-gray-400 line-through">${product.precioDescuento.toFixed(2)}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${
                      product.stock === 0 ? 'text-red-500' :
                      product.stock <= product.stockMinimo ? 'text-yellow-500' :
                      'text-green-500'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs px-2 py-1 rounded w-fit ${
                        product.activo ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                      }`}>
                        {product.activo ? 'Activo' : 'Inactivo'}
                      </span>
                      {product.destacado && (
                        <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded w-fit">
                          Destacado
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 bg-blue-500/20 text-blue-500 rounded-lg hover:bg-blue-500/30 transition"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No hay productos registrados. ¡Agrega el primero!
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-yellow-500/20">
            <div className="sticky top-0 bg-zinc-900 border-b border-yellow-500/20 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bangers text-yellow-500">
                {editingProduct ? 'EDITAR PRODUCTO' : 'NUEVO PRODUCTO'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingProduct(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-300 mb-2">Nombre del Producto</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-300 mb-2">Descripción</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Categoría</label>
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Marca</label>
                  <input
                    type="text"
                    name="marca"
                    value={formData.marca}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Precio</label>
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Precio con Descuento</label>
                  <input
                    type="number"
                    name="precioDescuento"
                    value={formData.precioDescuento}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Stock Mínimo</label>
                  <input
                    type="number"
                    name="stockMinimo"
                    value={formData.stockMinimo}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Volumen</label>
                  <input
                    type="text"
                    name="volumen"
                    value={formData.volumen}
                    onChange={handleChange}
                    placeholder="ej: 750ml, 355ml"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Graduación Alcohólica (%)</label>
                  <input
                    type="number"
                    name="graduacionAlcoholica"
                    value={formData.graduacionAlcoholica}
                    onChange={handleChange}
                    step="0.1"
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-300 mb-2">URL de Imagen</label>
                  <input
                    type="url"
                    name="imagen"
                    value={formData.imagen}
                    onChange={handleChange}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="destacado"
                      checked={formData.destacado}
                      onChange={handleChange}
                      className="w-5 h-5"
                    />
                    <span className="text-gray-300 font-semibold">Destacado</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="activo"
                      checked={formData.activo}
                      onChange={handleChange}
                      className="w-5 h-5"
                    />
                    <span className="text-gray-300 font-semibold">Activo</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition"
                >
                  {editingProduct ? 'Actualizar' : 'Crear'} Producto
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="flex-1 py-3 bg-zinc-700 text-white font-bold rounded-lg hover:bg-zinc-600 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
