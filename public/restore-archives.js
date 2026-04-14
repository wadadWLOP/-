// ============================================
// 日记归档批量恢复脚本
// 使用方法：在日记列表页打开浏览器控制台（F12），粘贴运行
// ============================================

async function batchRestoreArchives() {
  console.log('🔄 开始批量恢复归档数据...\n');
  
  // 获取所有归档
  console.log('📊 正在获取归档列表...');
  const { data: archives, error } = await supabase
    .from('diary_archives')
    .select('*')
    .order('archived_at', { ascending: false });
  
  if (error) {
    console.error('❌ 获取归档失败:', error);
    return;
  }
  
  if (!archives || archives.length === 0) {
    console.log('📭 没有找到归档数据');
    return;
  }
  
  console.log(`✅ 找到 ${archives.length} 个归档\n`);
  
  // 统计信息
  let hasNewFormat = 0;
  let hasOldFormat = 0;
  let hasNoPhotos = 0;
  
  archives.forEach((archive, index) => {
    const status = archive.photo_pages ? '✅ 新格式' : 
                   archive.photos ? '⚠️  中间格式' : 
                   archive.photo_url ? '📷 仅封面' : '❌ 无照片';
    
    if (archive.photo_pages) hasNewFormat++;
    else if (archive.photos) hasNewFormat++;
    else if (archive.photo_url) hasOldFormat++;
    else hasNoPhotos++;
    
    console.log(`${index + 1}. ${archive.date} - ${status}`);
  });
  
  console.log('\n📊 统计:');
  console.log(`   ✅ 新格式（完整数据）: ${hasNewFormat}`);
  console.log(`   ⚠️  旧格式（仅封面）: ${hasOldFormat}`);
  console.log(`   ❌ 无照片：${hasNoPhotos}`);
  
  if (hasOldFormat + hasNoPhotos > 0) {
    console.log('\n💡 建议:');
    console.log('   1. 依次点击旧格式的归档卡片');
    console.log('   2. 检查内容是否正确加载');
    console.log('   3. 重新点击"归档"按钮保存完整数据');
    console.log(`   4. 共需要处理 ${hasOldFormat + hasNoPhotos} 个归档`);
  } else {
    console.log('\n✅ 所有归档都已使用新格式，无需恢复！');
  }
}

// 执行恢复
batchRestoreArchives();
