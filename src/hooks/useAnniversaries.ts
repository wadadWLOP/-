import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Anniversary {
  id: string;
  title: string;
  date: string;
  description?: string;
  is_recurring: boolean;
  created_at?: string;
  updated_at?: string;
}

interface DeletedAnniversary {
  id: string;
  deleted_at?: string;
}

export function useAnniversaries() {
  const [anniversaries, setAnniversaries] = useState<Anniversary[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
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
        (payload) => {
          console.log('🔄 Anniversary change:', payload);
          loadInitialData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'deleted_anniversaries',
        },
        (payload) => {
          console.log('🔄 Deleted anniversary change:', payload);
          loadDeletedIds();
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
      
      // 加载纪念日
      const { data: annData, error: annError } = await supabase
        .from('anniversaries')
        .select('*')
        .order('created_at', { ascending: false });

      // 加载已删除的 ID
      const { data: delData, error: delError } = await supabase
        .from('deleted_anniversaries')
        .select('id');

      if (annError) {
        console.error('❌ Error loading anniversaries:', annError);
        throw annError;
      }
      if (delError) {
        console.error('❌ Error loading deleted IDs:', delError);
        throw delError;
      }

      console.log('✅ Loaded', annData?.length || 0, 'anniversaries');
      setAnniversaries(annData || []);
      setDeletedIds(delData?.map(d => d.id) || []);
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
    // 添加到已删除表
    await supabase
      .from('deleted_anniversaries')
      .upsert({ id });

    // 从原表删除
    const { error } = await supabase
      .from('anniversaries')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async function restoreAnniversary(id: string) {
    // 从已删除表移除
    await supabase
      .from('deleted_anniversaries')
      .delete()
      .eq('id', id);
  }

  const filteredAnniversaries = anniversaries.filter(a => !deletedIds.includes(a.id));

  return {
    anniversaries: filteredAnniversaries,
    loading,
    addAnniversary,
    updateAnniversary,
    deleteAnniversary,
    restoreAnniversary,
  };
}
