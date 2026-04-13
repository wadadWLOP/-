# Six Faces 图片上传配置说明

## 重要提示

由于 GitHub 的 secret 扫描保护，代码中使用占位符代替了真实的腾讯云密钥。

## 配置步骤

### 1. 在 HTML 中添加密钥配置

编辑 `public/six-faces/index.html`，在 `<head>` 标签中添加：

```html
<script>
  window.VITE_TENCENT_SECRET_ID = 'YOUR_SECRET_ID';
  window.VITE_TENCENT_SECRET_KEY = 'YOUR_SECRET_KEY';
</script>
```

### 2. 或者修改 main.js

编辑 `public/six-faces/src/main.js`，将 COS 配置中的占位符替换为真实密钥：

```javascript
const cos = new COS({
  SecretId: 'YOUR_SECRET_ID',  // 替换为你的 SecretId
  SecretKey: 'YOUR_SECRET_KEY',  // 替换为你的 SecretKey
  Bucket: 'juiceqiuqiu-1420133198',
  Region: 'ap-shanghai'
});
```

## 本地开发环境配置

1. 复制 `.env.example` 为 `.env`
2. 在 `.env` 文件中填入真实的腾讯云密钥

```env
VITE_TENCENT_SECRET_ID=YOUR_SECRET_ID
VITE_TENCENT_SECRET_KEY=YOUR_SECRET_KEY
VITE_TENCENT_BUCKET=juiceqiuqiu-1420133198
VITE_TENCENT_REGION=ap-shanghai
```

## 生产环境部署

生产环境建议使用以下方式之一：

1. **云函数方式**：部署云函数处理上传，避免在前端暴露密钥
2. **后端代理**：通过后端服务器代理上传请求
3. **临时密钥**：使用腾讯云 STS 服务生成临时密钥

## 注意事项

- ⚠️ 不要将真实密钥提交到 Git 仓库
- ⚠️ 前端暴露密钥存在安全风险，建议仅用于测试环境
- ⚠️ 生产环境务必使用云函数或后端代理方式
