import { useState, useRef, useEffect } from 'react';
import { Plus, Search, Filter, Calendar, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, Button, EmptyState } from '../components/UI';
import { mockDiaries } from '../data/mockData';

const moodFilters = [
  { label: '全部', value: 'all' },
  { label: '开心', value: 'happy', color: 'bg-yellow-50 text-yellow-600' },
  { label: '甜蜜', value: 'sweet', color: 'bg-pink-50 text-pink-600' },
  { label: '感动', value: 'touched', color: 'bg-blue-50 text-blue-600' },
  { label: '难过', value: 'sad', color: 'bg-red-50 text-red-600' },
];

export function DiaryPage() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredDiaries = mockDiaries.filter(diary => {
    const matchesMood = selectedMood === 'all' || diary.mood === selectedMood;
    const matchesSearch = diary.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !selectedDate || diary.date.startsWith(selectedDate);
    return matchesMood && matchesSearch && matchesDate;
  });

  const formatDateDisplay = (dateStr: string | null) => {
    if (!dateStr) return '选择日期';
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
  };

  const handleDateSelect = (month: number) => {
    const year = currentMonth.getFullYear();
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    setSelectedDate(monthStr);
    setShowDatePicker(false);
  };

  const getMonths = () => {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  };

  const clearDateFilter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDate(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-foreground">📝 恋爱日记</h1>
          <p className="text-muted-foreground mt-1">记录我们感情的点点滴滴</p>
        </div>
        <Button onClick={() => navigate('/diary/write')}>
          <Plus className="w-4 h-4 mr-2" />
          写日记
        </Button>
      </div>

      <Card className="!p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="搜索日记..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface border-2 border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="relative" ref={datePickerRef}>
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2
                  ${selectedDate
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-pink-50 text-[#8B4513] border border-pink-200 hover:bg-pink-100'
                  }
                `}
                style={!selectedDate ? { backgroundColor: '#FFF0F5', borderColor: '#FFD1DC' } : {}}
              >
                <Calendar className="w-4 h-4" style={!selectedDate ? { color: '#8B4513' } : {}} />
                <span>{formatDateDisplay(selectedDate)}</span>
                {selectedDate && (
                  <X className="w-4 h-4" onClick={clearDateFilter} />
                )}
              </button>
              {showDatePicker && (
                <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-2xl shadow-xl border border-pink-200 p-4 w-64">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                      className="w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 text-[#8B4513] flex items-center justify-center"
                    >
                      ‹
                    </button>
                    <span className="font-bold text-[#8B4513]">
                      {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
                    </span>
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                      className="w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 text-[#8B4513] flex items-center justify-center"
                    >
                      ›
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {getMonths().map((month) => {
                      const monthStr = `${currentMonth.getFullYear()}-${String(month).padStart(2, '0')}`;
                      const isSelected = selectedDate === monthStr;
                      return (
                        <button
                          key={month}
                          onClick={() => handleDateSelect(month)}
                          className={`
                            py-2 px-3 rounded-full text-sm transition-all
                            ${isSelected
                              ? 'bg-primary text-white'
                              : 'hover:bg-pink-50 text-[#8B4513]'
                            }
                          `}
                        >
                          {month}月
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            {moodFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedMood(filter.value)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${selectedMood === filter.value
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : filter.value === 'all'
                    ? 'bg-muted text-muted-foreground hover:bg-muted/80'
                    : `${filter.color} opacity-70 hover:opacity-100`
                  }
                `}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {filteredDiaries.length === 0 ? (
        <EmptyState
          icon={<Filter className="w-10 h-10" />}
          title="暂无日记"
          description="还没有写过日记，点击下方按钮记录你们的第一个美好时刻吧！"
          action={{
            label: '写日记',
            onClick: () => navigate('/diary/write'),
          }}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDiaries.map((diary) => (
            <Card
              key={diary.id}
              hover
              className="cursor-pointer overflow-hidden !p-0"
              onClick={() => navigate(`/diary/${diary.id}`)}
            >
              {diary.images[0] && (
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={diary.images[0]}
                    alt={diary.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={diary.mood as any}>
                    {diary.mood === 'happy' ? '😊 开心' :
                     diary.mood === 'sweet' ? '🥰 甜蜜' :
                     diary.mood === 'touched' ? '😢 感动' :
                     diary.mood === 'sad' ? '😭 难过' : diary.mood}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{diary.date}</span>
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{diary.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {diary.content.replace(/<[^>]*>/g, '')}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}