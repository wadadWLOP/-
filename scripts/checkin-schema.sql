-- 创建 checkin_items 表
CREATE TABLE IF NOT EXISTS checkin_items (
  id INTEGER PRIMARY KEY,
  emoji TEXT NOT NULL,
  title TEXT NOT NULL,
  count INTEGER DEFAULT 0,
  category TEXT DEFAULT 'daily',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建 checkin_records 表
CREATE TABLE IF NOT EXISTS checkin_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id INTEGER NOT NULL REFERENCES checkin_items(id),
  item_title TEXT NOT NULL,
  item_emoji TEXT NOT NULL,
  date TEXT NOT NULL,
  evidence TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 插入默认数据
INSERT INTO checkin_items (id, emoji, title, count, category)
VALUES 
  (1, '☀️', '笨蛋秋秋', 0, 'daily'),
  (2, '🌙', '笨蛋果汁', 0, 'daily')
ON CONFLICT (id) DO NOTHING;

-- 启用 Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE checkin_items;
ALTER PUBLICATION supabase_realtime ADD TABLE checkin_records;

-- 设置 RLS 策略（允许匿名访问）
ALTER TABLE checkin_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkin_records ENABLE ROW LEVEL SECURITY;

-- 创建允许所有操作的策略
CREATE POLICY "Allow all operations on checkin_items" ON checkin_items
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on checkin_records" ON checkin_records
  FOR ALL USING (true) WITH CHECK (true);
