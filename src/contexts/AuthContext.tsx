import React, { createContext, useState, useEffect, useMemo } from 'react';
import { Session } from '@supabase/supabase-js';
import { AppUser, Gender, Category, Profile } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  login: (email: string, pass: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  register: (userData: {
    email: string;
    pass: string;
    name: string;
    bib: number;
    gender: Gender;
    category: Category;
  }) => Promise<{ error: any }>;
  isAdmin: boolean;
  isAuthenticated: boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndProfile = async (currentSession: Session | null) => {
        if (currentSession?.user) {
            const { data: profiles, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentSession.user.id);

            if (error) {
                console.error("Error fetching profile:", error);
                setUser(null);
            } else if (profiles && profiles.length > 0) {
                const profile: Profile = profiles[0];
                setUser({ supabaseUser: currentSession.user, profile });
            } else {
                console.warn("No profile found for user:", currentSession.user.id);
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
        setSession(currentSession);
        fetchUserAndProfile(currentSession);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession);
        fetchUserAndProfile(newSession);
    });

    return () => {
        subscription.unsubscribe();
    };
  }, []);
  
  // Listen for updates on the current user's profile
  useEffect(() => {
    if (!user) return;

    const handleProfileUpdate = (payload: any) => {
        console.log('Profile updated, refreshing user state:', payload.new);
        const updatedProfile = payload.new as Profile;
        setUser(prevUser => prevUser ? { ...prevUser, profile: updatedProfile } : null);
    };

    const profileSubscription = supabase
      .channel(`profile-updates-${user.profile.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.profile.id}`,
        },
        handleProfileUpdate
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profileSubscription);
    };
  }, [user]);


  const login = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };
  
  const register = async (userData: { email: string; pass: string; name: string; bib: number; gender: Gender; category: Category; }) => {
    const { error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.pass,
        options: {
            data: {
                name: userData.name,
                bib: userData.bib,
                gender: userData.gender,
                category: userData.category,
                role: 'PARTICIPANT' // Default role
            }
        }
    });
    return { error };
  };

  const authContextValue = useMemo(() => ({
    user,
    session,
    login,
    logout,
    register,
    isAdmin: user?.profile.role === 'ADMIN',
    isAuthenticated: !!user,
    loading,
  }), [user, session, loading]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
