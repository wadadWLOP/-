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

  const getCalorieColor = (level: number) => {
    if (level < 30) return 'bg-green-400';
    if (level < 60) return 'bg-yellow-400';
    return 'bg-gradient-to-r from-orange-400 to-red-400';
  };

  const getRatingBg = (rating: string) => {
    switch (rating) {
      case 'god': return 'from-pink-400 to-rose-400';
      case 'yum': return 'from-orange-400 to-amber-400';
      case 'ok': return 'from-gray-400 to-gray-500';
      case 'bad': return 'from-purple-400 to-gray-600';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg shadow-orange-100/40 border border-orange-100/30 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
      <div className="relative overflow-hidden">
        <img
          src={entry.images[0] || 'https://juiceqiuqiu-1420133198.cos.ap-shanghai.myqcloud.com/food/placeholder.jpg'}
          alt={entry.name}
          className="w-full aspect-[4/3] object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {entry.rating === 'bad' && (
          <div className="absolute top-2 right-2 bg-gradient-to-br from-purple-500 to-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-lg animate-bounce">
            💀
          </div>
        )}
        <div className={`absolute bottom-2 left-2 bg-gradient-to-r ${getRatingBg(entry.rating)} text-white rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg backdrop-blur-sm`}>
          <span className="text-lg animate-pulse">{ratingEmojis[entry.rating]}</span>
          <span className="text-xs font-bold">
            {entry.rating === 'god' ? '封神' : entry.rating === 'yum' ? '好吃' : entry.rating === 'ok' ? '一般' : '踩雷'}
          </span>
        </div>
      </div>

      <div className="p-3.5 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-gray-800 truncate flex-1 group-hover:text-orange-600 transition-colors">
            {entry.name}
          </h3>
          <span className="text-xs bg-rose-50 text-rose-500 px-2 py-0.5 rounded-full font-medium">
            {payerLabels[entry.payer]}
          </span>
        </div>

        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {entry.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 rounded-full border border-orange-100"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
            {timeAgo}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs">
            {entry.calorieLevel < 50 ? (
              <Leaf className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <Flame className="w-3.5 h-3.5 text-orange-500" />
            )}
          </div>
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${getCalorieColor(entry.calorieLevel)} transition-all duration-500`}
              style={{ width: `${entry.calorieLevel}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-500">{entry.calorieLevel}%</span>
        </div>

        {entry.comment && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed italic">"{entry.comment}"</p>
        )}
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
