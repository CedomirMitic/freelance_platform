'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { fetchCurrentUser } from '@/src/utils/authApi';
import { notify } from '@/src/utils/notify';

interface User {
    id: number;
    email: string;
    role: string;
    display_name: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (token: string, userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, token: null, isLoading: true, logout: () => { }, login: () => { }, });

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkUser = async () => {
        const localToken = localStorage.getItem('AUTH_TOKEN');
        if (!localToken) {
            setIsLoading(false);
            return;
        }

        // Set token in state 
        setToken(localToken);

        // Fetch current user from authApi
        const userData = await fetchCurrentUser();
        if (userData) {
            setUser(userData);
        } else {
            // If Token is expired remove it
            localStorage.removeItem('AUTH_TOKEN');
            setToken(null);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            checkUser();
        } else {
            // If its building on server, tell it it isnt loading state anymore
            setIsLoading(false);
        }
    }, []);


    const login = (newToken: string, userData: User) => {
        localStorage.setItem('AUTH_TOKEN', newToken);
        document.cookie = `AUTH_TOKEN=${newToken}; path=/; max-age=604800; SameSite=Strict`; // 7 days duration
        setToken(newToken); // <-- Set in state during login
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('AUTH_TOKEN');
        document.cookie = "AUTH_TOKEN=; path=/; max-age=0; SameSite=Strict";
        setToken(null); // <-- Delete from state during Logout
        setUser(null);
        window.location.replace('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);