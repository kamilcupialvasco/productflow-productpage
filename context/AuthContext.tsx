import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { api } from '../services/mockData';

interface AuthContextType {
    users: User[];
    currentUser: User | null;
    loading: boolean;
    login: (user: User) => void;
    logout: () => void;
    switchUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUsers = async () => {
            setLoading(true);
            const fetchedUsers = await api.fetchUsers();
            setUsers(fetchedUsers);
            // Auto-login first user to simulate authenticated session in the app
            if (fetchedUsers.length > 0) {
                setCurrentUser(fetchedUsers[0]); 
            }
            setLoading(false);
        };
        loadUsers();
    }, []);

    const login = useCallback((user: User) => {
        const foundUser = users.find(u => u.id === user.id);
        if(foundUser) {
            setCurrentUser(foundUser);
        } else {
             setCurrentUser(user);
        }
    }, [users]);
    
    const logout = useCallback(() => {
        setCurrentUser(null);
    }, []);


    const switchUser = (userId: string) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            setCurrentUser(user);
        }
    };

    const value = {
        users,
        currentUser,
        loading,
        login,
        logout,
        switchUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
