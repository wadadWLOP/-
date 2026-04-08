import { useNavigate } from 'react-router-dom';

const coreFeatures = [
  {
    title: '一起看',
    subtitle: '一起看过的有趣和无趣',
    path: '/diary',
    img: 'https://xxrbtbeehmfmtpkyahwg.supabase.co/storage/v1/object/public/diary-images/4-1775627140118.jpg',
    fallback: '📝',
  },
  {
    title: '笨蛋大王',
    subtitle: '秋秋和果汁都是笨蛋',
    path: '/checkin',
    img: 'https://xxrbtbeehmfmtpkyahwg.supabase.co/storage/v1/object/public/diary-images/5-1775627140346.jpg',
    fallback: '🎀',
  },
  {
    title: '贪吃大王',
    subtitle: '吃吃吃',
    path: '/wish',
    img: 'https://xxrbtbeehmfmtpkyahwg.supabase.co/storage/v1/object/public/diary-images/6-1775627140574.jpg',
    fallback: '✨',
  },
  {
    title: '添加照片',
    subtitle: '珍藏的时光',
    path: '/album',
    img: 'https://xxrbtbeehmfmtpkyahwg.supabase.co/storage/v1/object/public/diary-images/7-1775627140802.jpg',
    fallback: '🖼️',
  },
];

const bannerFeatures = [
  {
    title: '每日提醒',
    subtitle: '设置温馨提醒，不错过每一个重要日子',
    path: '/anniversary/add',
    color: 'from-pink-300 to-rose-400',
    img: 'https://xxrbtbeehmfmtpkyahwg.supabase.co/storage/v1/object/public/diary-images/8-1775627141030.jpg',
    text: '喜欢、爱和小鱼干',
  },
  {
    title: '甜蜜时光',
    subtitle: '记录你们的每一个幸福瞬间',
    path: '/diary',
    color: 'from-amber-300 to-orange-400',
    img: 'https://xxrbtbeehmfmtpkyahwg.supabase.co/storage/v1/object/public/diary-images/9-1775627141258.jpg',
    text: '乌青色染雨霖抚琴拦雨停',
  },
];

export function CoreFeaturesGrid() {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      <div className="flex gap-3 w-full">
        {coreFeatures.map((feature) => (
          <button
            key={feature.path}
            onClick={() => navigate(feature.path)}
            className="flex-1 flex flex-col items-center rounded-[20px] bg-white border-2 border-[#5D4037] shadow-[0_4px_12px_rgba(0,0,0,0.05)] py-5 px-2 active:scale-[0.97] active:opacity-90 transition-all duration-200 cursor-pointer min-w-0"
          >
            <div className="w-20 h-20 rounded-full bg-[#FFF0F0] flex items-center justify-center overflow-hidden mb-3">
              <img
                src={feature.img}
                alt={feature.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) {
                    const span = document.createElement('span');
                    span.textContent = feature.fallback;
                    span.className = 'text-xl';
                    parent.appendChild(span);
                  }
                }}
              />
            </div>
            <p className="text-base font-bold leading-tight text-center truncate w-full px-1" style={{ color: '#4A4A4A' }}>
              {feature.title}
            </p>
            <p className="text-sm mt-4 leading-tight text-center truncate w-full px-1" style={{ color: '#999999' }}>
              {feature.subtitle}
            </p>
          </button>
        ))}
      </div>

      <div className="flex gap-3 w-full">
        {bannerFeatures.map((banner) => (
          <button
            key={banner.path}
            onClick={() => navigate(banner.path)}
            className="flex-1 rounded-[20px] border-2 border-[#5D4037] shadow-[0_4px_12px_rgba(0,0,0,0.05)] active:scale-[0.97] active:opacity-90 transition-all duration-200 cursor-pointer overflow-hidden relative"
            style={{ minHeight: '320px' }}
          >
            {banner.img ? (
              <>
                <img
                  src={banner.img}
                  alt={banner.title}
                  className="w-full h-full absolute inset-0 object-cover"
                  style={{ objectPosition: 'center 30%' }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm py-3 px-2">
                  <p className="text-base font-bold leading-tight text-center" style={{ color: '#4A4A4A' }}>
                    {banner.text}
                  </p>
                </div>
              </>
            ) : null}
          </button>
        ))}
      </div>

      <div className="flex gap-3 w-full">
        <button
          className="flex-1 rounded-[20px] border-2 border-[#5D4037] shadow-[0_4px_12px_rgba(0,0,0,0.05)] active:scale-[0.97] active:opacity-90 transition-all duration-200 cursor-pointer relative overflow-hidden"
          style={{ minHeight: '320px' }}
        >
          <img
            src="https://xxrbtbeehmfmtpkyahwg.supabase.co/storage/v1/object/public/diary-images/10-1775627141486.jpg"
            alt=""
            className="absolute left-3 top-12 w-[432px] h-56 object-cover border-2 border-black"
            style={{ transform: 'rotate(-3deg)', boxShadow: '10px 10px 20px rgba(0,0,0,0.5)' }}
          />
          <div className="absolute right-40 top-1/2 -translate-y-1/2 text-center">
            <p className="text-2xl font-bold leading-relaxed" style={{ color: '#5D4037' }}>
              森林落入凡间的雨滴
            </p>
            <p className="text-2xl font-bold leading-relaxed" style={{ color: '#5D4037' }}>
              夏天燥热又郁闷的空气
            </p>
            <p className="text-base leading-loose" style={{ color: '#999999' }}>
              浮云盖住了迷幻又无趣
            </p>
            <p className="text-base leading-loose" style={{ color: '#999999' }}>
              我挥袖抚琴拦雨停
            </p>
            <button className="mt-4 px-6 py-2 rounded-full bg-pink-200 text-white font-bold text-sm flex items-center justify-center gap-2 mx-auto">
              🌸 去寻找
            </button>
          </div>
        </button>
      </div>

      <div className="w-full flex justify-center mb-8 mt-96">
        <svg className="w-full max-w-[calc(100%-24px)] h-8" viewBox="0 0 400 30" preserveAspectRatio="none" fill="none">
          <path
            d="M5 15 Q20 8, 40 15 T80 15 T120 15 T160 15 T200 15 T240 15 T280 15 T320 15 T360 15 T395 15"
            stroke="#5D4037"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            className="opacity-60"
          />
        </svg>
      </div>

      <div className="w-full flex flex-col items-center">
        <span className="text-pink-200 text-lg">♥</span>
        <p className="text-base mt-1 font-bold" style={{ color: '#5D4037' }}>秋秋和果汁的秘密小屋</p>
      </div>
    </div>
  );
}