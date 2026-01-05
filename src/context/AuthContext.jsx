import React, { createContext, useContext, useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [experienceLevel, setExperienceLevel] = useState('beginner');
    const [role, setRole] = useState(null);

    const getApiUrl = () => {
        const url = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        return url.endsWith('/api') ? url : `${url}/api`;
    };

    const API_URL = getApiUrl();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        try {
            const onboardingData = JSON.parse(localStorage.getItem('prephub_onboarding') || '{}');
            if (onboardingData.level) {
                setExperienceLevel(onboardingData.level);
            }
            if (onboardingData.role) {
                setRole(onboardingData.role);
            }
        } catch (e) {
            console.warn('Failed to parse onboarding data', e);
        }

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (googleResponse) => {
        try {
            const res = await axios.post(`${API_URL}/auth/google`, {
                tokenId: googleResponse.credential
            });

            const { token: authToken, learningPreferences, ...userData } = res.data;

            // Include onboardingCompleted in user data
            const fullUserData = {
                ...userData,
                learningPreferences,
                onboardingCompleted: userData.onboardingCompleted || false
            };

            setToken(authToken);
            setUser(fullUserData);

            localStorage.setItem('token', authToken);
            localStorage.setItem('user', JSON.stringify(fullUserData));

            // Sync local path preferences to server on login
            const localPathConfig = JSON.parse(localStorage.getItem('prephub_ai_path_config') || 'null');
            if (localPathConfig?.pathId && !learningPreferences?.pathId) {
                try {
                    await axios.post(
                        `${API_URL}/auth/sync-preferences`,
                        { localPreferences: localPathConfig },
                        { headers: { Authorization: `Bearer ${authToken}` } }
                    );
                } catch (e) {
                    console.warn('Path sync failed:', e.message);
                }
            }

            syncBookmarks(authToken);

            // Only show welcome if onboarding is complete
            if (fullUserData.onboardingCompleted) {
                toast.success(`Welcome back, ${userData.name}!`);
            }
        } catch (error) {
            console.error('Login Failed:', error);
            toast.error('Login failed. Please try again.');
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success('Logged out successfully');
    };

    // Update user after onboarding completion
    const updateUser = (updatedUserData) => {
        const newUserData = { ...user, ...updatedUserData };
        setUser(newUserData);
        localStorage.setItem('user', JSON.stringify(newUserData));
    };

    const syncBookmarks = async (authToken) => {
        try {
            const localBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
            if (localBookmarks.length === 0) return;

            await axios.post(
                `${API_URL}/bookmarks/sync`,
                { bookmarks: localBookmarks },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
        } catch (error) {
            console.error('Bookmark Sync Error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            logout,
            loading,
            experienceLevel,
            role,
            updateUser
        }}>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                {children}
            </GoogleOAuthProvider>
        </AuthContext.Provider>
    );
};

