import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Anniversary {
  id: string;
  title: string;
  date: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export function useAnniversaries() {
  const [anniversaries, setAnniversaries] = useState<Anniversary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 加载初始数据
    loadInitialData();

    // 订阅实时变更
    const channel = supabase
      .channel('anniversaries-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'anniversaries',
        },
        () => {
          console.log('🔄 Anniversary changed, reloading...');
          loadInitialData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadInitialData() {
    try {
      console.log('📥 Loading anniversaries...');
      
      const { data: annData, error: annError } = await supabase
        .from('anniversaries')
        .select('*')
        .order('created_at', { ascending: false });

      if (annError) {
        console.error('❌ Error loading anniversaries:', annError);
        throw annError;
      }

      console.log('✅ Loaded', annData?.length || 0, 'anniversaries');
      setAnniversaries(annData || []);
      setLoading(false);
    } catch (error) {
      console.error('❌ Error in loadInitialData:', error);
      setLoading(false);
    }
  }

  async function loadDeletedIds() {
    const { data, error } = await supabase
      .from('deleted_anniversaries')
      .select('id');

    if (!error && data) {
      setDeletedIds(data.map(d => d.id));
    }
  }

  async function addAnniversary(anniversary: Omit<Anniversary, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('anniversaries')
      .insert([anniversary])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async function updateAnniversary(id: string, updates: Partial<Anniversary>) {
    const { data, error } = await supabase
      .from('anniversaries')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async function deleteAnniversary(id: string) {
    console.log('🗑️ Deleting anniversary:', id);
    
    const { error } = await supabase
      .from('anniversaries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Delete error:', error);
      throw error;
    }
    
    console.log('✅ Anniversary deleted');
  }

  const filteredAnniversaries = anniversaries;

  return {
    anniversaries: filteredAnniversaries,
    loading,
    addAnniversary,
    updateAnniversary,
    deleteAnniversary,
  };
}
