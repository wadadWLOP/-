import { useState, useRef, useEffect } from 'react';
import { Plus, Calendar, Clock, Repeat, MoreHorizontal, Pencil, Trash2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, Button, EmptyState, FloatingCalendar } from '../components/UI';
import { mockAnniversaries } from '../data/mockData';

interface AnniversaryItem {
  id: string;
  title: string;
  date: string;
  description?: string;
  icon: string;
  isRecurring: boolean;
}

export function AnniversaryPage() {
  const navigate = useNavigate();
  const [showType, setShowType] = useState<'past' | 'future'>('past');
  const [anniversaries, setAnniversaries] = useState(() => {
    const deletedIds = JSON.parse(localStorage.getItem('deletedAnniversaryIds') || '[]');
    const customAnniversaries = JSON.parse(localStorage.getItem('anniversary_custom') || '[]');
    return [...mockAnniversaries.filter((a: AnniversaryItem) => !deletedIds.includes(a.id)), ...customAnniversaries.filter((a: AnniversaryItem) => !deletedIds.includes(a.id))];
  });
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<AnniversaryItem | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const today = new Date();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const loadData = () => {
      const deletedIds = JSON.parse(localStorage.getItem('deletedAnniversaryIds') || '[]');
      const customAnniversaries = JSON.parse(localStorage.getItem('anniversary_custom') || '[]');
      setAnniversaries([...mockAnniversaries.filter((a: AnniversaryItem) => !deletedIds.includes(a.id)), ...customAnniversaries.filter((a: AnniversaryItem) => !deletedIds.includes(a.id))]);
    };
    loadData();
    window.addEventListener('focus', loadData);
    return () => window.removeEventListener('focus', loadData);
  }, []);

  const categorizedAnniversaries = anniversaries.map(anniversary => {
    const targetDate = new Date(anniversary.date);
    const diffTime = targetDate.getTime() - today.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isPast = days < 0;

    let displayText: string;
    let yearsAgo = 0;

    if (anniversary.isRecurring) {
      const nextOccurrence = new Date(anniversary.date);
      nextOccurrence.setFullYear(today.getFullYear());
      if (nextOccurrence < today) {
        nextOccurrence.setFullYear(today.getFullYear() + 1);
      }
      if (isPast) {
        displayText = `过去了${Math.abs(days)}天`;
      } else {
        displayText = days === 0 ? '今天' : `剩余 ${days} 天`;
      }
    } else {
      if (isPast) {
        yearsAgo = Math.abs(days);
        displayText = `过去了${yearsAgo}天`;
      } else {
        displayText = days === 0 ? '今天' : `剩余 ${days} 天`;
      }
    }

    return {
      ...anniversary,
      days,
      isPast,
      displayText,
      yearsAgo,
    };
  });

  const pastAnniversaries = categorizedAnniversaries
    .filter(a => a.isPast)
    .sort((a, b) => b.yearsAgo - a.yearsAgo);

  const futureAnniversaries = categorizedAnniversaries
    .filter(a => !a.isPast)
    .sort((a, b) => a.days - b.days);

  const displayList = showType === 'past' ? pastAnniversaries : futureAnniversaries;

  const handleDelete = (anniversary: AnniversaryItem) => {
    const deletedIds = JSON.parse(localStorage.getItem('deletedAnniversaryIds') || '[]');
    if (!deletedIds.includes(anniversary.id)) {
      deletedIds.push(anniversary.id);
      localStorage.setItem('deletedAnniversaryIds', JSON.stringify(deletedIds));
    }
    setAnniversaries(prev => prev.filter(a => a.id !== anniversary.id));
    setDeleteConfirm(null);
    setOpenMenuId(null);
  };

  const handleEdit = (anniversary: AnniversaryItem) => {
    setOpenMenuId(null);
    navigate(`/anniversary/edit/${anniversary.id}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-[#5C3A21]" style={{ fontFamily: "'乐米小奶泡体', cursive" }}>纪念日</h1>
          <p className="text-[#9A8B7A] mt-1 text-sm">记录时光的轨迹</p>
        </div>
        <button
            onClick={() => navigate('/anniversary/add')}
            className="relative px-5 py-2 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 group"
            style={{
              minWidth: '140px',
              background: 'rgba(255, 218, 230, 0.6)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              boxShadow: '0 4px 15px rgba(255, 182, 193, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
              border: '1.5px solid rgba(255, 182, 193, 0.5)',
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <Plus className="w-3.5 h-3.5 text-[#5C3A42]" style={{ strokeWidth: 2.5 }} />
              <span className="text-[#5C3A42] font-normal" style={{ fontFamily: "'乐米小奶泡体', cursive", fontSize: '13px' }}>
                添加日期
              </span>
            </div>
          </button>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setShowType('past')}
          className={`
            px-5 py-2.5 rounded-full font-medium transition-all flex items-center gap-2
            ${showType === 'past'
              ? 'bg-gradient-to-r from-[#D4A574] to-[#E8C4A0] text-white shadow-md'
              : 'bg-[#FFF5EB] text-[#9A8B7A] hover:bg-[#FFECD7]'
            }
          `}
        >
          🍂 铭记的过去
        </button>
        <button
          onClick={() => setShowType('future')}
          className={`
            px-5 py-2.5 rounded-full font-medium transition-all flex items-center gap-2
            ${showType === 'future'
              ? 'bg-gradient-to-r from-[#89CFF0] to-[#B4D8E7] text-white shadow-md'
              : 'bg-[#F0F7FF] text-[#9A8B7A] hover:bg-[#E6F0FF]'
            }
          `}
        >
          🕊️ 约定的未来
        </button>
      </div>

      {displayList.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-10 h-10" />}
          title="暂无纪念日"
          description="添加你们的纪念日吧，每一个特别的日子都值得被记住！"
          action={{
            label: '添加日期',
            onClick: () => navigate('/anniversary/add'),
          }}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayList.map((anniversary, index) => (
            <div
              key={anniversary.id}
              className="relative cursor-pointer group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div
                className="relative rounded-3xl overflow-hidden"
                style={{
                  background: anniversary.isPast
                    ? 'linear-gradient(180deg, #FFF5F7 0%, #FFF8F5 40%, #FFFDFB 100%)'
                    : 'linear-gradient(180deg, #F0F8FF 0%, #F5F8FF 40%, #FDFBFF 100%)',
                  boxShadow: anniversary.isPast
                    ? '0 8px 24px rgba(255, 182, 193, 0.15), inset 0 1px 0 rgba(255,255,255,0.9)'
                    : '0 8px 24px rgba(137, 207, 240, 0.15), inset 0 1px 0 rgba(255,255,255,0.9)',
                  border: '1px solid rgba(245, 230, 248, 0.5)',
                }}
              >
                <div className="flex items-start gap-4 p-5">
                  <div
                    className="relative flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                    style={{
                      background: anniversary.isPast
                        ? 'linear-gradient(135deg, #FFF5F7 0%, #FFE8EC 100%)'
                        : 'linear-gradient(135deg, #F0F8FF 0%, #E3F0FF 100%)',
                      boxShadow: anniversary.isPast
                        ? '0 3px 8px rgba(255, 182, 193, 0.2)'
                        : '0 3px 8px rgba(137, 207, 240, 0.2)',
                    }}
                  >
                    <span className="relative z-10">{anniversary.icon}</span>
                    <div
                      className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full opacity-40"
                      style={{ background: anniversary.isPast ? '#FFD4DC' : '#C0E5FF' }}
                    />
                  </div>

                  <div className="flex-1 min-w-0 pt-1">
                    <h3 className="font-semibold text-base text-[#4A4A4A] truncate">
                      {anniversary.title}
                    </h3>
                    <p className="text-xs text-[#AAAAAA] mt-0.5 truncate">
                      {anniversary.description || anniversary.date}
                    </p>

                    <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                      {anniversary.isRecurring && (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg" style={{ backgroundColor: '#FFF0F5', color: '#FF69B4' }}>
                          <Repeat className="w-2.5 h-2.5" />
                          每年
                        </span>
                      )}
                      <span
                        className="inline-flex items-center gap-0.5 text-[10px] font-medium px-2 py-1 rounded-full"
                        style={{
                          background: anniversary.isPast
                            ? 'linear-gradient(135deg, #FFE8EC 0%, #FFDCE2 100%)'
                            : 'linear-gradient(135deg, #E3F0FF 0%, #D6EDFF 100%)',
                          color: anniversary.isPast ? '#D4889A' : '#7BB8E0',
                        }}
                      >
                        <span>⏰</span>
                        {anniversary.displayText}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                >
                  <Sparkles className="w-3 h-3 text-[#E8D4A0]" />
                </div>
              </div>

              <div
                className="absolute top-3 right-3 z-10"
                ref={openMenuId === anniversary.id ? menuRef : null}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === anniversary.id ? null : anniversary.id);
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors bg-white/80 backdrop-blur-sm"
                >
                  <MoreHorizontal className="w-5 h-5 text-gray-500" />
                </button>

                {openMenuId === anniversary.id && (
                  <div className="absolute right-0 top-8 bg-white/95 backdrop-blur-sm rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-gray-100 py-1 min-w-[160px] z-50 overflow-hidden">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(anniversary);
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <Pencil className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-800 text-[15px]">更改日期</span>
                    </button>
                    <div className="h-px bg-gray-100 mx-2" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm(anniversary);
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 transition-colors text-left"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                      <span className="text-[#FF4D4F] text-[15px]">删除纪念日</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-heading font-semibold text-xl text-[#5C3A21] mb-2">确认删除？</h3>
            <p className="text-[#9A8B7A] mb-6">删除后将无法恢复，是否继续？</p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                取消
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={() => handleDelete(deleteConfirm)}
              >
                确定
              </Button>
            </div>
          </div>
        </div>
      )}

      <FloatingCalendar anniversaries={anniversaries} />
    </div>
  );
}