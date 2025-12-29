import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('donchupilas_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('donchupilas_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id);

      if (existingItem) {
        // Check if adding more won't exceed stock
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          toast.error(`¡Uy! Solo hay ${product.stock} unidades disponibles, Don.`);
          return prevItems;
        }

        toast.success(`¡${product.nombre} actualizado en el carrito!`);
        return prevItems.map(item =>
          item._id === product._id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        // Check stock before adding new item
        if (quantity > product.stock) {
          toast.error(`¡Uy! Solo hay ${product.stock} unidades disponibles, Don.`);
          return prevItems;
        }

        toast.success(`¡${product.nombre} agregado al carrito!`);
        return [...prevItems, {
          _id: product._id,
          nombre: product.nombre,
          precio: product.precioDescuento || product.precio,
          precioOriginal: product.precio,
          imagen: product.imagen,
          categoria: product.categoria,
          stock: product.stock,
          quantity: quantity
        }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
    toast.info('Producto eliminado del carrito');
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item._id === productId) {
          if (newQuantity > item.stock) {
            toast.error(`¡Uy! Solo hay ${item.stock} unidades disponibles, Don.`);
            return item;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toast.info('Carrito vaciado');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.precio * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.precio * item.quantity), 0);
  };

  const getTax = () => {
    return getSubtotal() * 0.16; // 16% IVA
  };

  const getShipping = () => {
    const subtotal = getSubtotal();
    return subtotal >= 300 ? 0 : 50; // Free shipping over $300
  };

  const getTotal = () => {
    return getSubtotal() + getTax() + getShipping();
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        getSubtotal,
        getTax,
        getShipping,
        getTotal,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
