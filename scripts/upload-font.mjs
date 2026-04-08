import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://xxrbtbeehmfmtpkyahwg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cmJ0YmVlaG1mbXRwa3lhaHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1Njc2MDQsImV4cCI6MjA5MTE0MzYwNH0.Yh3JIRWWNYgAhXC7vjXEj0LtmO21aCUDeqU4es4VJP8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadFont() {
  const fontPath = path.join(__dirname, '../public/fonts/乐米小奶泡体.ttf');
  const newFileName = 'lemit.ttf';
  const fileContent = fs.readFileSync(fontPath);

  console.log('📤 开始上传字体文件...\n');
  console.log(`原始文件名: 乐米小奶泡体.ttf`);
  console.log(`新文件名: ${newFileName}`);
  console.log(`文件大小: ${(fileContent.length / 1024 / 1024).toFixed(2)} MB\n`);

  const { error } = await supabase.storage
    .from('diary-images')
    .upload(newFileName, fileContent, {
      contentType: 'font/ttf',
      upsert: true
    });

  if (error) {
    console.error('❌ 上传失败:', error.message);
    return;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('diary-images')
    .getPublicUrl(newFileName);

  console.log('✅ 上传成功！');
  console.log('\n📋 字体文件 URL:');
  console.log(publicUrl);
}

uploadFont().catch(console.error);
