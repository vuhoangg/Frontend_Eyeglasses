// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { notification } from 'antd'; // Import notification

const ProtectedRoute = ({ allowedRoles, children }) => {
    const userData = localStorage.getItem('userData');
    const user = userData ? JSON.parse(userData) : null;
    const userRole = user?.role;

    if (!user) {
        // Redirect to login if not logged in
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Check if the user role is 'customer'
        if (userRole === 'customer') {
            // Display a notification for customer users
            notification.warning({
                message: 'Truy cập bị hạn chế',
                description: 'Bạn không có quyền truy cập trang quản trị.',
                duration: 3, // Display duration in seconds
            });
        } else {
            // Optionally, you can have a different notification for other unauthorized roles
            // or just keep the silent redirection for them.
            notification.error({
                message: 'Không được phép',
                description: 'Bạn không có quyền truy cập vào khu vực này.',
                duration: 3,
            });
        }

        // Redirect to homepage after showing the notification
        return <Navigate to="/" replace />;
    }

    return children; // Render the protected component if authorized
};

export default ProtectedRoute;