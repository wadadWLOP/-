import COS from 'cos-js-sdk-v5';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '../.env');

// 读取 .env 文件
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const cos = new COS({
  SecretId: envVars.VITE_TENCENT_SECRET_ID,
  SecretKey: envVars.VITE_TENCENT_SECRET_KEY
});

const bucket = 'juiceqiuqiu-1420133198';
const region = 'ap-shanghai';

async function listCatImages() {
  console.log('🔍 检查 COS 上的猫猫图片...\n');
  
  try {
    // 列出 max/ 目录下的所有文件
    const result = await cos.getBucket({
      Bucket: bucket,
      Region: region,
      Prefix: 'max/',
    });
    
    console.log(`📁 Bucket: ${bucket}/${region}`);
    console.log(`📂 目录：max/\n`);
    
    const catImages = result.Contents.filter(item => {
      const key = item.Key.toLowerCase();
      return ['stand', 'walk', 'sleep', 'fish', 'kiss', 'drag', 'falling'].some(name => 
        key.includes(name)
      );
    });
    
    if (catImages.length === 0) {
      console.log('❌ 未找到猫猫挂件图片！');
      console.log('\n可能的原因：');
      console.log('1. 图片还没有上传到 COS');
      console.log('2. 图片不在 max/ 目录下');
      console.log('3. 图片文件名不包含已知的动作名');
    } else {
      console.log(`✅ 找到 ${catImages.length} 张猫猫图片:\n`);
      catImages.forEach(item => {
        console.log(`  - ${item.Key} (${(item.Size / 1024).toFixed(2)} KB)`);
      });
    }
    
    // 也检查根目录
    console.log('\n\n📂 检查根目录...\n');
    const rootResult = await cos.getBucket({
      Bucket: bucket,
      Region: region,
      MaxKeys: 100,
    });
    
    const rootCatImages = rootResult.Contents.filter(item => {
      const key = item.Key.toLowerCase();
      return ['stand', 'walk', 'sleep', 'fish', 'kiss', 'drag', 'falling', 'cat'].some(name => 
        key.includes(name)
      );
    });
    
    if (rootCatImages.length > 0) {
      console.log(`✅ 根目录找到 ${rootCatImages.length} 张相关图片:\n`);
      rootCatImages.forEach(item => {
        console.log(`  - ${item.Key} (${(item.Size / 1024).toFixed(2)} KB)`);
      });
    }
    
  } catch (error) {
    console.error('❌ 错误:', error.message);
    console.error('\n请检查 .env 文件中的 COS 配置是否正确');
  }
}

listCatImages();
