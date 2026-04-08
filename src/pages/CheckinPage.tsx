import { useState, useEffect, useRef } from 'react';
import { Image, X } from 'lucide-react';
import { useCheckinData } from '../hooks/useCheckinData';

const checkinItems = [
  { id: 1, emoji: '☀️', title: '笨蛋秋秋', count: 0, category: 'daily' },
  { id: 2, emoji: '🌙', title: '笨蛋果汁', count: 0, category: 'daily' },
];

const randomComments = [
  '今日份甜度已满！💕',
  '又在偷偷想我了呀～',
  '这颗糖果我收下啦！',
  '我们的罐子又满一点啦',
  '好耶！今天也好爱你',
  '记录 success！✨',
  '这也太甜了吧！',
  '呜呜呜太幸福了',
];

const polaroidTitles: Record<number, string> = {
  1: '新的一天新的爱你',
  2: '做个好梦哦',
};

const categoryColors: Record<string, string> = {
  food: 'from-pink-300 to-rose-400',
  daily: 'from-amber-300 to-orange-400',
  activity: 'from-purple-300 to-pink-400',
  travel: 'from-blue-300 to-cyan-400',
};

export function CheckinPage() {
  const [selectedItem, setSelectedItem] = useState<typeof checkinItems[0] | null>(null);
  const [showPolaroid, setShowPolaroid] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [animatedCount, setAnimatedCount] = useState(0);
  const [clickScale, setClickScale] = useState(false);
  const { checkinData, records, loading, updateCheckinCount, addCheckinRecord } = useCheckinData();
  const [showEvidence, setShowEvidence] = useState(false);
  const [evidenceText, setEvidenceText] = useState('');
  const [showStamp, setShowStamp] = useState(false);
  const [lastCheckinItem, setLastCheckinItem] = useState<typeof checkinItems[0] | null>(null);
  const [pendingCheckin, setPendingCheckin] = useState<typeof checkinItems[0] | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<{ item: typeof checkinItems[0]; date: string; evidence?: string } | null>(null);

  const quickTags = ['#路痴发作', '#脑子短路', '#嘴硬王者', '#贪吃鬼', '#小迷糊'];
  const placeholders = ['老实交代，今天怎么犯迷糊了？', '比如：走路撞到了电线杆...', '比如：把盐当成糖放了...'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-[#9A8B7A]">加载中...</p>
        </div>
      </div>
    );
  }

  const handleCheckin = (item: typeof checkinItems[0]) => {
    setSelectedItem(item);
    setPendingCheckin(item);
    setClickScale(true);
    setTimeout(() => setClickScale(false), 200);

    setTimeout(() => {
      setShowPolaroid(true);
      setAnimatedCount(0);
      let count = 0;
      const interval = setInterval(() => {
        count += Math.ceil((item.count - count) / 5);
        if (count >= item.count) {
          count = item.count;
          clearInterval(interval);
        }
        setAnimatedCount(count);
      }, 50);
    }, 300);
  };

  const closePolaroid = () => {
    setShowPolaroid(false);
    if (pendingCheckin) {
      setLastCheckinItem(pendingCheckin);
      setEvidenceText('');
      setShowEvidence(true);
    }
    setSelectedItem(null);
  };

  const submitEvidence = async () => {
    if (evidenceText.trim() && pendingCheckin) {
      try {
        const currentItem = checkinData.find((i: typeof checkinItems[0]) => i.id === pendingCheckin.id);
        const target = (currentItem?.count || 0) + 1;

        // 更新计数
        await updateCheckinCount(pendingCheckin.id, target);

        setAnimatedCount(0);
        let count = 0;
        const interval = setInterval(() => {
          count += Math.ceil((target - count) / 5);
          if (count >= target) {
            count = target;
            clearInterval(interval);
          }
          setAnimatedCount(count);
        }, 50);

        // 添加记录
        await addCheckinRecord({
          item_id: pendingCheckin.id,
          item_name: pendingCheckin.title,
          item_emoji: pendingCheckin.emoji,
          date: new Date().toLocaleString('zh-CN'),
          evidence: evidenceText,
        });

        setShowStamp(true);
        setTimeout(() => {
          setShowStamp(false);
          setShowPolaroid(false);
          setShowEvidence(false);
          setEvidenceText('');
          setPendingCheckin(null);
          setLastCheckinItem(null);
          setSelectedItem(null);
          setShowHistory(true);
        }, 1500);
      } catch (error) {
        console.error('Failed to submit checkin:', error);
        alert('提交失败，请重试');
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes bounce-in {
          0% { transform: scale(0) rotate(-10deg); opacity: 0; }
          50% { transform: scale(1.1) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes count-up {
          0% { transform: translateY(100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 15px rgba(255,182,193,0.3); }
          50% { box-shadow: 0 0 25px rgba(255,182,193,0.5); }
        }
        @keyframes slide-up {
          0% { transform: translateY(100%) rotate(-5deg); opacity: 0; }
          100% { transform: translateY(0) rotate(-3deg); opacity: 1; }
        }
        @keyframes stamp {
          0% { transform: scale(2) rotate(-15deg); opacity: 0; }
          50% { transform: scale(1.1) rotate(-5deg); opacity: 1; }
          100% { transform: scale(1) rotate(-3deg); opacity: 0; }
        }
      `}</style>

      <div className="relative z-10 p-6 max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#8B4513', fontFamily: 'LeMiXiaoNaiPaoTi' }}>
            🌸 笨蛋大王 🌸
          </h1>
          <p className="text-sm opacity-70" style={{ color: '#8B4513' }}>究竟谁才是笨蛋大王</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {checkinData.map((item) => (
            <button
              key={item.id}
              onClick={() => handleCheckin(item)}
              className={`
                relative p-4 rounded-3xl bg-white/90 shadow-lg
                transform transition-all duration-200
                hover:scale-105 active:scale-95
                border-2 border-pink-200
                ${clickScale ? 'scale-90' : ''}
              `}
              style={{ animation: 'pulse-glow 2s infinite', borderColor: '#FFD1DC' }}
            >
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${categoryColors[item.category]} opacity-10`} />
              <div className="text-4xl mb-2 relative z-10 mt-8">
                {item.id === 1 ? (
                  <img src="https://juiceqiuqiu-1420133198.cos.ap-shanghai.myqcloud.com/12.png" alt="" className="w-16 h-16 object-contain mx-auto" />
                ) : item.id === 2 ? (
                  <img src="https://juiceqiuqiu-1420133198.cos.ap-shanghai.myqcloud.com/13.png" alt="" className="w-16 h-16 object-contain mx-auto" />
                ) : ''}
              </div>
              <div className="text-lg font-bold mb-1" style={{ color: '#8B4513' }}>{item.title}</div>
              <div className="text-xs px-2 py-0.5 rounded-full inline-block" style={{ backgroundColor: '#FFF0F5', color: '#DB7093' }}>
                {item.count} 次
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowHistory(true)}
          className="w-full py-3 rounded-full bg-white/80 text-[#8B4513] font-bold shadow-md hover:bg-white transition-colors flex items-center justify-center gap-2"
        >
          <Image className="w-5 h-5" />
          查看笨蛋碎片 ({records.length})
        </button>
      </div>

      {showPolaroid && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={closePolaroid}>
          <div
            className="bg-white p-6 rounded-xl shadow-2xl max-w-xs w-full"
            style={{ animation: 'bounce-in 0.5s ease-out', transform: 'rotate(-2deg)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closePolaroid}
              className="absolute -top-3 -right-3 w-8 h-8 bg-pink-400 text-white rounded-full flex items-center justify-center shadow-md"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              {selectedItem.id === 1 ? (
                <img src="https://juiceqiuqiu-1420133198.cos.ap-shanghai.myqcloud.com/12.png" alt="" className="text-6xl mb-4 w-20 h-20 object-contain mx-auto" />
              ) : selectedItem.id === 2 ? (
                <img src="https://juiceqiuqiu-1420133198.cos.ap-shanghai.myqcloud.com/13.png" alt="" className="text-6xl mb-4 w-20 h-20 object-contain mx-auto" />
              ) : (
                <div className="text-6xl mb-4">{selectedItem.emoji}</div>
              )}
              <div className="text-lg font-bold mb-2" style={{ color: '#8B4513' }}>{selectedItem.title}</div>
              <div className="text-5xl font-bold mb-4" style={{ color: '#DB7093', fontFamily: 'monospace' }}>
                {animatedCount}
              </div>
              {(() => {
                const relatedRecords = records.filter(r => r.item_id === selectedItem.id && r.evidence);
                if (relatedRecords.length > 0) {
                  const randomRecord = relatedRecords[Math.floor(Math.random() * relatedRecords.length)];
                  return <div className="text-sm px-4 py-2 rounded-full inline-block mb-4 bg-pink-100 text-gray-600" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{randomRecord.evidence}</div>;
                }
                return <div className="text-sm px-4 py-2 rounded-full inline-block mb-4" style={{ backgroundColor: '#FFF0F5', color: '#DB7093' }}>{randomComments[Math.floor(Math.random() * randomComments.length)]}</div>;
              })()}
              <div className="text-xs text-gray-400">
                {polaroidTitles[selectedItem.id] || '又完成一次打卡！'}
              </div>
            </div>
          </div>
        </div>
      )}

      {showHistory && (
        <div className="fixed inset-0 z-50 overflow-y-auto" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowHistory(false)}>
          <div className="min-h-screen p-6 flex items-start justify-center">
            <div
              className="bg-gradient-to-b from-pink-100 to-amber-50 p-6 rounded-3xl shadow-2xl max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: '#8B4513' }}>📒 笨蛋碎片墙</h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="w-10 h-10 bg-pink-400 text-white rounded-full flex items-center justify-center shadow-md hover:bg-pink-500 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {records.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-6xl mb-4">📭</div>
                  <p>还没有笨蛋碎片哦</p>
                  <p className="text-sm">快去打卡收集吧！</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {records.map((record, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedRecord(record)}
                      className="bg-white p-3 rounded-lg shadow-md transform hover:scale-105 transition-transform cursor-pointer"
                      style={{ transform: `rotate(${Math.random() * 6 - 3}deg)` }}
                    >
                      <div className="text-2xl mb-1">
                        {record.item_id === 1 ? (
                          <img src="https://juiceqiuqiu-1420133198.cos.ap-shanghai.myqcloud.com/12.png" alt="" className="w-10 h-10 object-contain inline-block" />
                        ) : record.item_id === 2 ? (
                          <img src="https://juiceqiuqiu-1420133198.cos.ap-shanghai.myqcloud.com/13.png" alt="" className="w-10 h-10 object-contain inline-block" />
                        ) : (
                          record.item_emoji
                        )}
                      </div>
                      <div className="text-xs font-bold" style={{ color: '#8B4513' }}>{record.item_name}</div>
                      {record.evidence && (
                        <div className="mt-1 px-2 py-0.5 bg-pink-100 rounded-full text-xs text-gray-600 truncate">{record.evidence}</div>
                      )}
                      <div className="text-xs text-gray-400 mt-1">{record.date}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showEvidence && lastCheckinItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowEvidence(false)}>
          <div
            className="relative w-80 bg-gradient-to-b from-amber-50 to-yellow-50 p-6 rounded-lg shadow-2xl"
            style={{ animation: 'slide-up 0.4s ease-out', transform: 'rotate(-3deg)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-4 -left-4 text-4xl">📎</div>

            <div className="text-center mb-4">
              <h3 className="text-xl font-bold" style={{ color: '#8B4513' }}>🔍 笨蛋行为取证单</h3>
            </div>

            <div className="mb-4">
              <div className="text-sm mb-2" style={{ color: '#8B4513' }}>
                {lastCheckinItem.id === 1 ? '笨蛋秋秋' : '笨蛋果汁'} 又犯傻了：
              </div>
              <textarea
                value={evidenceText}
                onChange={(e) => setEvidenceText(e.target.value.slice(0, 30))}
                placeholder={placeholders[Math.floor(Math.random() * placeholders.length)]}
                className="w-full h-24 bg-transparent border-b-2 border-dashed border-pink-300 outline-none resize-none text-base"
                style={{ color: '#8B4513' }}
              />
              <div className="text-xs text-right text-gray-400 mt-1">{evidenceText.length}/30</div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setEvidenceText(tag)}
                  className="px-3 py-1 rounded-full text-xs bg-pink-100 text-gray-600 hover:bg-pink-200 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                onClick={submitEvidence}
                disabled={!evidenceText.trim()}
                className={`w-24 h-24 rounded-full flex items-center justify-center text-center text-xs font-bold shadow-lg transition-all ${evidenceText.trim() ? 'bg-gradient-to-br from-red-400 to-red-500 text-white hover:scale-105' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                style={{ lineHeight: '1.2' }}
              >
                按手印
                <br />确认
              </button>
            </div>

            {showStamp && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-6xl font-bold px-4 py-2 border-4 border-red-500 rounded-lg rotate-12" style={{ animation: 'stamp 1.5s ease-out forwards', color: '#DC2626', borderColor: '#DC2626' }}>
                  已归档
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setSelectedRecord(null)}>
          <div
            className="relative w-80 bg-gradient-to-b from-amber-50 to-yellow-50 p-6 rounded-lg shadow-2xl"
            style={{ animation: 'slide-up 0.4s ease-out', transform: 'rotate(-3deg)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-4 -left-4 text-4xl">📎</div>
            <button
              onClick={() => setSelectedRecord(null)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-pink-400 text-white rounded-full flex items-center justify-center shadow-md"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <h3 className="text-xl font-bold" style={{ color: '#8B4513' }}>📋 笨蛋行为详情</h3>
            </div>

            <div className="text-center mb-4">
              <div className="text-5xl mb-2">
                {selectedRecord.item.id === 1 ? (
                  <img src="https://juiceqiuqiu-1420133198.cos.ap-shanghai.myqcloud.com/12.png" alt="" className="w-20 h-20 object-contain mx-auto" />
                ) : selectedRecord.item.id === 2 ? (
                  <img src="https://juiceqiuqiu-1420133198.cos.ap-shanghai.myqcloud.com/13.png" alt="" className="w-20 h-20 object-contain mx-auto" />
                ) : (
                  selectedRecord.item.emoji
                )}
              </div>
              <div className="text-lg font-bold" style={{ color: '#8B4513' }}>{selectedRecord.item.title}</div>
              <div className="text-sm text-gray-400 mt-1">{selectedRecord.date}</div>
            </div>

            {selectedRecord.evidence && (
              <div className="bg-white/80 p-4 rounded-lg border-2 border-dashed border-pink-200 mb-4">
                <div className="text-xs text-gray-400 mb-1">罪证：</div>
                <div className="text-base" style={{ color: '#8B4513' }}>{selectedRecord.evidence}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}