import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import adminApi from "../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.orders.getAll();
      if (response.data) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setIsUpdating(true);
      const response = await adminApi.orders.updateStatus(orderId, newStatus);

      if (response.data) {
        setOrders(
          orders.map((order) =>
            order._id === orderId ? response.data.order : order
          )
        );
        toast.success(`Order status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      setIsUpdating(true);
      const response = await adminApi.orders.updateStatus(orderId, "cancelled");

      if (response.data) {
        setOrders(
          orders.map((order) =>
            order._id === orderId ? response.data.order : order
          )
        );
        toast.success("Order cancelled successfully");
      }
    } catch (error) {
      console.error("Failed to cancel order:", error);
      toast.error("Failed to cancel order");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return timeString;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-900 text-yellow-300";
      case "confirmed":
        return "bg-blue-900 text-blue-300";
      case "preparing":
        return "bg-purple-900 text-purple-300";
      case "out_for_delivery":
        return "bg-orange-900 text-orange-300";
      case "delivered":
        return "bg-green-900 text-green-300";
      case "cancelled":
        return "bg-red-900 text-red-300";
      default:
        return "bg-gray-700 text-gray-300";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "confirmed":
        return "Confirmed";
      case "preparing":
        return "Preparing";
      case "out_for_delivery":
        return "Out for Delivery";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-900 min-h-screen pb-20 md:pb-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-3xl font-bold text-white">Orders Management</h1>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center"
          disabled={isLoading}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 mr-2" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" 
              clipRule="evenodd" 
            />
          </svg>
          {isLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-green-600">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Delivery Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-4 text-center text-gray-400 text-sm"
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-700">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                      #{order._id.slice(-6)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                      {order.user?.name || "N/A"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-green-400">
                      ₹{order.totalAmount}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className={`px-2 py-1 rounded-md text-xs font-semibold ${getStatusColor(
                          order.status
                        )} focus:outline-none focus:ring-1 focus:ring-green-500`}
                        disabled={
                          isUpdating ||
                          order.status === "cancelled" ||
                          order.status === "delivered"
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="out_for_delivery">
                          Out for Delivery
                        </option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(order.deliveryDate)} at{" "}
                      {formatTime(order.deliveryTime)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="text-blue-400 hover:text-blue-300 mr-3 text-xs px-2 py-1 rounded bg-gray-700"
                      >
                        View
                      </button>
                      {order.status !== "cancelled" &&
                        order.status !== "delivered" && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded bg-gray-700"
                          >
                            Cancel
                          </button>
                        )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh] border border-green-600">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Order Details</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-green-400 mb-3">Order Information</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-300">Order ID: <span className="text-white">#{selectedOrder._id.slice(-6)}</span></p>
                  <p className="text-gray-300">Customer: <span className="text-white">{selectedOrder.user?.name || "N/A"}</span></p>
                  <p className="text-gray-300">Email: <span className="text-white">{selectedOrder.user?.email || "N/A"}</span></p>
                  <p className="text-gray-300">Phone: <span className="text-white">{selectedOrder.user?.phone || "N/A"}</span></p>
                  <p className="text-gray-300">Order Date: <span className="text-white">{formatDate(selectedOrder.createdAt)}</span></p>
                  <p className="text-gray-300">Delivery Date: <span className="text-white">{formatDate(selectedOrder.deliveryDate)}</span></p>
                  <p className="text-gray-300">Delivery Time: <span className="text-white">{formatTime(selectedOrder.deliveryTime)}</span></p>
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-green-400 mb-3">Delivery Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Status:</span>
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Payment Status:</span>
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                      selectedOrder.paymentStatus === 'paid' 
                        ? 'bg-green-900 text-green-300' 
                        : 'bg-yellow-900 text-yellow-300'
                    }`}>
                      {selectedOrder.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                  {selectedOrder.driver && (
                    <>
                      <p className="text-gray-300">Driver: <span className="text-white">{selectedOrder.driver?.name || "N/A"}</span></p>
                      <p className="text-gray-300">Driver Phone: <span className="text-white">{selectedOrder.driver?.phone || "N/A"}</span></p>
                    </>
                  )}
                  <p className="text-gray-300">
                    Address: <span className="text-white">{selectedOrder.deliveryAddress?.street}, {selectedOrder.deliveryAddress?.city}, {selectedOrder.deliveryAddress?.state} - {selectedOrder.deliveryAddress?.pincode}</span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold text-green-400 mb-3">Products</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border border-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-300">Product</th>
                      <th className="px-4 py-2 text-left text-gray-300">Quantity</th>
                      <th className="px-4 py-2 text-left text-gray-300">Price</th>
                      <th className="px-4 py-2 text-left text-gray-300">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-700">
                        <td className="px-4 py-2 text-white">{item.product?.name || "N/A"}</td>
                        <td className="px-4 py-2 text-white">{item.quantity}</td>
                        <td className="px-4 py-2 text-green-400">₹{item.price}</td>
                        <td className="px-4 py-2 text-green-400">₹{item.quantity * item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-700">
                    <tr>
                      <td colSpan="3" className="px-4 py-2 text-right text-gray-300 font-semibold">
                        Total Amount:
                      </td>
                      <td className="px-4 py-2 text-green-400 font-semibold">
                        ₹{selectedOrder.totalAmount}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            {selectedOrder.notes && (
              <div className="mb-6 bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-green-400 mb-2">Notes</h3>
                <p className="text-gray-300 text-sm">{selectedOrder.notes}</p>
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;