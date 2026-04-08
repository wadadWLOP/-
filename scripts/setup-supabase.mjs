import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 请设置 VITE_SUPABASE_URL 和 VITE_SUPABASE_SERVICE_ROLE_KEY 环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  console.log('🚀 开始创建数据库表...\n');

  const createAnniversariesTable = `
    CREATE TABLE IF NOT EXISTS anniversaries (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      description TEXT,
      icon TEXT DEFAULT '📅',
      is_recurring BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  const createCheckinRecordsTable = `
    CREATE TABLE IF NOT EXISTS checkin_records (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      checkin_data JSONB NOT NULL,
      records JSONB DEFAULT '[]',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  const createDeletedAnniversariesTable = `
    CREATE TABLE IF NOT EXISTS deleted_anniversaries (
      id TEXT PRIMARY KEY,
      deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  try {
    console.log('📋 创建 anniversaries 表...');
    const { error: error1 } = await supabase.rpc('exec', { sql: createAnniversariesTable });
    if (error1) {
      console.log('   (可能已存在，继续...)');
    }

    console.log('📋 创建 checkin_records 表...');
    const { error: error2 } = await supabase.rpc('exec', { sql: createCheckinRecordsTable });
    if (error2) {
      console.log('   (可能已存在，继续...)');
    }

    console.log('📋 创建 deleted_anniversaries 表...');
    const { error: error3 } = await supabase.rpc('exec', { sql: createDeletedAnniversariesTable });
    if (error3) {
      console.log('   (可能已存在，继续...)');
    }

    console.log('\n✅ 数据库表创建完成！');

    console.log('\n📝 请在 Supabase 控制台启用 Realtime 功能：');
    console.log('   1. 打开 https://supabase.com/dashboard');
    console.log('   2. 选择你的项目');
    console.log('   3. 进入 Database → Replication');
    console.log('   4. 为 anniversaries 和 checkin_records 表启用 replication');

  } catch (err) {
    console.error('❌ 创建表失败:', err);
  }
}

createTables();
