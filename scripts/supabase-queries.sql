-- ========================================
-- 笨蛋打卡管理 SQL 查询
-- 在 Supabase SQL Editor 中执行
-- ========================================

-- 1. 查看所有打卡项目的当前次数
-- ========================================
SELECT 
  id,
  title,
  emoji,
  count,
  category
FROM checkin_items
ORDER BY id;

-- 2. 查看所有打卡记录（笨蛋碎片）
-- ========================================
SELECT 
  id,
  item_id,
  item_name,
  item_emoji,
  date,
  evidence,
  created_at
FROM checkin_records
ORDER BY created_at DESC;

-- 3. 查看某个项目的所有记录（例如：笨蛋秋秋 ID=1）
-- ========================================
SELECT 
  id,
  item_name,
  item_emoji,
  date,
  evidence,
  created_at
FROM checkin_records
WHERE item_id = 1
ORDER BY created_at DESC;

-- 4. 删除指定 ID 的打卡记录（删除一张卡片）
-- 将 UUID 替换为你要删除的记录 ID
-- ========================================
DELETE FROM checkin_records
WHERE id = '58e62c9c-850e-4977-9010-d5996168a447';

-- 5. 减少指定项目的打卡次数（减少一次笨蛋次数）
-- 将 ID 和次数替换为你需要的值
-- ========================================
UPDATE checkin_items
SET count = count - 1
WHERE id = 1  -- 1=笨蛋秋秋，2=笨蛋果汁
AND count > 0;  -- 确保次数不会变成负数

-- 5b. 增加指定项目的打卡次数（增加次数）
-- 将 ID 和增加的数量替换为你需要的值
-- ========================================
UPDATE checkin_items
SET count = count + 2  -- 改为要增加的数量
WHERE id = 1;  -- 1=笨蛋秋秋，2=笨蛋果汁

-- 6. 删除记录并同步减少次数（分步操作）
-- ========================================
-- 第一步：先查询这条记录的 item_id
SELECT item_id FROM checkin_records WHERE id = '58e62c9c-850e-4977-9010-d5996168a447';

-- 第二步：删除记录（假设查询到的 item_id = 1）
DELETE FROM checkin_records
WHERE id = '58e62c9c-850e-4977-9010-d5996168a447';

-- 第三步：减少对应项目的次数（将 1 替换为第一步查询到的 item_id）
UPDATE checkin_items
SET count = count - 1
WHERE id = 1
AND count > 0;

-- 7. 查看每个项目的记录数量（验证数据）
-- ========================================
SELECT 
  ci.id,
  ci.title,
  ci.emoji,
  ci.count AS stored_count,
  COUNT(cr.id) AS actual_count
FROM checkin_items ci
LEFT JOIN checkin_records cr ON ci.id = cr.item_id
GROUP BY ci.id, ci.title, ci.emoji, ci.count
ORDER BY ci.id;

-- 8. 修复数据：根据实际记录数量更新次数
-- ========================================
UPDATE checkin_items ci
SET count = (
  SELECT COUNT(*)
  FROM checkin_records cr
  WHERE cr.item_id = ci.id
)
WHERE ci.id IN (1, 2);

-- ========================================
-- 使用示例
-- ========================================

-- 场景 1: 删除 ID 为 5 的卡片
-- 1. 先执行查询 2 查看记录列表
-- 2. 找到想删除的记录 ID
-- 3. 执行查询 4，将 id = 5 替换为实际 ID

-- 场景 2: 删除卡片并减少次数
-- 1. 执行查询 6 的事务操作
-- 2. 将 record_id = 5 和 item_id = 1 替换为实际值

-- 场景 3: 修复数据不一致
-- 如果发现显示次数和实际记录数不符
-- 执行查询 8 自动修复
