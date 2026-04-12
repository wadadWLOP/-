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
    if (level < 30) return 'text-green-500';
    if (level < 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md border-2 border-orange-100 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer">
      <div className="relative">
        <img
          src={entry.images[0] || 'https://via.placeholder.com/300x200?text=美食'}
          alt={entry.name}
          className="w-full aspect-[4/3] object-cover"
        />
        {entry.rating === 'bad' && (
          <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg">
            💀
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <span className="text-lg">{ratingEmojis[entry.rating]}</span>
        </div>
      </div>

      <div className="p-3 space-y-2">
        <h3 className="font-bold text-orange-800 truncate">{entry.name}</h3>

        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {entry.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{payerLabels[entry.payer]}</span>
          <span>{timeAgo}</span>
        </div>

        <div className="flex items-center gap-1 text-xs">
          <span className={getCalorieColor(entry.calorieLevel)}>
            {entry.calorieLevel < 50 ? <Leaf className="w-3 h-3" /> : <Flame className="w-3 h-3" />}
          </span>
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${getCalorieColor(entry.calorieLevel).replace('text-', 'bg-')}`}
              style={{ width: `${entry.calorieLevel}%` }}
            />
          </div>
        </div>

        {entry.comment && (
          <p className="text-xs text-gray-600 line-clamp-2">{entry.comment}</p>
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
