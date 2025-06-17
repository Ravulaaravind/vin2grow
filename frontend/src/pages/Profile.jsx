import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaSignOutAlt, FaEdit, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { user, orders, subscriptions as subscriptionService } from '../services/api';

function Subscriptions({ subscriptions, onPause, onCancel, loading }) {
  const [confirming, setConfirming] = useState({ id: null, action: null, status: null });

  const handleAction = (id, action, status) => {
    setConfirming({ id, action, status });
  };

  const confirmAction = () => {
    if (confirming.action === 'pause') onPause(confirming.id, confirming.status);
    if (confirming.action === 'resume') onPause(confirming.id, confirming.status);
    if (confirming.action === 'cancel') onCancel(confirming.id);
    setConfirming({ id: null, action: null, status: null });
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 mt-6 border border-gray-700">
      <h2 className="text-2xl font-bold text-emerald-400 mb-6">My Subscriptions</h2>
      {loading ? (
        <div className="text-gray-400 text-center py-8">Loading subscriptions...</div>
      ) : subscriptions.length === 0 ? (
        <div className="text-gray-400 text-center py-8">You have no active subscriptions.</div>
      ) : (
        <div className="space-y-6">
          {subscriptions.map((sub, idx) => (
            <div
              key={sub._id || sub.id || idx}
              className="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-700 rounded-lg p-4 border border-gray-600"
            >
              <div className="flex items-center gap-4">
                {sub.product?.image && (
                  <img
                    src={sub.product.image}
                    alt={sub.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <div className="text-lg font-semibold text-gray-200">
                    {sub.plan || sub.product?.name || 'Subscription'}
                  </div>
                  <div className="text-sm text-gray-400">
                    Status: <span className="text-gray-200">
                      {typeof sub.status === 'string' && ['active','paused','cancelled'].includes(sub.status)
                        ? sub.status.charAt(0).toUpperCase() + sub.status.slice(1)
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Next Billing:{' '}
                    {sub.nextBilling ||
                      (sub.nextBillingDate
                        ? new Date(sub.nextBillingDate).toLocaleDateString()
                        : 'N/A')}
                  </div>
                  <div className="text-sm text-gray-400">
                    Frequency: <span className="text-gray-200">{sub.frequency ? String(sub.frequency) : 'N/A'}</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Quantity: <span className="text-gray-200">
                      {Array.isArray(sub.products) && sub.products.length > 0
                        ? sub.products.reduce((sum, p) => sum + (Number.isFinite(p.quantity) ? p.quantity : 0), 0)
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                {(sub.status === 'paused' || sub.status === 'Paused') ? (
                  <button
                    className="px-4 py-2 rounded-md border border-emerald-400 text-emerald-400 hover:bg-emerald-400/10 transition-colors disabled:opacity-50"
                    disabled={loading}
                    onClick={() => handleAction(sub._id || sub.id, 'resume', sub.status)}
                  >
                    Resume
                  </button>
                ) : (
                  <button
                    className="px-4 py-2 rounded-md border border-emerald-400 text-emerald-400 hover:bg-emerald-400/10 transition-colors disabled:opacity-50"
                    disabled={loading}
                    onClick={() => handleAction(sub._id || sub.id, 'pause', sub.status)}
                  >
                    Pause
                  </button>
                )}
                <button
                  className="px-4 py-2 rounded-md border border-red-400 text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
                  disabled={loading}
                  onClick={() => handleAction(sub._id || sub.id, 'cancel', sub.status)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Confirmation Dialog */}
      {confirming.id && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-xs text-center border border-gray-700">
            <div className="mb-4 text-lg font-semibold text-gray-200">
              {confirming.action === 'cancel'
                ? 'Cancel this subscription?'
                : confirming.action === 'pause'
                ? 'Pause this subscription?'
                : 'Resume this subscription?'}
            </div>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600"
                onClick={() => setConfirming({ id: null, action: null, status: null })}
              >
                No
              </button>
              <button
                className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={confirmAction}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const Profile = () => {
  const { user: authUser, isAuthenticated, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [userOrders, setUserOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [addressError, setAddressError] = useState(null);
  const [fetchAttempts, setFetchAttempts] = useState(0);
  const [activeSection, setActiveSection] = useState('profile');
  const [subsLoading, setSubsLoading] = useState(false);
  const [isFormDataReady, setIsFormDataReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchUserData();
    console.log("form Data in useEffect", formData);
  }, [isAuthenticated, navigate]);

  const fetchUserData = async () => {
    if (fetchAttempts > 3) {
      console.log('Too many fetch attempts, stopping');
      return;
    }

    try {
      setAddressError(null);
      setFetchAttempts(prev => prev + 1);

      const profileResponse = await user.getProfile();
      const userData = profileResponse.data.user;
      console.log("userData",userData);

      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.addresses?.[0] || {
          street: '',
          city: '',
          state: '',
          pincode: ''
        }
      });
      setIsFormDataReady(true);
      console.log("formData after setting",formData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.response?.status === 404) {
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: {
            street: '',
            city: '',
            state: '',
            pincode: ''
          }
        });
        setAddressError('Please complete your profile information');
      } else if (error.response?.status === 429) {
        toast.error('Too many requests. Please wait a moment and try again.');
        setTimeout(() => {
          setFetchAttempts(0);
        }, 5000);
      } else {
        toast.error('Failed to load user data. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAddressError(null);

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        addresses: [formData.address]
      };

      const response = await user.updateProfile(updateData);
      
      updateProfile(response.data.user);
      
      toast.success('Profile updated successfully!', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#059669',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '14px',
        },
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      
      if (error.response?.status === 400) {
        const errorMessage = error.response.data.error || 'Invalid data provided';
        setAddressError(errorMessage);
        toast.error(errorMessage);
      } else if (error.response?.status === 401) {
        toast.error('Your session has expired. Please log in again.');
        logout();
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to update this profile.');
      } else if (error.response?.status === 404) {
        toast.error('Profile not found.');
      } else if (error.response?.status === 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error('Failed to update profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCancelSubscription = async (subscriptionId) => {
    try {
      setSubsLoading(true);
      await subscriptionService.cancel(subscriptionId);
      setSubscriptions(prev => prev.filter(sub => (sub._id || sub.id) !== subscriptionId));
      toast.success('Subscription cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription. Please try again.');
    } finally {
      setSubsLoading(false);
    }
  };

  const handlePauseSubscription = async (subscriptionId, status) => {
    try {
      setSubsLoading(true);
      let response;
      if (status === 'paused' || status === 'Paused') {
        response = await subscriptionService.resume(subscriptionId);
        toast.success('Subscription resumed successfully!');
      } else {
        response = await subscriptionService.pause(subscriptionId);
      toast.success('Subscription paused successfully!');
      }
      const updatedSub = response.data.subscription || response.data;
      setSubscriptions(prev => prev.map(sub => (sub._id || sub.id) === subscriptionId ? updatedSub : sub));
    } catch (error) {
      console.error('Error pausing/resuming subscription:', error);
      toast.error('Failed to update subscription. Please try again.');
    } finally {
      setSubsLoading(false);
    }
  };

  return (
    !isFormDataReady ? (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-emerald-400">Loading...</div>
      </div>
    ) : (
      <div className="min-h-screen bg-gray-900 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-emerald-400 mb-6">My Profile</h1>

              {/* Profile Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-200">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData?.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-emerald-400 focus:ring-emerald-400 disabled:bg-gray-600 disabled:text-gray-400"
                      required
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-emerald-400 focus:ring-emerald-400 disabled:bg-gray-600 disabled:text-gray-400"
                      required
                    />
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-200">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-emerald-400 focus:ring-emerald-400 disabled:bg-gray-600 disabled:text-gray-400"
                      required
                    />
                  </div>

                  {/* Address Fields */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium text-emerald-400 mb-4">Address Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="street" className="block text-sm font-medium text-gray-200">
                          Street Address
                        </label>
                        <input
                          type="text"
                          id="street"
                          name="address.street"
                          value={formData.address.street}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-emerald-400 focus:ring-emerald-400 disabled:bg-gray-600 disabled:text-gray-400"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-200">
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-emerald-400 focus:ring-emerald-400 disabled:bg-gray-600 disabled:text-gray-400"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-200">
                          State
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="address.state"
                          value={formData.address.state}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-emerald-400 focus:ring-emerald-400 disabled:bg-gray-600 disabled:text-gray-400"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="pincode" className="block text-sm font-medium text-gray-200">
                          Pincode
                        </label>
                        <input
                          type="text"
                          id="pincode"
                          name="address.pincode"
                          value={formData.address.pincode}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-emerald-400 focus:ring-emerald-400 disabled:bg-gray-600 disabled:text-gray-400"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          fetchUserData();
                        }}
                        className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400 disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Profile;