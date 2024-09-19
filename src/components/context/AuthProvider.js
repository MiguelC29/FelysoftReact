import React, { createContext, useState, useContext, useEffect } from 'react';
import UserService from '../service/UserService';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(UserService.isAuthenticated());
    const [authError, setAuthError] = useState('');
    const [hasShownSessionExpired, setHasShownSessionExpired] = useState(false);
    const [profile, setProfile] = useState(null); // Estado para el perfil del usuario
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

        const checkUserStatus = async () => {
            if (isAuthenticated) {
                try {
                    const token = localStorage.getItem('token');
                    const profileData = await UserService.getYourProfile(token);

                    // Verificar si el usuario está deshabilitado o eliminado
                    if (profileData.user.enabled === false) {
                        setAuthError('Su cuenta ha sido deshabilitada o eliminada.');
                        logout();
                    } else {
                        setProfile(profileData);
                    }
                } catch (err) {
                    console.error('Error al obtener el perfil del usuario:', err);
                    setAuthError('No se pudo verificar su cuenta. Es posible que haya sido eliminada.');
                    logout();
                }
            }
        };

        checkTokenExpiration();
        checkUserStatus();

        // Verificar el estado del token y del usuario cada 5 segundos
        const interval = setInterval(() => {
            checkTokenExpiration();
            checkUserStatus();
        }, 5000);

        return () => clearInterval(interval);
    }, [isAuthenticated, hasShownSessionExpired]);

    useEffect(() => {
        const fetchProfile = async () => {
            if (isAuthenticated) {
                try {
                    const token = localStorage.getItem('token');
                    const profileData = await UserService.getYourProfile(token);
                    setProfile(profileData);
                } catch (err) {
                    console.error('Error fetching profile:', err);
                }
            }
        };

        fetchProfile();
    }, [isAuthenticated]); // Llama a la función cuando el estado de autenticación cambia

    const login = () => {
        setIsAuthenticated(true);
        setAuthError('');
        setHasShownSessionExpired(false);
        // Después de iniciar sesión, obtén el perfil
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const profileData = await UserService.getYourProfile(token);
                setProfile(profileData);
            } catch (err) {
                console.error('Error fetching profile:', err);
            }
        };
        fetchProfile();
    };

    const logout = () => {
        UserService.logout();
        setIsAuthenticated(false);
        setProfile(null); // Limpiar el perfil al cerrar sesión
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, authError, setAuthError, profile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
