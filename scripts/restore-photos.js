// ============================================
// 日记归档照片恢复脚本
// 功能：从数据库获取归档记录，提取照片 URL，重新保存到 photo_pages 字段
// 使用方法：在浏览器控制台运行（F12）
// ============================================

async function restoreArchivePhotos() {
  console.log('🔄 开始恢复归档照片...\n');
  
  // 检查 supabase 是否可用
  if (typeof supabase === 'undefined') {
    console.error('❌ supabase 未定义！请确保在日记应用页面运行此脚本。');
    console.log('💡 提示：先访问 http://localhost:5173/diary 或其他日记页面');
    return;
  }
  
  // 1. 获取所有归档
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
  
  // 2. 筛选需要恢复的归档（有 photo_url 但没有 photo_pages）
  const needsRestore = archives.filter(a => 
    a.photo_url && 
    !a.photo_pages && 
    !a.photos
  );
  
  console.log(`📋 需要恢复的归档：${needsRestore.length} 个\n`);
  
  if (needsRestore.length === 0) {
    console.log('✅ 所有归档都已包含完整照片数据，无需恢复！');
    return;
  }
  
  // 3. 显示需要恢复的归档列表
  console.log('📝 需要恢复的归档列表:');
  needsRestore.forEach((archive, index) => {
    console.log(`\n${index + 1}. ${archive.date} (ID: ${archive.id})`);
    console.log(`   字数：${archive.word_count || 0}`);
    console.log(`   分类：${archive.category || '未分类'}`);
    console.log(`   照片 URL: ${archive.photo_url}`);
    console.log(`   贴纸：${archive.sticker_emoji || '无'}`);
  });
  
  // 4. 询问是否继续
  console.log('\n⚠️  即将恢复这些归档的照片数据...');
  console.log('💡 提示：这些照片已经在腾讯云 COS 中，只是需要更新数据库记录\n');
  
  // 5. 批量恢复
  let successCount = 0;
  let failCount = 0;
  
  for (const archive of needsRestore) {
    try {
      console.log(`\n🔄 处理：${archive.date}`);
      
      // 创建 photo_pages 数据
      const photoPages = [{
        topImage: archive.photo_url,
        bottomImage: null,
        topDescription: '',
        bottomDescription: ''
      }];
      
      // 创建 photos 数据
      const photos = [{
        type: 'photoPage',
        position: 'top',
        pageIndex: 0,
        src: archive.photo_url,
        description: ''
      }];
      
      // 更新数据库
      const { error } = await supabase
        .from('diary_archives')
        .update({
          photo_pages: JSON.stringify(photoPages),
          photos: JSON.stringify(photos),
        })
        .eq('id', archive.id);
      
      if (error) throw error;
      
      console.log(`✅ 恢复成功`);
      successCount++;
      
    } catch (error) {
      console.error(`❌ 恢复失败:`, error);
      failCount++;
    }
    
    // 避免请求过快
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // 6. 显示结果
  console.log('\n' + '='.repeat(50));
  console.log('📊 恢复完成!');
  console.log(`✅ 成功：${successCount} 个`);
  console.log(`❌ 失败：${failCount} 个`);
  console.log('='.repeat(50));
}

// 执行恢复
restoreArchivePhotos();
