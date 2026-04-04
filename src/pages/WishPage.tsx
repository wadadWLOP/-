import { useState } from 'react';
import { Plus, Star, Heart, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, Button, EmptyState } from '../components/UI';
import { mockWishes } from '../data/mockData';

export function WishPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredWishes = mockWishes.filter(wish => {
    if (filter === 'all') return true;
    if (filter === 'pending') return wish.status === 'pending';
    if (filter === 'completed') return wish.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-foreground">⭐ 心愿墙</h1>
          <p className="text-muted-foreground mt-1">记录我们的小愿望，一起实现吧</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          添加心愿
        </Button>
      </div>

      <Card className="!p-4">
        <div className="flex gap-3">
          {[
            { label: '全部心愿', value: 'all' as const },
            { label: '待完成', value: 'pending' as const },
            { label: '已完成', value: 'completed' as const },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all
                ${filter === option.value
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Card>

      {filteredWishes.length === 0 ? (
        <EmptyState
          icon={<Star className="w-10 h-10" />}
          title="暂无心愿"
          description="许下你们的心愿吧，一起努力实现！"
          action={{
            label: '添加心愿',
            onClick: () => {},
          }}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWishes.map((wish) => (
            <Card
              key={wish.id}
              hover
              className={`cursor-pointer overflow-hidden !p-0 ${wish.status === 'completed' ? 'opacity-80' : ''}`}
            >
              {wish.coverImage && (
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={wish.coverImage}
                    alt={wish.title}
                    className={`w-full h-full object-cover ${wish.status === 'completed' ? 'grayscale' : ''} hover:scale-105 transition-transform duration-500`}
                  />
                  {wish.status === 'completed' && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <div className="bg-primary text-primary-foreground rounded-full p-3 shadow-lg">
                        <Heart className="w-8 h-8 fill-current" />
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={wish.status === 'completed' ? 'success' : 'default'}>
                    {wish.status === 'completed' ? '✅ 已完成' : '⏳ 待实现'}
                  </Badge>
                  {wish.expectedDate && (
                    <span className="text-xs text-muted-foreground">
                      期望: {wish.expectedDate}
                    </span>
                  )}
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{wish.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{wish.description}</p>
                {wish.status === 'completed' && wish.completedNote && (
                  <p className="mt-3 text-sm text-primary italic">"{wish.completedNote}"</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}