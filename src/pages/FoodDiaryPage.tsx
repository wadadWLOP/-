import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AddFoodModal } from '../components/UI/AddFoodModal';

interface FoodEntry {
  id: string;
  images: string[];
  name: string;
  rating: 'yum' | 'ok' | 'bad' | 'god';
  payer: 'qiuqiu' | 'guozhi';
  tags: string[];
  calorieLevel: number;
  date: string;
  comment: string;
}

const ratingEmojis = {
  god: '😍',
  yum: '😋',
  ok: '🙂',
  bad: '🤢',
};

const payerLabels = {
  qiuqiu: '秋秋',
  guozhi: '果汁',
};

const bgColors = [
  'bg-[#f5f0eb]',
  'bg-[#f0ebe5]',
  'bg-[#ebe5e0]',
  'bg-[#f5f0f0]',
  'bg-[#f0ece5]',
];

export function FoodDiaryPage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'up' | 'down' | 'left' | 'right' | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('food-diary-entries');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const handleShowControls = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        window.clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    window.addEventListener('click', handleShowControls);
    return () => {
      window.removeEventListener('click', handleShowControls);
      if (controlsTimeoutRef.current) {
        window.clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  const handleAddFood = (newEntry: Omit<FoodEntry, 'id' | 'date'>) => {
    const entry: FoodEntry = {
      ...newEntry,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    const newEntries = [entry, ...entries];
    setEntries(newEntries);
    localStorage.setItem('food-diary-entries', JSON.stringify(newEntries));
    setCurrentIndex(0);
  };

  const goToNext = useCallback(() => {
    if (isAnimating || currentIndex >= entries.length - 1) return;
    
    setIsAnimating(true);
    setSwipeDirection('up');
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setSwipeDirection(null);
      setTimeout(() => setIsAnimating(false), 50);
    }, 300);
  }, [currentIndex, entries.length, isAnimating]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
    const minSwipe = 50;
    
    if (Math.abs(deltaX) > minSwipe || Math.abs(deltaY) > minSwipe) {
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        if (deltaY < 0) {
          goToNext();
        }
      } else {
        if (deltaX < 0) {
          goToNext();
        }
      }
    }
    
    touchStartRef.current = null;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0) {
      goToNext();
    }
  };

  const getBgColor = (rating: string) => {
    switch (rating) {
      case 'god': return 'from-[#fce7f3] to-[#fbcfe8]';
      case 'yum': return 'from-[#fed7aa] to-[#fde68a]';
      case 'ok': return 'from-[#e5e7eb] to-[#d1d5db]';
      case 'bad': return 'from-[#e9d5ff] to-[#d8b4fe]';
      default: return 'from-[#e5e7eb] to-[#d1d5db]';
    }
  };

  const currentEntry = entries[currentIndex];

  if (!currentEntry) {
    return (
      <div className="min-h-screen bg-[#f5f0eb] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">🍽️</div>
          <p className="text-gray-500 font-medium">暂无美食记录</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-rose-400 to-orange-400 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
          >
            添加第一份美食
          </button>
        </div>
        {showAddModal && (
          <AddFoodModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddFood}
            placeholder="点击上传美食照片"
            quickTags={['早餐', '午餐', '晚餐', '宵夜', '甜品', '饮料']}
          />
        )}
      </div>
    );
  }

  const timeAgo = getTimeAgo(new Date(currentEntry.date));
  const date = new Date(currentEntry.date);
  const dateStr = `${date.getMonth() + 1}月${date.getDate()}日`;
  const yearStr = date.getFullYear().toString();

  return (
    <div 
      className={`min-h-screen ${bgColors[currentIndex % bgColors.length]} relative overflow-hidden transition-colors duration-700`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* 纸张纹理 */}
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
      }} />

      {/* 顶部导航 */}
      <div className={`absolute top-0 left-0 right-0 z-50 p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <button
          onClick={() => navigate(-1)}
          className="p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* 添加按钮 */}
      <div className={`absolute top-4 right-4 z-50 transition-all duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <button
          onClick={() => setShowAddModal(true)}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* 邮票卡片 */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div 
          className={`relative w-full max-w-md transition-all duration-300 ${
            isAnimating 
              ? swipeDirection === 'up' 
                ? 'transform -translate-y-full opacity-0' 
                : 'transform translate-y-full opacity-0'
              : 'transform translate-y-0 opacity-100'
          }`}
        >
          {/* 邮票外框 - 锯齿效果 */}
          <div className="relative">
            {/* 邮票锯齿边框容器 */}
            <div 
              className="bg-white shadow-2xl relative"
              style={{
                clipPath: `polygon(
                  0% 0%, 4% 0%, 5% 2%, 6% 0%, 10% 0%, 11% 2%, 12% 0%, 16% 0%, 17% 2%, 18% 0%, 22% 0%, 23% 2%, 24% 0%, 28% 0%, 29% 2%, 30% 0%, 34% 0%, 35% 2%, 36% 0%, 40% 0%, 41% 2%, 42% 0%, 46% 0%, 47% 2%, 48% 0%, 52% 0%, 53% 2%, 54% 0%, 58% 0%, 59% 2%, 60% 0%, 64% 0%, 65% 2%, 66% 0%, 70% 0%, 71% 2%, 72% 0%, 76% 0%, 77% 2%, 78% 0%, 82% 0%, 83% 2%, 84% 0%, 88% 0%, 89% 2%, 90% 0%, 94% 0%, 95% 2%, 96% 0%, 100% 0%,
                  100% 4%, 100% 5%, 98% 6%, 100% 10%, 100% 11%, 98% 12%, 100% 16%, 100% 17%, 98% 18%, 100% 22%, 100% 23%, 98% 24%, 100% 28%, 100% 29%, 98% 30%, 100% 34%, 100% 35%, 98% 36%, 100% 40%, 100% 41%, 98% 42%, 100% 46%, 100% 47%, 98% 48%, 100% 52%, 100% 53%, 98% 54%, 100% 58%, 100% 59%, 98% 60%, 100% 64%, 100% 65%, 98% 66%, 100% 70%, 100% 71%, 98% 72%, 100% 76%, 100% 77%, 98% 78%, 100% 82%, 100% 83%, 98% 84%, 100% 88%, 100% 89%, 98% 90%, 100% 94%, 100% 95%, 98% 96%, 100% 100%,
                  96% 100%, 95% 98%, 94% 100%, 90% 100%, 89% 98%, 88% 100%, 84% 100%, 83% 98%, 82% 100%, 78% 100%, 77% 98%, 76% 100%, 72% 100%, 71% 98%, 70% 100%, 66% 100%, 65% 98%, 64% 100%, 60% 100%, 59% 98%, 58% 100%, 54% 100%, 53% 98%, 52% 100%, 48% 100%, 47% 98%, 46% 100%, 42% 100%, 41% 98%, 40% 100%, 36% 100%, 35% 98%, 34% 100%, 30% 100%, 29% 98%, 28% 100%, 24% 100%, 23% 98%, 22% 100%, 18% 100%, 17% 98%, 16% 100%, 12% 100%, 11% 98%, 10% 100%, 6% 100%, 5% 98%, 4% 100%, 0% 100%,
                  0% 96%, 2% 95%, 0% 94%, 0% 90%, 2% 89%, 0% 88%, 0% 84%, 2% 83%, 0% 82%, 0% 78%, 2% 77%, 0% 76%, 0% 72%, 2% 71%, 0% 70%, 0% 66%, 2% 65%, 0% 64%, 0% 60%, 2% 59%, 0% 58%, 0% 54%, 2% 53%, 0% 52%, 0% 48%, 2% 47%, 0% 46%, 0% 42%, 2% 41%, 0% 40%, 0% 36%, 2% 35%, 0% 34%, 0% 30%, 2% 29%, 0% 28%, 0% 24%, 2% 23%, 0% 22%, 0% 18%, 2% 17%, 0% 16%, 0% 12%, 2% 11%, 0% 10%, 0% 6%, 2% 5%, 0% 4%
                )`,
              }}
            >
              {/* 上半部分 - 彩色背景区域 */}
              <div className={`bg-gradient-to-br ${getBgColor(currentEntry.rating)} p-6 pb-4 relative overflow-hidden`}>
                {/* 纸质纹理 */}
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
                }} />
                
                {/* 标题 */}
                <h3 className="font-bold text-gray-800 text-xl mb-4 text-left font-serif">
                  {currentEntry.name}
                </h3>

                {/* 食物图片 - 手绘白边效果 */}
                <div className="relative flex justify-center mb-6">
                  <div className="relative">
                    {/* 白色不规则描边 */}
                    <div 
                      className="absolute inset-0 bg-white transform rotate-1 scale-110"
                      style={{
                        clipPath: 'polygon(2% 2%, 98% 5%, 95% 95%, 5% 98%)',
                        filter: 'blur(2px)',
                      }}
                    />
                    <div 
                      className="absolute inset-0 bg-white transform -rotate-0.5 scale-105"
                      style={{
                        clipPath: 'polygon(0% 0%, 100% 3%, 97% 97%, 3% 95%)',
                      }}
                    />
                    <img
                      src={currentEntry.images[0] || 'https://juiceqiuqiu-1420133198.cos.ap-shanghai.myqcloud.com/food/placeholder.jpg'}
                      alt={currentEntry.name}
                      className="w-56 h-56 object-cover relative z-10 transform rotate-0 hover:rotate-1 transition-transform duration-500"
                      style={{
                        clipPath: 'polygon(1% 1%, 99% 2%, 98% 98%, 2% 99%)',
                      }}
                    />
                  </div>
                </div>

                {/* 日期水印 */}
                <div className="relative">
                  <p className="text-gray-300/60 font-bold text-3xl text-center">
                    {dateStr}
                  </p>
                  {/* 年份竖排 */}
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 writing-vertical-rl">
                    <p className="text-gray-200/40 font-bold text-lg tracking-widest">
                      {yearStr}
                    </p>
                  </div>
                </div>

                {/* 评分 emoji */}
                <div className="absolute top-4 right-4 text-3xl opacity-60">
                  {ratingEmojis[currentEntry.rating]}
                </div>
              </div>

              {/* 下半部分 - 白色区域 */}
              <div className="pt-6 pb-3 px-3">
                {/* 谁的好吃的 */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs bg-rose-50 text-rose-600 px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5">
                    <img 
                      src={currentEntry.payer === 'qiuqiu' 
                        ? "https://juiceqiuqiu-1420133198.cos.ap-shanghai.myqcloud.com/icons/qiuqiu-icon.jpg"
                        : "https://juiceqiuqiu-1420133198.cos.ap-shanghai.myqcloud.com/icons/guozhi-icon.jpg"
                      }
                      alt={currentEntry.payer}
                      className="w-4 h-4 object-cover rounded-full"
                    />
                    {currentEntry.payer === 'qiuqiu' ? "秋秋的好吃的" : "果汁的好吃的"}
                  </span>
                  
                  {/* 卡路里指示器 */}
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          currentEntry.calorieLevel < 30 ? 'bg-green-400' :
                          currentEntry.calorieLevel < 60 ? 'bg-yellow-400' :
                          'bg-gradient-to-r from-orange-400 to-red-400'
                        }`}
                        style={{ width: `${currentEntry.calorieLevel}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 标签 */}
                {currentEntry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {currentEntry.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 bg-gray-50 text-gray-500 rounded-sm font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* 点评 - 打字机字体 */}
                {currentEntry.comment && (
                  <p className="text-sm text-gray-500 font-mono leading-relaxed italic border-l-2 border-gray-200 pl-3">
                    {currentEntry.comment}
                  </p>
                )}
              </div>
            </div>

            {/* 邮票背景阴影层 */}
            <div 
              className="absolute inset-0 bg-white shadow-2xl -z-10"
              style={{
                clipPath: `polygon(
                  0% 0%, 4% 0%, 5% 2%, 6% 0%, 10% 0%, 11% 2%, 12% 0%, 16% 0%, 17% 2%, 18% 0%, 22% 0%, 23% 2%, 24% 0%, 28% 0%, 29% 2%, 30% 0%, 34% 0%, 35% 2%, 36% 0%, 40% 0%, 41% 2%, 42% 0%, 46% 0%, 47% 2%, 48% 0%, 52% 0%, 53% 2%, 54% 0%, 58% 0%, 59% 2%, 60% 0%, 64% 0%, 65% 2%, 66% 0%, 70% 0%, 71% 2%, 72% 0%, 76% 0%, 77% 2%, 78% 0%, 82% 0%, 83% 2%, 84% 0%, 88% 0%, 89% 2%, 90% 0%, 94% 0%, 95% 2%, 96% 0%, 100% 0%,
                  100% 4%, 100% 5%, 98% 6%, 100% 10%, 100% 11%, 98% 12%, 100% 16%, 100% 17%, 98% 18%, 100% 22%, 100% 23%, 98% 24%, 100% 28%, 100% 29%, 98% 30%, 100% 34%, 100% 35%, 98% 36%, 100% 40%, 100% 41%, 98% 42%, 100% 46%, 100% 47%, 98% 48%, 100% 52%, 100% 53%, 98% 54%, 100% 58%, 100% 59%, 98% 60%, 100% 64%, 100% 65%, 98% 66%, 100% 70%, 100% 71%, 98% 72%, 100% 76%, 100% 77%, 98% 78%, 100% 82%, 100% 83%, 98% 84%, 100% 88%, 100% 89%, 98% 90%, 100% 94%, 100% 95%, 98% 96%, 100% 100%,
                  96% 100%, 95% 98%, 94% 100%, 90% 100%, 89% 98%, 88% 100%, 84% 100%, 83% 98%, 82% 100%, 78% 100%, 77% 98%, 76% 100%, 72% 100%, 71% 98%, 70% 100%, 66% 100%, 65% 98%, 64% 100%, 60% 100%, 59% 98%, 58% 100%, 54% 100%, 53% 98%, 52% 100%, 48% 100%, 47% 98%, 46% 100%, 42% 100%, 41% 98%, 40% 100%, 36% 100%, 35% 98%, 34% 100%, 30% 100%, 29% 98%, 28% 100%, 24% 100%, 23% 98%, 22% 100%, 18% 100%, 17% 98%, 16% 100%, 12% 100%, 11% 98%, 10% 100%, 6% 100%, 5% 98%, 4% 100%, 0% 100%,
                  0% 96%, 2% 95%, 0% 94%, 0% 90%, 2% 89%, 0% 88%, 0% 84%, 2% 83%, 0% 82%, 0% 78%, 2% 77%, 0% 76%, 0% 72%, 2% 71%, 0% 70%, 0% 66%, 2% 65%, 0% 64%, 0% 60%, 2% 59%, 0% 58%, 0% 54%, 2% 53%, 0% 52%, 0% 48%, 2% 47%, 0% 46%, 0% 42%, 2% 41%, 0% 40%, 0% 36%, 2% 35%, 0% 34%, 0% 30%, 2% 29%, 0% 28%, 0% 24%, 2% 23%, 0% 22%, 0% 18%, 2% 17%, 0% 16%, 0% 12%, 2% 11%, 0% 10%, 0% 6%, 2% 5%, 0% 4%
                )`,
                transform: 'scale(0.98)',
              }}
            />
          </div>
        </div>
      </div>

      {/* 底部进度条 */}
      <div className={`absolute bottom-0 left-0 right-0 p-6 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center justify-center gap-3 text-sm text-gray-400 font-medium">
          <span className="text-gray-600">{currentIndex + 1}</span>
          <span>/</span>
          <span>{entries.length}</span>
        </div>
        <div className="mt-2 h-0.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-rose-400 to-orange-400 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / entries.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 添加美食弹窗 */}
      {showAddModal && (
        <AddFoodModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddFood}
          placeholder="点击上传美食照片"
          quickTags={['早餐', '午餐', '晚餐', '宵夜', '甜品', '饮料']}
        />
      )}
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays < 7) return `${diffDays}天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
  return `${Math.floor(diffDays / 30)}个月前`;
}
