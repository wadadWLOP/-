-- 实时同步数据库表

-- 纪念日表
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

-- 已删除的纪念日ID表（用于同步删除状态）
CREATE TABLE IF NOT EXISTS deleted_anniversaries (
  id TEXT PRIMARY KEY,
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 打卡记录表
CREATE TABLE IF NOT EXISTS checkin_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  checkin_data JSONB NOT NULL DEFAULT '{}',
  records JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用 Realtime 功能（重要！）
-- 在 Supabase Dashboard → Database → Replication 中启用

-- 为 anniversaries 表启用 Row Level Security
ALTER TABLE anniversaries ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取和插入数据
CREATE POLICY "Allow all reads" ON anniversaries FOR SELECT USING (true);
CREATE POLICY "Allow all inserts" ON anniversaries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all updates" ON anniversaries FOR UPDATE USING (true);
CREATE POLICY "Allow all deletes" ON anniversaries FOR DELETE USING (true);

-- 为 deleted_anniversaries 表启用 RLS
ALTER TABLE deleted_anniversaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all reads" ON deleted_anniversaries FOR SELECT USING (true);
CREATE POLICY "Allow all inserts" ON deleted_anniversaries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all deletes" ON deleted_anniversaries FOR DELETE USING (true);

-- 为 checkin_records 表启用 RLS
ALTER TABLE checkin_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all reads" ON checkin_records FOR SELECT USING (true);
CREATE POLICY "Allow all inserts" ON checkin_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all updates" ON checkin_records FOR UPDATE USING (true);
