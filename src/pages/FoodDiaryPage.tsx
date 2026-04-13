import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function FoodDiaryPage() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-[#1c1814]">
      <div className="absolute top-4 left-4 z-[100]">
        <button
          onClick={() => navigate(-1)}
          className="p-3 rounded-full bg-black/50 backdrop-blur-sm shadow-lg hover:bg-black/70 transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      </div>
      <iframe
        src="/six-faces/index.html"
        title="Six Faces Gallery"
        className="w-full h-full border-0"
        style={{ width: '100vw', height: '100vh' }}
      />
    </div>
  );
}