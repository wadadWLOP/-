import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';

const decorations = [
  { type: '🐾', x: '3%', y: '12%' },
  { type: '💕', x: '95%', y: '15%' },
  { type: '⭐', x: '88%', y: '35%' },
  { type: '🐾', x: '6%', y: '45%' },
  { type: '💗', x: '2%', y: '65%' },
  { type: '⭐', x: '96%', y: '60%' },
  { type: '💕', x: '45%', y: '8%' },
  { type: '🐾', x: '92%', y: '85%' },
  { type: '⭐', x: '10%', y: '88%' },
  { type: '💗', x: '75%', y: '18%' },
  { type: '🐾', x: '25%', y: '95%' },
  { type: '💕', x: '60%', y: '92%' },
  { type: '⭐', x: '18%', y: '25%' },
  { type: '💗', x: '82%', y: '92%' },
  { type: '🐾', x: '55%', y: '5%' },
  { type: '⭐', x: '8%', y: '78%' },
  { type: '💕', x: '90%', y: '50%' },
  { type: '💗', x: '35%', y: '3%' },
  { type: '🐾', x: '98%', y: '40%' },
  { type: '⭐', x: '12%', y: '35%' },
  { type: '💗', x: '70%', y: '3%' },
  { type: '🐾', x: '42%', y: '95%' },
  { type: '💕', x: '85%', y: '75%' },
  { type: '⭐', x: '3%', y: '88%' },
  { type: '💗', x: '58%', y: '2%' },
  { type: '🐾', x: '15%', y: '5%' },
  { type: '💕', x: '32%', y: '92%' },
  { type: '⭐', x: '78%', y: '98%' },
  { type: '💗', x: '5%', y: '52%' },
  { type: '🐾', x: '93%', y: '28%' },
  { type: '💕', x: '48%', y: '97%' },
  { type: '⭐', x: '22%', y: '18%' },
  { type: '💗', x: '68%', y: '88%' },
  { type: '🐾', x: '38%', y: '6%' },
  { type: '💕', x: '72%', y: '42%' },
  { type: '⭐', x: '2%', y: '32%' },
  { type: '💗', x: '88%', y: '68%' },
  { type: '🐾', x: '52%', y: '90%' },
];

export function Layout() {
  return (
    <div className="min-h-screen bg-[#F8F5F0] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {decorations.map((dec, i) => (
          <span
            key={i}
            className="absolute text-[#F0D0D0]/40"
            style={{
              left: dec.x,
              top: dec.y,
              fontSize: '16px',
              opacity: 0.4,
            }}
          >
            {dec.type}
          </span>
        ))}
      </div>
      <TopNav />
      <main className="pt-20 relative">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}