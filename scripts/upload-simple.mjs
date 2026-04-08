import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://xxrbtbeehmfmtpkyahwg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cmJ0YmVlaG1mbXRwa3lhaHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1Njc2MDQsImV4cCI6MjA5MTE0MzYwNH0.Yh3JIRWWNYgAhXC7vjXEj0LtmO21aCUDeqU4es4VJP8';

const supabase = createClient(supabaseUrl, supabaseKey);

const results = {};

async function uploadFile(filePath, newFileName = null) {
  const fileName = path.basename(filePath);
  const ext = path.extname(fileName);
  const baseName = newFileName || path.basename(fileName, ext);

  const fileContent = fs.readFileSync(filePath);

  const { error } = await supabase.storage
    .from('diary-images')
    .upload(baseName + ext, fileContent, {
      contentType: ext === '.svg' ? 'image/svg+xml' : `image/${ext.slice(1)}`,
      upsert: true
    });

  if (error) {
    console.error(`❌ 上传失败 ${fileName}:`, error.message);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('diary-images')
    .getPublicUrl(baseName + ext);

  console.log(`✅ ${fileName} → ${baseName + ext}`);
  return publicUrl;
}

async function main() {
  console.log('🚀 开始重新上传图片...\n');

  // 1. 上传头像图片 (1.jpg, 2.jpg)
  console.log('📁 上传头像图片...');
  results['1'] = await uploadFile(path.join(__dirname, '../1.jpg'), '1');
  results['2'] = await uploadFile(path.join(__dirname, '../2.jpg'), '2');

  // 2. 上传 HomePage 和 GlobalCatMenu 图片
  console.log('\n📁 上传 3.jpg...');
  results['3'] = await uploadFile(path.join(__dirname, '../public/3.jpg'), '3');

  // 3. 上传 CoreFeaturesGrid 图片 (4-11.jpg)
  console.log('\n📁 上传 CoreFeaturesGrid 图片...');
  for (let i = 4; i <= 11; i++) {
    const imgPath = path.join(__dirname, `../image/${i}.jpg`);
    if (fs.existsSync(imgPath)) {
      results[`${i}`] = await uploadFile(imgPath, String(i));
    }
  }

  // 4. 上传 CheckinPage 图片 (12.png, 13.png)
  console.log('\n📁 上传 CheckinPage 图片...');
  results['12'] = await uploadFile(path.join(__dirname, '../image/12.png'), '12');
  results['13'] = await uploadFile(path.join(__dirname, '../image/13.png'), '13');

  // 5. 上传 max 目录下的所有图片
  console.log('\n📁 上传 Max 目录图片...');
  const maxDir = path.join(__dirname, '../public/max');
  if (fs.existsSync(maxDir)) {
    const files = fs.readdirSync(maxDir).filter(f => f.endsWith('.png'));
    for (const file of files) {
      const baseName = path.basename(file, '.png');
      const result = await uploadFile(path.join(maxDir, file), baseName);
      if (result) {
        results[`max_${file}`] = result;
      }
    }
  }

  console.log('\n✅ 上传完成！\n');
  console.log('📋 简化后的 URL 映射:\n');
  for (const [key, url] of Object.entries(results)) {
    if (url && key.startsWith('max_')) {
      console.log(`${key}: ${url}`);
    }
  }

  console.log('\n📋 非 max 目录的 URL:\n');
  for (const [key, url] of Object.entries(results)) {
    if (url && !key.startsWith('max_')) {
      console.log(`${key}: ${url}`);
    }
  }
}

main().catch(console.error);
