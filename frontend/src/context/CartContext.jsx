import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import apiService from '../api/apiService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Load cart from backend on initial load and when user changes
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setCart([]);
        setLoading(false);
        setError(null);
        setInitialized(true);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await apiService.get('/cart');
        console.log('Cart API response:', response.data);
        
        if (response.data?.items) {
          console.log('Cart items:', response.data.items);
          // Validate cart items structure
          const validItems = response.data.items.filter(item => {
            if (!item.product || !item.product._id) {
              console.warn('Invalid cart item found:', item);
              return false;
            }
            return true;
          });
          
          if (validItems.length !== response.data.items.length) {
            console.warn(`Filtered out ${response.data.items.length - validItems.length} invalid cart items`);
          }
          
          setCart(validItems);
        } else {
          setCart([]);
        }
      } catch (err) {
        console.error('Error fetching cart:', err);
        if (err.response?.status === 404) {
          // If cart not found, it's not an error - just empty cart
          setCart([]);
          setError(null);
        } else {
          setError('Failed to load cart');
          setCart([]);
        }
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    fetchCart();
  }, [user]);

  const addToCart = async (product) => {
    try {
      if (!user) {
        toast.error('Please login to add items to cart');
        navigate('/login');
        return;
      }

      if (!product || !product._id) {
        throw new Error('Invalid product data');
      }

      // Ensure all required product fields are present
      const cartItem = {
        productId: product._id,
        quantity: product.quantity || 1,
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          length: product.length,
          width: product.width,
          height: product.height,
          images: Array.isArray(product.images) ? product.images : product.image ? [product.image] : [],
          discount: product.discount || 0,
          minOrder: product.minOrder || 1,
          maxOrder: product.maxOrder || 100,
          stock: product.stock || 0
        }
      };

      console.log('Adding to cart:', cartItem);
      const response = await apiService.post('/cart/items', cartItem);
      
      if (response.data?.items) {
        setCart(response.data.items);
        // toast.success('Added to cart successfully!');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.response?.status === 403) {
        toast.error('Please login to add items to cart');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.error || 'Failed to add to cart');
      }
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Find the cart item to get its product ID
      const cartItem = cart.find(item => item._id === itemId);
      if (!cartItem) {
        throw new Error('Item not found in cart');
      }

      // Check if product and product._id exist
      if (!cartItem.product || !cartItem.product._id) {
        console.error('Cart item missing product or product._id:', cartItem);
        throw new Error('Invalid cart item: missing product information');
      }

      const response = await apiService.delete(`/cart/items/${cartItem.product._id}`);
      if (response.data?.items) {
        setCart(response.data.items);
        toast.success('Item removed from cart');
      } else {
        setCart([]);
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove from cart');
      // Refresh cart to ensure sync with server
      try {
        const response = await apiService.get('/cart');
        setCart(response.data?.items || []);
      } catch (refreshError) {
        console.error('Error refreshing cart:', refreshError);
        setCart([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      if (!itemId) {
        throw new Error('Cart item ID is required');
      }

      // Find the cart item to get its product ID
      const cartItem = cart.find(item => item._id === itemId);
      if (!cartItem) {
        throw new Error('Item not found in cart');
      }

      // Check if product and product._id exist
      if (!cartItem.product || !cartItem.product._id) {
        console.error('Cart item missing product or product._id:', cartItem);
        throw new Error('Invalid cart item: missing product information');
      }

      // Use the correct endpoint for updating cart item quantity
      const response = await apiService.patch(`/cart/items/${cartItem.product._id}`, { 
        quantity 
      });

      if (response.data?.items) {
        setCart(response.data.items);
        toast.success('Quantity updated successfully');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error(error.response?.data?.error || 'Failed to update quantity');
      // Refresh cart to ensure sync with server
      try {
        const response = await apiService.get('/cart');
        setCart(response.data?.items || []);
      } catch (refreshError) {
        console.error('Error refreshing cart:', refreshError);
        setCart([]);
      }
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);
      await apiService.delete('/cart');
      setCart([]);
      setError(null);
    } catch (error) {
      console.error('Error clearing cart:', error);
      setError('Failed to clear cart');
      // Refresh cart to ensure sync with server
      try {
        const response = await apiService.get('/cart');
        setCart(response.data?.items || []);
      } catch (refreshError) {
        console.error('Error refreshing cart:', refreshError);
        setCart([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      if (!item?.product?.price || !item?.quantity) return total;
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + (item?.quantity || 0), 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        initialized,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext; 
