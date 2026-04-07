import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
const BUTTON_SIZE = 56;
const STORAGE_KEY = 'floating_calendar_position';

interface Position {
  x: number;
  y: number;
}

interface FloatingCalendarProps {
  anniversaries?: Array<{
    id: string;
    title: string;
    date: string;
    icon: string;
  }>;
}

export function FloatingCalendar({ anniversaries = [] }: FloatingCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [position, setPosition] = useState<Position>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          const maxX = window.innerWidth - BUTTON_SIZE;
          const maxY = window.innerHeight - BUTTON_SIZE;
          return {
            x: Math.min(Math.max(parsed.x, 0), maxX),
            y: Math.min(Math.max(parsed.y, 0), maxY),
          };
        }
      }
    } catch (e) {
      console.error('Failed to load calendar position', e);
    }
    return { x: window.innerWidth - BUTTON_SIZE - 24, y: window.innerHeight - BUTTON_SIZE - 24 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [isMagnetized, setIsMagnetized] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dragStartRef = useRef<Position>({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);

  const today = new Date();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
  }, [position]);

  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.min(prev.x, window.innerWidth - BUTTON_SIZE),
        y: Math.min(prev.y, window.innerHeight - BUTTON_SIZE),
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      hasMovedRef.current = false;
      setIsDragging(true);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      });
      dragStartRef.current = { x: touch.clientX, y: touch.clientY };
      hasMovedRef.current = false;
      setIsDragging(true);
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const dx = Math.abs(e.clientX - dragStartRef.current.x);
      const dy = Math.abs(e.clientY - dragStartRef.current.y);
      if (dx >= 5 || dy >= 5) {
        hasMovedRef.current = true;
        if (isOpen) setIsOpen(false);
      }

      const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - BUTTON_SIZE));
      const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - BUTTON_SIZE));
      setPosition({ x: newX, y: newY });
    },
    [isDragging, dragOffset, isOpen]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const touch = e.touches[0];

      const dx = Math.abs(touch.clientX - dragStartRef.current.x);
      const dy = Math.abs(touch.clientY - dragStartRef.current.y);
      if (dx >= 5 || dy >= 5) {
        hasMovedRef.current = true;
        if (isOpen) setIsOpen(false);
      }

      const newX = Math.max(0, Math.min(touch.clientX - dragOffset.x, window.innerWidth - BUTTON_SIZE));
      const newY = Math.max(0, Math.min(touch.clientY - dragOffset.y, window.innerHeight - BUTTON_SIZE));
      setPosition({ x: newX, y: newY });
    },
    [isDragging, dragOffset, isOpen]
  );

  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    const magnetThreshold = 100;
    let finalX = position.x;
    let magnetized = false;

    if (position.x < magnetThreshold) {
      finalX = 24;
      magnetized = true;
    } else if (position.x > window.innerWidth - BUTTON_SIZE - magnetThreshold) {
      finalX = window.innerWidth - BUTTON_SIZE - 24;
      magnetized = true;
    }

    if (magnetized) {
      setIsMagnetized(true);
      setPosition(prev => ({ ...prev, x: finalX }));
      setTimeout(() => setIsMagnetized(false), 300);
    }

    if (hasMovedRef.current) {
      console.log('calendar_drag_end', {
        final_x: finalX,
        final_y: position.y,
        is_magnetized: magnetized,
      });
    }
  }, [isDragging, position]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handleEnd]);

  const handleButtonClick = () => {
    if (!hasMovedRef.current) {
      setIsOpen(!isOpen);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getAnniversaryDates = () => {
    return anniversaries.map(a => a.date);
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    );
  };

  const hasAnniversary = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return getAnniversaryDates().includes(dateStr);
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
  };

  const days = getDaysInMonth(currentMonth);
  const anniversaryDates = getAnniversaryDates();

  const PANEL_WIDTH = 320;
  const PANEL_HEIGHT = 380;
  const MARGIN = 12;

  const showAbove = position.y + BUTTON_SIZE + PANEL_HEIGHT + MARGIN > window.innerHeight;
  const showLeft = position.x + BUTTON_SIZE + PANEL_WIDTH + MARGIN > window.innerWidth;

  let panelStyle: React.CSSProperties;

  if (showLeft) {
    panelStyle = {
      width: PANEL_WIDTH,
      top: showAbove ? undefined : position.y,
      bottom: showAbove ? window.innerHeight - position.y : undefined,
      right: window.innerWidth - position.x,
    };
  } else {
    panelStyle = {
      width: PANEL_WIDTH,
      top: showAbove ? undefined : position.y + BUTTON_SIZE + MARGIN,
      bottom: showAbove ? window.innerHeight - position.y - BUTTON_SIZE - MARGIN : undefined,
      left: position.x,
    };
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={`fixed z-[1001] flex items-center justify-center transition-shadow ${
          isDragging ? 'scale-110 cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          left: position.x,
          top: position.y,
          width: BUTTON_SIZE,
          height: BUTTON_SIZE,
          background: 'linear-gradient(135deg, #FFD1DC 0%, #FFB7C5 100%)',
          borderRadius: '50%',
          boxShadow: isDragging
            ? '0 8px 30px rgba(255, 159, 67, 0.5)'
            : '0 4px 12px rgba(255, 159, 67, 0.4)',
          transform: isDragging ? 'scale(1.1)' : isMagnetized ? 'scale(1.05)' : 'scale(1)',
        }}
      >
        <span className="text-2xl select-none">{isOpen ? '✕' : '📅'}</span>
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          className="fixed bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-pink-100 z-[1000] overflow-hidden"
          style={{
            ...panelStyle,
            animation: 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          }}
        >
          <div className="p-4 border-b border-pink-50">
            <div className="flex items-center justify-between">
              <button
                onClick={prevMonth}
                className="w-8 h-8 rounded-full hover:bg-pink-50 flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-[#5C3A42]" />
              </button>
              <span className="text-[#5C3A42] font-medium" style={{ fontFamily: "'乐米小奶泡体', cursive" }}>
                {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
              </span>
              <button
                onClick={nextMonth}
                className="w-8 h-8 rounded-full hover:bg-pink-50 flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-[#5C3A42]" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mt-3">
              {weekDays.map(day => (
                <div key={day} className="text-center text-xs text-[#9A8B7A] py-1">
                  {day}
                </div>
              ))}
              {days.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="h-9" />;
                }
                const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const hasAnniv = anniversaryDates.includes(dateStr);
                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`
                      h-9 rounded-full flex items-center justify-center text-sm transition-all relative
                      ${isToday(day) ? 'bg-[#FF9F43]/20 ring-2 ring-[#FF9F43]/40' : ''}
                      ${isSelected(day) ? 'bg-[#FFB7C5] text-white' : 'hover:bg-pink-50'}
                    `}
                    style={{ color: isSelected(day) ? '#fff' : '#5C3A42' }}
                  >
                    {day}
                    {hasAnniv && <span className="absolute text-[8px] bottom-0">💕</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-pink-50/50">
            {selectedDate && (
              <div className="text-center text-sm text-[#5C3A42]">
                已选择：{selectedDate.getFullYear()}年{selectedDate.getMonth() + 1}月{selectedDate.getDate()}日
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}