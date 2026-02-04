'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

export default function UserDashboardPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !user) {
      router.push('/auth/login');
    }
    
    // Redirect admin to admin dashboard
    if (!loading && user && user.role === 'admin') {
      router.push('/admin/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>User Dashboard</h1>
      <div style={{ 
        backgroundColor: '#f0fdf4', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '20px',
        border: '2px solid #22c55e'
      }}>
        <h2>Welcome, {user.firstName} {user.lastName}! 👤</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Role:</strong> <span style={{ color: '#22c55e', fontWeight: 'bold' }}>USER</span></p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>User Features:</h3>
        <ul>
          <li>View Profile</li>
          <li>Manage Trips</li>
          <li>Settings</li>
        </ul>
      </div>

      <button 
        onClick={handleLogout}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#2563eb',
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