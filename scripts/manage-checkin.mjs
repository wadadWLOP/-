import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 读取 .env 文件
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');

try {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
} catch (error) {
  console.error('❌ 读取 .env 文件失败:', error);
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 错误：缺少环境变量');
  console.error('请确保 .env 文件中包含 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 显示帮助信息
function showHelp() {
  console.log(`
📒 笨蛋打卡管理工具

使用方法:
  node scripts/manage-checkin.mjs [命令] [选项]

命令:
  list           列出所有打卡记录和次数
  delete-record  删除一条打卡记录（按 ID）
  decrease-count 减少打卡次数（按项目 ID）

选项:
  --id <ID>      指定记录或项目 ID
  --help         显示帮助信息

示例:
  node scripts/manage-checkin.mjs list
  node scripts/manage-checkin.mjs delete-record --id 5
  node scripts/manage-checkin.mjs decrease-count --id 1
  `);
}

// 列出所有记录和次数
async function listRecords() {
  console.log('\n📊 加载打卡数据...\n');

  // 获取打卡项目
  const { data: items, error: itemsError } = await supabase
    .from('checkin_items')
    .select('*')
    .order('id', { ascending: true });

  if (itemsError) {
    console.error('❌ 获取打卡项目失败:', itemsError);
    return;
  }

  // 获取打卡记录
  const { data: records, error: recordsError } = await supabase
    .from('checkin_records')
    .select('*')
    .order('created_at', { descending: true });

  if (recordsError) {
    console.error('❌ 获取打卡记录失败:', recordsError);
    return;
  }

  console.log('📋 打卡项目次数:');
  console.log('─'.repeat(50));
  items?.forEach(item => {
    console.log(`  ID: ${item.id} | ${item.title} | 次数：${item.count}`);
  });

  console.log('\n📒 打卡记录列表:');
  console.log('─'.repeat(50));
  if (records && records.length > 0) {
    records.forEach((record, index) => {
      console.log(`  [${index + 1}] ID: ${record.id}`);
      console.log(`      项目：${record.item_name} (${record.item_emoji})`);
      console.log(`      日期：${record.date}`);
      console.log(`      罪证：${record.evidence || '无'}`);
      console.log(`      创建时间：${record.created_at}`);
      console.log('');
    });
  } else {
    console.log('  暂无记录');
  }
}

// 删除打卡记录
async function deleteRecord(recordId) {
  if (!recordId) {
    console.error('❌ 错误：请提供记录 ID');
    console.error('使用示例：node scripts/manage-checkin.mjs delete-record --id 5');
    return;
  }

  console.log(`\n🗑️  正在删除记录 ID: ${recordId}...`);

  // 先获取记录信息
  const { data: record } = await supabase
    .from('checkin_records')
    .select('*')
    .eq('id', recordId)
    .single();

  if (!record) {
    console.error(`❌ 记录 ID ${recordId} 不存在`);
    return;
  }

  console.log(`   找到记录：${record.item_name} - ${record.date}`);
  console.log(`   罪证：${record.evidence || '无'}`);

  // 确认删除
  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const answer = await new Promise(resolve => {
    rl.question('\n确定要删除这条记录吗？(y/N): ', resolve);
    rl.close();
  });

  if (answer.toLowerCase() !== 'y') {
    console.log('❌ 取消删除');
    return;
  }

  // 删除记录
  const { error } = await supabase
    .from('checkin_records')
    .delete()
    .eq('id', recordId);

  if (error) {
    console.error('❌ 删除失败:', error);
    return;
  }

  console.log('✅ 记录删除成功！');

  // 询问是否要减少对应的次数
  const rl2 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const answer2 = await new Promise(resolve => {
    rl2.question('\n是否要减少该项目的一次打卡次数？(y/N): ', resolve);
    rl2.close();
  });

  if (answer2.toLowerCase() === 'y') {
    // 获取当前次数
    const { data: item } = await supabase
      .from('checkin_items')
      .select('count')
      .eq('id', record.item_id)
      .single();

    if (item && item.count > 0) {
      const newCount = item.count - 1;
      const { error: updateError } = await supabase
        .from('checkin_items')
        .update({ count: newCount })
        .eq('id', record.item_id);

      if (updateError) {
        console.error('❌ 更新次数失败:', updateError);
      } else {
        console.log(`✅ 次数已更新：${item.count} → ${newCount}`);
      }
    }
  }
}

// 减少打卡次数
async function decreaseCount(itemId) {
  if (!itemId) {
    console.error('❌ 错误：请提供项目 ID');
    console.error('使用示例：node scripts/manage-checkin.mjs decrease-count --id 1');
    return;
  }

  console.log(`\n📉 正在减少项目 ID: ${itemId} 的次数...`);

  // 获取当前次数
  const { data: item } = await supabase
    .from('checkin_items')
    .select('*')
    .eq('id', itemId)
    .single();

  if (!item) {
    console.error(`❌ 项目 ID ${itemId} 不存在`);
    return;
  }

  console.log(`   当前项目：${item.title}`);
  console.log(`   当前次数：${item.count}`);

  if (item.count <= 0) {
    console.log('⚠️  次数已经为 0，无法减少');
    return;
  }

  const newCount = item.count - 1;

  const { error } = await supabase
    .from('checkin_items')
    .update({ count: newCount })
    .eq('id', itemId);

  if (error) {
    console.error('❌ 更新失败:', error);
    return;
  }

  console.log(`✅ 次数更新成功：${item.count} → ${newCount}`);
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '--help' || command === '-h') {
    showHelp();
    return;
  }

  switch (command) {
    case 'list':
      await listRecords();
      break;

    case 'delete-record': {
      const idIndex = args.indexOf('--id');
      const recordId = idIndex !== -1 ? parseInt(args[idIndex + 1]) : null;
      await deleteRecord(recordId);
      break;
    }

    case 'decrease-count': {
      const idIndex = args.indexOf('--id');
      const itemId = idIndex !== -1 ? parseInt(args[idIndex + 1]) : null;
      await decreaseCount(itemId);
      break;
    }

    default:
      console.error(`❌ 未知命令：${command}`);
      showHelp();
  }
}

// 运行主函数
main().catch(console.error);
