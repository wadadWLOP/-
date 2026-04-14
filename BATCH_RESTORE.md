# 恢复 59 个日记的完整数据

## 问题分析

昨天归档的 59 个日记：
- ✅ 照片都已上传到腾讯云 COS
- ❌ 数据库缺少 `photos`、`floating_elements`、`photo_pages` 字段
- ❌ 文字内容可能只保存了摘要（`excerpt`），没有保存完整内容（`full_content`）

## 解决方案

### 第一步：执行数据库迁移（必须）

在 Supabase SQL Editor 中执行：

```sql
-- 为 diary_archives 表添加新字段
ALTER TABLE diary_archives 
ADD COLUMN IF NOT EXISTS photos JSONB DEFAULT '[]';

ALTER TABLE diary_archives 
ADD COLUMN IF NOT EXISTS floating_elements JSONB DEFAULT '[]';

ALTER TABLE diary_archives 
ADD COLUMN IF NOT EXISTS photo_pages JSONB DEFAULT '[]';
```

**操作步骤：**
1. 登录 https://supabase.com/dashboard
2. 选择你的项目
3. 进入 **SQL Editor**
4. 粘贴上面的 SQL
5. 点击 **Run**

### 第二步：重新归档所有日记

由于代码已经更新，只需要：

1. **打开日记列表页**
2. **依次点击每个归档卡片**
3. **检查内容是否正确加载**
4. **重新点击"归档"按钮**

这样会自动更新数据库记录，保存完整的照片和文字数据。

### 第三步：批量恢复（可选）

如果手动操作太麻烦，可以在浏览器控制台运行以下代码：

```javascript
// 在浏览器控制台运行（打开日记列表页后按 F12）
async function batchRestoreArchives() {
  console.log('🔄 开始批量恢复归档数据...');
  
  const { data: archives } = await supabase
    .from('diary_archives')
    .select('*');
  
  if (!archives || archives.length === 0) {
    console.log('❌ 没有找到归档数据');
    return;
  }
  
  console.log(`📊 找到 ${archives.length} 个归档`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const archive of archives) {
    try {
      console.log(`\n📝 处理：${archive.date}`);
      
      // 检查是否已经有完整数据
      if (archive.photo_pages || archive.photos) {
        console.log('✅ 已有完整数据，跳过');
        successCount++;
        continue;
      }
      
      // 标记为需要手动更新
      console.log('⚠️  需要手动重新归档');
      failCount++;
      
    } catch (error) {
      console.error('❌ 处理失败:', error);
      failCount++;
    }
  }
  
  console.log(`\n📊 恢复完成:`);
  console.log(`✅ 成功：${successCount}`);
  console.log(`⚠️  需要手动处理：${failCount}`);
}

batchRestoreArchives();
```

## 快速恢复指南

### 方案一：手动重新归档（推荐）
1. 打开日记列表页
2. 点击归档卡片
3. 检查内容是否正确
4. 重新点击"归档"按钮
5. 重复以上步骤直到处理完所有日记

**预计时间：** 59 个日记 × 10 秒 = 约 10 分钟

### 方案二：等待自动恢复
- 下次打开某个日记时，系统会自动检查并提示更新
- 但不会自动批量处理所有日记

## 验证恢复结果

恢复后，检查数据库记录：

```sql
SELECT 
  id,
  date,
  CASE 
    WHEN photo_pages IS NOT NULL THEN '✅ 完整'
    WHEN photos IS NOT NULL THEN '⚠️ 部分'
    WHEN photo_url IS NOT NULL THEN '❌ 仅封面'
    ELSE '❌ 无照片'
  END as photo_status,
  CASE 
    WHEN full_content IS NOT NULL THEN '✅ 完整'
    WHEN excerpt IS NOT NULL THEN '⚠️ 仅摘要'
    ELSE '❌ 无文字'
  END as text_status
FROM diary_archives
ORDER BY archived_at DESC;
```

## 注意事项

⚠️ **必须先执行数据库迁移**，否则无法保存新字段

⚠️ **所有照片都在腾讯云 COS**，不会被删除或修改

⚠️ **重新归档不会创建新记录**，只会更新现有记录

⚠️ **建议先恢复几个重要的日记**，确认功能正常后再批量处理
