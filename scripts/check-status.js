// ============================================
// 检查归档数据状态
// 在浏览器控制台运行（F12）
// ============================================

async function checkArchiveStatus() {
  console.log('🔍 检查归档数据状态...\n');
  
  // 检查 supabase 是否可用
  if (typeof supabase === 'undefined') {
    console.error('❌ supabase 未定义！请确保在日记应用页面运行此脚本。');
    console.log('💡 提示：先访问 http://localhost:5173/diary 或其他日记页面');
    return;
  }
  
  const { data: archives } = await supabase
    .from('diary_archives')
    .select('*');
  
  if (!archives) {
    console.log('❌ 无法获取归档数据');
    return;
  }
  
  console.log(`📊 总归档数：${archives.length}\n`);
  
  // 分类统计
  const withPhotoPages = archives.filter(a => a.photo_pages).length;
  const withPhotos = archives.filter(a => a.photos && !a.photo_pages).length;
  const withPhotoUrlOnly = archives.filter(a => a.photo_url && !a.photos && !a.photo_pages).length;
  const noPhotos = archives.filter(a => !a.photo_url && !a.photos && !a.photo_pages).length;
  
  console.log('📋 数据格式分布:');
  console.log(`   ✅ 新格式 (photo_pages): ${withPhotoPages} 个`);
  console.log(`   ⚠️  中间格式 (photos): ${withPhotos} 个`);
  console.log(`   📷 旧格式 (仅 photo_url): ${withPhotoUrlOnly} 个 ← 需要恢复`);
  console.log(`   ❌ 无照片：${noPhotos} 个\n`);
  
  if (withPhotoUrlOnly > 0) {
    console.log('📝 需要恢复的归档列表:');
    archives
      .filter(a => a.photo_url && !a.photos && !a.photo_pages)
      .forEach((a, i) => {
        console.log(`   ${i+1}. ${a.date} - ${a.photo_url}`);
      });
    console.log(`\n💡 提示：共 ${withPhotoUrlOnly} 个归档需要恢复`);
    console.log('🚀 运行 restore-photos.js 脚本自动恢复\n');
  }
}

checkArchiveStatus();
