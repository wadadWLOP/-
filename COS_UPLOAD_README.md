# Six Faces 图片上传 - 腾讯云 COS 集成

## 部署说明

### 1. 云函数部署

使用 Serverless Framework 部署云函数到腾讯云：

```bash
# 安装 Serverless Framework
npm install -g serverless

# 进入项目目录
cd d:\ku\1

# 配置腾讯云凭证
# 方式 1: 使用 .env 文件
cp .env.example .env
# 编辑 .env 文件，填入你的腾讯云密钥

# 方式 2: 使用环境变量
export TENCENT_SECRET_ID=your_secret_id
export TENCENT_SECRET_KEY=your_secret_key

# 部署云函数
serverless deploy
```

### 2. 环境变量配置

需要在 `.env` 文件中配置以下环境变量：

```env
# 腾讯云 COS 配置
TENCENT_SECRET_ID=your_secret_id
TENCENT_SECRET_KEY=your_secret_key
TENCENT_BUCKET=juiceqiuqiu-1420133198
TENCENT_REGION=ap-shanghai
```

### 3. CORS 配置

在腾讯云 COS 控制台配置 CORS 规则：

1. 进入 COS 控制台
2. 选择对应的存储桶
3. 进入"权限管理" -> "CORS 设置"
4. 添加 CORS 规则：
   - 允许来源：`*` 或你的域名
   - 允许方法：`GET, POST, PUT, DELETE, HEAD`
   - 允许头部：`*`
   - 暴露头部：`ETag`
   - 缓存时间：`60`

### 4. 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 文件说明

- `functions/upload-to-cos.js` - 云函数代码，处理图片上传到 COS
- `public/six-faces/src/main.js` - 前端代码，调用云函数 API 上传图片
- `scripts/upload-to-cos.mjs` - 本地上传脚本（用于批量上传）

## API 端点

部署后，云函数会提供一个 API 端点：

```
POST https://<service-id>.ap-shanghai.tscfunction.com/upload-to-cos
```

请求体：
```json
{
  "image": "data:image/png;base64,...",
  "faceIndex": 0
}
```

响应：
```json
{
  "url": "https://juiceqiuqiu-1420133198.cos.ap-shanghai.myqcloud.com/six-faces/face-0-1234567890.png",
  "faceIndex": 0
}
```

## 注意事项

1. 云函数需要配置正确的腾讯云密钥
2. COS 存储桶需要开启公网访问
3. 注意配置 CORS 规则，否则前端无法访问
4. 图片大小建议控制在 1MB 以内，避免上传超时
