import { Leaf, Flame } from 'lucide-react';

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

export function FoodCard({ entry }: { entry: FoodEntry }) {
  const timeAgo = getTimeAgo(new Date(entry.date));

  const getBgColor = (rating: string) => {
    switch (rating) {
      case 'god': return 'from-pink-100 to-rose-100';
      case 'yum': return 'from-orange-100 to-amber-100';
      case 'ok': return 'from-gray-100 to-slate-100';
      case 'bad': return 'from-purple-100 to-gray-100';
      default: return 'from-gray-100 to-slate-100';
    }
  };

  return (
    <div className="relative group cursor-pointer">
      {/* 邮票外框 */}
      <div className="bg-white rounded-lg p-3 shadow-lg hover:shadow-xl transition-shadow duration-300">
        {/* 邮票锯齿效果 */}
        <div className="relative">
          {/* 上半部分 - 粉色背景区域 */}
          <div className={`bg-gradient-to-br ${getBgColor(entry.rating)} rounded-t-lg p-4 relative overflow-hidden`}>
            {/* 纸质纹理 */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
            }} />
            
            {/* 标题 */}
            <h3 className="font-bold text-gray-800 text-lg mb-3 relative z-10 line-clamp-1">
              {entry.name}
            </h3>

            {/* 食物图片 - 白边抠图效果 */}
            <div className="relative flex justify-center mb-3">
              <div className="relative">
                {/* 白色描边 */}
                <div className="absolute inset-0 bg-white rounded-full blur-md transform scale-105" />
                <div className="absolute inset-0 bg-white rounded-full transform scale-105" />
                <img
                  src={entry.images[0] || 'https://juiceqiuqiu-1420133198.cos.ap-shanghai.myqcloud.com/food/placeholder.jpg'}
                  alt={entry.name}
                  className="w-40 h-40 object-cover rounded-full relative z-10 shadow-lg group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* 日期 */}
            <div className="text-center">
              <p className="text-gray-400 font-medium text-sm">{timeAgo}</p>
            </div>

            {/* 右侧竖排年份 */}
            <div className="absolute right-2 bottom-10 transform rotate-90 origin-bottom-right">
              <p className="text-gray-300 text-xs font-medium">
                {new Date(entry.date).getFullYear()}
              </p>
            </div>

            {/* 评分 emoji */}
            <div className="absolute top-3 right-3 text-2xl animate-bounce">
              {ratingEmojis[entry.rating]}
            </div>
          </div>

          {/* 邮票齿孔效果 - 中间 */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between px-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-2 h-2 bg-white rounded-full shadow-sm" />
            ))}
          </div>
        </div>

        {/* 下半部分 - 白色区域 */}
        <div className="pt-8 pb-2 px-2">
          {/* 付款人 */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-rose-50 text-rose-500 px-2 py-1 rounded-full font-medium">
                {payerLabels[entry.payer]}
              </span>
            </div>
            
            {/* 卡路里指示器 */}
            <div className="flex items-center gap-1.5">
              {entry.calorieLevel < 50 ? (
                <Leaf className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <Flame className="w-3.5 h-3.5 text-orange-500" />
              )}
              <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    entry.calorieLevel < 30 ? 'bg-green-400' :
                    entry.calorieLevel < 60 ? 'bg-yellow-400' :
                    'bg-gradient-to-r from-orange-400 to-red-400'
                  }`}
                  style={{ width: `${entry.calorieLevel}%` }}
                />
              </div>
            </div>
          </div>

          {/* 标签 */}
          {entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {entry.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 bg-gray-50 text-gray-500 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* 点评 */}
          {entry.comment && (
            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed italic">
              "{entry.comment}"
            </p>
          )}
        </div>

        {/* 底部齿孔效果 */}
        <div className="flex justify-between px-2 -mt-1 mb-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-2 h-2 bg-white rounded-full shadow-sm" />
          ))}
        </div>
      </div>
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
