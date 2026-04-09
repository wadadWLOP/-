import { useState } from 'react';
import { Image as ImageIcon, X, ZoomIn, ZoomOut } from 'lucide-react';
import { uploadImage } from '../lib/supabase';

interface PhotoPageData {
  topImage: string | null;
  bottomImage: string | null;
  topDescription: string;
  bottomDescription: string;
}

interface PhotoPageProps {
  photoPage: PhotoPageData;
  onUpdate: (data: PhotoPageData) => void;
  position?: 'top' | 'bottom'; // 新增参数，用于区分显示上半部分还是下半部分
}

export function PhotoPage({ photoPage, onUpdate, position }: PhotoPageProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await uploadImage(file);
      const key = position === 'bottom' ? 'bottomImage' : 'topImage';
      onUpdate({
        ...photoPage,
        [key]: imageUrl,
      });
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('图片上传失败，请重试');
    }
  };

  const handleRemoveImage = () => {
    const imageKey = position === 'bottom' ? 'bottomImage' : 'topImage';
    const descKey = position === 'bottom' ? 'bottomDescription' : 'topDescription';
    onUpdate({
      ...photoPage,
      [imageKey]: null,
      [descKey]: '',
    });
  };

  const handleDescriptionChange = (value: string) => {
    const descKey = position === 'bottom' ? 'bottomDescription' : 'topDescription';
    onUpdate({
      ...photoPage,
      [descKey]: value,
    });
  };

  const imageKey = position === 'bottom' ? 'bottomImage' : 'topImage';
  const descKey = position === 'bottom' ? 'bottomDescription' : 'topDescription';
  const currentImage = photoPage[imageKey];
  const currentDescription = photoPage[descKey];

  return (
    <div className="w-full h-full flex flex-col">
      {currentImage && (
        <div className="relative h-48 flex-shrink-0 mb-3 flex flex-col">
          <div className="relative flex-1 overflow-hidden rounded-lg bg-gray-100 cursor-move"
            onMouseDown={(e) => {
              if (zoom > 1) {
                setIsDragging(true);
                setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
              }
            }}
            onMouseMove={(e) => {
              if (isDragging && zoom > 1) {
                setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
              }
            }}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
          >
            <img
              src={currentImage}
              alt=""
              className="w-full h-full object-contain transition-transform duration-200"
              style={{ transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)` }}
              draggable={false}
            />
            <div className="absolute bottom-2 right-2 flex gap-1">
              <button
                onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
                className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors text-xs text-gray-600"
                title="重置"
              >
                ↺
              </button>
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
              >
                <ZoomOut className="w-4 h-4 text-gray-600" />
              </button>
              <span className="w-12 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-md text-xs text-gray-600">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(Math.min(2, zoom + 0.25))}
                className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
              >
                <ZoomIn className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 w-6 h-6 bg-red-400 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors shadow-md"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
      {!currentImage && (
        <label className="h-48 flex-shrink-0 mb-3 border-2 border-dashed border-[#e8dcc8] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-pink-300 transition-colors">
          <ImageIcon className="w-10 h-10 text-[#c0b0a0] mb-2" />
          <span className="text-sm text-[#a09080]" style={{ fontFamily: '乐米小奶泡体' }}>
            点击上传照片
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      )}
      <textarea
        value={currentDescription}
        onChange={(e) => handleDescriptionChange(e.target.value)}
        placeholder={position === 'bottom' ? "记录下这个美好瞬间..." : "写下这张照片的故事..."}
        className="flex-1 w-full px-2 py-1 text-sm text-[#5a4030] bg-transparent resize-none focus:outline-none"
        style={{ fontFamily: '乐米小奶泡体' }}
      />
    </div>
  );
}
