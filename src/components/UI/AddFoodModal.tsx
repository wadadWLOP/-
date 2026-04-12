import { useState, useRef } from 'react';
import { X, Upload, Leaf, Flame } from 'lucide-react';
import { uploadImage } from '../../lib/supabase';

interface AddFoodModalProps {
  onClose: () => void;
  onAdd: (food: {
    images: string[];
    name: string;
    rating: 'yum' | 'ok' | 'bad' | 'god';
    payer: 'qiuqiu' | 'guozhi' | 'aa' | 'parents';
    tags: string[];
    calorieLevel: number;
    comment: string;
  }) => void;
  placeholder: string;
  quickTags: string[];
}

const ratingOptions = [
  { value: 'god', emoji: '😍', label: '封神之作', sublabel: '必吃！' },
  { value: 'yum', emoji: '😋', label: '好吃到舔盘', sublabel: '' },
  { value: 'ok', emoji: '🙂', label: '还可以吧', sublabel: '' },
  { value: 'bad', emoji: '🤢', label: '黑暗料理', sublabel: '踩雷！' },
];

const payerOptions = [
  { value: 'qiuqiu', label: '秋秋请客', emoji: '🎁' },
  { value: 'guozhi', label: '果子请客', emoji: '🎁' },
  { value: 'aa', label: 'AA', emoji: '💰' },
  { value: 'parents', label: '爸妈买单', emoji: '👨‍👩‍👧' },
];

export function AddFoodModal({ onClose, onAdd, placeholder, quickTags }: AddFoodModalProps) {
  const [images, setImages] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [rating, setRating] = useState<'yum' | 'ok' | 'bad' | 'god' | null>(null);
  const [payer, setPayer] = useState<'qiuqiu' | 'guozhi' | 'aa' | 'parents'>('aa');
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
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gradient-to-b from-orange-50 to-amber-50 rounded-t-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-orange-400 to-amber-400 text-white px-4 py-3 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-xl font-bold">投喂美食 🍔</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          <div>
            <p className="text-sm font-bold text-orange-600 mb-2">美食证件照 📸</p>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-orange-300 rounded-2xl p-6 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all"
            >
              {images.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="aspect-square rounded-xl border-2 border-orange-300 flex items-center justify-center text-orange-400">
                    <Upload className="w-8 h-8" />
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 mx-auto text-orange-400 mb-2" />
                  <p className="text-orange-500 font-bold">{placeholder}</p>
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
              <p className="text-sm text-orange-500 mt-2 text-center animate-pulse">
                上传中...
              </p>
            )}
          </div>

          <div>
            <p className="text-sm font-bold text-orange-600 mb-2">这是什么好吃的？🍜</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="比如：楼下那家超赞的螺蛳粉..."
              className="w-full px-4 py-3 rounded-xl border-2 border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all bg-white"
            />
          </div>

          <div>
            <p className="text-sm font-bold text-orange-600 mb-3">干饭指数 🍽️</p>
            <div className="grid grid-cols-4 gap-2">
              {ratingOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setRating(option.value as 'yum' | 'ok' | 'bad' | 'god')}
                  onMouseEnter={() => setActiveRating(option.value)}
                  onMouseLeave={() => setActiveRating(null)}
                  className={`relative p-3 rounded-xl border-2 transition-all ${
                    rating === option.value
                      ? 'border-orange-500 bg-orange-50 scale-105 shadow-lg'
                      : 'border-orange-200 bg-white hover:border-orange-300'
                  } ${option.value === 'bad' ? 'col-span-2' : ''}`}
                >
                  <div className="text-3xl mb-1">{option.emoji}</div>
                  <div className={`text-xs font-bold ${rating === option.value ? 'text-orange-600' : 'text-gray-600'}`}>
                    {option.label}
                  </div>
                  {(activeRating === option.value || rating === option.value) && option.sublabel && (
                    <div className="text-xs text-orange-400 mt-1">{option.sublabel}</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-orange-600 mb-2">谁来买单？💰</p>
            <div className="grid grid-cols-4 gap-2">
              {payerOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPayer(option.value as typeof payer)}
                  className={`p-2 rounded-xl border-2 transition-all ${
                    payer === option.value
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-orange-200 bg-white hover:border-orange-300'
                  }`}
                >
                  <div className="text-xl mb-1">{option.emoji}</div>
                  <div className={`text-xs font-bold ${payer === option.value ? 'text-orange-600' : 'text-gray-600'}`}>
                    {option.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-orange-600 mb-2">一句点评 💬</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="说说你的感受..."
              rows={2}
              className="w-full px-4 py-3 rounded-xl border-2 border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all resize-none bg-white"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-orange-500 text-white'
                      : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-orange-600 mb-2">卡路里计算器 🔥</p>
            <div className="bg-white rounded-xl p-4 border-2 border-orange-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-green-600">
                  <Leaf className="w-5 h-5" />
                  <span className="text-sm font-bold">草</span>
                </div>
                <div className="text-2xl font-bold text-orange-500">
                  {calorieLevel}%
                </div>
                <div className="flex items-center gap-1 text-red-600">
                  <span className="text-sm font-bold">罪恶</span>
                  <Flame className="w-5 h-5" />
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={calorieLevel}
                onChange={(e) => setCalorieLevel(Number(e.target.value))}
                className="w-full h-3 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #22c55e 0%, #eab308 50%, #ef4444 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>健康轻食</span>
                <span>罪恶大餐</span>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 p-4 bg-white border-t border-orange-100">
          <button
            onClick={handleSubmit}
            disabled={!name || !rating}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
              name && rating
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 active:scale-[0.98] shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            记录这份美食 🍽️
          </button>
        </div>
      </div>
    </div>
  );
}
