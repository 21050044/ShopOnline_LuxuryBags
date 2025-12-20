import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, register as apiRegister, getProfile, updateProfile as apiUpdateProfile } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth phải được sử dụng trong AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user từ localStorage khi khởi động
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('access_token');
            const savedUser = localStorage.getItem('luxury_user');

            if (token && savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                    // Optionally fetch fresh profile
                    const result = await getProfile();
                    if (result.success) {
                        setUser(result.data);
                        localStorage.setItem('luxury_user', JSON.stringify(result.data));
                    }
                } catch (e) {
                    console.error('Error loading user:', e);
                }
            }
            setIsLoading(false);
        };
        loadUser();
    }, []);

    // Đăng nhập
    const login = async (email, password) => {
        setIsLoading(true);
        const result = await apiLogin(email, password);

        if (result.success) {
            setUser(result.data);
            localStorage.setItem('luxury_user', JSON.stringify(result.data));
        }

        setIsLoading(false);
        return result;
    };

    // Đăng xuất
    const logout = async () => {
        await apiLogout();
        setUser(null);
        localStorage.removeItem('luxury_user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    };

    // Đăng ký - sử dụng API thật
    const register = async (userData) => {
        setIsLoading(true);
        const result = await apiRegister(userData);

        if (result.success) {
            setUser(result.data);
            localStorage.setItem('luxury_user', JSON.stringify(result.data));
        }

        setIsLoading(false);
        return result;
    };

    // Cập nhật profile - gọi API thật
    const updateProfile = async (updatedData) => {
        setIsLoading(true);
        const result = await apiUpdateProfile(updatedData);

        if (result.success) {
            const updatedUser = { ...user, ...result.data };
            setUser(updatedUser);
            localStorage.setItem('luxury_user', JSON.stringify(updatedUser));
        }

        setIsLoading(false);
        return result;
    };

    const value = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
