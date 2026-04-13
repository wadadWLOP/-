# Six Faces 本地配置说明

## 问题
由于 GitHub 的 secret 扫描保护，包含真实密钥的代码无法推送到 GitHub。

## 解决方案

### 方案一：本地修改 HTML（最简单）

1. 打开文件：`public/six-faces/index.html`
2. 找到第 10-11 行
3. 替换为真实密钥（查看 `.env` 或 `.env.local` 文件获取）
4. **不要提交这个文件到 Git**

### 方案二：使用 .env.local（推荐）

已创建 `.env.local` 文件，包含完整密钥。

Vite 会自动读取 `.env.local`，但需要在代码中引用：

```javascript
// 在 main.js 中使用
const cos = new COS({
  SecretId: import.meta.env.VITE_TENCENT_SECRET_ID || 'YOUR_SECRET_ID',
  SecretKey: import.meta.env.VITE_TENCENT_SECRET_KEY || 'YOUR_SECRET_KEY',
  // ...
});
```

### 方案三：生产环境部署

部署到生产环境时，使用以下方式：
- 云函数（推荐）
- 后端代理
- 临时密钥（STS）

## 重要提示

⚠️ **永远不要**将包含真实密钥的文件提交到 Git
⚠️ `.env` 和 `.env.local` 已在 `.gitignore` 中，很安全
⚠️ 只修改 `public/six-faces/index.html` 用于本地测试
