import { useState, useEffect, useRef } from 'react';

const catActions = [
  { name: 'stand', label: '站立' },
  { name: 'walkleft', label: '左跑' },
  { name: 'walkright', label: '右跑' },
  { name: 'sleep', label: '睡觉' },
  { name: 'fish', label: '吃鱼' },
  { name: 'kiss', label: '亲亲' },
  { name: 'drag', label: '拖拽' },
  { name: 'falling', label: '掉落' },
];

interface ActiveCat {
  name: string;
  left: number;
  top: number;
  id: number;
}

const STORAGE_KEY_CATS = '__global_cat_menu_position';
const STORAGE_KEY_ACTIVE_CATS = '__global_active_cats';
const MENU_SIZE = 160;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getValidPosition(x: number, y: number): { left: number; top: number } {
  const maxX = window.innerWidth - MENU_SIZE;
  const maxY = window.innerHeight - MENU_SIZE;
  return {
    left: clamp(x, 0, maxX),
    top: clamp(y, 0, maxY),
  };
}

function getDefaultPosition(): { left: number; top: number } {
  return {
    left: window.innerWidth - MENU_SIZE - 16,
    top: window.innerHeight - MENU_SIZE - 16,
  };
}

function loadPosition(): { left: number; top: number } {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CATS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (typeof parsed.left === 'number' && typeof parsed.top === 'number') {
        return getValidPosition(parsed.left, parsed.top);
      }
    }
  } catch (e) {
    console.error('Failed to load cat position', e);
  }
  return getDefaultPosition();
}

function DraggableCat({ framePrefix, initialLeft, initialTop, onRemove, catId }: { framePrefix: string; initialLeft: number; initialTop: number; onRemove?: (id: number) => void; catId?: number }) {
  const [position, setPosition] = useState({ left: initialLeft, top: initialTop });
  const [isDragging, setIsDragging] = useState(false);
  const [frame, setFrame] = useState(1);
  const [isVisible, setIsVisible] = useState(true);
  const [showClose, setShowClose] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const dragRef = useRef({ startX: 0, startY: 0, startLeft: 0, startTop: 0 });
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isDragging && isVisible && framePrefix !== 'falling') {
      const interval = setInterval(() => {
        setFrame((prev) => (prev % 12) + 1);
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isDragging, isVisible, framePrefix]);

  useEffect(() => {
    // 构建图片 URL
    const staticActions = ['sleep', 'fish', 'kiss'];
    const isStaticAction = staticActions.includes(framePrefix);
    
    let url;
    if (framePrefix === 'falling') {
      // falling 只有一张图片
      url = `https://juiceqiuqiu-1420133198.cos.ap-shanghai.myqcloud.com/max/falling1.png`;
    } else if (isStaticAction) {
      // 静态动作：只有一张图片
      url = `https://juiceqiuqiu-1420133198.cos.ap-shanghai.myqcloud.com/max/${framePrefix}1.png`;
    } else {
      // 动态动作：stand, walkleft, walkright, drag (1-12 帧)
      url = `https://juiceqiuqiu-1420133198.cos.ap-shanghai.myqcloud.com/max/${framePrefix}${frame}.png`;
    }
    
    setImageUrl(url);
  }, [framePrefix, frame]);

  useEffect(() => {
    const saved = localStorage.getItem(`__global_cat_pos_${catId}`);
    if (saved) {
      setPosition(JSON.parse(saved));
    }
  }, [catId]);

  useEffect(() => {
    localStorage.setItem(`__global_cat_pos_${catId}`, JSON.stringify(position));
  }, [position, catId]);

  const handleMouseEnter = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setShowClose(true);
  };

  const handleMouseLeave = () => {
    hideTimerRef.current = setTimeout(() => {
      setShowClose(false);
    }, 2000);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragRef.current = { startX: e.clientX, startY: e.clientY, startLeft: position.left, startTop: position.top };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newLeft = dragRef.current.startLeft + (e.clientX - dragRef.current.startX);
      const newTop = dragRef.current.startTop + (e.clientY - dragRef.current.startY);
      setPosition({ left: newLeft, top: newTop });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  if (!isVisible) return null;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // 图片加载失败时，记录错误
    console.error('图片加载失败:', e.currentTarget.src);
  };

  const handleClose = () => {
    setIsVisible(false);
    if (onRemove && catId !== undefined) {
      setTimeout(() => onRemove(catId), 300);
    }
  };

  return (
    <div
      className="absolute cursor-move select-none z-[9999]"
      style={{ left: position.left, top: position.top }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {showClose && (
        <button onClick={handleClose} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 z-10">×</button>
      )}
      <img 
        src={imageUrl} 
        alt={framePrefix} 
        className="w-20 h-20 object-contain pointer-events-none" 
        draggable={false} 
        onError={handleImageError}
      />
    </div>
  );
}

