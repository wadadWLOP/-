import { useState } from 'react';
import { X, Star, Heart, Sparkles } from 'lucide-react';

interface ScrapbookCardProps {
  id?: string;
  date: string;
  title?: string;
  excerpt?: string;
  weather?: string;
  wordCount?: number;
  photoUrl?: string;
  stickerEmoji?: string;
  category?: string;
  onClick?: (id?: string) => void;
  onDelete?: () => void;
}

const weatherIcons: Record<string, string> = {
  sunny: '☀️',
  cloudy: '☁️',
  rainy: '🌧️',
  snowy: '❄️',
};

// 从 HTML 中提取纯文本
const extractTextFromHTML = (html: string) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

export function ScrapbookCard({
  id,
  date,
  title,
  excerpt,
  weather = 'sunny',
  wordCount = 0,
  photoUrl,
  stickerEmoji,
  category,
  onClick,
  onDelete,
}: ScrapbookCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [weatherImageIndex, setWeatherImageIndex] = useState(() => {
    const saved = localStorage.getItem(`weather-image-${id}`);
    return saved ? parseInt(saved, 10) : 0;
  });

  const weatherImages = [
    'https://juiceqiuqiu-1420133198.cos.ap-shanghai.myqcloud.com/weather/a.png',
    'https://juiceqiuqiu-1420133198.cos.ap-shanghai.myqcloud.com/weather/b.png',
    'https://juiceqiuqiu-1420133198.cos.ap-shanghai.myqcloud.com/weather/c.png'
  ];

  const handleWeatherClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = (weatherImageIndex + 1) % weatherImages.length;
    setWeatherImageIndex(newIndex);
    if (id) {
      localStorage.setItem(`weather-image-${id}`, newIndex.toString());
    }
  };

  const handleCardClick = () => {
    onClick?.(id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    setTimeout(() => onDelete?.(), 300);
  };

  const dateObj = new Date(date);
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const weekDay = ['日', '一', '二', '三', '四', '五', '六'][dateObj.getDay()];

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-72 h-80 cursor-pointer transition-all duration-300 ${
        isDeleting ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundColor: '#FFFBF0',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: isHovered
          ? '8px 8px 20px rgba(0,0,0,0.15)'
          : '5px 5px 15px rgba(0,0,0,0.08)',
        border: '1px solid #F0E6D2',
        marginTop: isHovered ? '-4px' : '0',
        marginLeft: isHovered ? '-2px' : '0',
      }}
    >
      <div
        className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 z-10"
        style={{
          backgroundColor: 'rgba(255, 182, 193, 0.6)',
          border: '1px dashed rgba(255,255,255,0.4)',
        }}
      />

      {category && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20">
          {category === 'qiuqiu' ? (
            <span
              className="px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"
              style={{
                backgroundColor: '#FFB6C1',
                color: '#fff',
                fontFamily: '乐米小奶泡体',
                fontSize: '10px',
              }}
            >
              <img 
                src="https://juiceqiuqiu-1420133198.cos.ap-shanghai.myqcloud.com/icons/qiuqiu-icon.jpg" 
                alt="秋秋"
                className="w-4 h-4 object-cover rounded-full"
              />
              秋秋
            </span>
          ) : category === 'guozhi' ? (
            <span
              className="px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"
              style={{
                backgroundColor: '#87CEEB',
                color: '#fff',
                fontFamily: '乐米小奶泡体',
                fontSize: '10px',
              }}
            >
              <img 
                src="https://juiceqiuqiu-1420133198.cos.ap-shanghai.myqcloud.com/icons/guozhi-icon.jpg" 
                alt="果汁"
                className="w-4 h-4 object-cover rounded-full"
              />
              果汁
            </span>
          ) : null}
        </div>
      )}

      {isHovered && onDelete && (
        <button
          onClick={handleDelete}
          className="absolute -top-2 -right-2 w-8 h-8 bg-red-400 text-white rounded-full shadow-lg hover:bg-red-500 transition-colors z-20 flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="flex items-start justify-between mb-3">
        <div
          className="px-3 py-1 border-2 border-[#c45c3e] rounded"
          style={{ color: '#c45c3e', fontFamily: '乐米小奶泡体', fontSize: '14px' }}
        >
          {month}.{day}
        </div>
        <div className="text-2xl">
          {weather === 'sunny' ? (
            <img
              src={weatherImages[weatherImageIndex]}
              alt=""
              className="w-16 h-16 object-contain cursor-pointer hover:scale-110 transition-transform"
              onClick={handleWeatherClick}
            />
          ) : (
            weatherIcons[weather] || '☀️'
          )}
        </div>
      </div>

      <div className="mb-3">
        <span
          className="inline-block px-2 py-1 text-xs rounded"
          style={{
            backgroundColor: '#FFE4E1',
            color: '#8B4513',
            fontFamily: '乐米小奶泡体',
          }}
        >
          星期{weekDay}
        </span>
      </div>

      {title && (
        <h3
          className="text-lg font-bold mb-2 truncate"
          style={{ color: '#722F37', fontFamily: '乐米小奶泡体' }}
        >
          {title}
        </h3>
      )}

      {excerpt && (
        <p
          className="text-sm mb-3 line-clamp-3"
          style={{
            color: '#5a4a3a',
            fontFamily: '乐米小奶泡体',
            lineHeight: '1.8',
          }}
          dangerouslySetInnerHTML={{ __html: excerpt }}
        />
      )}

      {photoUrl && (
        <div className="mb-3 rounded-lg overflow-hidden shadow-md">
          <img src={photoUrl} alt="" className="w-full h-32 object-cover" />
        </div>
      )}

      {stickerEmoji && (
        <div className="absolute bottom-16 right-4 text-3xl animate-bounce">
          {stickerEmoji}
        </div>
      )}

      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <span className="text-xs text-gray-400" style={{ fontFamily: '乐米小奶泡体' }}>共 {wordCount} 字</span>
        <div className="flex gap-1">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
          <Sparkles className="w-3 h-3 text-purple-400 fill-purple-400" />
        </div>
      </div>
    </div>
  );
}
