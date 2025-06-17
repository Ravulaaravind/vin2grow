import api from './api';

const createOrder = async (amount) => {
  try {
    const response = await api.post('/payment/create-order', { amount });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const verifyPayment = async (paymentData) => {
  try {
    const response = await api.post('/payment/verify-payment', paymentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const initializeRazorpayPayment = (orderData, onSuccess) => {
  const options = {
    key: orderData.keyId,
    amount: orderData.amount,
    currency: orderData.currency,
    name: 'Vin2Grow',
    description: 'Payment for Vin2Grow products',
    order_id: orderData.orderId,
    handler: async (response) => {
      try {
        const verificationData = {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        };
        
        const verificationResponse = await verifyPayment(verificationData);
        if (onSuccess) {
          onSuccess(verificationResponse);
        }
      } catch (error) {
        console.error('Payment verification failed:', error);
        throw error;
      }
    },
    prefill: {
      name: '',
      email: '',
      contact: ''
    },
    theme: {
      color: '#16a34a' // Updated to match frontend's primary-600 green color
    }
  };

  const razorpayInstance = new window.Razorpay(options);
  razorpayInstance.open();
};

const paymentService = {
  createOrder,
  verifyPayment,
  initializeRazorpayPayment
};

export default paymentService; 
