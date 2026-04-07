import { NavLink, useLocation } from 'react-router-dom';
import { Heart, Home, BookOpen, Calendar, Star, Image } from 'lucide-react';
import { useState, useEffect } from 'react';

const navItems = [
  { label: '首页', path: '/', icon: Home },
  { label: '日记', path: '/diary', icon: BookOpen },
  { label: '纪念日', path: '/anniversary', icon: Calendar },
  { label: '心愿', path: '/wish', icon: Star },
  { label: '回忆', path: '/album', icon: Image },
];

export function TopNav() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const location = useLocation();

  return (
    <header
      className="border-b border-[#d4c4a8]/30 bg-[#f5f0e6]/80 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer">
            <div className="w-9 h-9 rounded-full border-2 border-[#c9a0a0] bg-gradient-to-br from-[#f8d4d4] to-[#f0c0c0] flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm">
              <span className="text-white font-bold text-sm drop-shadow-md">秋</span>
            </div>
          </div>
          <span className="font-heading text-lg text-[#5a4a3a]">秋秋和果汁的小窝</span>
        </div>

        <nav className="flex items-center gap-1">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`
                  relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'text-[#8B4513] bg-[#f0e0d0]/50'
                    : 'text-[#6a5a4a] hover:text-[#8B4513] hover:bg-[#f0e0d0]/30'
                  }
                `}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon className="w-4 h-4" />
                  {item.label}
                </span>
                {hoveredIndex === index && !isActive && (
                  <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-[#f0e0d0]/20 to-transparent animate-shimmer" />
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-[#c9a0a0] fill-[#c9a0a0]" />
        </div>
      </div>
    </header>
  );
}
