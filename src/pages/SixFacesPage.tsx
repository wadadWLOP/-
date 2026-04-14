import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Maximize2, Minimize2 } from 'lucide-react';
import './SixFacesPage.css';

export default function SixFacesPage() {
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'six-faces-ready') {
        setIsLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await iframeRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="six-faces-container">
      <div className="six-faces-header">
        <button className="six-faces-back-btn" onClick={handleBack}>
          <ChevronLeft size={24} />
          <span>返回</span>
        </button>
        <h1 className="six-faces-title">六面体</h1>
        <button className="six-faces-fullscreen-btn" onClick={toggleFullscreen}>
          {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      </div>
      
      <div className="six-faces-content">
        {isLoading && (
          <div className="six-faces-loading">
            <div className="spinner"></div>
            <p>加载中...</p>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src="/six-faces/index.html"
          className="six-faces-iframe"
          title="Six Faces"
          allow="fullscreen"
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
}
