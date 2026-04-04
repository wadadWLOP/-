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
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        ${isScrolled
          ? 'bg-[#F8F5F0]/95 backdrop-blur-sm shadow-lg'
          : 'bg-[#F8F5F0]'
        }
      `}
      style={{
        backgroundImage: isScrolled ? 'none' : 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
        backgroundBlendMode: 'overlay',
      }}
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 rounded-full border-2 border-[#FFB6C1] bg-[#FFF0F5] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <span className="text-white font-bold text-lg drop-shadow-md">秋</span>
            </div>
          </div>
        </div>

        <nav className="flex items-center gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onMouseEnter={() => setHoveredIndex(navItems.indexOf(item))}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  boxShadow: (isActive || hoveredIndex === navItems.indexOf(item))
                    ? '4px 4px 0px 0px rgba(92, 58, 33, 0.25)'
                    : '2px 2px 0px 0px rgba(92, 58, 33, 0.1)',
                }}
                className={`
                  relative flex items-center gap-1 px-3 py-1.5
                  rounded-full border-2 transition-all duration-300
                  font-semibold text-xs
                  ${isActive
                    ? 'bg-[#E8A857] text-[#5C3A21] border-[#5C3A21]'
                    : 'bg-white text-[#5C3A21] border-[#5C3A21]/70 hover:bg-[#F8E8D8]'
                  }
                `}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#5C3A21]'}`} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 rounded-full border-2 border-[#FFB6C1] bg-[#FFF0F5] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <span className="text-white font-bold text-lg drop-shadow-md">果</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}