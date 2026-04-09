import { useState } from 'react';
import { Plus, BookOpen, Search, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, EmptyState, DatePickerModal } from '../components/UI';
import { ScrapbookCard } from '../components/UI/ScrapbookCard';
import { CalendarFilter } from '../components/UI/CalendarFilter';
import { useArchivedDiaries } from '../hooks/useArchivedDiaries';
import { mockDiaries } from '../data/mockData';

export function DiaryPage() {
  const navigate = useNavigate();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCalendarFilter, setShowCalendarFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'qiuqiu' | 'guozhi'>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const { archives, loading, deleteArchive } = useArchivedDiaries();

  const diaryDates = mockDiaries.map(d => d.date);

  const handleDateSelect = (date: string) => {
    navigate(`/diary/write?date=${date}`);
  };

  const handleDeleteArchive = async (id: string) => {
    if (confirm('确定要删除这张归档卡片吗？')) {
      await deleteArchive(id);
    }
  };

  const handleArchiveClick = (id?: string) => {
    if (id) {
      navigate(`/diary/write?archiveId=${id}`);
    }
  };

  const handleDateFilterSelect = (date: string) => {
    setSelectedDate(date);
  };

  // 过滤归档日记
  const filteredArchives = archives.filter(archive => {
    // 搜索过滤
    const matchSearch = searchQuery === '' || 
      archive.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      archive.title?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 分类过滤
    const matchCategory = selectedCategory === 'all' || archive.category === selectedCategory;
    
    // 日期过滤
    const matchDate = selectedDate === '' || archive.date === selectedDate;
    
    return matchSearch && matchCategory && matchDate;
  });

  // 获取所有有日记的月份
  const availableMonths = Array.from(
    new Set(archives.map(a => a.date.substring(0, 7)))
  ).sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-diary text-3xl text-[#5a4030]">📖 秋秋和果汁的日记</h1>
          <p className="font-diary text-sm text-[#8a7060] mt-1">在这个三月</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDatePicker(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-full font-diary text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            style={{ fontFamily: '乐米小奶泡体' }}
          >
            <Plus className="w-4 h-4" />
            <span className="font-medium">写日记</span>
          </button>
        </div>
      </div>

      {/* 搜索和筛选栏 */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* 搜索框 */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索日记内容..."
            className="w-full pl-10 pr-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300 font-diary text-sm"
          />
        </div>

        {/* 分类筛选 */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm transition-all font-diary flex items-center gap-2 ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-pink-400 to-blue-400 text-white shadow-md'
                : 'bg-white/80 text-gray-600 hover:bg-white'
            }`}
          >
            <span className="text-lg">🌸</span>
            <span>全部</span>
          </button>
          <button
            onClick={() => setSelectedCategory('qiuqiu')}
            className={`px-4 py-2 rounded-full text-sm transition-all font-diary flex items-center gap-2 ${
              selectedCategory === 'qiuqiu'
                ? 'bg-pink-400 text-white shadow-md'
                : 'bg-white/80 text-gray-600 hover:bg-white'
            }`}
          >
            <span className="text-lg">🐰</span>
            <span>秋秋</span>
          </button>
          <button
            onClick={() => setSelectedCategory('guozhi')}
            className={`px-4 py-2 rounded-full text-sm transition-all font-diary flex items-center gap-2 ${
              selectedCategory === 'guozhi'
                ? 'bg-blue-400 text-white shadow-md'
                : 'bg-white/80 text-gray-600 hover:bg-white'
            }`}
          >
            <span className="text-lg">🦊</span>
            <span>果汁</span>
          </button>
        </div>

        {/* 日期选择 */}
        <button
          onClick={() => setShowCalendarFilter(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full hover:bg-white transition-colors font-diary text-sm min-w-[150px] justify-center"
        >
          <Calendar className="w-4 h-4 text-[#5a4030]" />
          {selectedDate ? (
            <span className="text-[#5a4030]">{selectedDate}</span>
          ) : (
            <span className="text-gray-500">选择日期</span>
          )}
        </button>
      </div>

      {/* 归档卡片墙 */}
      {!loading && filteredArchives.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 justify-items-center">
          {filteredArchives.map((archive) => (
            <ScrapbookCard
              key={archive.id}
              id={archive.id}
              date={archive.date}
              title={archive.title}
              excerpt={archive.excerpt}
              weather={archive.weather}
              wordCount={archive.word_count}
              photoUrl={archive.photo_url}
              stickerEmoji={archive.sticker_emoji}
              category={archive.category}
              onClick={handleArchiveClick}
              onDelete={() => archive.id && handleDeleteArchive(archive.id)}
            />
          ))}
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-400">加载中...</p>
        </div>
      )}

      {!loading && filteredArchives.length === 0 && (
        <EmptyState
          icon={<BookOpen className="w-10 h-10" />}
          title={searchQuery || selectedCategory !== 'all' || selectedDate ? '没有找到匹配的日记' : '还没有日记'}
          description={searchQuery || selectedCategory !== 'all' || selectedDate ? '换个搜索词或筛选条件试试看~' : '还没有写过日记，点击上方按钮记录你们的第一个美好时刻吧！'}
        />
      )}

      <DatePickerModal
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelect={handleDateSelect}
        diaryDates={diaryDates}
      />

      <CalendarFilter
        isOpen={showCalendarFilter}
        onClose={() => setShowCalendarFilter(false)}
        onSelect={handleDateFilterSelect}
        selectedDate={selectedDate}
        availableMonths={availableMonths}
      />
    </div>
  );
}
