import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface ArchivedDiary {
  id?: string;
  diary_id?: string;
  date: string;
  title?: string;
  excerpt?: string;
  full_content?: string;
  weather?: string;
  word_count?: number;
  photo_url?: string;
  sticker_emoji?: string;
  background_color?: string;
  category?: string;
  created_at?: string;
  archived_at?: string;
}

export function useArchivedDiaries() {
  const [archives, setArchives] = useState<ArchivedDiary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArchives();

    // 设置 realtime 订阅
    const channel = supabase
      .channel('diary_archives_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'diary_archives',
        },
        () => {
          loadArchives();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadArchives = async () => {
    try {
      const { data, error } = await supabase
        .from('diary_archives')
        .select('*')
        .order('archived_at', { ascending: false });

      if (error) throw error;
      setArchives(data || []);
    } catch (error) {
      console.error('Error loading archives:', error);
    } finally {
      setLoading(false);
    }
  };

  const archiveDiary = async (archive: Omit<ArchivedDiary, 'id' | 'created_at' | 'archived_at'>) => {
    try {
      const { data, error } = await supabase
        .from('diary_archives')
        .insert({
          diary_id: archive.diary_id,
          date: archive.date,
          title: archive.title,
          excerpt: archive.excerpt,
          weather: archive.weather,
          word_count: archive.word_count,
          photo_url: archive.photo_url,
          sticker_emoji: archive.sticker_emoji,
          background_color: archive.background_color,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error archiving diary:', error);
      throw error;
    }
  };

  const deleteArchive = async (id: string) => {
    try {
      const { error } = await supabase
        .from('diary_archives')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setArchives(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting archive:', error);
      throw error;
    }
  };

  return {
    archives,
    loading,
    archiveDiary,
    deleteArchive,
    refreshArchives: loadArchives,
  };
}
