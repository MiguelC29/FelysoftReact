import React from 'react'
import { useAuth } from './AuthProvider';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ element, redirectTo }) {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? <Navigate to={redirectTo} replace /> : element;
}
