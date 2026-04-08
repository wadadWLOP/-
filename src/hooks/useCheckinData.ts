import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface CheckinItem {
  id: number;
  emoji: string;
  title: string;
  count: number;
  category: string;
}

interface CheckinRecord {
  id?: number;
  item_id: number;
  item_title: string;
  item_emoji: string;
  date: string;
  evidence?: string;
  created_at?: string;
}

export function useCheckinData() {
  const [checkinData, setCheckinData] = useState<CheckinItem[]>([
    { id: 1, emoji: '☀️', title: '笨蛋秋秋', count: 0, category: 'daily' },
    { id: 2, emoji: '🌙', title: '笨蛋果汁', count: 0, category: 'daily' },
  ]);
  const [records, setRecords] = useState<CheckinRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();

    const channel = supabase
      .channel('checkin-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'checkin_items',
        },
        () => {
          console.log('🔄 Checkin item changed, reloading...');
          loadInitialData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'checkin_records',
        },
        () => {
          console.log('🔄 Checkin record changed, reloading...');
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
      console.log('📥 Loading checkin data...');
      
      const { data: itemsData, error: itemsError } = await supabase
        .from('checkin_items')
        .select('*')
        .order('id', { ascending: true });

      const { data: recordsData, error: recordsError } = await supabase
        .from('checkin_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (itemsError) {
        console.error('❌ Error loading checkin items:', itemsError);
        throw itemsError;
      }
      if (recordsError) {
        console.error('❌ Error loading checkin records:', recordsError);
        throw recordsError;
      }

      if (itemsData && itemsData.length > 0) {
        setCheckinData(itemsData);
      }
      
      if (recordsData) {
        setRecords(recordsData);
      }
      
      setLoading(false);
      console.log('✅ Loaded checkin data');
    } catch (error) {
      console.error('❌ Error in loadInitialData:', error);
      setLoading(false);
    }
  }

  async function updateCheckinCount(itemId: number, newCount: number) {
    console.log('📝 Updating checkin count:', itemId, newCount);
    
    const { error } = await supabase
      .from('checkin_items')
      .update({ count: newCount })
      .eq('id', itemId);

    if (error) {
      console.error('❌ Update error:', error);
      throw error;
    }
    
    console.log('✅ Checkin count updated');
  }

  async function addCheckinRecord(record: Omit<CheckinRecord, 'id' | 'created_at'>) {
    console.log('📝 Adding checkin record:', record);
    
    const { data, error } = await supabase
      .from('checkin_records')
      .insert([record])
      .select();

    if (error) {
      console.error('❌ Add record error:', error);
      throw error;
    }
    
    console.log('✅ Checkin record added:', data);
    return data?.[0];
  }

  return {
    checkinData,
    records,
    loading,
    updateCheckinCount,
    addCheckinRecord,
  };
}
