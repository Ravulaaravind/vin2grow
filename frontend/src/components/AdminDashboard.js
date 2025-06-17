import React from 'react';
import TestEmail from './TestEmail';

const AdminDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-1000 text-gray-100">
            {/* Fixed Header */}
            <div className="fixed top-0 left-0 right-0 z-40 bg-gray-900 border-b border-green-700 py-4 px-6">
                <h2 className="text-2xl font-bold text-green-400">Admin Dashboard</h2>
            </div>
            
            <div className="container mx-auto pt-16 px-4 pb-16">
            {/* Test Email Section */}
            <TestEmail />

            {/* ... rest of your existing dashboard components ... */}
            </div>
        </div>
    );
};

export default AdminDashboard; 