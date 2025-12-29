import { useState, useEffect } from 'react';
import { getProducts } from '../../services/productService';
import { Link } from 'react-router-dom';
import { ShoppingCart, Filter, Search } from 'lucide-react';
import { toast } from 'react-toastify';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  const categories = [
    { value: '', label: 'Todos' },
    { value: 'cervezas', label: 'Cervezas' },
    { value: 'destilados', label: 'Destilados' },
    { value: 'vinos', label: 'Vinos' },
    { value: 'snacks', label: 'Snacks' },
    { value: 'hielos', label: 'Hielos' },
    { value: 'mezcladores', label: 'Mezcladores' },
    { value: 'combos', label: 'Combos' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts({ activo: true });
      setProducts(response.data || []);
    } catch (error) {
      toast.error('¡Uy! No pudimos cargar los productos, Don.');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter(p => p.categoria === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const addToCart = (product) => {
    // TODO: Implement cart context
    toast.success(`¡${product.nombre} agregado al carrito!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-yellow-500 font-bangers text-2xl">Cargando hidratación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-6 pb-12">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bangers text-yellow-500 mb-2">
            CATÁLOGO DE LICORES
          </h1>
          <p className="text-gray-400">¡Encuentra tu bebida favorita!</p>
        </div>

        {/* Filters */}
        <div className="bg-zinc-900 rounded-xl p-6 mb-8 border border-yellow-500/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition appearance-none cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 text-gray-400 text-sm">
            Mostrando {filteredProducts.length} de {products.length} productos
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl mb-4">¡Uy! No encontramos productos con ese filtro, Don.</p>
            <button
              onClick={() => {
                setSelectedCategory('');
                setSearchTerm('');
              }}
              className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition"
            >
              Ver Todos los Productos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 product-card group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.imagen || 'https://via.placeholder.com/400?text=Producto'}
                    alt={product.nombre}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/400?text=Producto'}
                  />
                  {product.destacado && (
                    <span className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                      ¡DESTACADO!
                    </span>
                  )}
                  {product.stock <= product.stockMinimo && product.stock > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      ¡ÚLTIMAS UNIDADES!
                    </span>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <span className="text-red-500 text-xl font-bold">AGOTADO</span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="mb-2">
                    <span className="text-xs text-yellow-500 uppercase font-bold">{product.categoria}</span>
                  </div>
                  
                  <Link to={`/producto/${product._id}`}>
                    <h3 className="text-lg font-bold mb-2 hover:text-yellow-500 transition line-clamp-2">
                      {product.nombre}
                    </h3>
                  </Link>

                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {product.descripcion}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      {product.precioDescuento && product.precioDescuento < product.precio ? (
                        <div>
                          <span className="text-gray-500 line-through text-sm">${product.precio.toFixed(2)}</span>
                          <span className="text-yellow-500 font-black text-2xl ml-2">
                            ${product.precioDescuento.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-yellow-500 font-black text-2xl">
                          ${product.precio.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {product.stock > 0 && (
                      <span className="text-gray-400 text-sm">Stock: {product.stock}</span>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className={`w-full py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
                      product.stock === 0
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-yellow-500 text-black hover:bg-yellow-400'
                    }`}
                  >
                    <ShoppingCart size={20} />
                    {product.stock === 0 ? 'Agotado' : 'Agregar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
