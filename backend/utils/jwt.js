import jwt from 'jsonwebtoken';

// Generar JWT
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Enviar respuesta con token
export const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const userData = {
    _id: user._id,
    nombre: user.nombre,
    email: user.email,
    telefono: user.telefono,
    rol: user.rol,
    avatar: user.avatar
  };

  res.status(statusCode).json({
    success: true,
    token,
    user: userData
  });
};
