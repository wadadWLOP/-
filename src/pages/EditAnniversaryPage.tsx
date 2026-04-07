import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, Heart, Sparkles } from 'lucide-react';
import { Button } from '../components/UI';
import { mockAnniversaries } from '../data/mockData';

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

export function EditAnniversaryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [toast, setToast] = useState<string | null>(null);
  const [anniversary, setAnniversary] = useState(mockAnniversaries.find(a => a.id === Number(id)));

  useEffect(() => {
    if (anniversary) {
      setSelectedDate(new Date(anniversary.date));
      setCurrentMonth(new Date(anniversary.date));
    }
  }, [anniversary]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (number | null)[] = [];

    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number | null) => {
    if (!day) return;
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
  };

  const handleToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(today);
  };

  const handleTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow);
    setCurrentMonth(tomorrow);
  };

  const handleOneYear = () => {
    const oneYear = new Date();
    oneYear.setFullYear(oneYear.getFullYear() + 1);
    setSelectedDate(oneYear);
    setCurrentMonth(oneYear);
  };

  const handleConfirm = () => {
    setToast('纪念日已更新啦~ 🎉');
    setTimeout(() => {
      setToast(null);
      navigate('/anniversary');
    }, 2000);
  };

  const handleCancel = () => {
    navigate('/anniversary');
  };

  const isSelected = (day: number | null) => {
    if (!day) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.toDateString() === selectedDate.toDateString();
  };

  const isToday = (day: number | null) => {
    if (!day) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.toDateString() === new Date().toDateString();
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="min-h-screen bg-[#FFF9F5] relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,182,193,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,182,193,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }} />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-[#FFB6C1] to-[#FFC0CB] rounded-full flex items-center justify-center shadow-lg">
              <Calendar className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#5C3A21] mb-2" style={{ fontFamily: "'乐米小奶泡体', cursive" }}>
            选择新的纪念日
          </h1>
          <p className="text-sm text-[#9A8B7A]">时光倒流，重新定格美好的一天</p>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-4 bg-gradient-to-r from-[#FFF0F5] to-[#FFFAF0]">
            <button
              onClick={handlePrevMonth}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-all active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 text-[#5C3A21]" />
            </button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FFB6C1]" />
              <span className="text-lg font-semibold text-[#5C3A21]">{formatDate(currentMonth)}</span>
              <Sparkles className="w-4 h-4 text-[#FFB6C1]" />
            </div>
            <button
              onClick={handleNextMonth}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-all active:scale-95"
            >
              <ChevronRight className="w-5 h-5 text-[#5C3A21]" />
            </button>
          </div>

          <div className="px-4 py-2">
            <div className="grid grid-cols-7 gap-1 text-center">
              {weekDays.map((day, index) => (
                <div key={index} className="text-xs font-medium text-[#9A8B7A] py-2">
                  {day}
                </div>
              ))}
              {days.map((day, index) => (
                <div key={index} className="aspect-square flex items-center justify-center">
                  {day ? (
                    <button
                      onClick={() => handleDateClick(day)}
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
                        ${isSelected(day)
                          ? 'bg-[#FFB6C1] text-white shadow-md scale-100'
                          : isToday(day)
                            ? 'border-2 border-[#FFB6C1] text-[#FFB6C1]'
                            : 'text-[#5C3A21] hover:bg-[#FFF0F5]'
                        }
                      `}
                    >
                      {day}
                    </button>
                  ) : (
                    <div className="w-10 h-10" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="px-4 py-4 border-t border-[#F0F0F0]">
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleToday}
                className="px-4 py-2 rounded-full bg-[#FFF0F5] text-[#5C3A21] text-sm font-medium hover:bg-[#FFE4E8] transition-colors"
              >
                今天
              </button>
              <button
                onClick={handleTomorrow}
                className="px-4 py-2 rounded-full bg-[#FFF0F5] text-[#5C3A21] text-sm font-medium hover:bg-[#FFE4E8] transition-colors"
              >
                明天
              </button>
              <button
                onClick={handleOneYear}
                className="px-4 py-2 rounded-full bg-[#FFE4E8] text-[#C2185B] text-sm font-medium hover:bg-[#FFD0DC] transition-colors flex items-center gap-1"
              >
                <Heart className="w-3 h-3" />
                一周年
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <Button
            onClick={handleCancel}
            className="flex-1 bg-[#FFF9E6] text-[#5C3A21] border-2 border-[#F0E4C4] hover:bg-[#FFF0D0] rounded-full py-4"
          >
            取消
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-gradient-to-r from-[#FF8A9B] to-[#FFB6C1] text-white rounded-full py-4 shadow-md hover:shadow-lg transition-all"
          >
            确认修改
          </Button>
        </div>
      </div>

      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-white rounded-full px-6 py-3 shadow-lg z-50 flex items-center gap-2 animate-bounce">
          <span className="text-[#C2185B]">{toast}</span>
        </div>
      )}
    </div>
  );
}