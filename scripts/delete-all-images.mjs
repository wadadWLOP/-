import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://xxrbtbeehmfmtpkyahwg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cmJ0YmVlaG1mbXRwa3lhaHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1Njc2MDQsImV4cCI6MjA5MTE0MzYwNH0.Yh3JIRWWNYgAhXC7vjXEj0LtmO21aCUDeqU4es4VJP8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteAllFiles() {
  console.log('🗑️  开始删除所有文件...\n');

  const { data: files, error: listError } = await supabase.storage
    .from('diary-images')
    .list('', { limit: 100 });

  if (listError) {
    console.error('❌ 列出文件失败:', listError.message);
    return;
  }

  if (!files || files.length === 0) {
    console.log('📂 存储桶已经是空的了');
    return;
  }

  console.log(`📋 发现 ${files.length} 个文件，准备删除...\n`);

  for (const file of files) {
    const { error: deleteError } = await supabase.storage
      .from('diary-images')
      .remove([file.name]);

    if (deleteError) {
      console.error(`❌ 删除失败 ${file.name}:`, deleteError.message);
    } else {
      console.log(`✅ 已删除 ${file.name}`);
    }
  }

  console.log('\n✅ 所有文件删除完成！');
}

deleteAllFiles().catch(console.error);
