import { useState, useRef } from 'react';
import { X, Upload, Leaf, Flame } from 'lucide-react';
import { uploadImage } from '../../lib/supabase';

interface AddFoodModalProps {
  onClose: () => void;
  onAdd: (food: {
    images: string[];
    name: string;
    rating: 'yum' | 'ok' | 'bad' | 'god';
    payer: 'qiuqiu' | 'guozhi';
    tags: string[];
    calorieLevel: number;
    comment: string;
  }) => void;
  placeholder: string;
  quickTags: string[];
}

const ratingOptions = [
  { value: 'god', emoji: '😍', label: '封神之作', sublabel: '必吃！', bg: 'from-pink-400 to-rose-500' },
  { value: 'yum', emoji: '😋', label: '好吃到舔盘', sublabel: '', bg: 'from-orange-400 to-amber-500' },
  { value: 'ok', emoji: '🙂', label: '还可以吧', sublabel: '', bg: 'from-gray-400 to-gray-500' },
  { value: 'bad', emoji: '🤢', label: '黑暗料理', sublabel: '踩雷！', bg: 'from-purple-400 to-gray-600' },
];

const payerOptions = [
  { value: 'qiuqiu', label: '秋秋', emoji: '🐱', bg: 'from-amber-100 to-orange-100' },
  { value: 'guozhi', label: '果汁', emoji: '🐹', bg: 'from-rose-100 to-pink-100' },
];

export function AddFoodModal({ onClose, onAdd, placeholder, quickTags }: AddFoodModalProps) {
  const [images, setImages] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [rating, setRating] = useState<'yum' | 'ok' | 'bad' | 'god' | null>(null);
  const [payer, setPayer] = useState<'qiuqiu' | 'guozhi'>('qiuqiu');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [calorieLevel, setCalorieLevel] = useState(50);
  const [comment, setComment] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [activeRating, setActiveRating] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    try {
      const newImages: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadImage(file);
        newImages.push(url);
      }
      setImages((prev) => [...prev, ...newImages]);
    } catch (error) {
      console.error('上传失败:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (!name || !rating) return;
    onAdd({
      images,
      name,
      rating,
      payer,
      tags: selectedTags,
      calorieLevel,
      comment,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gradient-to-b from-white to-rose-50 rounded-t-[2rem] w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 z-10 bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 text-white px-6 py-4 flex items-center justify-between rounded-t-[2rem] shadow-lg">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-bounce">🍔</span>
            <h2 className="text-xl font-bold">投喂美食</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📸</span>
              <p className="text-sm font-bold text-gray-700">美食证件照</p>
            </div>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                images.length > 0
                  ? 'border-orange-300 bg-orange-50/50'
                  : 'border-rose-200 hover:border-rose-400 hover:bg-rose-50/50'
              }`}
            >
              {images.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden shadow-md">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="aspect-square rounded-xl border-2 border-dashed border-orange-300 flex items-center justify-center text-orange-400 hover:bg-orange-100 transition-colors">
                    <Upload className="w-8 h-8" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-rose-100 to-orange-100 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-rose-400" />
                  </div>
                  <p className="text-rose-500 font-bold">{placeholder}</p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            {isUploading && (
              <div className="flex items-center justify-center gap-2 mt-3 text-sm text-orange-500 animate-pulse">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" />
                <span>上传中...</span>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🍜</span>
              <p className="text-sm font-bold text-gray-700">这是什么好吃的？</p>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="比如：楼下那家超赞的螺蛳粉..."
              className="w-full px-4 py-3.5 rounded-2xl border-2 border-rose-100 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none transition-all bg-white/80 text-gray-700 placeholder:text-gray-400"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🍽️</span>
              <p className="text-sm font-bold text-gray-700">干饭指数</p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {ratingOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setRating(option.value as 'yum' | 'ok' | 'bad' | 'god')}
                  onMouseEnter={() => setActiveRating(option.value)}
                  onMouseLeave={() => setActiveRating(null)}
                  className={`relative p-3 rounded-2xl border-2 transition-all duration-300 ${
                    rating === option.value
                      ? `border-transparent bg-gradient-to-br ${option.bg} text-white shadow-lg scale-105`
                      : 'border-rose-100 bg-white hover:border-rose-200 hover:shadow-md'
                  } ${option.value === 'bad' ? 'col-span-2' : ''}`}
                >
                  <div className="text-3xl mb-1">{option.emoji}</div>
                  <div className={`text-xs font-bold ${rating === option.value ? 'text-white' : 'text-gray-600'}`}>
                    {option.label}
                  </div>
                  {(activeRating === option.value || rating === option.value) && option.sublabel && (
                    <div className={`absolute -top-1 -right-1 text-xs px-1.5 py-0.5 rounded-full ${rating === option.value ? 'bg-white/30 text-white' : 'bg-rose-100 text-rose-500'}`}>
                      {option.sublabel}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🍽️</span>
              <p className="text-sm font-bold text-gray-700">谁的好吃的？</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {payerOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPayer(option.value as typeof payer)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                    payer === option.value
                      ? `border-transparent bg-gradient-to-br ${option.bg} shadow-lg`
                      : 'border-rose-100 bg-white hover:border-rose-200 hover:shadow-md'
                  }`}
                >
                  <div className="text-3xl mb-1">{option.emoji}</div>
                  <div className={`text-sm font-bold ${payer === option.value ? 'text-gray-700' : 'text-gray-500'}`}>
                    {option.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">💬</span>
              <p className="text-sm font-bold text-gray-700">一句点评</p>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="说说你的感受..."
              rows={2}
              className="w-full px-4 py-3.5 rounded-2xl border-2 border-rose-100 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none transition-all resize-none bg-white/80 text-gray-700 placeholder:text-gray-400"
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-gradient-to-r from-rose-400 to-orange-400 text-white shadow-md'
                      : 'bg-rose-50 text-rose-500 hover:bg-rose-100 border border-rose-200'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🔥</span>
              <p className="text-sm font-bold text-gray-700">卡路里计算器</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border-2 border-rose-100 shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-green-500">
                  <Leaf className="w-5 h-5" />
                  <span className="text-sm font-bold">健康</span>
                </div>
                <div className="px-4 py-1.5 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full text-white font-bold text-lg shadow-md">
                  {calorieLevel}%
                </div>
                <div className="flex items-center gap-2 text-orange-500">
                  <span className="text-sm font-bold">罪恶</span>
                  <Flame className="w-5 h-5" />
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 h-3 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400"
                    style={{ width: `${calorieLevel}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={calorieLevel}
                  onChange={(e) => setCalorieLevel(Number(e.target.value))}
                  className="relative w-full h-3 appearance-none cursor-pointer bg-transparent"
                  style={{
                    WebkitAppearance: 'none',
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                <span>🥗 轻食</span>
                <span>🍖 大餐</span>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 p-4 bg-white/80 backdrop-blur-md border-t border-rose-100 rounded-b-[2rem]">
          <button
            onClick={handleSubmit}
            disabled={!name || !rating}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
              name && rating
                ? 'bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-200/50'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {name && rating ? '🍽️ 记录这份美食' : '🍽️ 输入名称和评分'}
          </button>
        </div>
      </div>
    </div>
  );
}
