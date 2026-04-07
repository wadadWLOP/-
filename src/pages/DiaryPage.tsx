import { useState } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, EmptyState, DatePickerModal } from '../components/UI';
import { mockDiaries } from '../data/mockData';

export function DiaryPage() {
  const navigate = useNavigate();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const diaryDates = mockDiaries.map(d => d.date);

  const handleDateSelect = (date: string) => {
    navigate(`/diary/write?date=${date}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-diary text-3xl text-[#5a4030]">📖 秋秋和果汁的日记</h1>
          <p className="font-diary text-sm text-[#8a7060] mt-1">在这个三月</p>
        </div>
        <Button onClick={() => setShowDatePicker(true)}>
          <Plus className="w-4 h-4 mr-2" />
          写日记
        </Button>
      </div>

      {mockDiaries.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-10 h-10" />}
          title="还没有日记"
          description="还没有写过日记，点击上方按钮记录你们的第一个美好时刻吧！"
          action={{
            label: '开始记录',
            onClick: () => setShowDatePicker(true),
          }}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockDiaries.map((diary, index) => (
            <div
              key={diary.id}
              onClick={() => navigate(`/diary/${diary.id}`)}
              className="relative p-5 rounded-2xl bg-[#faf5ee] border border-[#e8dcc8] cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              style={{
                boxShadow: '0 2px 8px rgba(139, 119, 101, 0.1)',
                transform: `rotate(${(index % 3) * 0.5 - 0.5}deg)`,
              }}
            >
              <div className="absolute top-2 right-3 text-xs font-diary text-[#c4a882]">
                {diary.date}
              </div>
              {diary.images[0] && (
                <div className="w-full h-32 rounded-lg overflow-hidden mb-3 mt-2">
                  <img
                    src={diary.images[0]}
                    alt={diary.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <h3 className="font-diary text-lg text-[#5a4030] mb-2">{diary.title}</h3>
              <p className="font-diary text-sm text-[#8a7060] line-clamp-2">
                {diary.content.replace(/<[^>]*>/g, '')}
              </p>
              <div className="absolute bottom-2 right-3 text-xs text-[#c4a882]">
                ✎ 查看全文
              </div>
            </div>
          ))}
        </div>
      )}

      <DatePickerModal
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelect={handleDateSelect}
        diaryDates={diaryDates}
      />
    </div>
  );
}
