import { useState, useEffect } from 'react';
import { getVisitorLogs, VisitorLog } from '../lib/supabase';

export function VisitorLogsPage() {
  const [logs, setLogs] = useState<VisitorLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const data = await getVisitorLogs();
      setLogs(data);
      setLoading(false);
    };
    fetchLogs();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '900px',
      margin: '0 auto',
      fontFamily: "'乐米小奶泡体', cursive",
    }}>
      <h1 style={{
        fontSize: '1.8rem',
        color: '#d4a84b',
        marginBottom: '1.5rem',
        textAlign: 'center',
      }}>📊 访客记录</h1>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#8a7b6e' }}>加载中...</p>
      ) : logs.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#8a7b6e' }}>暂无访客记录</p>
      ) : (
        <div style={{
          background: 'rgba(28, 24, 20, 0.95)',
          border: '1px solid rgba(212, 168, 75, 0.3)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.9rem',
          }}>
            <thead>
              <tr style={{
                background: 'rgba(212, 168, 75, 0.15)',
                color: '#d4a84b',
              }}>
                <th style={{ padding: '1rem', textAlign: 'left' }}>时间</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>IP地址</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>页面</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr
                  key={log.id}
                  style={{
                    borderTop: index > 0 ? '1px solid rgba(212, 168, 75, 0.1)' : 'none',
                    color: '#ede8df',
                  }}
                >
                  <td style={{ padding: '0.875rem 1rem' }}>{formatDate(log.visited_at)}</td>
                  <td style={{ padding: '0.875rem 1rem', fontFamily: 'monospace' }}>
                    {log.ip_address || '未知'}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {log.page_url || '未知'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}