export function GlobalCatMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCats, setActiveCats] = useState<ActiveCat[]>([]);
  const [menuPosition, setMenuPosition] = useState<{ left: number; top: number }>(loadPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const catIdRef = useRef(activeCats.length > 0 ? Math.max(...activeCats.map(c => c.id)) + 1 : 0);
  const dragRef = useRef({ startX: 0, startY: 0, startLeft: 0, startTop: 0 });

  useEffect(() => {
    const savedCats = localStorage.getItem(STORAGE_KEY_ACTIVE_CATS);
    if (savedCats) {
      try {
        const parsed = JSON.parse(savedCats);
        if (Array.isArray(parsed) && parsed.length > 0) {
          catIdRef.current = Math.max(...parsed.map((c: ActiveCat) => c.id)) + 1;
          setActiveCats(parsed);
        }
      } catch (e) {
        console.error('Failed to parse active cats', e);
      }
    }
  }, []);

  useEffect(() => {
    if (activeCats.length > 0) {
      localStorage.setItem(STORAGE_KEY_ACTIVE_CATS, JSON.stringify(activeCats));
      const maxId = Math.max(...activeCats.map(c => c.id));
      catIdRef.current = maxId + 1;
    }
  }, [activeCats]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CATS, JSON.stringify(menuPosition));
  }, [menuPosition]);

  useEffect(() => {
    const handleResize = () => {
      setMenuPosition((prev) => getValidPosition(prev.left, prev.top));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectAction = (actionName: string) => {
    const newCat: ActiveCat = {
      name: actionName,
      left: 200 + Math.random() * 200,
      top: 200 + Math.random() * 200,
      id: catIdRef.current++,
    };
    setActiveCats((prev) => [...prev, newCat]);
    setIsOpen(false);
  };

  const handleRemoveCat = (id: number) => {
    setActiveCats((prev) => {
      const updated = prev.filter((cat) => cat.id !== id);
      localStorage.setItem(STORAGE_KEY_ACTIVE_CATS, JSON.stringify(updated));
      return updated;
    });
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  const radius = 80;
  const centerX = 28;
  const centerY = 28;

  const handleMenuMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setHasDragged(false);
    dragRef.current = { startX: e.clientX, startY: e.clientY, startLeft: menuPosition.left, startTop: menuPosition.top };
  };

  const handleMenuMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = Math.abs(e.clientX - dragRef.current.startX);
    const deltaY = Math.abs(e.clientY - dragRef.current.startY);
    if (deltaX > 5 || deltaY > 5) {
      setHasDragged(true);
    }
    const newLeft = dragRef.current.startLeft + (e.clientX - dragRef.current.startX);
    const newTop = dragRef.current.startTop + (e.clientY - dragRef.current.startY);
    setMenuPosition({ left: newLeft, top: newTop });
  };

  const handleMenuMouseUp = () => {
    const validPosition = getValidPosition(menuPosition.left, menuPosition.top);
    setMenuPosition(validPosition);
    setIsDragging(false);
    setTimeout(() => setHasDragged(false), 100);
  };

  const handleCatButtonClick = () => {
    if (!hasDragged) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-[9998]" onClick={handleBackdropClick} />
      )}
      {activeCats.map((cat) => (
        <DraggableCat
          key={cat.id}
          catId={cat.id}
          framePrefix={cat.name}
          initialLeft={cat.left}
          initialTop={cat.top}
          onRemove={handleRemoveCat}
        />
      ))}
      <div
        ref={menuRef}
        className="fixed z-[9999] flex items-center justify-center cursor-move select-none"
        style={{ left: menuPosition.left, top: menuPosition.top, width: MENU_SIZE, height: MENU_SIZE }}
        onMouseDown={handleMenuMouseDown}
        onMouseMove={handleMenuMouseMove}
        onMouseUp={handleMenuMouseUp}
        onMouseLeave={handleMenuMouseUp}
      >
        {isOpen && catActions.map((action, index) => {
          const angle = ((index - catActions.length / 2) + 0.5) * (360 / catActions.length);
          const radian = (angle * Math.PI) / 180;
          const x = centerX + radius * Math.cos(radian);
          const y = centerY + radius * Math.sin(radian);

          return (
            <button
              key={action.name}
              onClick={() => handleSelectAction(action.name)}
              className="absolute w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-xs font-bold text-[#5C3A21] hover:bg-pink-100 transition-all"
              style={{
                left: centerX,
                top: centerY,
                transform: `translate(-50%, -50%)`,
                animation: `catMenuAppear 0.4s ease-out forwards`,
                animationDelay: `${index * 60}ms`,
                ['--tx' as string]: `${x - centerX}px`,
                ['--ty' as string]: `${y - centerY}px`,
              }}
            >
              {action.label}
            </button>
          );
        })}
        <button
          onClick={handleCatButtonClick}
          className="w-14 h-14 rounded-full shadow-lg hover:scale-110 transition-transform z-10 overflow-hidden"
          style={{ position: 'absolute', left: centerX, top: centerY, transform: 'translate(-50%, -50%)' }}
        >
          <img src="https://juiceqiuqiu-1420133198.cos.ap-shanghai.myqcloud.com/3.jpg" alt="cat menu" className="w-full h-full object-cover" />
        </button>
      </div>
      <style>{`
        @keyframes catMenuAppear {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) translate(var(--tx, 0), var(--ty, 0)) scale(0);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) translate(var(--tx, 0), var(--ty, 0)) scale(1);
          }
        }
      `}</style>
    </>
  );
}