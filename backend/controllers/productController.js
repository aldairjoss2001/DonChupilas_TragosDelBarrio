import Product from '../models/Product.js';

// @desc    Obtener todos los productos
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const { categoria, search, destacado, activo } = req.query;
    
    let query = {};

    // Filtrar por categoría
    if (categoria) {
      query.categoria = categoria;
    }

    // Filtrar por búsqueda de texto
    if (search) {
      query.$text = { $search: search };
    }

    // Filtrar por destacado
    if (destacado !== undefined) {
      query.destacado = destacado === 'true';
    }

    // Filtrar por activo
    if (activo !== undefined) {
      query.activo = activo === 'true';
    } else {
      query.activo = true; // Por defecto solo mostrar productos activos
    }

    const products = await Product.find(query)
      .sort({ destacado: -1, ventas: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener un producto
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '¡Uy! Ese producto no existe, Don.'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Crear producto
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: '¡Producto agregado al catálogo, Don!',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar producto
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '¡Uy! Ese producto no existe, Don.'
      });
    }

    res.status(200).json({
      success: true,
      message: '¡Producto actualizado, Don!',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Eliminar producto
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '¡Uy! Ese producto no existe, Don.'
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: '¡Producto eliminado del catálogo, Don!',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
