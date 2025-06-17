import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import apiService from '../api/apiService';
import { toast } from 'react-hot-toast';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deliveryOTP, setDeliveryOTP] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('online'); // Default to Pay Online

  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    setOrderDetails({
      total,
      items: cart.map(item => ({
        name: item.product.name,
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      }))
    });
  }, [cart]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      if (!orderDetails || !orderDetails.total) {
        toast.error('No items in cart');
        return;
      }

      setLoading(true);
      setError(null);

      const orderPayload = {
        items: orderDetails.items,
        address: location.state?.orderData?.address,
        deliveryDate: location.state?.orderData?.deliveryDate,
        deliveryTime: location.state?.orderData?.deliveryTime,
        totalAmount: orderDetails.total, // Ensure totalAmount is part of payload for COD as well
        user: {
          name: user?.name,
          email: user?.email,
          phone: user?.phone,
        }, // Include user details in the payload
      };

      if (selectedPaymentMethod === 'online') {
        // Step 1: Create Razorpay order (not DB order)
        const razorpayOrder = await apiService.post('/payment/create-order', {
          amount: orderDetails.total,
          currency: 'INR',
          receipt: `order_${Date.now()}`
        });
  
        console.log('Razorpay Order from backend:', razorpayOrder.data);

        if (!razorpayOrder.data || !razorpayOrder.data.orderId) {
          throw new Error('Failed to create Razorpay order');
        }
  
        // Step 2: Load Razorpay script
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error('Failed to load Razorpay script');
        }
  
        // Step 3: Open Razorpay payment modal
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_LhDSZSAlf3hFaQ',
          amount: razorpayOrder.data.amount,
          currency: razorpayOrder.data.currency,
          name: 'Vin2Grow',
          description: 'Payment for your order',
          order_id: razorpayOrder.data.orderId,
          handler: async function (response) {
            try {
              const verifyResponse = await apiService.post('/payment/verify-payment', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData: {
                  ...orderPayload,
                  paymentMethod: 'Online',
                  paymentStatus: 'Paid',
                  razorpayPaymentId: response.razorpay_payment_id
                }
              });
  
              if (verifyResponse.data.success) {
                toast.success('Payment successful!');
                
                // Order is already created in the backend during payment verification
                setDeliveryOTP(verifyResponse.data.order.otp);
                await clearCart();
                navigate('/orders', {
                  state: {
                    orderId: verifyResponse.data.order._id,
                    otp: verifyResponse.data.order.otp,
                    userDetails: user,
                    orderSummary: orderDetails
                  }
                });
              } else {
                throw new Error(verifyResponse.data.error || 'Payment verification failed');
              }
            } catch (error) {
              console.error('Payment verification error:', error);
              const errorMessage = error.response?.data?.error || error.message || 'Payment verification failed';
              toast.error(errorMessage);
              setError({
                message: errorMessage,
                details: error.response?.data?.details
              });
              setLoading(false);
            }
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
            contact: user?.phone || ''
          },
          theme: {
            color: '#16a34a'
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            }
          },
        };
  
        console.log('Razorpay Options:', options);

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else if (selectedPaymentMethod === 'cod') {
        // Logic for Cash on Delivery
        orderPayload.paymentMethod = 'COD';
        orderPayload.paymentStatus = 'pending'; // Set payment status for COD
        const response = await apiService.post('/orders', orderPayload); // Use /orders endpoint for COD

        if (response.data.success) {
          toast.success('Order placed successfully (Cash on Delivery)!');
          setDeliveryOTP(response.data.order.otp); // Assuming OTP is returned in the order object
          await clearCart();
          navigate('/orders', {
            state: {
              orderId: response.data.order._id,
              otp: response.data.order.otp
            }
          });
        } else {
          throw new Error(response.data.message || 'Failed to place COD order');
        }
      } else {
        toast.error('Please select a payment method.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.response?.data?.error || 'Payment failed');
      toast.error(error.response?.data?.error || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-md p-6">
          <div className="text-center">
            <p className="text-gray-300">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-100 mb-6">Payment Details</h2>
        
        {error && (
          <div className="bg-red-900/50 text-red-400 p-4 rounded-md mb-4 border border-red-700">
            {error.message}
            {error.details && (
              <div className="text-sm mt-2">{error.details}</div>
            )}
          </div>
        )}

        {deliveryOTP && (
          <div className="bg-green-900/50 text-green-400 p-4 rounded-md mb-4 border border-green-700">
            <p className="font-semibold">Delivery OTP: {deliveryOTP}</p>
            <p className="text-sm mt-2">Please keep this OTP handy for delivery verification.</p>
          </div>
        )}

        <div className="space-y-4">
          {/* Payment Method Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-100 mb-3">Choose Payment Method</h3>
            <div className="flex items-center space-x-6">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-green-600 h-5 w-5"
                  name="paymentMethod"
                  value="online"
                  checked={selectedPaymentMethod === 'online'}
                  onChange={() => setSelectedPaymentMethod('online')}
                />
                <span className="ml-2 text-gray-300">Pay Online</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-green-600 h-5 w-5"
                  name="paymentMethod"
                  value="cod"
                  checked={selectedPaymentMethod === 'cod'}
                  onChange={() => setSelectedPaymentMethod('cod')}
                />
                <span className="ml-2 text-gray-300">Cash on Delivery</span>
              </label>
            </div>
          </div>

          <div className="border-t border-gray-600 pt-4">
            <h3 className="text-lg font-medium text-gray-100">Order Summary</h3>
            <div className="mt-4 space-y-2">
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between">
                  <span className="text-gray-300">{item.product.name} x {item.quantity}</span>
                  <span className="text-gray-300">₹{item.product.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t border-gray-600 pt-2 font-semibold">
                <div className="flex justify-between">
                  <span className="text-gray-100">Total</span>
                  <span className="text-green-400">₹{orderDetails.total}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white ${selectedPaymentMethod === 'online' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Processing...' : selectedPaymentMethod === 'online' ? 'Pay Online' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
