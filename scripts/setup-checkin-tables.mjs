import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 请设置 VITE_SUPABASE_URL 和 VITE_SUPABASE_SERVICE_ROLE_KEY 环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createCheckinTables() {
  console.log('🚀 开始创建 checkin 相关表...\n');

  const createCheckinItemsTable = `
    CREATE TABLE IF NOT EXISTS checkin_items (
      id INTEGER PRIMARY KEY,
      emoji TEXT NOT NULL,
      title TEXT NOT NULL,
      count INTEGER DEFAULT 0,
      category TEXT DEFAULT 'daily',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  const createCheckinRecordsTable = `
    CREATE TABLE IF NOT EXISTS checkin_records (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      item_id INTEGER NOT NULL REFERENCES checkin_items(id),
      item_title TEXT NOT NULL,
      item_emoji TEXT NOT NULL,
      date TEXT NOT NULL,
      evidence TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  const insertDefaultItems = `
    INSERT INTO checkin_items (id, emoji, title, count, category)
    VALUES 
      (1, '☀️', '笨蛋秋秋', 0, 'daily'),
      (2, '🌙', '笨蛋果汁', 0, 'daily')
    ON CONFLICT (id) DO NOTHING;
  `;

  try {
    console.log('📋 创建 checkin_items 表...');
    const { error: error1 } = await supabase.rpc('exec', { sql: createCheckinItemsTable });
    if (error1) throw error1;

    console.log('📋 创建 checkin_records 表...');
    const { error: error2 } = await supabase.rpc('exec', { sql: createCheckinRecordsTable });
    if (error2) throw error2;

    console.log('📋 插入默认数据...');
    const { error: error3 } = await supabase.rpc('exec', { sql: insertDefaultItems });
    if (error3) throw error3;

    console.log('\n✅ checkin 表创建完成！');

    console.log('\n📝 请在 Supabase 控制台启用 Realtime 功能：');
    console.log('   1. 打开 https://supabase.com/dashboard');
    console.log('   2. 选择你的项目');
    console.log('   3. 进入 Database → Replication');
    console.log('   4. 为 checkin_items 和 checkin_records 表启用 replication');

    console.log('\n📝 请设置 RLS 策略：');
    console.log('   1. 进入 Authentication → Policies');
    console.log('   2. 为 checkin_items 和 checkin_records 表添加允许匿名访问的策略');

  } catch (err) {
    console.error('❌ 创建表失败:', err);
  }
}

createCheckinTables();
