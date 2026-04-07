-- 日记表
CREATE TABLE IF NOT EXISTS diaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  left_content TEXT DEFAULT '',
  right_content TEXT DEFAULT '',
  weather TEXT DEFAULT 'sunny',
  floating_elements JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 纪念日表
CREATE TABLE IF NOT EXISTS anniversaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 打卡记录表
CREATE TABLE IF NOT EXISTS checkin_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id TEXT NOT NULL,
  item_name TEXT NOT NULL,
  count INTEGER DEFAULT 0,
  date DATE NOT NULL,
  evidence TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用 Row Level Security (RLS)
ALTER TABLE diaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE anniversaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkin_records ENABLE ROW LEVEL SECURITY;

-- 为公开访问配置策略（根据需要调整）
CREATE POLICY "Allow public read access" ON diaries FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON diaries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON diaries FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON anniversaries FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON anniversaries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON anniversaries FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON anniversaries FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON checkin_records FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON checkin_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON checkin_records FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON checkin_records FOR DELETE USING (true);