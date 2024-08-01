import React, { createContext, useState, useContext, useEffect } from 'react';
import UserService from '../service/UserService';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(UserService.isAuthenticated());
    const [authError, setAuthError] = useState('');
    const [hasShownSessionExpired, setHasShownSessionExpired] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkTokenExpiration = () => {
            if (isAuthenticated) {
                if (UserService.isTokenExpired()) {
                    if (!hasShownSessionExpired) {
                        setAuthError('Su sesión ha caducado, inicie nuevamente.');
                        setHasShownSessionExpired(true);
                    }
                    logout();
                } else {
                    setIsAuthenticated(true);
                    setAuthError(''); // Limpiar el error si el token es válido
                }
            }
        };

        checkTokenExpiration();
        // Intervalo para verificar la expiración del token cada cierto tiempo
        const interval = setInterval(checkTokenExpiration, 20000); // 20 segundos
        return () => clearInterval(interval);
    }, [isAuthenticated, hasShownSessionExpired]);

    useEffect(() => {
        // Limpiar el mensaje de error de autenticación al recargar la página
        setAuthError('');
        setHasShownSessionExpired(false);
    }, []);

    const login = () => {
        setIsAuthenticated(true);
        setAuthError('');
        setHasShownSessionExpired(false);
    };

    const logout = () => {
        UserService.logout();
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, authError, setAuthError }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
