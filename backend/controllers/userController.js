import User from '../models/User.js';

// @desc    Obtener todos los usuarios
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar rol de usuario
// @route   PUT /api/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res, next) => {
  try {
    const { rol } = req.body;

    if (!['cliente', 'admin', 'repartidor'].includes(rol)) {
      return res.status(400).json({
        success: false,
        message: '¡Uy! Ese rol no es válido, Don.'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { rol },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '¡Uy! Usuario no encontrado.'
      });
    }

    res.status(200).json({
      success: true,
      message: '¡Rol actualizado!',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Activar/Desactivar usuario
// @route   PUT /api/users/:id/status
// @access  Private/Admin
export const updateUserStatus = async (req, res, next) => {
  try {
    const { activo } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { activo },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '¡Uy! Usuario no encontrado.'
      });
    }

    res.status(200).json({
      success: true,
      message: `Usuario ${activo ? 'activado' : 'desactivado'}!`,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
