import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserAndSession = useCallback(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        // Fetch session on mount
        fetchUserAndSession();

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [fetchUserAndSession]);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    if (loading) {
        return <div>Loading...</div>; // You can change this to a better loading screen
    }

    return (
        <AuthContext.Provider value={{ session, user, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";