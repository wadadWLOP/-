import { NavLink, useLocation } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import { navItems } from '../../constants/navigation';
import { useState } from 'react';

interface SidebarProps {
  loveDays: number;
}

export function Sidebar({ loveDays }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 bg-card rounded-full shadow-md flex items-center justify-center hover:bg-accent transition-colors"
      >
        {isOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-50
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-md">
                <Heart className="w-6 h-6 text-primary-foreground fill-current" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-lg text-sidebar-foreground">恋爱记录</h1>
                <p className="text-sm text-muted-foreground">LoveRecord</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-card rounded-xl border border-border">
              <p className="text-xs text-muted-foreground">在一起的日子</p>
              <p className="font-heading font-bold text-2xl text-primary">{loveDays} 天</p>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-200
                    ${isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'animate-bounce-heart' : ''}`} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-lg">👫</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-sidebar-foreground truncate">我们的故事</p>
                <p className="text-xs text-muted-foreground">记录每一刻</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}