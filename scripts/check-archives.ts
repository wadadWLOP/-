import { supabase } from './src/lib/supabase';

// 检查并恢复归档数据
async function checkAndRestoreArchives() {
  console.log('🔍 检查归档数据...');
  
  // 1. 获取所有归档
  const { data: archives, error } = await supabase
    .from('diary_archives')
    .select('*')
    .order('archived_at', { ascending: false });
  
  if (error) {
    console.error('❌ 获取归档失败:', error);
    return;
  }
  
  console.log(`✅ 找到 ${archives?.length || 0} 篇归档`);
  
  if (!archives || archives.length === 0) {
    console.log('📭 暂无归档数据');
    return;
  }
  
  // 2. 检查每篇归档的数据完整性
  archives.forEach((archive, index) => {
    console.log(`\n📝 归档 #${index + 1}: ${archive.date}`);
    console.log(`   ID: ${archive.id}`);
    console.log(`   字数：${archive.word_count || 0}`);
    console.log(`   分类：${archive.category || '未分类'}`);
    console.log(`   天气：${archive.weather || 'sunny'}`);
    
    // 检查照片数据
    if (archive.photo_pages) {
      const photoPages = JSON.parse(archive.photo_pages);
      console.log(`   📸 照片页：${photoPages.length} 页`);
      photoPages.forEach((page: any, i: number) => {
        if (page.topImage) console.log(`      - 第${i+1}页上半部分：${page.topImage}`);
        if (page.bottomImage) console.log(`      - 第${i+1}页下半部分：${page.bottomImage}`);
      });
    } else if (archive.photos) {
      const photos = JSON.parse(archive.photos);
      console.log(`   📸 照片数：${photos.length}`);
      photos.forEach((photo: any, i: number) => {
        console.log(`      - 照片${i+1}: ${photo.type} - ${photo.src}`);
      });
    } else if (archive.photo_url) {
      console.log(`   📸 封面照片：${archive.photo_url}`);
    } else {
      console.log(`   📸 无照片`);
    }
    
    // 检查贴纸
    if (archive.sticker_emoji) {
      console.log(`   🏷️  贴纸：${archive.sticker_emoji}`);
    }
    
    // 检查浮动元素
    if (archive.floating_elements) {
      const elements = JSON.parse(archive.floating_elements);
      console.log(`   🎨 浮动元素：${elements.length} 个`);
    }
    
    // 检查文字内容
    if (archive.full_content) {
      const pages = archive.full_content.split('\n==========\n');
      console.log(`   📝 文字页数：${pages.length} 页`);
    } else if (archive.excerpt) {
      console.log(`   📝 摘要：${archive.excerpt.slice(0, 50)}...`);
    }
  });
  
  // 3. 提供恢复建议
  console.log('\n💡 恢复建议:');
  const needsMigration = archives.filter(a => !a.photo_pages && !a.photos);
  if (needsMigration.length > 0) {
    console.log(`   ⚠️  ${needsMigration.length} 篇归档需要迁移到新格式`);
    console.log('   建议：重新打开这些归档并点击"更新归档"以保存完整数据');
  } else {
    console.log('   ✅ 所有归档都已使用新格式，无需迁移');
  }
}

// 执行检查
checkAndRestoreArchives();
