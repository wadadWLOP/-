// ============================================
// Six Faces 环境配置注入脚本
// 功能：在构建时将 .env 中的配置注入到 HTML 文件
// 使用方法：npm run build 时自动运行
// ============================================

const fs = require('fs');
const path = require('path');

const htmlFile = path.join(__dirname, '..', 'public', 'six-faces', 'index.html');
const envFile = path.join(__dirname, '..', '.env');

function loadEnv() {
  const envVars = {};
  
  if (fs.existsSync(envFile)) {
    const envContent = fs.readFileSync(envFile, 'utf-8');
    envContent.split('\n').forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#')) {
        const [key, value] = line.split('=');
        if (key && value) {
          envVars[key] = value;
        }
      }
    });
  }
  
  return envVars;
}

function injectEnvToHtml() {
  const env = loadEnv();
  
  if (!fs.existsSync(htmlFile)) {
    console.log('⚠️  Six Faces HTML 文件不存在，跳过配置注入');
    return;
  }
  
  let htmlContent = fs.readFileSync(htmlFile, 'utf-8');
  
  // 替换密钥占位符
  htmlContent = htmlContent.replace(
    /window\.VITE_TENCENT_SECRET_ID\s*=\s*['"][^'"]*['"]/,
    `window.VITE_TENCENT_SECRET_ID = '${env.VITE_TENCENT_SECRET_ID || env.TENCENT_SECRET_ID || ''}'`
  );
  
  htmlContent = htmlContent.replace(
    /window\.VITE_TENCENT_SECRET_KEY\s*=\s*['"][^'"]*['"]/,
    `window.VITE_TENCENT_SECRET_KEY = '${env.VITE_TENCENT_SECRET_KEY || env.TENCENT_SECRET_KEY || ''}'`
  );
  
  fs.writeFileSync(htmlFile, htmlContent);
  console.log('✅ Six Faces 配置注入完成');
}

injectEnvToHtml();
