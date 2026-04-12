import { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Flame } from 'lucide-react';
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
    if (count >= 50) return { title: '超级无敌宇宙巨好吃喵喵', icon: '👑', color: 'text-yellow-500' };
    if (count >= 25) return { title: '美食猎人', icon: '🎯', color: 'text-orange-500' };
    if (count >= 7) return { title: '干饭人', icon: '🍽️', color: 'text-green-500' };
    return null;
  };

  const achievement = getAchievement();
  const energyPercent = Math.min((monthEntries.length / 20) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
      <header className="sticky top-0 z-40 bg-gradient-to-r from-orange-400 to-amber-400 text-white shadow-lg">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold flex-1">贪吃大王的美食探险</h1>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6 pb-24">
        <div className="bg-white rounded-3xl p-5 shadow-lg border-2 border-orange-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-orange-600 font-bold">本月已消灭</p>
              <p className="text-3xl font-bold text-orange-500">
                {monthEntries.length} <span className="text-lg">份美食！</span>
              </p>
            </div>
            <Flame className="w-12 h-12 text-orange-500" />
          </div>

          <div className="relative h-6 bg-orange-100 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${energyPercent}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-orange-700">
                吃货能量 {Math.round(energyPercent)}%
              </span>
            </div>
          </div>

          {achievement && (
            <div className={`mt-4 flex items-center gap-2 text-sm ${achievement.color}`}>
              <span className="text-2xl">{achievement.icon}</span>
              <span className="font-bold">已解锁：{achievement.title}</span>
            </div>
          )}
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-4 animate-bounce">🤤</div>
            <p className="text-xl text-orange-600 font-bold mb-2">肚子饿了！</p>
            <p className="text-orange-400">快去吃点好的记录一下！</p>
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
          <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity animate-pulse" />
          <div className="relative bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full px-8 py-4 shadow-xl flex items-center gap-3 group-hover:scale-105 group-active:scale-95 transition-transform">
            <Plus className="w-6 h-6 animate-spin-slow" />
            <span className="font-bold text-lg">投喂一下</span>
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
