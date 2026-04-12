import { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Flame, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FoodCard } from '../components/UI/FoodCard';
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

const STORAGE_KEY = '__food_diary_entries';

const quickTags = [
  '减肥路上的绊脚石',
  '碳水快乐',
  '除了贵没毛病',
  '全是科技与狠活',
  '深夜放毒',
  '碳水炸弹',
  '秋秋请客',
  '神仙美味',
];

const placeholderTexts = [
  '拍得好看才好吃~',
  '让我康康这是啥！',
  '馋死了馋死了！',
  '发出来让大家流口水！',
];

const defaultEntries: FoodEntry[] = [
  {
    id: 'demo_1',
    images: ['https://juiceqiuqiu-1420133198.cos.ap-shanghai.myqcloud.com/food/1.jpg'],
    name: '超级至尊披萨',
    rating: 'god',
    payer: 'qiuqiu',
    tags: ['碳水', '高热量', '神仙美味'],
    calorieLevel: 85,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    comment: '芝士拉丝有一米长！绝绝子！',
  },
  {
    id: 'demo_2',
    images: ['https://juiceqiuqiu-1420133198.cos.ap-shanghai.myqcloud.com/food/2.jpg'],
    name: '巷口那家超好吃的烧烤',
    rating: 'yum',
    payer: 'guozhi',
    tags: ['深夜放毒', '秋秋请客'],
    calorieLevel: 90,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    comment: '五花肉烤得滋滋冒油，太香了！',
  },
  {
    id: 'demo_3',
    images: ['https://juiceqiuqiu-1420133198.cos.ap-shanghai.myqcloud.com/food/3.jpg'],
    name: '网红螺蛳粉',
    rating: 'ok',
    payer: 'guozhi',
    tags: ['除了贵没毛病'],
    calorieLevel: 60,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    comment: '酸笋够臭，腐竹够脆，就是有点咸',
  },
];

const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

export function FoodDiaryPage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setEntries(parsed.length > 0 ? parsed : defaultEntries);
      } catch {
        setEntries(defaultEntries);
      }
    } else {
      setEntries(defaultEntries);
    }
  }, []);

  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
  }, [entries]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAddFood = (food: Omit<FoodEntry, 'id' | 'date'>) => {
    const newEntry: FoodEntry = {
      ...food,
      id: `food_${Date.now()}`,
      date: new Date().toISOString(),
    };
    setEntries((prev) => [newEntry, ...prev]);
    setShowAddModal(false);
  };

  const currentMonth = new Date().getMonth();
  const monthEntries = entries.filter((e) => {
    const entryMonth = new Date(e.date).getMonth();
    return entryMonth === currentMonth;
  });

  const getAchievement = () => {
    const count = entries.length;
    if (count >= 50) return { title: '超级无敌宇宙巨好吃喵喵', icon: '👑', color: 'from-yellow-400 to-amber-400', bgColor: 'bg-yellow-50' };
    if (count >= 25) return { title: '美食猎人', icon: '🎯', color: 'from-orange-400 to-red-400', bgColor: 'bg-orange-50' };
    if (count >= 7) return { title: '干饭人', icon: '🍽️', color: 'from-green-400 to-emerald-400', bgColor: 'bg-green-50' };
    return null;
  };

  const achievement = getAchievement();
  const energyPercent = Math.min((monthEntries.length / 20) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-orange-50 to-amber-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fbbf24' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm border-b border-rose-100">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-rose-100 transition-colors text-rose-500"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-800">贪吃大王的美食探险</h1>
            <p className="text-xs text-gray-400">今天也要好好吃饭呀~</p>
          </div>
          <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
        </div>
      </header>

      <div className="px-4 py-6 space-y-6 pb-28 relative z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-5 shadow-xl shadow-orange-100/50 border border-orange-100/50 relative overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full opacity-50 blur-xl" />

          <div className="flex items-center justify-between mb-4 relative">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">🍽️</span>
                <p className="text-sm text-gray-500 font-medium">{monthNames[currentMonth]}干饭记录</p>
              </div>
              <p className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                {monthEntries.length}
              </p>
              <p className="text-sm text-gray-400">份美味佳肴</p>
            </div>
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full flex items-center justify-center shadow-lg shadow-orange-200/50 animate-pulse">
                <Flame className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 text-xs bg-white rounded-full px-2 py-0.5 shadow-md font-bold text-orange-500">
                {Math.round(energyPercent)}%
              </div>
            </div>
          </div>

          <div className="relative h-4 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${energyPercent}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg animate-pulse" />
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-2 font-medium">
            {energyPercent >= 100 ? '🎉 本月吃货能量已爆表！' : '吃货能量还有空间，继续加油~'}
          </p>

          {achievement && (
            <div className={`mt-4 flex items-center gap-3 p-3 rounded-2xl ${achievement.bgColor} border border-current/10`}>
              <span className="text-3xl animate-bounce">{achievement.icon}</span>
              <div>
                <p className="text-xs text-gray-500 font-medium">已解锁成就</p>
                <p className={`font-bold bg-gradient-to-r ${achievement.color} bg-clip-text text-transparent`}>
                  {achievement.title}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 px-2">
          <h2 className="text-sm font-bold text-gray-600">🍜 美食画廊</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent" />
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-16 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-orange-50/50 to-amber-50/50 rounded-3xl" />
            <div className="relative">
              <div className="text-8xl mb-6 animate-bounce">🤤</div>
              <p className="text-2xl font-bold text-gray-700 mb-2">肚子饿了！</p>
              <p className="text-gray-400 mb-6">快去吃点好的记录一下吧~</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-orange-400 to-amber-400 text-white rounded-full font-bold shadow-lg shadow-orange-200/50 hover:shadow-xl hover:scale-105 transition-all"
              >
                🍔 开始投喂
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {entries.map((entry) => (
              <FoodCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 group"
      >
        <div className="relative">
          <div className="absolute -inset-3 bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-opacity animate-pulse" />
          <div className="relative bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white rounded-full px-10 py-5 shadow-2xl shadow-orange-200/50 flex items-center gap-4 group-hover:scale-105 group-active:scale-95 transition-all">
            <div className="relative">
              <Plus className="w-8 h-8" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping" />
            </div>
            <span className="font-bold text-xl">投喂一下</span>
          </div>
        </div>
      </button>

      {showAddModal && (
        <AddFoodModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddFood}
          placeholder={placeholderTexts[placeholderIndex]}
          quickTags={quickTags}
        />
      )}
    </div>
  );
}
