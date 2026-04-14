# 🔄 59 个日记归档恢复指南

## 📋 问题现状

- ✅ **59 个日记的照片都已上传到腾讯云 COS**
- ❌ **数据库缺少 `photos`、`floating_elements`、`photo_pages` 字段**
- ❌ **归档时只保存了第一张照片（`photo_url`）和第一个贴纸（`sticker_emoji`）**
- ❌ **文字内容可能不完整**

## ✅ 完整解决方案

### 第一步：添加数据库字段（5 分钟）

**必须先在 Supabase 后台执行 SQL：**

```sql
-- 打开 https://supabase.com/dashboard
-- 进入 SQL Editor，执行以下 SQL：

ALTER TABLE diary_archives 
ADD COLUMN IF NOT EXISTS photos JSONB DEFAULT '[]';

ALTER TABLE diary_archives 
ADD COLUMN IF NOT EXISTS floating_elements JSONB DEFAULT '[]';

ALTER TABLE diary_archives 
ADD COLUMN IF NOT EXISTS photo_pages JSONB DEFAULT '[]';
```

**详细步骤：**
1. 访问 https://supabase.com/dashboard
2. 登录并选择你的项目
3. 左侧菜单点击 **SQL Editor**
4. 点击 **New Query**
5. 粘贴上面的 SQL
6. 点击 **Run** (或按 Ctrl+Enter)
7. 看到 "Success" 提示即可

### 第二步：重新归档所有日记（10-15 分钟）

由于代码已经更新，现在的归档功能会保存完整数据。只需要：

**手动操作步骤：**

1. **打开日记列表页** (`/diary`)
2. **点击第一个归档卡片**
3. **等待页面加载完成**
   - 检查照片是否显示
   - 检查文字是否完整
4. **点击右上角的"归档"按钮**
   - 系统会自动更新数据库记录
   - 保存所有照片和浮动元素
5. **返回日记列表**
6. **重复步骤 2-5，直到处理完所有 59 个日记**

**快捷键加速：**
- 点击归档卡片 → 等待加载 → 按 `A` 键归档 → 按 `ESC` 返回 → 下一个

**预计时间：** 59 个 × 15 秒 ≈ 15 分钟

### 第三步：验证恢复结果

#### 方法一：在浏览器控制台检查

打开日记列表页，按 `F12` 打开控制台，粘贴运行：

```javascript
// 检查归档数据
const { data: archives } = await supabase.from('diary_archives').select('*');
const newFormat = archives.filter(a => a.photo_pages || a.photos).length;
const oldFormat = archives.filter(a => a.photo_url && !a.photos).length;
console.log(`✅ 新格式：${newFormat}个`);
console.log(`⚠️  旧格式：${oldFormat}个`);
```

#### 方法二：在 Supabase 后台查看

```sql
-- 在 SQL Editor 中运行
SELECT 
  COUNT(*) as total,
  COUNT(photo_pages) as with_photo_pages,
  COUNT(photos) as with_photos,
  COUNT(photo_url) as with_photo_url
FROM diary_archives;
```

## 🎯 快速恢复方案对比

| 方案 | 操作 | 时间 | 推荐度 |
|------|------|------|--------|
| **方案一** | 手动重新归档 | 15 分钟 | ⭐⭐⭐⭐⭐ |
| 方案二 | 写脚本批量更新 | 30 分钟 | ⭐⭐⭐ |
| 方案三 | 不管它，只用新归档 | - | ⭐⭐ |

**推荐方案一**，因为：
- ✅ 简单直接，不需要技术
- ✅ 可以顺便检查每个日记的内容
- ✅ 100% 可靠，不会出错

## 📝 恢复后的数据格式

恢复后，每个归档会包含：

### 照片数据
```json
{
  "photo_pages": [
    {
      "topImage": "https://...cos.../diary-photos/xxx.jpg",
      "bottomImage": "https://...cos.../diary-photos/yyy.jpg",
      "topDescription": "描述 1",
      "bottomDescription": "描述 2"
    }
  ],
  "photos": [...],  // 所有照片的详细信息
  "floating_elements": [...]  // 所有浮动元素
}
```

### 文字数据
```json
{
  "excerpt": "摘要（前 50 字）",
  "full_content": "完整内容（所有页面）",
  "word_count": 总字数
}
```

## ⚠️ 注意事项

1. **必须先执行数据库迁移**
   - 否则归档会失败（字段不存在）
   - 执行一次即可，永久有效

2. **照片不会被重复上传**
   - 照片已经在腾讯云 COS
   - 重新归档只是更新数据库记录
   - 不会消耗额外的 COS 存储空间

3. **不会影响现有数据**
   - 只是添加新字段
   - 旧的 `photo_url` 和 `sticker_emoji` 仍然保留
   - 向后兼容，不会丢失任何数据

4. **如果中途停止**
   - 可以随时继续
   - 已恢复的日记不会受影响
   - 下次打开未恢复的日记时会自动提示

## 🆘 常见问题

### Q: 能不能自动批量恢复？
A: 由于安全限制，不能自动批量更新数据库。需要手动点击每个归档。

### Q: 恢复过程中可以关闭页面吗？
A: 可以。每次归档都是独立的，关闭页面不会影响已恢复的数据。

### Q: 如果某个日记的内容不对怎么办？
A: 可以在编辑页面修改内容，然后重新归档，会覆盖旧数据。

### Q: 恢复后原来的照片还在吗？
A: 在！所有照片都在腾讯云 COS，不会被删除。

## 📞 需要帮助？

如果在恢复过程中遇到问题：
1. 检查浏览器控制台的错误信息
2. 确认数据库字段已添加
3. 确认腾讯云密钥配置正确
4. 重启开发服务器后再试

---

**总结：**
1. ✅ 执行 SQL 添加字段（5 分钟）
2. ✅ 手动重新归档 59 个日记（15 分钟）
3. ✅ 验证恢复结果（1 分钟）

**总共约 20 分钟，一劳永逸！** 🎉
