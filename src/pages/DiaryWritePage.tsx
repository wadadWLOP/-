import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Cloud, Sun, CloudRain, CloudSnow, Image, Pencil, Sticker, Archive } from 'lucide-react';
import { supabase, uploadImage } from '../lib/supabase';
import { PhotoPage } from '../components/PhotoPage';

const weatherIcons: Record<string, React.ReactNode> = {
  sunny: <Sun className="w-5 h-5 text-yellow-500" />,
  cloudy: <Cloud className="w-5 h-5 text-gray-400" />,
  rainy: <CloudRain className="w-5 h-5 text-blue-400" />,
  snowy: <CloudSnow className="w-5 h-5 text-blue-200" />,
};

const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

interface FloatingElement {
  id: string;
  type: 'photo' | 'sticker' | 'doodle';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scale: number;
  zIndex: number;
  src?: string;
  emoji?: string;
}

interface PageData {
  leftContent: string;
  rightContent: string;
}

interface PhotoPageData {
  topImage: string | null;
  bottomImage: string | null;
  topDescription: string;
  bottomDescription: string;
}

export function DiaryWritePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dateParam = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const archiveId = searchParams.get('archiveId');
  const [pages, setPages] = useState<PageData[]>([{ leftContent: '', rightContent: '' }]);
  const [photoPages, setPhotoPages] = useState<PhotoPageData[]>([{ topImage: null, bottomImage: null, topDescription: '', bottomDescription: '' }]);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPhotoPage, setCurrentPhotoPage] = useState(0);
  const [isPhotoMode, setIsPhotoMode] = useState(false);
  const [weather, setWeather] = useState<string>('sunny');
  const [showWeatherPicker, setShowWeatherPicker] = useState(false);
  const [isEntryAnimating, setIsEntryAnimating] = useState(true);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [diaryCategory, setDiaryCategory] = useState<'qiuqiu' | 'guozhi' | ''>('');
  const leftTextareaRef = useRef<HTMLTextAreaElement>(null);
  const rightTextareaRef = useRef<HTMLTextAreaElement>(null);

  const currentPageData = pages[currentPage] || { leftContent: '', rightContent: '' };
  const leftContent = currentPageData.leftContent;
  const rightContent = currentPageData.rightContent;
  const totalChars = pages.reduce((acc, page) => acc + page.leftContent.length + page.rightContent.length, 0);

  const date = new Date(dateParam);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekDay = weekDays[date.getDay()];

  useEffect(() => {
    const timer = setTimeout(() => setIsEntryAnimating(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (archiveId) {
      const loadArchive = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('diary_archives')
            .select('*')
            .eq('id', archiveId)
            .single();

          if (error) throw error;

          if (data) {
            // 优先使用 full_content，如果没有则使用 excerpt
            const content = data.full_content || data.excerpt || '';
            setPages([{ leftContent: content, rightContent: '' }]);
            setWeather(data.weather || 'sunny');
            setDiaryCategory(data.category || '');
            if (data.photo_url) {
              setFloatingElements([{
                id: 'photo-1',
                type: 'photo',
                x: 50,
                y: 100,
                width: 200,
                height: 150,
                rotation: -5,
                scale: 1,
                zIndex: 1,
                src: data.photo_url,
              }]);
            }
            if (data.sticker_emoji) {
              setFloatingElements(prev => [...prev, {
                id: 'sticker-1',
                type: 'sticker',
                x: 250,
                y: 80,
                width: 60,
                height: 60,
                rotation: 10,
                scale: 1,
                zIndex: 2,
                emoji: data.sticker_emoji,
              }]);
            }
          }
        } catch (error) {
          console.error('Error loading archive:', error);
        } finally {
          setLoading(false);
        }
      };

      loadArchive();
    }
  }, [archiveId]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggingId) {
        setFloatingElements(prev =>
          prev.map(el =>
            el.id === draggingId
              ? { ...el, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y }
              : el
          )
        );
      }
    };

    const handleMouseUp = () => {
      setDraggingId(null);
    };

    if (draggingId) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingId, dragOffset]);

  const isOverflowing = (textarea: HTMLTextAreaElement): boolean => {
    return textarea.scrollHeight > textarea.clientHeight;
  };

  const getOverflowContent = (textarea: HTMLTextAreaElement): { kept: string; overflow: string } => {
    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight) || 28;
    const maxHeight = textarea.clientHeight;
    const content = textarea.value;
    const lines = content.split('\n');
    
    let keptLines: string[] = [];
    let currentHeight = 0;
    
    for (const line of lines) {
      const lineHeightValue = line ? lineHeight : lineHeight * 0.8;
      if (currentHeight + lineHeightValue > maxHeight) {
        break;
      }
      keptLines.push(line);
      currentHeight += lineHeightValue;
    }
    
    return {
      kept: keptLines.join('\n'),
      overflow: lines.slice(keptLines.length).join('\n')
    };
  };

  const updateCurrentPage = (left: string, right: string) => {
    setPages(prev => {
      const newPages = [...prev];
      newPages[currentPage] = { 
        leftContent: left, 
        rightContent: right
      };
      return newPages;
    });
  };

  const handleLeftContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    const newContent = e.target.value;
    const hasOverflow = isOverflowing(textarea);
    
    if (hasOverflow && rightContent === '') {
      const { kept, overflow } = getOverflowContent(textarea);
      updateCurrentPage(kept, overflow);
      setTimeout(() => rightTextareaRef.current?.focus(), 50);
    } else if (hasOverflow && rightContent !== '') {
      const { kept, overflow } = getOverflowContent(textarea);
      const newRight = overflow + (overflow ? '\n' : '') + rightContent;
      updateCurrentPage(kept, newRight);
    } else if (!hasOverflow && rightContent !== '' && newContent.split('\n').length < MAX_LINES_PER_PAGE) {
      const combined = newContent + '\n' + rightContent;
      const tempTextarea = document.createElement('textarea');
      tempTextarea.value = combined;
      tempTextarea.style.lineHeight = getComputedStyle(e.target).lineHeight;
      tempTextarea.style.width = getComputedStyle(e.target).width;
      tempTextarea.style.height = getComputedStyle(e.target).height;
      tempTextarea.style.visibility = 'hidden';
      tempTextarea.style.position = 'absolute';
      document.body.appendChild(tempTextarea);
      
      const { kept, overflow } = getOverflowContent(tempTextarea);
      document.body.removeChild(tempTextarea);
      
      if (!overflow) {
        updateCurrentPage(combined, '');
      } else {
        updateCurrentPage(kept, overflow);
      }
    } else {
      updateCurrentPage(newContent, rightContent);
    }
  };

  const handleRightContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    const newContent = e.target.value;
    const hasOverflow = isOverflowing(textarea);
    
    if (hasOverflow) {
      const { kept, overflow } = getOverflowContent(textarea);
      
      if (currentPage < pages.length - 1) {
        const nextPageData = pages[currentPage + 1];
        setPages(prev => {
          const newPages = [...prev];
          newPages[currentPage] = { leftContent, rightContent: kept };
          newPages[currentPage + 1] = { 
            leftContent: overflow, 
            rightContent: nextPageData?.rightContent || ''
          };
          return newPages;
        });
        setCurrentPage(currentPage + 1);
        setTimeout(() => {
          if (leftTextareaRef.current) {
            leftTextareaRef.current.focus();
            leftTextareaRef.current.setSelectionRange(leftTextareaRef.current.value.length, leftTextareaRef.current.value.length);
          }
        }, 50);
      } else {
        setPages(prev => {
          const newPages = [...prev];
          newPages[currentPage] = { leftContent, rightContent: kept };
          newPages.push({ leftContent: overflow, rightContent: '' });
          return newPages;
        });
        setCurrentPage(currentPage + 1);
        setTimeout(() => {
          if (leftTextareaRef.current) {
            leftTextareaRef.current.focus();
            leftTextareaRef.current.setSelectionRange(leftTextareaRef.current.value.length, leftTextareaRef.current.value.length);
          }
        }, 50);
      }
    } else {
      updateCurrentPage(leftContent, newContent);
    }
  };

  const handleRightKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Backspace' && rightContent === '' && leftContent !== '') {
      updateCurrentPage(leftContent, '');
    }
  };

  const handleArchive = async () => {
    setIsArchiving(true);
    try {
      // 提取第一张照片
      const photoElement = floatingElements.find(el => el.type === 'photo');
      const photoUrl = photoElement?.src;
      
      // 提取第一个贴纸
      const stickerElement = floatingElements.find(el => el.type === 'sticker');
      const stickerEmoji = stickerElement?.emoji;
      
      // 生成摘要（取左页前 50 字）
      const excerpt = leftContent.slice(0, 50) + (leftContent.length > 50 ? '...' : '');
      
      if (archiveId) {
        // 从归档卡片进入，更新原有记录
        await supabase
          .from('diary_archives')
          .update({
            excerpt: excerpt,
            full_content: leftContent,
            category: diaryCategory,
            weather: weather,
            word_count: totalChars,
            photo_url: photoUrl,
            sticker_emoji: stickerEmoji,
            background_color: '#FFFBF0',
          })
          .eq('id', archiveId);
      } else {
        // 新建归档
        await supabase.from('diary_archives').insert({
          diary_id: null,
          date: dateParam,
          title: undefined,
          excerpt: excerpt,
          full_content: leftContent,
          category: diaryCategory,
          weather: weather,
          word_count: totalChars,
          photo_url: photoUrl,
          sticker_emoji: stickerEmoji,
          background_color: '#FFFBF0',
        });
      }
      
      setShowArchiveConfirm(true);
      setTimeout(() => {
        setShowArchiveConfirm(false);
        navigate('/diary');
      }, 2000);
    } catch (error) {
      console.error('Archive failed:', error);
      alert('归档失败，请重试');
    } finally {
      setIsArchiving(false);
    }
  };

  const goToNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      setPages([...pages, { leftContent: '', rightContent: '' }]);
      setCurrentPage(pages.length);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleBack = async () => {
    const diaryData = {
      date: dateParam,
      left_content: pages[0]?.leftContent || '',
      right_content: pages[0]?.rightContent || '',
      weather,
      floating_elements: floatingElements,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('diaries')
      .upsert(diaryData);

    if (error) {
      console.error('Error saving diary:', error);
    }

    navigate('/diary');
  };

  const addFloatingElement = (type: 'photo' | 'sticker' | 'doodle', data?: { emoji?: string; src?: string }) => {
    const textareaRef = rightContent !== '' ? rightTextareaRef : leftTextareaRef;
    const rect = textareaRef.current?.getBoundingClientRect();
    
    const newElement: FloatingElement = {
      id: Date.now().toString(),
      type,
      x: rect ? rect.left + rect.width / 2 - 100 : 100,
      y: rect ? rect.top + rect.height / 2 - 75 : 100,
      width: type === 'photo' ? 200 : 100,
      height: type === 'photo' ? 150 : 100,
      rotation: 0,
      scale: 1,
      zIndex: floatingElements.length,
      ...data,
    };
    setFloatingElements(prev => [...prev, newElement]);
    setSelectedElement(newElement.id);
    setShowStickerPicker(false);
  };

  const updateElement = (id: string, updates: Partial<FloatingElement>) => {
    setFloatingElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const deleteElement = (id: string) => {
    setFloatingElements(prev => prev.filter(el => el.id !== id));
    setSelectedElement(null);
  };

  return (
    <div className="min-h-screen bg-[#2C3E50] flex items-center justify-center p-4 overflow-hidden relative">
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin text-6xl mb-4">📖</div>
            <p className="text-gray-400" style={{ fontFamily: '乐米小奶泡体' }}>加载日记中...</p>
          </div>
        </div>
      ) : (
        <>
          <div
            className={`relative w-full max-w-4xl transition-all duration-700 ${
              isEntryAnimating ? 'scale-75 rotate-3 opacity-0' : 'scale-100 rotate-0 opacity-100'
            }`}
            style={{ perspective: '2000px' }}
          >
            <div
              className="relative bg-[#faf5ee] rounded-lg transition-transform duration-500"
              style={{
                boxShadow: `
                  0 40px 80px rgba(0,0,0,0.5),
                  0 15px 30px rgba(0,0,0,0.3),
                  -8px 0 20px rgba(0,0,0,0.15),
                  8px 0 20px rgba(0,0,0,0.15)
                `,
                background: `
                  url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")
                `,
                backgroundColor: '#faf5ee',
                maxHeight: '80vh',
                width: '100%',
                maxWidth: '800px',
              }}
            >
              {/* 照片页标签 - 紧贴右边边缘 */}
              <button
                onClick={() => setIsPhotoMode(!isPhotoMode)}
                className={`absolute -right-8 top-1/2 -translate-y-1/2 z-50 w-8 h-24 rounded-r-xl rounded-l-none shadow-xl transition-all duration-300 flex items-center justify-center ${
                  isPhotoMode
                    ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white'
                    : 'bg-gradient-to-r from-pink-200 to-pink-300 text-pink-700 hover:from-pink-300 hover:to-pink-400'
                }`}
                style={{
                  fontFamily: '乐米小奶泡体',
                  letterSpacing: '0.05em',
                }}
                title={isPhotoMode ? '返回文字页' : '切换到照片页'}
              >
                <span className="text-xs font-medium" style={{ writingMode: 'vertical-rl' }}>{isPhotoMode ? '文字' : '照片'}</span>
              </button>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 top-0 bottom-0 w-12 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#8a7a60]/15 to-transparent" />
            <div
              className="absolute left-1/2 top-0 bottom-0 w-[4px] -translate-x-1/2 bg-gradient-to-b from-[#6a5a40]/40 via-[#5a4a30]/50 to-[#6a5a40]/40"
              style={{ boxShadow: '0 0 15px rgba(90, 74, 48, 0.4)' }}
            />
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 bg-gradient-to-b from-transparent via-[#4a3a20]/30 to-transparent" />
          </div>
          {floatingElements.filter(el => el.type === 'photo').map(el => (
            <div
              key={el.id}
              className="absolute cursor-move pointer-events-auto"
              style={{
                left: el.x,
                top: el.y,
                width: el.width,
                height: el.height,
                zIndex: el.zIndex,
                transform: `rotate(${el.rotation}deg) scale(${el.scale})`,
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDraggingId(el.id);
                setSelectedElement(el.id);
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                setDragOffset({
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                });
              }}
              onClick={() => setSelectedElement(el.id)}
            >
              <img
                src={el.src}
                alt=""
                className="w-full h-full object-cover rounded-lg shadow-md pointer-events-none"
                draggable={false}
              />
              {selectedElement === el.id && (
                <div className="absolute -top-2 -right-2 flex gap-1 pointer-events-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFloatingElements(prev => prev.map(p => p.id === el.id ? { ...p, zIndex: prev.length - 1 } : p));
                    }}
                    className="w-6 h-6 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center"
                    title="置于顶层"
                  >
                    ↑
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateElement(el.id, { zIndex: 0 });
                    }}
                    className="w-6 h-6 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center"
                    title="置于底层"
                  >
                    ↓
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateElement(el.id, { rotation: (el.rotation + 15) % 360 });
                    }}
                    className="w-6 h-6 bg-green-500 text-white rounded-full text-xs flex items-center justify-center"
                    title="旋转15°"
                  >
                    ↻
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const newScale = Math.max(0.5, el.scale - 0.1);
                      updateElement(el.id, { scale: newScale, width: el.width * newScale / el.scale, height: el.height * newScale / el.scale });
                    }}
                    className="w-6 h-6 bg-purple-500 text-white rounded-full text-xs flex items-center justify-center"
                    title="缩小"
                  >
                    −
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const newScale = Math.min(2, el.scale + 0.1);
                      updateElement(el.id, { scale: newScale, width: el.width * newScale / el.scale, height: el.height * newScale / el.scale });
                    }}
                    className="w-6 h-6 bg-purple-500 text-white rounded-full text-xs flex items-center justify-center"
                    title="放大"
                  >
                    +
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteElement(el.id);
                    }}
                    className="w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                    title="删除"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          ))}

          <div className="relative flex overflow-hidden max-h-[70vh]">
            <button
              onClick={handleBack}
              className="absolute top-4 left-4 z-30 w-10 h-10 rounded-full bg-[#faf5ee]/95 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-[#fff] transition-all hover:scale-105"
            >
              <ChevronLeft className="w-5 h-5 text-[#5a4030]" />
            </button>

            {!isPhotoMode ? (
              <>
                <div className="w-1/2 p-6 pt-12 flex flex-col h-[500px] relative">
                  {currentPage === 0 && (
                  <div className="mb-2 flex-shrink-0">
                    {/* 日记分类选择 */}
                    <div className="flex justify-center mb-3">
                      <div className="flex gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                        <button
                          onClick={() => setDiaryCategory('qiuqiu')}
                          className={`px-3 py-1 rounded-full text-sm transition-all ${
                            diaryCategory === 'qiuqiu'
                              ? 'bg-pink-400 text-white shadow-md'
                              : 'text-gray-500 hover:bg-pink-100'
                          }`}
                          style={{ fontFamily: '乐米小奶泡体' }}
                        >
                          📔 秋秋的日记
                        </button>
                        <button
                          onClick={() => setDiaryCategory('guozhi')}
                          className={`px-3 py-1 rounded-full text-sm transition-all ${
                            diaryCategory === 'guozhi'
                              ? 'bg-blue-400 text-white shadow-md'
                              : 'text-gray-500 hover:bg-blue-100'
                          }`}
                          style={{ fontFamily: '乐米小奶泡体' }}
                        >
                          📘 果汁的日记
                        </button>
                      </div>
                    </div>

                <h2
                  className="text-2xl mb-2"
                  style={{ color: '#c45c3e', fontFamily: '乐米小奶泡体' }}
                >
                  {year}.{month.toString().padStart(2, '0')}.{day.toString().padStart(2, '0')}
                </h2>
                <div className="flex items-center gap-3 mb-1">
                  <span
                    className="inline-block px-3 py-1 border-2 border-[#3a3a3a] text-sm text-[#3a3a3a] bg-white rounded-sm"
                    style={{ transform: 'rotate(-1.5deg)', fontFamily: '乐米小奶泡体' }}
                  >
                    {weekDay}
                  </span>
                  <button
                    onClick={() => setShowWeatherPicker(!showWeatherPicker)}
                    className="relative p-1 hover:bg-[#f0e8e0] rounded transition-colors"
                  >
                    {weatherIcons[weather]}
                    {showWeatherPicker && (
                      <div className="absolute top-full left-0 mt-2 p-2 bg-white rounded-lg shadow-lg flex gap-2 z-20">
                        {Object.entries(weatherIcons).map(([key, icon]) => (
                          <button
                            key={key}
                            onClick={(e) => {
                              e.stopPropagation();
                              setWeather(key);
                              setShowWeatherPicker(false);
                            }}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                    )}
                  </button>
                </div>
              </div>
              )}

              <div className="flex-1 overflow-hidden">
                <textarea
                  ref={leftTextareaRef}
                  value={leftContent}
                  onChange={handleLeftContentChange}
                  placeholder="在这里写下今天的故事..."
                  className="w-full h-full resize-none bg-transparent border-none outline-none text-sm text-[#3a3020] placeholder:text-[#c0b0a0] placeholder:font-['乐米小奶泡体'] scrollbar-none"
                  style={{
                    lineHeight: '2.2',
                    letterSpacing: '0.05em',
                    fontFamily: '乐米小奶泡体',
                  }}
                />
              </div>
            </div>
                <div className={`w-1/2 p-6 pt-12 flex flex-col h-[500px] border-l ${rightContent ? 'border-[#e8dcc8]' : 'border-transparent'}`}>
                  <div className="flex-1 overflow-hidden relative">
                    <textarea
                      ref={rightTextareaRef}
                      value={rightContent}
                      onChange={handleRightContentChange}
                      onKeyDown={handleRightKeyDown}
                      placeholder={rightContent ? "" : "写满左页后将自动跳转到这里..."}
                      className={`w-full h-full resize-none bg-transparent border-none outline-none text-sm text-[#3a3020] placeholder:text-[#c0b0a0] placeholder:font-['乐米小奶泡体'] scrollbar-none ${!rightContent ? 'opacity-40' : 'opacity-100'}`}
                      style={{
                        lineHeight: '2.2',
                        letterSpacing: '0.05em',
                        fontFamily: '乐米小奶泡体',
                      }}
                    />
                    <div className="absolute top-4 right-4 text-xs text-[#a09080]" style={{ fontFamily: '乐米小奶泡体' }}>
                      {currentPage + 1}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* 照片模式：左右两页都显示照片上传区域 */
              <>
                <div className="w-1/2 p-4 pt-12 flex flex-col h-[500px] relative border-r border-[#e8dcc8]">
                  <div className="absolute top-4 left-4 text-xs text-[#a09080]" style={{ fontFamily: '乐米小奶泡体' }}>
                    第 {currentPhotoPage + 1} 页 · 左
                  </div>
                  <PhotoPage
                    photoPage={photoPages[currentPhotoPage]}
                    position="top"
                    onUpdate={(data) => {
                      const newPhotoPages = [...photoPages];
                      if (!newPhotoPages[currentPhotoPage]) {
                        newPhotoPages[currentPhotoPage] = { topImage: null, bottomImage: null, topDescription: '', bottomDescription: '' };
                      }
                      newPhotoPages[currentPhotoPage] = data;
                      setPhotoPages(newPhotoPages);
                    }}
                  />
                </div>
                <div className="w-1/2 p-4 pt-12 flex flex-col h-[500px] relative">
                  <div className="absolute top-4 right-4 text-xs text-[#a09080]" style={{ fontFamily: '乐米小奶泡体' }}>
                    第 {currentPhotoPage + 1} 页 · 右
                  </div>
                  <PhotoPage
                    photoPage={photoPages[currentPhotoPage]}
                    position="bottom"
                    onUpdate={(data) => {
                      const newPhotoPages = [...photoPages];
                      if (!newPhotoPages[currentPhotoPage]) {
                        newPhotoPages[currentPhotoPage] = { topImage: null, bottomImage: null, topDescription: '', bottomDescription: '' };
                      }
                      newPhotoPages[currentPhotoPage] = data;
                      setPhotoPages(newPhotoPages);
                    }}
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-between px-4 py-3 bg-[#f5f0e8] border-t border-[#e8dcc8]">
            <div className="flex items-center gap-2">
              {!isPhotoMode ? (
                <span className="text-sm text-[#a09080]" style={{ fontFamily: '乐米小奶泡体' }}>共 {totalChars} 字</span>
              ) : (
                <span className="text-sm text-[#a09080]" style={{ fontFamily: '乐米小奶泡体' }}>第 {currentPhotoPage + 1} / {photoPages.length} 页</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isPhotoMode && (
                <>
                  <button
                    onClick={() => setCurrentPhotoPage(Math.max(0, currentPhotoPage - 1))}
                    disabled={currentPhotoPage === 0}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-all ${
                      currentPhotoPage === 0
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-[#5a4030] hover:bg-[#e8dcc8]'
                    }`}
                    style={{ fontFamily: '乐米小奶泡体' }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      const newPages = [...photoPages];
                      newPages.push({ topImage: null, bottomImage: null, topDescription: '', bottomDescription: '' });
                      setPhotoPages(newPages);
                      setCurrentPhotoPage(newPages.length - 1);
                    }}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm text-[#5a4030] hover:bg-[#e8dcc8] transition-all"
                    style={{ fontFamily: '乐米小奶泡体' }}
                  >
                    <span>+ 新页</span>
                  </button>
                  <button
                    onClick={() => setCurrentPhotoPage(Math.min(photoPages.length - 1, currentPhotoPage + 1))}
                    disabled={currentPhotoPage === photoPages.length - 1}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-all ${
                      currentPhotoPage === photoPages.length - 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-[#5a4030] hover:bg-[#e8dcc8]'
                    }`}
                    style={{ fontFamily: '乐米小奶泡体' }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {!isPhotoMode && (
                <>
                  <button
                    onClick={handleArchive}
                    disabled={isArchiving || totalChars === 0}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm transition-all ${
                      isArchiving || totalChars === 0
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-[#c45c3e] hover:bg-[#c45c3e]/10'
                    }`}
                    style={{ fontFamily: '乐米小奶泡体' }}
                    title="归档日记"
                  >
                    <Archive className="w-4 h-4" />
                    <span>{isArchiving ? '归档中...' : '归档'}</span>
                  </button>

                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 0}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-all ${
                      currentPage === 0
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-[#5a4030] hover:bg-[#e8dcc8]'
                    }`}
                    style={{ fontFamily: '乐米小奶泡体' }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </>
              )}

              {!isPhotoMode && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="photo-input"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const imageUrl = await uploadImage(file);
                          addFloatingElement('photo', { src: imageUrl });
                        } catch (error) {
                          console.error('Failed to upload image:', error);
                          alert('图片上传失败，请重试');
                        }
                      }
                      e.target.value = '';
                    }}
                  />

                  <div className="flex items-center gap-1 px-2 py-1 bg-[#faf5ee]/80 rounded-full">
                    <button
                      onClick={() => document.getElementById('photo-input')?.click()}
                      className="p-1.5 hover:bg-[#f0e8e0] rounded-full transition-colors"
                      title="插入照片"
                    >
                      <Image className="w-4 h-4 text-[#5a4030]" />
                    </button>
                    <button
                      onClick={() => setShowStickerPicker(!showStickerPicker)}
                      className="p-1.5 hover:bg-[#f0e8e0] rounded-full transition-colors"
                      title="插入贴纸"
                    >
                      <Sticker className="w-4 h-4 text-[#5a4030]" />
                    </button>
                    <button
                      onClick={() => addFloatingElement('doodle')}
                      className="p-1.5 hover:bg-[#f0e8e0] rounded-full transition-colors"
                      title="手绘涂鸦"
                    >
                      <Pencil className="w-4 h-4 text-[#5a4030]" />
                    </button>
                  </div>
                </>
              )}

              {!isPhotoMode && (
                <button
                  onClick={goToNextPage}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg text-[#c45c3e] hover:bg-[#c45c3e]/10 transition-all"
                  style={{ fontFamily: '乐米小奶泡体' }}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {showStickerPicker && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 p-3 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-[#e8dcc8] z-50 animate-fade-in">
              <div className="flex gap-1 flex-wrap justify-center max-w-[200px]">
                {['🔥', '💕', '✨', '🌸', '⭐', '🌙', '💫', '🎀', '🌈', '🍀', '🦋', '🐱', '🌺', '🍃', '💎', '🎵'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      addFloatingElement('sticker', { emoji });
                      setShowStickerPicker(false);
                    }}
                    className="p-2 hover:bg-[#f0e8e0] rounded-lg transition-all hover:scale-110 text-2xl"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 归档确认弹窗 */}
          {showArchiveConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div
                className="relative w-80 bg-gradient-to-b from-amber-50 to-yellow-50 p-8 rounded-2xl shadow-2xl text-center animate-bounce-in"
                style={{
                  backgroundColor: '#FFFBF0',
                  border: '2px solid #F0E6D2',
                }}
              >
                {/* 胶带装饰 */}
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6"
                  style={{
                    backgroundColor: 'rgba(255, 182, 193, 0.6)',
                    border: '1px dashed rgba(255,255,255,0.4)',
                  }}
                />

                <div className="text-6xl mb-4 animate-pulse">✨</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#8B4513', fontFamily: 'cursive' }}>
                  归档成功！
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  日记已存入时光胶囊
                </p>
                <div className="text-xs text-gray-400">
                  即将返回日记列表...
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
           </>
         )}

      {(showStickerPicker || showArchiveConfirm) && (
        <div className="fixed inset-0 z-30" onClick={() => {}} />
      )}
    </div>
  );
}
