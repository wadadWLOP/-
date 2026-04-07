import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 替换为你的 Supabase 配置
const SUPABASE_URL = 'https://xxrbtbeehmfmtpkyahwg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cmJ0YmVlaG1mbXRwa3lhaHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1Njc2MDQsImV4cCI6MjA5MTE0MzYwNH0.Yh3JIRWWNYgAhXC7vjXEj0LtmO21aCUDeqU4es4VJP8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 要上传的文件夹路径
const IMAGE_DIRS = [
  path.join(__dirname, '..', 'image'),
  path.join(__dirname, '..', 'public', 'max'),
  path.join(__dirname, '..', 'public'),
];

// 支持的文件格式
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

async function uploadFile(filePath: string) {
  const fileName = path.basename(filePath);
  const ext = path.extname(fileName);
  const nameWithoutExt = path.basename(fileName, ext);
  
  // 创建带时间戳的文件名避免冲突
  const timestamp = Date.now();
  const newFileName = `${nameWithoutExt}-${timestamp}${ext}`;
  
  const fileContent = fs.readFileSync(filePath);
  
  const { data, error } = await supabase.storage
    .from('diary-images')
    .upload(newFileName, fileContent, {
      contentType: ext === '.svg' ? 'image/svg+xml' : `image/${ext.slice(1)}`,
    });
  
  if (error) {
    console.error(`❌ 上传失败 ${fileName}:`, error.message);
    return null;
  }
  
  const { data: { publicUrl } } = supabase.storage
    .from('diary-images')
    .getPublicUrl(newFileName);
  
  console.log(`✅ 上传成功 ${fileName} → ${publicUrl}`);
  return { originalName: fileName, url: publicUrl, supabaseName: newFileName };
}

async function main() {
  console.log('🚀 开始批量上传图片到 Supabase...\n');
  
  const results: any[] = [];
  
  for (const dir of IMAGE_DIRS) {
    if (!fs.existsSync(dir)) {
      console.log(`⚠️  目录不存在：${dir}`);
      continue;
    }
    
    console.log(`📁 扫描目录：${dir}`);
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (IMAGE_EXTENSIONS.includes(ext)) {
        const filePath = path.join(dir, file);
        const result = await uploadFile(filePath);
        if (result) {
          results.push(result);
        }
        // 避免请求过快
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
  }
  
  console.log('\n========================================');
  console.log(`🎉 上传完成！共上传 ${results.length} 张图片`);
  console.log('========================================\n');
  
  // 保存映射关系
  const mappingFile = path.join(__dirname, 'image-mapping.json');
  fs.writeFileSync(mappingFile, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`📄 图片映射已保存到：${mappingFile}`);
  console.log('\n图片列表:');
  results.forEach((r, i) => {
    console.log(`${i + 1}. ${r.originalName} → ${r.url}`);
  });
}

main().catch(console.error);
