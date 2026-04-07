import { useState, useEffect } from 'react';
import { Gift, Cake, PartyPopper, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockAnniversaries } from '../../data/mockData';

interface AnniversaryItem {
  id: string;
  title: string;
  date: string;
  icon: string;
  isRecurring: boolean;
}

interface UpcomingAnniversaryCardProps {
  anniversaries?: AnniversaryItem[];
}

const iconMap: Record<string, React.ReactNode> = {
  '🎁': <Gift className="w-5 h-5 text-white" />,
  '🎂': <Cake className="w-5 h-5 text-white" />,
  '🎈': <PartyPopper className="w-5 h-5 text-white" />,
};

export function UpcomingAnniversaryCard({ anniversaries }: UpcomingAnniversaryCardProps) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [today, setToday] = useState(new Date());
  const [upcomingList, setUpcomingList] = useState<AnniversaryItem[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setToday(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const deletedIds = JSON.parse(localStorage.getItem('deletedAnniversaryIds') || '[]');
    const customAnniversaries: AnniversaryItem[] = JSON.parse(localStorage.getItem('anniversary_custom') || '[]');

    const filteredMock = mockAnniversaries.filter((a: AnniversaryItem) => !deletedIds.includes(a.id));
    const filteredCustom = customAnniversaries.filter((a: AnniversaryItem) => !deletedIds.includes(a.id));
    const allAnniversaries = [...filteredMock, ...filteredCustom];

    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const withNextDate = allAnniversaries.map(item => {
      const [year, month, day] = item.date.split('-').map(Number);
      let nextOccurrence = new Date(year, month - 1, day);
      nextOccurrence.setFullYear(today.getFullYear());

      if (nextOccurrence < todayStart) {
        nextOccurrence.setFullYear(today.getFullYear() + 1);
      }

      const daysLeft = Math.ceil((nextOccurrence.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24));

      let priority = 4;
      if (item.title.includes('生日')) priority = 1;
      else if (item.title.includes('周年')) priority = 2;
      else if (item.title.includes('节日')) priority = 3;

      return { item, daysLeft, priority };
    });

    const futureAnniversaries = withNextDate
      .filter(a => a.daysLeft > 0 && a.daysLeft <= 365)
      .sort((a, b) => {
        if (a.daysLeft !== b.daysLeft) return a.daysLeft - b.daysLeft;
        return a.priority - b.priority;
      });

    setUpcomingList(futureAnniversaries.map(f => f.item));
  }, [today]);

  const displayList = isExpanded ? upcomingList : upcomingList.slice(0, 1);

  const getDaysLeft = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    let nextOccurrence = new Date(year, month - 1, day);
    nextOccurrence.setFullYear(today.getFullYear());

    if (nextOccurrence < todayStart) {
      nextOccurrence.setFullYear(today.getFullYear() + 1);
    }

    return Math.ceil((nextOccurrence.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getProgress = (dateStr: string) => {
    const daysLeft = getDaysLeft(dateStr);
    return Math.max(0, Math.min(100, ((365 - daysLeft) / 365) * 100));
  };

  const getCountdownText = (daysLeft: number) => {
    if (daysLeft === 0) return '就是今天！';
    if (daysLeft === 1) return '明天见';
    if (daysLeft <= 30) return `还有 ${daysLeft} 天`;
    return `还有 ${daysLeft} 天`;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'from-[#FF9800] to-[#FF5722]';
    if (progress >= 70) return 'from-[#FF9800] to-[#FF9800]';
    return 'from-[#FFCC80] to-[#FF9800]';
  };

  if (upcomingList.length === 0) {
    return (
      <div
        className="w-full rounded-[20px] bg-[#FFFBF0] border-2 border-[#5D4037] shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-5 cursor-pointer transition-transform hover:scale-[1.02]"
        onClick={() => navigate('/anniversary/add')}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#FFCC80] flex items-center justify-center">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-[#5D4037] font-medium">暂无即将到来的纪念日</p>
            <p className="text-[#757575] text-sm">去创建一个专属回忆吧</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {displayList.map((item) => {
        const daysLeft = getDaysLeft(item.date);
        const progress = getProgress(item.date);

        return (
          <div
            key={item.id}
            className="w-full rounded-[20px] bg-[#FFFBF0] border-2 border-[#5D4037] shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-5 cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => navigate('/anniversary')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FFCC80] flex items-center justify-center shrink-0">
                {iconMap[item.icon] || <Gift className="w-5 h-5 text-white" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[#5D4037] font-bold">{item.title}</h3>
                    <p className={`text-sm ${daysLeft === 0 ? 'text-[#FF5722] animate-pulse' : 'text-[#757575]'}`}>
                      {getCountdownText(daysLeft)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-[#757575] mb-1">倒计时进度</p>
                    <div className="w-24 h-2 bg-[#FFE0B2] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(progress)} transition-all duration-500`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {upcomingList.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="w-full flex items-center justify-center gap-1 py-2 text-[#5D4037] text-sm hover:text-[#8D6E63] transition-colors"
        >
          <span>{isExpanded ? '收起' : `还有 ${upcomingList.length - 1} 个纪念日`}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}