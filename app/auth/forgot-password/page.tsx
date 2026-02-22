'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { passwordResetAPI } from '@/lib/api/password-reset';
import '@/styles/auth.css';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    const result = await passwordResetAPI.forgotPassword(email);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'Failed to send reset email');
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: 'center', maxWidth: '500px' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>📧</div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '12px', color: '#0f172a' }}>
            Check Your Email
          </h1>
          <p style={{ color: '#64748b', marginBottom: '24px', lineHeight: '1.6' }}>
            If an account exists with <strong>{email}</strong>, you will receive a password reset link shortly.
          </p>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
            The link will expire in 1 hour for security reasons.
          </p>
          <div style={{ 
            background: 'rgba(13, 148, 136, 0.1)', 
            padding: '16px', 
            borderRadius: '12px',
            marginBottom: '24px'
          }}>
            <p style={{ fontSize: '14px', color: '#0d9488', margin: 0 }}>
              💡 <strong>Tip:</strong> Check your spam folder if you don't see the email in your inbox.
            </p>
          </div>
          <Link href="/auth/login" style={{ 
            display: 'inline-block',
            padding: '12px 32px',
            background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '12px',
            fontWeight: '700'
          }}>
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">🔒</div>
          <h1 className="auth-title">Forgot Password?</h1>
          <p className="auth-subtitle">
            No worries! Enter your email and we'll send you a reset link.
          </p>
        </div>

        {error && (
          <div className="auth-error">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <span className="input-icon">📧</span>
              <input
                type="email"
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Sending Reset Link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Remember your password?{' '}
            <Link href="/auth/login" className="auth-link">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}