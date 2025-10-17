import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Boulder, Profile, CompletedBoulder, UserRole, Category } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface DataContextType {
  boulders: Boulder[];
  profiles: Profile[];
  completedBoulders: CompletedBoulder[];
  toggleBoulderComplete: (boulderId: string) => Promise<void>;
  addBoulder: (boulderData: Omit<Boulder, 'id' | 'created_at' | 'number'>) => Promise<void>;
  updateBoulder: (boulder: Boulder) => Promise<void>;
  updateProfile: (userId: string, updates: { role?: UserRole; category?: Category }) => Promise<void>;
  loading: boolean;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [boulders, setBoulders] = useState<Boulder[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [completedBoulders, setCompletedBoulders] = useState<CompletedBoulder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    const [
      { data: bouldersData, error: bouldersError },
      { data: profilesData, error: profilesError },
      { data: completedData, error: completedError },
    ] = await Promise.all([
      supabase.from('boulders').select('*').order('number', { ascending: true }),
      supabase.from('profiles').select('*'),
      supabase.from('completed_boulders').select('*'),
    ]);

    if (bouldersError) console.error('Error fetching boulders:', bouldersError);
    else setBoulders(bouldersData || []);

    if (profilesError) console.error('Error fetching profiles:', profilesError);
    else setProfiles(profilesData || []);
    
    if (completedError) console.error('Error fetching completed boulders:', completedError);
    else setCompletedBoulders(completedData || []);

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAllData();
    const subscription = supabase.channel('public-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        console.log('Database change detected, refreshing data.', payload);
        fetchAllData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchAllData]);

  const toggleBoulderComplete = useCallback(async (boulderId: string) => {
    if (!user) return;
    const userId = user.supabaseUser.id;
    const isCompleted = completedBoulders.some(cb => cb.user_id === userId && cb.boulder_id === boulderId);
    
    if (isCompleted) {
      const { error } = await supabase.from('completed_boulders').delete().match({ user_id: userId, boulder_id: boulderId });
      if (error) console.error('Error un-completing boulder:', error);
    } else {
      const { error } = await supabase.from('completed_boulders').insert({ user_id: userId, boulder_id: boulderId });
      if (error) console.error('Error completing boulder:', error);
    }
  }, [user, completedBoulders]);
  
  const addBoulder = useCallback(async (boulderData: Omit<Boulder, 'id' | 'created_at' | 'number'>) => {
    const { data: maxNumberResult, error: rpcError } = await supabase.rpc('get_max_boulder_number');
    if (rpcError) {
      console.error('Error in RPC get_max_boulder_number:', rpcError);
      return;
    }
    const newNumber = (maxNumberResult || 0) + 1;
    const { error } = await supabase.from('boulders').insert({ ...boulderData, number: newNumber });
    if (error) {
      console.error('Error adding boulder:', error);
    }
  }, []);
  
  const updateBoulder = useCallback(async (boulder: Boulder) => {
    const { id, ...updateData } = boulder;
    const { error } = await supabase.from('boulders').update(updateData).match({ id });
    if (error) {
      console.error('Error updating boulder:', error);
    }
  }, []);

  const updateProfile = useCallback(async (userId: string, updates: { role?: UserRole; category?: Category }) => {
    const { error } = await supabase.from('profiles').update(updates).eq('id', userId);
    if (error) {
        console.error("Error updating profile:", error);
    }
  }, []);

  const value = useMemo(() => ({
    boulders,
    profiles,
    completedBoulders,
    toggleBoulderComplete,
    addBoulder,
    updateBoulder,
    updateProfile,
    loading
  }), [
    boulders, 
    profiles, 
    completedBoulders, 
    loading, 
    toggleBoulderComplete, 
    addBoulder, 
    updateBoulder, 
    updateProfile
  ]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
