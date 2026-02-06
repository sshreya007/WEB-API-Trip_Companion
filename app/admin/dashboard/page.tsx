'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { adminAPI } from '@/lib/api/admin';
import '@/styles/admin.css';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    newUsers: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
    if (!loading && user && user.role !== 'admin') {
      router.push('/auth/dashboard');
    }
    if (user && user.role === 'admin') {
      fetchStats();
    }
  }, [user, loading, router]);

  const fetchStats = async () => {
    const result = await adminAPI.getAllUsers();
    if (result.success && result.data) {
      const users = result.data;
      setStats({
        totalUsers: users.filter(u => u.role === 'user').length,
        totalAdmins: users.filter(u => u.role === 'admin').length,
        newUsers: users.filter(u => {
          const createdDate = new Date(u.createdAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return createdDate > weekAgo;
        }).length,
      });
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  if (loading) return <div>Loading...</div>;
  if (!user || user.role !== 'admin') return null;

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span className="admin-logo-icon">✈️</span>
          <span>TripCompanion</span>
        </div>

        <ul className="admin-menu">
          <li className="admin-menu-item">
            <button className="admin-menu-link active">
              <span className="admin-menu-icon">📊</span>
              <span>Dashboard</span>
            </button>
          </li>
          <li className="admin-menu-item">
            <button 
              className="admin-menu-link"
              onClick={() => router.push('/admin/users')}
            >
              <span className="admin-menu-icon">👥</span>
              <span>User Management</span>
            </button>
          </li>
          <li className="admin-menu-item">
            <button className="admin-menu-link">
              <span className="admin-menu-icon">🗺️</span>
              <span>Trips</span>
            </button>
          </li>
          <li className="admin-menu-item">
            <button className="admin-menu-link">
              <span className="admin-menu-icon">📸</span>
              <span>Media</span>
            </button>
          </li>
          <li className="admin-menu-item">
            <button className="admin-menu-link">
              <span className="admin-menu-icon">⚙️</span>
              <span>Settings</span>
            </button>
          </li>
        </ul>

        <button className="logout-button" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <h1 className="admin-header-title">Admin Dashboard</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </header>

        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-avatar">
            👑
          </div>
          <div className="welcome-info">
            <h2>Welcome back, {user.firstName}!</h2>
            <p>Here's what's happening with your travel community today</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-icon blue">👥</div>
            <div className="stat-label">Total Users</div>
            <h3 className="stat-value">{stats.totalUsers}</h3>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">👑</div>
            <div className="stat-label">Administrators</div>
            <h3 className="stat-value">{stats.totalAdmins}</h3>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">🆕</div>
            <div className="stat-label">New This Week</div>
            <h3 className="stat-value">{stats.newUsers}</h3>
          </div>

          <div className="stat-card">
            <div className="stat-icon red">✈️</div>
            <div className="stat-label">Active Trips</div>
            <h3 className="stat-value">0</h3>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="admin-content-card">
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            marginBottom: '20px',
            color: '#111827'
          }}>
            Quick Actions
          </h3>

          <div className="quick-actions">
            <button 
              className="action-button primary"
              onClick={() => router.push('/admin/users/create')}
            >
              <span>➕</span>
              <span>Add New User</span>
            </button>

            <button 
              className="action-button secondary"
              onClick={() => router.push('/admin/users')}
            >
              <span>📋</span>
              <span>View All Users</span>
            </button>

            <button className="action-button secondary">
              <span>📊</span>
              <span>View Reports</span>
            </button>

            <button className="action-button secondary">
              <span>⚙️</span>
              <span>System Settings</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="admin-content-card">
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            marginBottom: '20px',
            color: '#111827'
          }}>
            Recent Activity
          </h3>
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px' }}>
            No recent activity to display
          </p>
        </div>
      </main>
    </div>
  );
}