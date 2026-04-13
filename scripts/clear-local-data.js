// 清除本地浏览器存储的日记数据
// 在浏览器控制台中运行此代码

console.log('🧹 开始清除本地数据...');

// 清除 localStorage 中的日记数据
const diaryKeys = Object.keys(localStorage).filter(key => 
  key.startsWith('diary_') || 
  key.startsWith('last_written_') ||
  key === 'diary_preferences'
);

diaryKeys.forEach(key => {
  localStorage.removeItem(key);
  console.log(`✅ 已删除：${key}`);
});

// 清除所有与日记相关的数据
const allKeys = Object.keys(localStorage);
console.log('\n📋 当前 localStorage 中的所有键:');
allKeys.forEach(key => console.log(`  - ${key}`));

console.log('\n✨ 清除完成！请刷新页面。');

// 如果需要清除所有 localStorage（谨慎使用）：
// localStorage.clear();
// console.log('✅ 已清除所有 localStorage 数据');
