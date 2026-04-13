# Six Faces 图片上传 - 配置指南

## 问题说明

由于 GitHub 的 secret 扫描保护，代码中无法直接包含腾讯云密钥。

## 解决方案

### 方案一：在 HTML 中添加配置（推荐）

编辑 `public/six-faces/index.html`，在 `<head>` 标签中添加：

```html
<script>
  // 替换为你的真实密钥
  window.VITE_TENCENT_SECRET_ID = 'YOUR_SECRET_ID';
  window.VITE_TENCENT_SECRET_KEY = 'YOUR_SECRET_KEY';
</script>
```

### 方案二：修改 main.js

编辑 `public/six-faces/src/main.js`，找到 COS 配置部分：

```javascript
const cos = new COS({
  SecretId: 'YOUR_SECRET_ID',  // 替换为你的 SecretId
  SecretKey: 'YOUR_SECRET_KEY',  // 替换为你的 SecretKey
  Bucket: 'juiceqiuqiu-1420133198',
  Region: 'ap-shanghai'
});
```

## 本地开发配置

在本地开发时，可以使用以下密钥：

- **SecretId**: 查看 .env 文件
- **SecretKey**: 查看 .env 文件
- **Bucket**: `juiceqiuqiu-1420133198`
- **Region**: `ap-shanghai`

## 使用说明

1. 按照上述任一方案配置密钥
2. 打开页面，滚动到任意 section（s1-s5）
3. 鼠标悬停时会看到右上角的上传按钮
4. 点击按钮选择图片文件
5. 图片会自动上传到 COS 并显示在对应的正方体面

## 注意事项

- ⚠️ 配置完成后不要将密钥提交到 Git
- ⚠️ 生产环境建议使用云函数或后端代理方式上传
- ⚠️ 图片大小建议控制在 1MB 以内
