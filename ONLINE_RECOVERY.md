# 🔄 在 juiceqiuqiu.top 恢复照片指南

## 📋 问题

你的网站 `https://juiceqiuqiu.top/diary` 显示 404，可能是：
1. 网站还没有部署
2. 或者部署配置有问题

但无论如何，你可以使用以下方法恢复照片数据。

## ✅ 解决方案

### 方案一：使用独立版恢复脚本（推荐）

这个脚本自带 Supabase 初始化，可以在**任何页面**运行。

#### 步骤 1：获取 Supabase 配置

1. 打开 `.env` 文件
2. 找到以下配置：
   ```
   VITE_SUPABASE_URL=https://xxx-xxx.supabase.co
   VITE_SUPABASE_ANON_KEY=xxx.xxx.xxx
   ```

#### 步骤 2：修改恢复脚本

打开 `scripts/restore-photos-standalone.js`

找到第 19-20 行，替换为你的配置：
```javascript
const SUPABASE_URL = 'https://你的项目 ID.supabase.co';
const SUPABASE_ANON_KEY = '你的匿名密钥';
```

#### 步骤 3：运行脚本

1. **打开任何网页**（甚至可以是空白页）
2. 按 `F12` 打开控制台
3. 复制 `scripts/restore-photos-standalone.js` 的全部内容
4. 粘贴到控制台
5. 按 `Enter` 运行

### 方案二：先修复网站部署

如果你的网站还没有部署，需要先部署：

#### 检查部署状态

1. 访问 https://juiceqiuqiu.top
2. 如果显示 404，说明网站没有正确部署

#### 部署方法（以 Vercel 为例）

1. 登录 Vercel
2. 导入你的 GitHub 仓库
3. 配置环境变量（从 `.env` 文件复制）
4. 部署

部署成功后，访问 `https://juiceqiuqiu.top/diary`，然后使用普通版脚本。

### 方案三：直接在 Supabase 后台恢复

如果脚本运行有问题，可以直接在 Supabase 后台手动更新。

#### 步骤：

1. 登录 https://supabase.com/dashboard
2. 进入 **Table Editor**
3. 选择 `diary_archives` 表
4. 筛选出需要恢复的记录（`photo_url` 不为空，`photo_pages` 为空）
5. 手动编辑每条记录，添加 `photo_pages` 字段

## 📝 使用独立版脚本的详细步骤

### 1. 获取 Supabase 密钥

打开 `.env` 文件，复制：
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. 修改脚本

打开 `scripts/restore-photos-standalone.js`

修改第 19-20 行：
```javascript
const SUPABASE_URL = 'https://你的实际 URL';  // 粘贴上面的 URL
const SUPABASE_ANON_KEY = '你的实际密钥';  // 粘贴上面的密钥
```

### 3. 运行脚本

1. 打开浏览器
2. 按 `F12` 打开开发者工具
3. 切换到 **Console** 标签
4. 复制修改后的脚本内容
5. 粘贴到控制台
6. 按 `Enter` 运行

### 4. 查看结果

脚本会自动：
- ✅ 连接 Supabase
- ✅ 获取所有归档
- ✅ 找出需要恢复的记录
- ✅ 批量更新数据库
- ✅ 显示恢复结果

## ⚠️ 注意事项

1. **脚本只运行一次**
   - 恢复完成后不需要再次运行
   - 可以多次运行（幂等的）

2. **照片不会重复上传**
   - 照片已经在腾讯云 COS
   - 只是更新数据库记录

3. **关于照片描述文字**
   - 脚本只恢复照片 URL
   - 照片描述需要手动添加

4. **如果网站是 404**
   - 使用独立版脚本（方案一）
   - 或者先部署网站（方案二）

## 🔍 验证恢复结果

### 方法一：在 Supabase 后台查看

1. 登录 Supabase Dashboard
2. 进入 Table Editor → diary_archives
3. 检查 `photo_pages` 字段是否有数据

### 方法二：访问网站查看

如果网站已部署：
1. 访问 https://juiceqiuqiu.top/diary
2. 点击任意归档
3. 检查照片是否显示

## 🆘 常见问题

### Q: 脚本运行后没反应？
A: 检查控制台是否有错误，确认 Supabase URL 和密钥正确。

### Q: 提示权限错误？
A: 确保使用的是匿名密钥（anon key），不是 service role key。

### Q: 恢复后网站还是 404？
A: 需要先部署网站，参考方案二。

### Q: 可以恢复照片描述吗？
A: 当前脚本只恢复照片 URL，文字需要手动添加。

---

**快速开始：**
1. 打开 `.env` 获取 Supabase 配置
2. 修改 `scripts/restore-photos-standalone.js`
3. 在任何页面按 F12 运行脚本
4. 等待恢复完成

**1 分钟恢复所有照片！** 🎉
