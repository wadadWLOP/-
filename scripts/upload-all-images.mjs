import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://xxrbtbeehmfmtpkyahwg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cmJ0YmVlaG1mbXRwa3lhaHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1Njc2MDQsImV4cCI6MjA5MTE0MzYwNH0.Yh3JIRWWNYgAhXC7vjXEj0LtmO21aCUDeqU4es4VJP8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadFile(filePath, bucket = 'diary-images') {
  const fileName = path.basename(filePath);
  const ext = path.extname(fileName);
  const nameWithoutExt = path.basename(fileName, ext);
  
  // 创建带时间戳的文件名避免冲突
  const timestamp = Date.now();
  const newFileName = `${nameWithoutExt}-${timestamp}${ext}`;
  
  const fileContent = fs.readFileSync(filePath);
  
  const { error } = await supabase.storage
    .from(bucket)
    .upload(newFileName, fileContent, {
      contentType: ext === '.svg' ? 'image/svg+xml' : `image/${ext.slice(1)}`,
    });
  
  if (error) {
    console.error(`❌ 上传失败 ${fileName}:`, error.message);
    return null;
  }
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(newFileName);
  
  console.log(`✅ 上传成功 ${fileName} → ${publicUrl}`);
  return { originalName: fileName, url: publicUrl, supabaseName: newFileName };
}

async function main() {
  console.log('🚀 开始上传图片...\n');
  
  const results = {};
  
  // 1. 上传 image/12.png 和 13.png
  console.log('📁 上传 CheckinPage 图片...');
  const image12 = await uploadFile(path.join(__dirname, '../image/12.png'));
  const image13 = await uploadFile(path.join(__dirname, '../image/13.png'));
  if (image12) results['image12'] = image12.url;
  if (image13) results['image13'] = image13.url;
  
  // 2. 上传 public/3.jpg
  console.log('\n📁 上传 GlobalCatMenu 图片...');
  const image3 = await uploadFile(path.join(__dirname, '../public/3.jpg'));
  if (image3) results['image3'] = image3.url;
  
  // 3. 上传 CoreFeaturesGrid 的图片 (4.jpg - 10.jpg)
  console.log('\n📁 上传 CoreFeaturesGrid 图片...');
  for (let i = 4; i <= 10; i++) {
    const imgPath = path.join(__dirname, `../image/${i}.jpg`);
    if (fs.existsSync(imgPath)) {
      const result = await uploadFile(imgPath);
      if (result) results[`image${i}`] = result.url;
    }
  }
  
  // 4. 上传 max 目录下的所有图片
  console.log('\n📁 上传 Max 目录图片...');
  const maxDir = path.join(__dirname, '../public/max');
  if (fs.existsSync(maxDir)) {
    const files = fs.readdirSync(maxDir).filter(f => f.endsWith('.png'));
    for (const file of files) {
      const result = await uploadFile(path.join(maxDir, file));
      if (result) {
        // 保存原始文件名以便后续替换
        const key = `max_${file}`;
        results[key] = result.url;
      }
    }
  }
  
  console.log('\n✅ 所有图片上传完成!\n');
  console.log('📋 图片 URL 列表:');
  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error);
