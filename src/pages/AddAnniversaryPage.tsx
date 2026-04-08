import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Heart, Bell, CloudSun, ChevronRight, ChevronLeft, Calendar, Sparkles, Pencil, Repeat } from 'lucide-react';
import { Button } from '../components/UI';
import { supabase } from '../lib/supabase';

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

const anniversaryTypes = [
  { label: '今天喝了一杯果汁', icon: '🍹', color: '#FFA07A' },
  { label: '生日', icon: '🎂', color: '#FF69B4' },
  { label: '今天喝了两杯果汁', icon: '🥤', color: '#FF6347' },
  { label: '秋秋', icon: '🐱', color: '#5C3A21' },
  { label: '三月', icon: '🌸', color: '#FFB6C1' },
  { label: '秋秋秋秋', icon: '🐈', color: '#FFD700' },
];

export function AddAnniversaryPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<string | null>(null);
  const [reminder, setReminder] = useState(true);
  const [mood, setMood] = useState('');
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [toast, setToast] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);

  const canProceed = title.trim().length > 0;

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    const days: (number | null)[] = [];
    for (let i = 0; i < startingDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const formatDateDisplay = (date: Date) => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const handleNext = () => {
    if (canProceed) setStep(2);
  };

  const formatDateToLocal = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const handleConfirm = async () => {
    setToast(true);
    try {
      await supabase.from('anniversaries').insert([{
        title,
        date: formatDateToLocal(selectedDate),
        description: type || undefined,
        icon: anniversaryTypes.find(t => t.label === type)?.icon || '📅',
        is_recurring: isRecurring,
      }]);
    } catch (error) {
      console.error('Failed to add anniversary:', error);
      alert('添加失败，请重试');
      setToast(false);
      return;
    }
    setTimeout(() => {
      setToast(false);
      navigate('/anniversary');
    }, 2000);
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
    else navigate('/anniversary');
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number | null) => {
    if (!day) return;
    setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
  };

  const isSelected = (day: number | null) => {
    if (!day) return false;
    return new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString() === selectedDate.toDateString();
  };

  const isToday = (day: number | null) => {
    if (!day) return false;
    return new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString() === new Date().toDateString();
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="min-h-screen bg-[#FFF9F5] relative">
      <div className="h-2 bg-gradient-to-r from-[#FFB6C1] via-[#DDA0DD] to-[#87CEEB]" />

      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-[#FFE4E8] to-[#FFF0F5] rounded-full flex items-center justify-center shadow-lg">
              <Pencil className="w-10 h-10 text-[#C2185B]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#5C3A21] mb-2" style={{ fontFamily: "'乐米小奶泡体', cursive" }}>
            {step === 1 ? '记录特别的时刻' : '选择日期'}
          </h1>
          <p className="text-sm text-[#9A8B7A]">
            {step === 1 ? '为重要的日子起个名字吧' : '定格美好的一天'}
          </p>
        </div>

        {step === 1 ? (
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#5C3A21] mb-2">
                <Tag className="w-4 h-4 text-[#C2185B]" />
                起个名字吧
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：秋秋捉到一只果汁"
                className="w-full px-4 py-3 bg-white border-b-2 border-[#F0E4C4] rounded-xl focus:border-[#FFB6C1] focus:outline-none transition-colors text-[#5C3A21] placeholder-[#C4B8A8]"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#5C3A21] mb-2">
                <Heart className="w-4 h-4 text-[#C2185B]" />
                这是什么日子
              </label>
              <button
                onClick={() => setShowTypePicker(true)}
                className="w-full px-4 py-3 bg-white border-b-2 border-[#F0E4C4] rounded-xl text-left hover:border-[#FFB6C1] transition-colors flex items-center justify-between"
              >
                <span className={type ? 'text-[#5C3A21]' : 'text-[#C4B8A8]'}>{type || '选择一个类型（可选）'}</span>
                <ChevronRight className="w-4 h-4 text-[#C4B8A8]" />
              </button>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#5C3A21] mb-2">
                <Bell className="w-4 h-4 text-[#C2185B]" />
                提前提醒我
              </label>
              <div className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border-b-2 border-[#F0E4C4]">
                <span className="text-[#9A8B7A]">纪念日当天 / 提前1天提醒</span>
                <button
                  onClick={() => setReminder(!reminder)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${reminder ? 'bg-[#FFB6C1]' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${reminder ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#5C3A21] mb-2">
                <Repeat className="w-4 h-4 text-[#C2185B]" />
                每年循环提醒
              </label>
              <div className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border-b-2 border-[#F0E4C4]">
                <div>
                  <span className="text-[#5C3A21]">每年重复提醒</span>
                  <p className="text-xs text-[#BBBBBB]">每年的这一天都会收到提醒</p>
                </div>
                <button
                  onClick={() => setIsRecurring(!isRecurring)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${isRecurring ? 'bg-[#FFB6C1]' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${isRecurring ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#5C3A21] mb-2">
                <CloudSun className="w-4 h-4 text-[#C2185B]" />
                今日心情
              </label>
              <textarea
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="那天天气很好..."
                rows={3}
                className="w-full px-4 py-3 bg-white border-b-2 border-[#F0E4C4] rounded-xl focus:border-[#FFB6C1] focus:outline-none transition-colors text-[#5C3A21] placeholder-[#C4B8A8] resize-none"
              />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-4 bg-gradient-to-r from-[#FFF0F5] to-[#FFFAF0]">
              <button onClick={handlePrevMonth} className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-all active:scale-95">
                <ChevronLeft className="w-5 h-5 text-[#5C3A21]" />
              </button>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FFB6C1]" />
                <span className="text-lg font-semibold text-[#5C3A21]">{currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月</span>
                <Sparkles className="w-4 h-4 text-[#FFB6C1]" />
              </div>
              <button onClick={handleNextMonth} className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-all active:scale-95">
                <ChevronRight className="w-5 h-5 text-[#5C3A21]" />
              </button>
            </div>

            <div className="px-4 py-2">
              <div className="grid grid-cols-7 gap-1 text-center">
                {weekDays.map((day, i) => (
                  <div key={i} className="text-xs font-medium text-[#9A8B7A] py-2">{day}</div>
                ))}
                {days.map((day, i) => (
                  <div key={i} className="aspect-square flex items-center justify-center">
                    {day ? (
                      <button
                        onClick={() => handleDateClick(day)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                          isSelected(day) ? 'bg-[#FFB6C1] text-white shadow-md' : isToday(day) ? 'border-2 border-[#FFB6C1] text-[#FFB6C1]' : 'text-[#5C3A21] hover:bg-[#FFF0F5]'
                        }`}
                      >
                        {day}
                      </button>
                    ) : <div className="w-10 h-10" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="px-4 py-4 border-t border-[#F0F0F0] text-center">
              <p className="text-[#9A8B7A] text-sm">已选择</p>
              <p className="text-[#C2185B] font-semibold text-lg">{formatDateDisplay(selectedDate)}</p>
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-8">
          <Button
            onClick={handleBack}
            className="flex-1 bg-[#FFF9E6] text-[#5C3A21] border-2 border-[#F0E4C4] hover:bg-[#FFF0D0] rounded-full py-4"
          >
            {step === 1 ? '取消' : '上一步'}
          </Button>
          {step === 1 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className={`flex-1 rounded-full py-4 shadow-md transition-all ${
                canProceed ? 'bg-gradient-to-r from-[#FF8A9B] to-[#FFB6C1] text-white hover:shadow-lg active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              下一步
            </Button>
          ) : (
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-gradient-to-r from-[#FF8A9B] to-[#FFB6C1] text-white rounded-full py-4 shadow-md hover:shadow-lg transition-all"
            >
              确认创建
            </Button>
          )}
        </div>
      </div>

      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-white rounded-full px-6 py-3 shadow-lg z-50 flex items-center gap-2">
          <span className="text-[#C2185B]">纪念日创建成功！🎉</span>
        </div>
      )}

      {showTypePicker && (
        <div className="fixed inset-0 z-50" onClick={() => setShowTypePicker(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-xl transform transition-transform duration-300 ease-out"
            style={{ maxHeight: '70vh', overflow: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white z-10 px-4 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-[#5C3A21]">选择纪念日类型</h3>
                <button
                  onClick={() => setShowTypePicker(false)}
                  className="text-[#9A8B7A] hover:text-[#5C3A21] transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 p-4">
              {anniversaryTypes.map((t) => (
                <button
                  key={t.label}
                  onClick={() => { setType(t.label); setShowTypePicker(false); }}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all ${
                    type === t.label
                      ? 'bg-[#FFE4E8] border-2 border-[#FFB6C1]'
                      : 'bg-[#FFF9F5] border-2 border-transparent hover:bg-[#FFF0F5]'
                  }`}
                >
                  <span className="text-3xl mb-2">{t.icon}</span>
                  <span
                    className="text-sm text-center font-medium"
                    style={{ color: type === t.label ? t.color : '#5C3A21' }}
                  >
                    {t.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}