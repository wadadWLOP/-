-- 为 diary_archives 表添加新字段（如果不存在）
-- 用于存储完整的照片和浮动元素数据

-- 添加 photos 字段（存储所有照片的 JSON 数组）
ALTER TABLE diary_archives 
ADD COLUMN IF NOT EXISTS photos JSONB DEFAULT '[]';

-- 添加 floating_elements 字段（存储所有浮动元素）
ALTER TABLE diary_archives 
ADD COLUMN IF NOT EXISTS floating_elements JSONB DEFAULT '[]';

-- 添加 photo_pages 字段（存储照片页数据）
ALTER TABLE diary_archives 
ADD COLUMN IF NOT EXISTS photo_pages JSONB DEFAULT '[]';

-- 添加注释说明字段用途
COMMENT ON COLUMN diary_archives.photos IS '存储所有照片数据，包括浮动照片和照片页照片';
COMMENT ON COLUMN diary_archives.floating_elements IS '存储所有浮动元素（照片、贴纸、涂鸦）';
COMMENT ON COLUMN diary_archives.photo_pages IS '存储照片页数据，每页可包含上下两张照片';
