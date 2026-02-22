'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { passwordResetAPI } from '@/lib/api/password-reset';
import '@/styles/auth.css';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError('Invalid or missing reset token');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }

    if (!newPassword) {
      setError('Please enter a new password');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    const result = await passwordResetAPI.resetPassword(token, newPassword);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } else {
      setError(result.error || 'Failed to reset password');
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: 'center', maxWidth: '500px' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>✅</div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '12px', color: '#0f172a' }}>
            Password Reset Successfully!
          </h1>
          <p style={{ color: '#64748b', marginBottom: '24px', lineHeight: '1.6' }}>
            Your password has been changed successfully. You can now log in with your new password.
          </p>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
            Redirecting to login page...
          </p>
          <Link href="/auth/login" style={{ 
            display: 'inline-block',
            padding: '12px 32px',
            background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '12px',
            fontWeight: '700'
          }}>
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">🔑</div>
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">
            Enter your new password below.
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
            <label className="form-label">New Password</label>
            <div className="input-with-icon">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px'
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
              Must be at least 6 characters long
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="input-with-icon">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading || !token}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Resetting Password...
              </>
            ) : (
              'Reset Password'
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '40px auto' }}></div>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}