// ============================================
// 日记归档照片恢复脚本（独立版）
// 功能：自带 supabase 初始化，可在任何页面运行
// 使用方法：在浏览器控制台运行（F12）
// ============================================

(async function() {
  console.log('🔄 开始恢复归档照片...\n');
  
  // 1. 检查并初始化 Supabase
  if (typeof supabase === 'undefined') {
    console.log('⚙️  正在初始化 Supabase 客户端...');
    
    // 从环境变量或硬编码获取配置
    const SUPABASE_URL = 'https://xxrbtbeehmfmtpkyahwg.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cmJ0YmVlaG1mbXRwa3lhaHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1Njc2MDQsImV4cCI6MjA5MTE0MzYwNH0.Yh3JIRWWNYgAhXC7vjXEj0LtmO21aCUDeqU4es4VJP8';
    
    // 动态加载 Supabase SDK
    if (!window.supabase) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      document.head.appendChild(script);
      
      await new Promise(resolve => {
        script.onload = resolve;
      });
      
      console.log('✅ Supabase SDK 加载完成');
    }
    
    // 初始化客户端
    window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase 客户端初始化完成');
  }
  
  // 2. 获取所有归档
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
  
  // 3. 筛选需要恢复的归档（有 photo_url 但没有 photo_pages）
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
  
  // 4. 显示需要恢复的归档列表
  console.log('📝 需要恢复的归档列表:');
  needsRestore.forEach((archive, index) => {
    console.log(`\n${index + 1}. ${archive.date} (ID: ${archive.id})`);
    console.log(`   字数：${archive.word_count || 0}`);
    console.log(`   分类：${archive.category || '未分类'}`);
    console.log(`   照片 URL: ${archive.photo_url}`);
    console.log(`   贴纸：${archive.sticker_emoji || '无'}`);
  });
  
  // 5. 询问是否继续
  console.log('\n⚠️  即将恢复这些归档的照片数据...');
  console.log('💡 提示：这些照片已经在腾讯云 COS 中，只是需要更新数据库记录\n');
  
  // 6. 批量恢复
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
          photo_pages: photoPages,  // 直接传对象，让 Supabase 自动序列化
          photos: photos,
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
  
  // 7. 显示结果
  console.log('\n' + '='.repeat(50));
  console.log('📊 恢复完成!');
  console.log(`✅ 成功：${successCount} 个`);
  console.log(`❌ 失败：${failCount} 个`);
  console.log('='.repeat(50));
  
  console.log('\n💡 提示：刷新页面查看恢复结果');
})();
