// src/context/AuthProvider.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import UserService from '../service/UserService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(UserService.isAuthenticated());

    useEffect(() => {
        setIsAuthenticated(UserService.isAuthenticated());
    }, []);

    const login = () => {
        setIsAuthenticated(true);
    };

    const logout = () => {
        UserService.logout();
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);