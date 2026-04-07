import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';

export function Layout() {
  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-5xl h-full max-h-[85vh] relative rounded-lg overflow-hidden"
          style={{
            background: 'linear-gradient(to right, #d4c4a8 0%, #f5f0e6 2%, #f5f0e6 48%, #e8dcc8 50%, #f5f0e6 52%, #f5f0e6 98%, #d4c4a8 100%)',
            boxShadow: `
              0 0 0 3px #c4b498,
              0 0 0 5px #a89878,
              0 8px 32px rgba(0,0,0,0.5),
              inset 0 0 80px rgba(139, 119, 101, 0.1)
            `
          }}
        >
          <div className="absolute left-0 top-0 bottom-0 w-1/2 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, rgba(0,0,0,0.08), rgba(0,0,0,0.02), transparent)',
            }}
          />
          <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none"
            style={{
              background: 'linear-gradient(to left, rgba(0,0,0,0.08), rgba(0,0,0,0.02), transparent)',
            }}
          />
          <div className="absolute left-1/2 top-0 bottom-0 w-px pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, transparent 0%, rgba(139, 119, 101, 0.2) 5%, rgba(139, 119, 101, 0.2) 95%, transparent 100%)',
            }}
          />
          <div className="absolute inset-0 pointer-events-none rounded-lg"
            style={{
              backgroundImage: `
                linear-gradient(90deg, transparent 79px, rgba(200,180,160,0.4) 79px, rgba(200,180,160,0.4) 81px, transparent 81px),
                linear-gradient(rgba(200,180,160,0.15) 1px, transparent 1px)
              `,
              backgroundSize: '100% 100%, 100% 28px',
            }}
          />
          <div className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden">
            <div
              className="absolute top-0 left-1/2 w-40 h-40 opacity-20"
              style={{
                background: 'radial-gradient(circle, rgba(139, 100, 80, 0.3) 0%, transparent 70%)',
                transform: 'translate(-50%, -50%) rotate(-5deg)'
              }}
            />
          </div>
          <div className="relative z-10 h-full flex flex-col bg-[#f5f0e6]/95 rounded-lg">
            <TopNav />
            <main className="flex-1 overflow-y-auto px-8 py-6">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
