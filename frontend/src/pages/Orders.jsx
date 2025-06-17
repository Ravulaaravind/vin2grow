import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link, useLocation } from 'react-router-dom';
import { BACKEND_URL } from '../config';
import { motion } from 'framer-motion';
import { FaCopy } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { orders as ordersApi } from '../services/api';

// Base64 encoded placeholder image (1x1 transparent pixel)
const PLACEHOLDER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

const statusStyles = {
  delivered: 'bg-green-900 text-green-100',
  processing: 'bg-blue-900 text-blue-100',
  out_for_delivery: 'bg-yellow-900 text-yellow-100',
  'out for delivery': 'bg-yellow-900 text-yellow-100',
  pending: 'bg-gray-700 text-gray-100',
  cancelled: 'bg-red-900 text-red-100',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({ type: null, orderId: null });
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const filters = [
    { value: 'all', label: 'All Orders' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  // Calculate order statistics
  const getOrderStatistics = () => {
    const stats = {
      pending: 0,
      confirmed: 0,
      cancelled: 0,
      delivered: 0,
      out_for_delivery: 0,
      total: orders.length
    };

    orders.forEach(order => {
      const status = order.status?.toLowerCase();
      if (stats.hasOwnProperty(status)) {
        stats[status]++;
      }
    });

    return stats;
  };

  const orderStats = getOrderStatistics();

  const statisticsCards = [
    {
      title: 'Pending Orders',
      count: orderStats.pending,
      color: 'bg-amber-800 text-amber-100 border-amber-600',
      bgColor: 'bg-amber-800/20'
    },
    {
      title: 'Confirmed Orders',
      count: orderStats.confirmed,
      color: 'bg-blue-900 text-blue-100 border-blue-700',
      bgColor: 'bg-blue-900/20'
    },
    {
      title: 'Cancelled Orders',
      count: orderStats.cancelled,
      color: 'bg-red-900 text-red-100 border-red-700',
      bgColor: 'bg-red-900/20'
    },
    {
      title: 'Delivered Orders',
      count: orderStats.delivered,
      color: 'bg-green-900 text-green-100 border-green-700',
      bgColor: 'bg-green-900/20'
    }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersApi.getAll();
      if (response.data) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders');
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-800 text-amber-100',
      confirmed: 'bg-blue-900 text-blue-100',
      preparing: 'bg-purple-900 text-purple-100',
      out_for_delivery: 'bg-yellow-900 text-yellow-100',
      delivered: 'bg-green-900 text-green-100',
      cancelled: 'bg-red-900 text-red-100'
    };
    return colors[status] || 'bg-gray-700 text-gray-100';
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order? Note: Cancelled orders are non-refundable.')) {
      try {
        setActionLoading({ type: 'cancel', orderId });
        await ordersApi.cancel(orderId);
        await fetchOrders(); // Refresh orders after cancellation
        toast.success('Order cancelled successfully');
      } catch (err) {
        toast.error('Failed to cancel order. Please try again.');
      } finally {
        setActionLoading({ type: null, orderId: null });
      }
    }
  };

  const handleTrackOrder = async (order) => {
    try {
      setTrackingLoading(true);
      const response = await ordersApi.getTracking(order._id);
      setSelectedOrder({ ...order, trackingDetails: response.data.trackingDetails });
      setIsTrackingModalOpen(true);
    } catch (err) {
      toast.error('Failed to fetch tracking details');
    } finally {
      setTrackingLoading(false);
    }
  };

  const filteredOrders = orders
    .filter(order => selectedFilter === 'all' || order.status?.toLowerCase() === selectedFilter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto pt-20 px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="animate-pulse space-y-6"
          >
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-800 p-6 rounded-lg border border-green-700">
                <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto pt-20 px-4">
          <div className="bg-red-900 text-red-100 p-4 rounded-md border border-red-700">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Fixed Header for Orders Page */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-gray-900">
        {/* Header */}
        <div className="bg-gray-800 border-b border-green-700 py-4 px-6">
          <h1 className="text-2xl font-bold text-green-400">My Orders</h1>
        </div>

        {/* Order Statistics */}
        <div className="px-4 md:px-6 py-2 md:py-3 bg-gray-800 border-b border-green-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2">
            {statisticsCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${stat.bgColor} border ${stat.color.split(' ')[1]} rounded-lg p-1 md:p-2 text-center`}
              >
                <div className="text-sm md:text-lg font-bold text-white mb-1">{stat.count}</div>
                <div className="text-xs text-gray-300">{stat.title}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Filter Dropdown */}
        <div className="px-6 py-4">
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-between w-full px-4 py-2 bg-gray-800 border border-green-700 rounded-md text-green-400 hover:bg-gray-700 transition-colors"
            >
              <span>{filters.find(f => f.value === selectedFilter)?.label}</span>
              <svg
                className={`w-5 h-5 ml-2 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-10 mt-1 w-full bg-gray-800 border border-green-700 rounded-md shadow-lg"
              >
                {filters.map((filter) => (
                  <motion.div
                    key={filter.value}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button
                      onClick={() => {
                        setSelectedFilter(filter.value);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
                        selectedFilter === filter.value ? 'bg-green-900 text-green-100' : 'text-gray-300'
                      }`}
                    >
                      {filter.label}
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pt-56 pb-16">
        {location.state?.otp && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-900 border border-green-700 text-green-100 p-4 rounded-md mb-6"
          >
            <p className="font-semibold">Delivery OTP: {location.state.otp}</p>
            <p className="text-sm mt-2">Please keep this OTP handy for delivery verification.</p>
          </motion.div>
        )}

        {location.state?.userDetails && location.state?.orderSummary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-900 border border-blue-700 text-blue-100 p-4 rounded-md mb-6"
          >
            <h2 className="font-semibold text-xl mb-2">Payment Details & Order Summary</h2>
            <div className="mb-3">
              <p><span className="font-medium">Name:</span> {location.state.userDetails.name}</p>
              <p><span className="font-medium">Email:</span> {location.state.userDetails.email}</p>
              {location.state.userDetails.phone && <p><span className="font-medium">Phone:</span> {location.state.userDetails.phone}</p>}
            </div>
            <h3 className="font-medium text-lg mb-2">Ordered Items:</h3>
            <ul className="list-disc list-inside mb-3">
              {location.state.orderSummary.items.map((item, index) => (
                <li key={index} className="text-sm">
                  {item.name} x {item.quantity} - ₹{item.price}
                </li>
              ))}
            </ul>
            <p className="font-semibold text-lg">Total Amount: ₹{location.state.orderSummary.totalAmount}</p>
          </motion.div>
        )}

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800 rounded-lg shadow p-6 text-center border border-green-700"
          >
            <p className="text-gray-400">No orders found</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-800 rounded-lg shadow overflow-hidden border border-green-700"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-green-400">
                        Order #{order._id.slice(-6)}
                      </h2>
                      <p className="text-sm text-gray-400">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="border-t border-green-700 pt-4">
                    <h3 className="text-sm font-medium text-green-400 mb-2">Items</h3>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item._id} className="flex justify-between text-sm">
                          <span className="text-gray-300">{item.product?.name} x {item.quantity}</span>
                          <span className="text-green-400 font-medium">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-green-700 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-green-400">Total Amount</span>
                      <span className="text-lg font-semibold text-green-400">₹{order.totalAmount}</span>
                    </div>
                  </div>

                  <div className="border-t border-green-700 pt-4 mt-4">
                    <h3 className="text-sm font-medium text-green-400 mb-2">Delivery Details</h3>
                    <div className="text-sm text-gray-400">
                      <p>Date: {new Date(order.deliveryDate).toLocaleDateString()}</p>
                      <p>Time: {order.deliveryTime}</p>
                      {order.address && (
                        <p className="mt-2">
                          {order.address.street}<br />
                          {order.address.city}, {order.address.state}<br />
                          Pincode: {order.address.pincode}
                        </p>
                      )}
                    </div>
                  </div>

                  {order.status === 'out_for_delivery' && order.otp && (
                    <div className="border-t border-green-700 pt-4 mt-4">
                      <p className="text-sm text-gray-400">
                        Delivery OTP: <span className="font-semibold text-green-400">{order.otp}</span>
                        <button 
                          onClick={() => copyToClipboard(order.otp)}
                          className="ml-2 text-green-400 hover:text-green-300"
                        >
                          <FaCopy className="inline" />
                        </button>
                      </p>
                    </div>
                  )}

                  <div className="border-t border-green-700 pt-4 mt-4 flex flex-wrap justify-end gap-3">
                    {order.status !== 'cancelled' && order.status !== 'delivered' && order.status !== 'confirmed' && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={actionLoading.type === 'cancel' && actionLoading.orderId === order._id}
                        className="px-4 py-2 text-red-400 hover:text-red-300 disabled:opacity-50 border border-red-700 rounded-md hover:bg-red-900 transition-colors"
                      >
                        {actionLoading.type === 'cancel' && actionLoading.orderId === order._id
                          ? 'Cancelling...'
                          : 'Cancel Order'}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const copyToClipboard = (otp) => {
  navigator.clipboard.writeText(otp);
  toast.success('OTP copied to clipboard!');
};

export default Orders;