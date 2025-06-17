import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAddress } from '../context/AddressContext';
import { FaTrash, FaPlus, FaMinus, FaMapMarkerAlt, FaShoppingBag, FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { Loader } from '../components/Loader';
import { BACKEND_URL } from '../config';

const getImageUrl = (img) => {
  if (!img) return '/placeholder.svg';
  return img.startsWith('http') ? img : BACKEND_URL + img.replace(/^\/+/, '');
};

const Cart = () => {
  const navigate = useNavigate();
  const { cart, loading: cartLoading, error: cartError, initialized, updateQuantity, removeFromCart, clearCart } = useCart();
  const { addresses, selectedAddress, loading: addressLoading, selectAddress } = useAddress();
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!cartLoading) {
      setIsLoading(false);
    }
  }, [cartLoading]);

  const subtotal = cart?.reduce((total, item) => {
    if (!item || !item.product?.price || !item.quantity) return total;
    return total + (item.product.price * item.quantity);
  }, 0) || 0;

  const total = subtotal;

  const getDeliveryDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    
    return dates;
  };

  const timeSlots = [
    { value: '06:00-08:00', label: '6 AM - 8 AM' },
    { value: '08:00-10:00', label: '8 AM - 10 AM' },
    { value: '16:00-18:00', label: '4 PM - 6 PM' },
    { value: '18:00-20:00', label: '6 PM - 8 PM' }
  ];

  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      setIsLoading(true);
      const item = cart?.find(item => item._id === itemId);
      if (!item) {
        toast.error('Item not found in cart');
        return;
      }

      const minOrder = item.product?.minOrder || 1;
      const maxOrder = item.product?.maxOrder || 100;

      if (newQuantity < minOrder) {
        toast.error(`Minimum order quantity is ${minOrder}`);
        return;
      }

      if (newQuantity > maxOrder) {
        toast.error(`Maximum order quantity is ${maxOrder}`);
        return;
      }

      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      setIsLoading(true);
      const item = cart.find(item => item._id === itemId);
      if (!item) {
        toast.error('Item not found in cart');
        return;
      }
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item from cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        setIsLoading(true);
        await clearCart();
        toast.success('Cart cleared successfully');
      } catch (error) {
        console.error('Error clearing cart:', error);
        toast.error('Failed to clear cart');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCheckout = () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    if (!selectedDeliveryDate || !selectedTimeSlot) {
      toast.error('Please select delivery date and time');
      return;
    }

    const orderData = {
      items: cart || [],
      subtotal,
      total,
      address: selectedAddress,
      deliveryDate: selectedDeliveryDate,
      deliveryTime: selectedTimeSlot
    };

    navigate('/payment', { state: { orderData } });
  };

  if (!initialized || cartLoading || addressLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (cartError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{cartError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-green-400 mb-4">Shopping Cart</h1>
              <div className="w-20 h-1 bg-green-600 mx-auto rounded-full mb-4"></div>
              <div className="text-sm text-gray-400 mb-2">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <FaShoppingBag className="h-24 w-24 text-gray-600 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-200 mb-4">Your cart is empty</h2>
              <p className="text-gray-400 mb-8">Looks like you haven't added any items to your cart yet.</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/products')}
                className="bg-green-700 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors"
              >
                Continue Shopping
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-green-400 mb-4">Shopping Cart</h1>
            <div className="w-20 h-1 bg-green-600 mx-auto rounded-full mb-4"></div>
            <div className="text-sm text-gray-400 mb-2">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-green-700">
                <div className="divide-y divide-green-700">
                  {cart.map((item, index) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-6 flex items-center gap-6"
                    >
                      <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-700 border border-green-700">
                        <img
                          src={getImageUrl(item?.product?.images?.[0])}
                          alt={item?.product?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4">
                          <h3 className="text-lg font-medium text-gray-200 truncate flex-1">{item?.product?.name}</h3>
                          <div className="flex items-center gap-2">
                            <p className="text-lg font-medium text-green-400">₹{item?.product?.price * item.quantity}</p>
                            <button
                              onClick={() => handleRemoveItem(item._id)}
                              disabled={isLoading}
                              className="w-8 h-8 flex items-center justify-center rounded-full border border-green-700 text-green-400 hover:bg-gray-700 hover:text-green-300 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Remove item"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-gray-400">
                          ₹{item?.product?.price} per {
                            item?.product?.length && item?.product?.width && item?.product?.height
                              ? <span><span className="text-gray-300 font-semibold">Length:</span>{item.product.length} × <span className="text-gray-300 font-semibold">Width:</span>{item.product.width} × <span className="text-gray-300 font-semibold">Height:</span>{item.product.height} cm</span>
                              : 'item'
                          }
                        </p>
                        <div className="mt-4 flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            disabled={isLoading || item.quantity <= (item.product?.minOrder || 1)}
                            className="text-green-400 hover:text-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-green-700 rounded-full w-8 h-8 flex items-center justify-center"
                          >
                            <FaMinus />
                          </button>
                          <span className="mx-2 text-gray-200 font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            disabled={isLoading || item.quantity >= (item.product?.maxOrder || 100)}
                            className="text-green-400 hover:text-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-green-700 rounded-full w-8 h-8 flex items-center justify-center"
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClearCart}
                disabled={isLoading}
                className="mt-6 flex items-center px-4 py-2 text-red-400 hover:text-red-300 bg-gray-800 hover:bg-gray-700 border border-red-700 rounded-md transition-colors"
              >
                <FaTrash className="mr-2" />
                Clear Cart
              </motion.button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-xl shadow-sm p-6 border border-green-700">
                <h2 className="text-lg font-medium text-green-400 mb-4">Order Summary</h2>
                
                {/* Delivery Address */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-green-400 mb-2">Delivery Address</h3>
                  {addresses && addresses.length > 0 ? (
                    <div className="space-y-2">
                      {addresses.map((address) => (
                        <motion.div
                          key={address._id}
                          whileHover={{ scale: 1.01 }}
                          onClick={() => selectAddress(address)}
                          className={`p-3 border rounded-md cursor-pointer transition-colors ${selectedAddress?._id === address._id ? 'border-green-500 bg-gray-700' : 'border-gray-700 hover:border-green-500'}`}
                        >
                          <div className="flex items-start">
                            <FaMapMarkerAlt className="text-green-500 mt-1 mr-2" />
                            <div>
                              <p className="text-sm text-gray-200">{address.street}</p>
                              <p className="text-sm text-gray-400">{address.city}, {address.state} {address.pincode}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/address')}
                        className="w-full text-sm text-green-400 hover:text-green-300 transition-colors"
                      >
                        + Add New Address
                      </motion.button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-400 mb-2">No addresses found</p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/address')}
                        className="text-sm text-green-400 hover:text-green-300 transition-colors"
                      >
                        Add Address
                      </motion.button>
                    </div>
                  )}
                </div>
                
                {/* Delivery Date & Time */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-green-400 mb-1">Delivery Date</label>
                    <select
                      value={selectedDeliveryDate}
                      onChange={(e) => setSelectedDeliveryDate(e.target.value)}
                      className="w-full bg-gray-700 border-gray-700 text-gray-200 rounded-md focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="" className="text-gray-400">Select a date</option>
                      {getDeliveryDates().map((date) => (
                        <option key={date.value} value={date.value} className="text-gray-200">{date.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-400 mb-1">Delivery Time</label>
                    <select
                      value={selectedTimeSlot}
                      onChange={(e) => setSelectedTimeSlot(e.target.value)}
                      className="w-full bg-gray-700 border-gray-700 text-gray-200 rounded-md focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="" className="text-gray-400">Select a time slot</option>
                      {timeSlots.map((slot) => (
                        <option key={slot.value} value={slot.value} className="text-gray-200">{slot.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Order Total */}
                <div className="border-t border-green-700 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="font-medium text-gray-200">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-lg font-medium">
                    <span className="text-gray-200">Total</span>
                    <span className="text-green-400">₹{total}</span>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  disabled={isLoading || !selectedAddress || !selectedDeliveryDate || !selectedTimeSlot}
                  className="mt-6 w-full bg-green-700 text-white py-3 px-4 rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Processing...' : 'Proceed to Checkout'}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;