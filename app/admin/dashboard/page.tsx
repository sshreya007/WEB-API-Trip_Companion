'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { adminAPI } from '@/lib/api/admin';
import { packagesAPI } from '@/lib/api/packages';
import { adminBookingsAPI } from '@/lib/api/admin-bookings';
import '@/styles/admin.css';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    newUsers: 0,
    totalPackages: 0,
    activePackages: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    revenue: 0
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
    try {
      // Fetch users
      const usersResult = await adminAPI.getAllUsers();
      if (usersResult.success && usersResult.data) {
        const users = usersResult.data;
        const totalUsers = users.filter(u => u.role === 'user').length;
        const totalAdmins = users.filter(u => u.role === 'admin').length;
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const newUsers = users.filter(u => {
          const createdDate = new Date(u.createdAt);
          return createdDate > weekAgo;
        }).length;

        setStats(prev => ({ ...prev, totalUsers, totalAdmins, newUsers }));
      }

      // Fetch packages
      const packagesResult = await packagesAPI.getAllPackages({ limit: 1000 });
      if (packagesResult.success) {
        const packages = packagesResult.data;
        const totalPackages = packages.length;
        const activePackages = packages.filter(p => p.isActive).length;
        setStats(prev => ({ ...prev, totalPackages, activePackages }));
      }

      // Fetch bookings
      const bookingsResult = await adminBookingsAPI.getAllBookings({ limit: 1000 });
      if (bookingsResult.success) {
        const bookings = bookingsResult.data;
        const totalBookings = bookings.length;
        const pendingBookings = bookings.filter(b => b.status === 'pending').length;
        const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
        const revenue = bookings
          .filter(b => b.paymentStatus === 'paid')
          .reduce((sum, b) => sum + b.totalPrice, 0);
        
        setStats(prev => ({ ...prev, totalBookings, pendingBookings, confirmedBookings, revenue }));
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
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
            <button 
              className="admin-menu-link"
              onClick={() => router.push('/admin/packages')}
            >
              <span className="admin-menu-icon">📦</span>
              <span>Package Management</span>
            </button>
          </li>
          <li className="admin-menu-item">
            <button 
              className="admin-menu-link"
              onClick={() => router.push('/admin/bookings')}
            >
              <span className="admin-menu-icon">📋</span>
              <span>Booking Management</span>
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
          <div className="welcome-avatar">👑</div>
          <div className="welcome-info">
            <h2>Welcome back, {user.firstName}!</h2>
            <p>Here's an overview of your travel management system</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="admin-stats">
          {/* Users Stats */}
          <div className="stat-card">
            <div className="stat-icon blue">👥</div>
            <div className="stat-label">Total Users</div>
            <h3 className="stat-value">{stats.totalUsers}</h3>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">🆕</div>
            <div className="stat-label">New This Week</div>
            <h3 className="stat-value">{stats.newUsers}</h3>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">📦</div>
            <div className="stat-label">Total Packages</div>
            <h3 className="stat-value">{stats.totalPackages}</h3>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">✅</div>
            <div className="stat-label">Active Packages</div>
            <h3 className="stat-value">{stats.activePackages}</h3>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">📋</div>
            <div className="stat-label">Total Bookings</div>
            <h3 className="stat-value">{stats.totalBookings}</h3>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">⏳</div>
            <div className="stat-label">Pending Bookings</div>
            <h3 className="stat-value">{stats.pendingBookings}</h3>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">✔️</div>
            <div className="stat-label">Confirmed Bookings</div>
            <h3 className="stat-value">{stats.confirmedBookings}</h3>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">💰</div>
            <div className="stat-label">Total Revenue</div>
            <h3 className="stat-value">${stats.revenue.toLocaleString()}</h3>
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
              onClick={() => router.push('/admin/packages/create')}
            >
              <span>➕</span>
              <span>Add New Package</span>
            </button>

            <button 
              className="action-button secondary"
              onClick={() => router.push('/admin/packages')}
            >
              <span>📦</span>
              <span>Manage Packages</span>
            </button>

            <button 
              className="action-button secondary"
              onClick={() => router.push('/admin/bookings')}
            >
              <span>📋</span>
              <span>View All Bookings</span>
            </button>

            <button 
              className="action-button secondary"
              onClick={() => router.push('/admin/users')}
            >
              <span>👥</span>
              <span>Manage Users</span>
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
            System Overview
          </h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '16px',
              background: 'rgba(13, 148, 136, 0.05)',
              borderRadius: '12px'
            }}>
              <div>
                <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 4px 0' }}>
                  User Accounts
                </p>
                <p style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                  {stats.totalUsers} Users, {stats.totalAdmins} Admins
                </p>
              </div>
              <button
                onClick={() => router.push('/admin/users')}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Manage →
              </button>
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '16px',
              background: 'rgba(13, 148, 136, 0.05)',
              borderRadius: '12px'
            }}>
              <div>
                <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 4px 0' }}>
                  Holiday Packages
                </p>
                <p style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                  {stats.activePackages} Active / {stats.totalPackages} Total
                </p>
              </div>
              <button
                onClick={() => router.push('/admin/packages')}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Manage →
              </button>
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '16px',
              background: 'rgba(13, 148, 136, 0.05)',
              borderRadius: '12px'
            }}>
              <div>
                <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 4px 0' }}>
                  Bookings Status
                </p>
                <p style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                  {stats.pendingBookings} Pending, {stats.confirmedBookings} Confirmed
                </p>
              </div>
              <button
                onClick={() => router.push('/admin/bookings')}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Manage →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}