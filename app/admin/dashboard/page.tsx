'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
    if (!loading && user && user.role !== 'admin') {
      router.push('/auth/dashboard');
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user || user.role !== 'admin') return null;

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      <div style={{ 
        backgroundColor: '#f0f9ff', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '20px',
        border: '2px solid #3b82f6'
      }}>
        <h2>Welcome, {user.firstName} {user.lastName}! 👑</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Role:</strong> <span style={{ color: '#dc2626', fontWeight: 'bold' }}>ADMIN</span></p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Admin Features:</h3>
        <ul>
          <li>
            <button
              onClick={() => router.push('/admin/users')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              👥 Manage Users
            </button>
          </li>
        </ul>
      </div>

      <button 
        onClick={handleLogout}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>
    </div>
  );
}