import { useState, useEffect } from 'react';

const CORRECT_PASSWORD = '260221';
const PASSWORD_KEY = 'site-password-verified';

interface PasswordGateProps {
  children: React.ReactNode;
}

export function PasswordGate({ children }: PasswordGateProps) {
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem(PASSWORD_KEY);
    if (verified === 'true') {
      setIsVerified(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      localStorage.setItem(PASSWORD_KEY, 'true');
      setIsVerified(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (isVerified) {
    return <>{children}</>;
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'linear-gradient(135deg, #1c1814 0%, #2d2520 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'乐米小奶泡体', cursive",
    }}>
      <div style={{
        background: 'rgba(28, 24, 20, 0.95)',
        border: '1px solid rgba(212, 168, 75, 0.3)',
        borderRadius: '16px',
        padding: '3rem',
        textAlign: 'center',
        maxWidth: '360px',
        width: '90%',
      }}>
        <div style={{
          fontSize: '2.5rem',
          marginBottom: '0.5rem',
        }}>🔐</div>
        <h1 style={{
          fontSize: '1.5rem',
          color: '#d4a84b',
          marginBottom: '0.5rem',
        }}>密码保护</h1>
        <p style={{
          fontSize: '0.85rem',
          color: '#8a7b6e',
          marginBottom: '2rem',
        }}>请输入密码以继续</p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="输入密码"
            autoFocus
            style={{
              width: '100%',
              padding: '0.875rem 1rem',
              background: 'rgba(0, 0, 0, 0.4)',
              border: `1px solid ${error ? '#e74c3c' : 'rgba(212, 168, 75, 0.3)'}`,
              borderRadius: '8px',
              color: '#ede8df',
              fontSize: '1rem',
              fontFamily: "'乐米小奶泡体', cursive",
              outline: 'none',
              marginBottom: '1rem',
              boxSizing: 'border-box',
            }}
          />
          {error && (
            <p style={{
              color: '#e74c3c',
              fontSize: '0.8rem',
              marginBottom: '1rem',
            }}>密码错误，请重试</p>
          )}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.875rem',
              background: '#d4a84b',
              border: 'none',
              borderRadius: '8px',
              color: '#000',
              fontSize: '1rem',
              fontFamily: "'乐米小奶泡体', cursive",
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
          >
            进入网站
          </button>
        </form>
      </div>
    </div>
  );
}
