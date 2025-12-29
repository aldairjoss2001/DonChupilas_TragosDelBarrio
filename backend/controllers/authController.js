import User from '../models/User.js';
import { sendTokenResponse } from '../utils/jwt.js';

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { nombre, email, password, telefono, rol } = req.body;

    // Verificar si el usuario ya existe
    const existeUsuario = await User.findOne({ email });
    if (existeUsuario) {
      return res.status(400).json({
        success: false,
        message: '¡Uy! Ese email ya está registrado, Don.'
      });
    }

    // Crear usuario
    const user = await User.create({
      nombre,
      email,
      password,
      telefono,
      rol: rol || 'cliente'
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login de usuario
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validar email y password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '¡Epa! Necesito tu email y contraseña, Don.'
      });
    }

    // Buscar usuario con password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '¡Uy! Credenciales inválidas.'
      });
    }

    // Verificar password
    const isMatch = await user.compararPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: '¡Uy! Credenciales inválidas.'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener usuario actual
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar perfil
// @route   PUT /api/auth/updateprofile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      nombre: req.body.nombre,
      telefono: req.body.telefono,
      avatar: req.body.avatar
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: '¡Perfil actualizado, Don!',
      data: user
    });
  } catch (error) {
    next(error);
  }
};
