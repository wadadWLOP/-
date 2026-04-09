import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface CalendarFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (date: string | '') => void;
  selectedDate?: string;
  availableMonths?: string[];
}

export function CalendarFilter({ isOpen, onClose, onSelect, selectedDate = '', availableMonths = [] }: CalendarFilterProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'month' | 'year'>('day');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen && selectedDate) {
      const date = new Date(selectedDate);
      setCurrentDate(date);
      setSelectedYear(date.getFullYear());
    }
  }, [isOpen, selectedDate]);

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
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onSelect(dateStr);
    onClose();
  };

  const handleMonthClick = (monthIndex: number) => {
    setCurrentDate(new Date(year, monthIndex, 1));
    setView('day');
  };

  const handleYearClick = (yearValue: number) => {
    setSelectedYear(yearValue);
    setView('month');
  };

  const clearSelection = () => {
    onSelect('');
    onClose();
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const prevMonthDays = getDaysInMonth(year, month - 1);

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

  // 获取有日记的年份
  const availableYears = Array.from(new Set(availableMonths.map(m => parseInt(m.substring(0, 4))))).sort();

  const renderDays = () => {
    const days = [];
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // 上个月的日期
    for (let i = 0; i < firstDay; i++) {
      const day = prevMonthDays - firstDay + i + 1;
      days.push(
        <div key={`prev-${i}`} className="w-10 h-10 flex items-center justify-center text-[#c4a882]/40 font-diary text-sm">
          {day}
        </div>
      );
    }

    // 当月的日期
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasDiary = availableMonths.some(m => dateStr.startsWith(m));
      const isSelected = selectedDate === dateStr;
      const isToday = dateStr === todayStr;

      days.push(
        <div
          key={day}
          onClick={() => hasDiary && handleDateClick(day)}
          className={`w-10 h-10 flex items-center justify-center rounded-full font-diary text-sm cursor-pointer transition-all
            ${!hasDiary ? 'text-gray-300 cursor-default' : ''}
            ${isSelected ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-md scale-110' : ''}
            ${hasDiary && !isSelected && isToday ? 'bg-blue-100 text-blue-600 font-bold' : ''}
            ${hasDiary && !isSelected && !isToday ? 'hover:bg-pink-100 text-[#5a4030]' : ''}
          `}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const renderMonths = () => {
    return months.map((monthName, index) => {
      const monthStr = `${year}-${String(index + 1).padStart(2, '0')}`;
      const hasDiary = availableMonths.some(m => m.startsWith(monthStr));
      const isSelected = selectedDate?.startsWith(monthStr);

      return (
        <div
          key={monthName}
          onClick={() => hasDiary && handleMonthClick(index)}
          className={`p-3 rounded-xl text-center cursor-pointer transition-all font-diary text-sm
            ${!hasDiary ? 'text-gray-300 cursor-default' : ''}
            ${isSelected ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-md' : ''}
            ${hasDiary && !isSelected ? 'hover:bg-pink-100 text-[#5a4030]' : ''}
          `}
        >
          {monthName}
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
      <div
        className="relative bg-gradient-to-b from-amber-50 to-yellow-50 p-6 rounded-3xl shadow-2xl animate-bounce-in"
        style={{
          backgroundColor: '#FFFBF0',
          border: '3px solid #F0E6D2',
          maxWidth: '400px',
        }}
      >
        {/* 胶带装饰 */}
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8"
          style={{
            backgroundColor: 'rgba(255, 182, 193, 0.6)',
            border: '1px dashed rgba(255,255,255,0.4)',
          }}
        />

        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 w-8 h-8 bg-red-400 text-white rounded-full shadow-lg hover:bg-red-500 transition-colors flex items-center justify-center z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 标题 */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold mb-2" style={{ color: '#8B4513', fontFamily: '乐米小奶泡体' }}>
            📅 选择日期
          </h3>
        </div>

        {/* 年份和月份导航 */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={view === 'year' ? () => setSelectedYear(Math.max(...availableYears, year - 1)) : prevMonth}
            className="p-2 hover:bg-pink-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#5a4030]" />
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => setView(view === 'year' ? 'day' : 'year')}
              className="px-4 py-2 bg-white/80 rounded-full hover:bg-white transition-colors font-diary text-sm"
              style={{ fontFamily: '乐米小奶泡体' }}
            >
              {year}年
            </button>
            {view === 'day' && (
              <button
                onClick={() => setView('month')}
                className="px-4 py-2 bg-white/80 rounded-full hover:bg-white transition-colors font-diary text-sm"
                style={{ fontFamily: '乐米小奶泡体' }}
              >
                {month + 1}月
              </button>
            )}
          </div>

          <button
            onClick={view === 'year' ? () => setSelectedYear(Math.min(...availableYears, year + 1)) : nextMonth}
            className="p-2 hover:bg-pink-100 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-[#5a4030]" />
          </button>
        </div>

        {/* 日历内容 */}
        <div className="overflow-hidden">
          {view === 'day' && (
            <>
              {/* 星期 */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day, index) => (
                  <div key={index} className="w-10 h-8 flex items-center justify-center text-xs font-diary text-[#8a7060]">
                    {day}
                  </div>
                ))}
              </div>

              {/* 日期 */}
              <div className="grid grid-cols-7 gap-1">
                {renderDays()}
              </div>
            </>
          )}

          {view === 'month' && (
            <div className="grid grid-cols-3 gap-2">
              {renderMonths()}
            </div>
          )}

          {view === 'year' && selectedYear && (
            <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
              {availableYears.map((yearValue) => (
                <div
                  key={yearValue}
                  onClick={() => handleYearClick(yearValue)}
                  className={`p-3 rounded-xl text-center cursor-pointer transition-all font-diary text-sm
                    ${yearValue === year ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-md' : 'hover:bg-pink-100 text-[#5a4030]'}
                  `}
                >
                  {yearValue}年
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="flex justify-between mt-6 pt-4 border-t border-[#e8dcc8]">
          <button
            onClick={clearSelection}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors font-diary text-sm"
            style={{ fontFamily: '乐米小奶泡体' }}
          >
            清除选择
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-full hover:from-pink-500 hover:to-pink-600 transition-colors font-diary text-sm shadow-md"
            style={{ fontFamily: '乐米小奶泡体' }}
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}
