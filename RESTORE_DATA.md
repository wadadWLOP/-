# 恢复之前的图片和文字内容

## 当前状态分析

### 1. 数据库字段
当前 `diary_archives` 表已有字段：
- ✅ `id` - 归档 ID
- ✅ `diary_id` - 原日记 ID
- ✅ `date` - 日期
- ✅ `excerpt` - 摘要（文字内容）
- ✅ `full_content` - 完整内容（所有页面的文字）
- ✅ `photo_url` - 第一张照片
- ✅ `sticker_emoji` - 贴纸
- ✅ `weather` - 天气
- ✅ `word_count` - 字数
- ✅ `category` - 分类
- ✅ `photos` - 所有照片数据（新增）
- ✅ `floating_elements` - 所有浮动元素（新增）
- ✅ `photo_pages` - 照片页数据（新增）

### 2. 恢复策略

#### 方案一：自动恢复（推荐）
修改 `useArchivedDiaries.ts` 和 `DiaryWritePage.tsx` 的加载逻辑，自动识别并恢复数据。

**加载优先级：**
1. 优先使用 `photo_pages`（最完整）
2. 其次使用 `photos` + `floating_elements`
3. 最后使用 `photo_url` + `sticker_emoji`（向后兼容）

#### 方案二：手动数据迁移
如果之前的数据只保存在 `photo_url` 和 `sticker_emoji` 中，可以：
1. 从数据库导出所有归档
2. 批量更新到新字段格式
3. 重新导入

### 3. 需要执行的操作

#### 第一步：执行数据库迁移
在 Supabase SQL Editor 中执行：

```sql
-- 添加新字段（如果不存在）
ALTER TABLE diary_archives 
ADD COLUMN IF NOT EXISTS photos JSONB DEFAULT '[]';

ALTER TABLE diary_archives 
ADD COLUMN IF NOT EXISTS floating_elements JSONB DEFAULT '[]';

ALTER TABLE diary_archives 
ADD COLUMN IF NOT EXISTS photo_pages JSONB DEFAULT '[]';
```

#### 第二步：代码已自动支持恢复
代码已经修改完成，会自动：
- ✅ 加载所有照片（从 `photo_pages` 或 `photos` 或 `photo_url`）
- ✅ 加载所有浮动元素（从 `floating_elements`）
- ✅ 加载所有文字内容（从 `full_content`）

#### 第三步：测试恢复
1. 重启开发服务器：`npm run dev`
2. 打开日记列表页
3. 点击任意归档卡片
4. 检查是否所有照片和文字都正确加载

### 4. 数据格式说明

#### 新格式（photo_pages）
```json
[
  {
    "topImage": "https://...cos.../diary-photos/xxx.jpg",
    "bottomImage": "https://...cos.../diary-photos/yyy.jpg",
    "topDescription": "描述 1",
    "bottomDescription": "描述 2"
  }
]
```

#### 中间格式（photos）
```json
[
  {
    "type": "floating",
    "src": "https://...cos.../diary-photos/xxx.jpg",
    "x": 50,
    "y": 50,
    "width": 100,
    "height": 100
  },
  {
    "type": "photoPage",
    "position": "top",
    "pageIndex": 0,
    "src": "https://...cos.../diary-photos/yyy.jpg"
  }
]
```

#### 旧格式（photo_url）
```
photo_url: "https://...cos.../diary-photos/xxx.jpg"
sticker_emoji: "🌸"
```

### 5. 注意事项

⚠️ **所有图片都已经存储在腾讯云 COS**
- 路径格式：`diary-photos/YYYY-MM-DD-xxx.jpg`
- Bucket: `juiceqiuqiu-1420133198`
- Region: `ap-shanghai`

⚠️ **向后兼容**
- 旧的归档记录（只有 `photo_url`）仍然可以正常加载
- 新的归档记录会保存完整数据
- 加载时自动识别数据格式

⚠️ **如果之前归档失败**
- 可能是因为数据库字段不存在
- 执行迁移 SQL 后，重新归档即可
