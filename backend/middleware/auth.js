import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Obtener token del header
      token = req.headers.authorization.split(' ')[1];

      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Obtener usuario del token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: '¡Uy! Usuario no encontrado, Don.' 
        });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ 
        success: false, 
        message: '¡Opa! Token no válido o expirado.' 
      });
    }
  }

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: '¡Epa! No tienes autorización para esto, Don.' 
    });
  }
};

// Middleware para verificar roles específicos
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: `¡Alto ahí! El rol ${req.user.rol} no tiene acceso a esta ruta.`
      });
    }
    next();
  };
};
