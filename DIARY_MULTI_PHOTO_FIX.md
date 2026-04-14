# 日记归档多照片支持

## 问题
之前日记归档时只保存第一张照片和第一个贴纸，其他照片和文字内容都会丢失。

## 解决方案

### 1. 数据库迁移

已创建迁移文件：`supabase/migrations/0002_add_archive_fields.sql`

需要手动在 Supabase 后台执行以下 SQL：

```sql
-- 为 diary_archives 表添加新字段（如果不存在）
ALTER TABLE diary_archives 
ADD COLUMN IF NOT EXISTS photos JSONB DEFAULT '[]';

ALTER TABLE diary_archives 
ADD COLUMN IF NOT EXISTS floating_elements JSONB DEFAULT '[]';

ALTER TABLE diary_archives 
ADD COLUMN IF NOT EXISTS photo_pages JSONB DEFAULT '[]';
```

**执行步骤：**
1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 SQL Editor
4. 复制上面的 SQL 并执行

### 2. 代码修改

已修改 `src/pages/DiaryWritePage.tsx`：

#### 归档逻辑（handleArchive）
- ✅ 收集所有 floatingElements 中的照片
- ✅ 收集所有 photoPages 中的照片
- ✅ 保存完整的浮动元素数据
- ✅ 保存完整的照片页数据
- ✅ 保持向后兼容（保留 photo_url 和 sticker_emoji）

#### 加载逻辑（loadArchive）
- ✅ 优先加载 photo_pages（新格式）
- ✅ 其次加载 photos（中间格式）
- ✅ 最后加载 photo_url（旧格式）
- ✅ 自动重建 floatingElements 和 photoPages

### 3. 数据格式

#### photos 字段
```json
[
  {
    "type": "floating",
    "src": "https://...",
    "x": 50,
    "y": 50,
    "width": 100,
    "height": 100,
    "rotation": 0,
    "scale": 1,
    "zIndex": 1
  },
  {
    "type": "photoPage",
    "position": "top",
    "pageIndex": 0,
    "src": "https://...",
    "description": "照片描述"
  }
]
```

#### floating_elements 字段
```json
[
  {
    "id": "photo-0",
    "type": "photo",
    "x": 50,
    "y": 50,
    "width": 100,
    "height": 100,
    "rotation": 0,
    "scale": 1,
    "zIndex": 1,
    "src": "https://..."
  },
  {
    "id": "sticker-1",
    "type": "sticker",
    "x": 250,
    "y": 80,
    "width": 60,
    "height": 60,
    "rotation": 10,
    "scale": 1,
    "zIndex": 2,
    "emoji": "🌸"
  }
]
```

#### photo_pages 字段
```json
[
  {
    "topImage": "https://...",
    "bottomImage": "https://...",
    "topDescription": "描述 1",
    "bottomDescription": "描述 2"
  }
]
```

## 测试

### 测试步骤
1. 执行数据库迁移
2. 重启开发服务器：`npm run dev`
3. 创建新的日记，添加多张照片和贴纸
4. 点击归档
5. 重新打开归档的日记，检查是否所有照片都正确加载

### 向后兼容
- ✅ 旧的归档记录（只有 photo_url）仍然可以正常加载
- ✅ 新的归档记录会保存完整数据
- ✅ 加载时自动识别数据格式

## 注意事项

⚠️ **必须先执行数据库迁移**，否则归档会失败（字段不存在）

⚠️ 腾讯云 COS 已正确配置，所有照片都会自动上传到 COS

⚠️ `.env` 文件已包含完整的腾讯云密钥配置
