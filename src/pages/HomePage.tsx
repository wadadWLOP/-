import { Heart, Pencil } from 'lucide-react';
import { UpcomingAnniversaryCard, CoreFeaturesGrid } from '../components/UI';
import { useState, useEffect } from 'react';

function LeftAvatar() {
  return (
    <div className="w-28 h-28 rounded-full border-2 border-[#8B7355]/60 bg-[#FFF0D0] flex items-center justify-center shadow-md overflow-hidden">
      <img src="https://xxrbtbeehmfmtpkyahwg.supabase.co/storage/v1/object/public/diary-images/1-1775578079815.jpg" alt="头像" className="w-full h-full object-cover rounded-full" />
    </div>
  );
}

function RightAvatar() {
  return (
    <div className="w-28 h-28 rounded-full border-2 border-[#8B7355]/60 bg-[#E6F3FF] flex items-center justify-center shadow-md overflow-hidden">
      <img src="https://xxrbtbeehmfmtpkyahwg.supabase.co/storage/v1/object/public/diary-images/2-1775578087983.jpg" alt="头像" className="w-full h-full object-cover rounded-full" />
    </div>
  );
}

export function HomePage() {
  const [loveDays, setLoveDays] = useState(40);
  const [startDate, setStartDate] = useState('2026年02月21日');

  useEffect(() => {
    const storedDate = localStorage.getItem('__global_love_startDate') || '2026-02-21';
    setStartDate(new Date(storedDate).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
    const start = new Date(storedDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    setLoveDays(Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 40);
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl p-8 relative overflow-hidden" style={{ backgroundColor: '#FFF9F5' }}>
        <div className="relative flex items-center justify-center gap-6">
          <LeftAvatar />
          <RightAvatar />
          <div className="flex-1 max-w-md text-center">
            <h2
              className="text-lg mb-2 tracking-wide"
              style={{
                fontFamily: "'乐米小奶泡体', cursive",
                color: '#9A8B7A',
                fontWeight: 500
              }}
            >
              超爱喝果汁 🍊
            </h2>

            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span
                className="text-7xl font-bold"
                style={{
                  fontFamily: "'乐米小奶泡体', cursive",
                  color: '#FFA500'
                }}
              >
                {loveDays}
              </span>
              <span
                className="text-3xl"
                style={{ color: '#888888', fontFamily: "'乐米小奶泡体', cursive" }}
              >
                天
              </span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <span
                className="text-sm"
                style={{ color: '#9A8B7A', fontFamily: "'乐米小奶泡体', cursive" }}
              >
                从{startDate}开始
              </span>
              <button className="p-1 rounded-full hover:bg-[#F5E6D3] transition-colors">
                <Pencil className="w-3.5 h-3.5 text-[#9A8B7A]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <UpcomingAnniversaryCard />

      <CoreFeaturesGrid />
    </div>
  );
}