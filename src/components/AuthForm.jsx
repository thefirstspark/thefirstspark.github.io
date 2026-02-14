import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setMessage('Check your email to confirm signup!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <style>{`
        .auth-container {
          max-width: 400px;
          margin: 60px auto;
          padding: 40px;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-radius: 10px;
          border: 2px solid rgba(255, 200, 87, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .auth-form h2 {
          color: #ffc857;
          text-align: center;
          margin: 0 0 20px 0;
          font-size: 24px;
        }
        .auth-form input {
          padding: 12px;
          border: 1px solid rgba(255, 200, 87, 0.5);
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          font-size: 14px;
        }
        .auth-form input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
        .auth-form button {
          padding: 12px;
          background: #ffc857;
          color: #1a1a2e;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .auth-form button:hover {
          background: #ffb744;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 200, 87, 0.3);
        }
        .auth-form button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .toggle-text {
          text-align: center;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
        }
        .toggle-text button {
          background: none;
          border: none;
          color: #ffc857;
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
        }
        .error {
          color: #ff6b6b;
          text-align: center;
          font-size: 14px;
        }
        .message {
          color: #51cf66;
          text-align: center;
          font-size: 14px;
        }
      `}</style>

      <form onSubmit={handleAuth} className="auth-form">
        <h2>{isSignUp ? 'Begin Your Journey' : 'Welcome Back'}</h2>
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
        </button>

        {error && <div className="error">{error}</div>}
        {message && <div className="message">{message}</div>}

        <div className="toggle-text">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </form>
    </div>
  );
}
