import { Plus, Image, Grid, LayoutGrid } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, EmptyState } from '../components/UI';
import { mockAlbums } from '../data/mockData';

export function AlbumPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-foreground">📷 甜蜜相册</h1>
          <p className="text-muted-foreground mt-1">保存我们的每一张照片</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-muted rounded-full p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-card shadow-sm' : ''}`}
            >
              <Grid className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-full transition-all ${viewMode === 'list' ? 'bg-card shadow-sm' : ''}`}
            >
              <LayoutGrid className="w-5 h-5 text-foreground" />
            </button>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            创建相册
          </Button>
        </div>
      </div>

      {mockAlbums.length === 0 ? (
        <EmptyState
          icon={<Image className="w-10 h-10" />}
          title="暂无相册"
          description="创建第一个相册来保存你们的甜蜜回忆吧！"
          action={{
            label: '创建相册',
            onClick: () => {},
          }}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockAlbums.map((album) => (
            <Card
              key={album.id}
              hover
              className="cursor-pointer overflow-hidden !p-0"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={album.coverImage}
                  alt={album.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-heading font-semibold text-lg text-foreground mb-1">{album.name}</h3>
                <p className="text-sm text-muted-foreground">{album.photoCount} 张照片</p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {mockAlbums.map((album) => (
            <Card
              key={album.id}
              hover
              className="cursor-pointer"
            >
              <div className="flex gap-4">
                <div className="w-32 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={album.coverImage}
                    alt={album.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-1">{album.name}</h3>
                  <p className="text-sm text-muted-foreground">{album.photoCount} 张照片</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}