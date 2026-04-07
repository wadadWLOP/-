import { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (date: string) => void;
  diaryDates?: string[];
}

export function DatePickerModal({ isOpen, onClose, onSelect, diaryDates = [] }: DatePickerModalProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [animatingDate, setAnimatingDate] = useState<string | null>(null);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  useEffect(() => {
    if (isOpen) {
      setSelectedDate(null);
      setAnimatingDate(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    setSlideDirection('right');
    setTimeout(() => {
      setCurrentDate(new Date(year, month - 1, 1));
      setSlideDirection(null);
    }, 150);
  };

  const nextMonth = () => {
    setSlideDirection('left');
    setTimeout(() => {
      setCurrentDate(new Date(year, month + 1, 1));
      setSlideDirection(null);
    }, 150);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextMonth();
      } else {
        prevMonth();
      }
    }
  };

  const handleDateClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setAnimatingDate(dateStr);
    setTimeout(() => setAnimatingDate(null), 500);
  };

  const handleConfirm = () => {
    if (selectedDate) {
      onSelect(selectedDate);
      onClose();
    }
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const prevMonthDays = getDaysInMonth(year, month - 1);

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const renderDays = () => {
    const days = [];
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    for (let i = 0; i < firstDay; i++) {
      const day = prevMonthDays - firstDay + i + 1;
      days.push(
        <div key={`prev-${i}`} className="w-10 h-10 flex items-center justify-center text-[#c4a882]/40 font-diary text-sm">
          {day}
        </div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isSelected = selectedDate === dateStr;
      const isToday = todayStr === dateStr;
      const hasDiary = diaryDates.includes(dateStr);
      const isAnimating = animatingDate === dateStr;

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`
            relative w-10 h-10 flex items-center justify-center font-diary text-base cursor-pointer
            transition-all duration-200 hover:scale-110
            ${isSelected ? 'text-[#5a4030]' : 'text-[#6a5040]'}
          `}
          style={{
            transform: `rotate(${(day % 7) * 1.5 - 5}deg)`,
          }}
        >
          {isAnimating && (
            <svg
              className="absolute inset-0 w-full h-full animate-circle-draw"
              viewBox="0 0 40 40"
            >
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke="#e8a060"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="100"
              />
            </svg>
          )}
          {isSelected && (
            <div className="absolute inset-0 animate-highlight rounded-full" />
          )}
          {isToday && !isSelected && (
            <div className="absolute inset-0 border-2 border-[#c9a0a0] rounded-sm rotate-[-2deg]" />
          )}
          <span className={`relative z-10 ${isSelected ? 'font-bold' : ''}`}>
            {day}
          </span>
          {hasDiary && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#c9a0a0] rounded-full" />
          )}
        </div>
      );
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(
        <div key={`next-${i}`} className="w-10 h-10 flex items-center justify-center text-[#c4a882]/40 font-diary text-sm">
          {i}
        </div>
      );
    }

    return days;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[#2a1a0a]/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md animate-pop-in"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="paper-texture rounded-3xl p-6 shadow-2xl"
          style={{
            boxShadow: `
              0 0 0 3px #d4c4a8,
              0 0 0 5px #c4b498,
              0 10px 40px rgba(0,0,0,0.3),
              inset 0 0 60px rgba(139, 119, 101, 0.1)
            `,
            background: `
              linear-gradient(135deg, #f5e6d3 0%, #f0dcc8 100%),
              url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")
            `
          }}
        >
          <button
            onClick={onClose}
            className="absolute -top-3 -right-3 w-10 h-10 bg-[#f5e6d3] border-2 border-[#c4b498] rounded-full flex items-center justify-center shadow-md hover:bg-[#f0dcc8] transition-colors"
          >
            <X className="w-5 h-5 text-[#6a5040]" />
          </button>

          <div className="text-center mb-6">
            <h2 className="font-diary text-2xl text-[#5a4030] handwritten-underline">
              那年那天发生了什么？
            </h2>
            <p className="font-diary text-sm text-[#8a7060] mt-2">选择要记录的日子</p>
          </div>

          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="w-10 h-10 rounded-full border-2 border-[#d4c4a8] bg-[#f5e6d3] flex items-center justify-center hover:bg-[#e8d8c0] transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[#6a5040]" />
            </button>
            <div className="font-diary text-lg text-[#5a4030]">
              {year}年 {month + 1}月
            </div>
            <button
              onClick={nextMonth}
              className="w-10 h-10 rounded-full border-2 border-[#d4c4a8] bg-[#f5e6d3] flex items-center justify-center hover:bg-[#e8d8c0] transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-[#6a5040]" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="w-10 h-8 flex items-center justify-center font-diary text-xs text-[#8a7060]">
                {day}
              </div>
            ))}
          </div>

          <div
            className={`grid grid-cols-7 gap-1 transition-transform duration-150 ${
              slideDirection === 'left' ? '-translate-x-4 opacity-80' :
              slideDirection === 'right' ? 'translate-x-4 opacity-80' : ''
            }`}
          >
            {renderDays()}
          </div>

          <div className="flex gap-4 mt-6 justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full border-2 border-[#c4b498] font-diary text-[#6a5040] hover:bg-[#e8d8c0]/50 transition-colors"
              style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)' }}
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedDate}
              className={`
                px-6 py-2.5 rounded-full font-diary text-white transition-all
                ${selectedDate
                  ? 'bg-[#c9a0a0] hover:bg-[#b89090] shadow-md hover:shadow-lg'
                  : 'bg-[#d4c4a8] cursor-not-allowed'
                }
              `}
              style={selectedDate ? { boxShadow: '0 4px 12px rgba(201, 160, 160, 0.4)' } : {}}
            >
              去记录 ✎
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
