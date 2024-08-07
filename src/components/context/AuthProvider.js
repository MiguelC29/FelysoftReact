import React, { createContext, useState, useContext, useEffect } from 'react';
import UserService from '../service/UserService';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(UserService.isAuthenticated());
    const [authError, setAuthError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkTokenExpiration = () => {
            if (UserService.isTokenExpired()) {
                setAuthError('Su sesión ha caducado, inicie nuevamente.');
                logout();
            } else {
                setIsAuthenticated(true);
                setAuthError(''); // Limpiar el error si el token es válido
            }
        };

        checkTokenExpiration();
        // Intervalo para verificar la expiración del token cada cierto tiempo
        const interval = setInterval(checkTokenExpiration, 30000); // 1 minuto
        return () => clearInterval(interval);
    }, []);

    const login = () => {
        setIsAuthenticated(true);
        setAuthError('');
    };

    const logout = () => {
        UserService.logout();
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, authError }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
