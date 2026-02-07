'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import '@/styles/user-dashboard.css';

export default function UserDashboardPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
    if (!loading && user && user.role === 'admin') {
      router.push('/admin/dashboard');
    }
  }, [user, loading, router]);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)',
        color: 'white',
        fontSize: '20px',
        fontWeight: '600'
      }}>
        Loading your adventure...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="user-dashboard-layout">
      {/* Sidebar */}
      <aside className="user-sidebar">
        <div className="user-logo">
          <span className="user-logo-icon">✈️</span>
          <span>TripCompanion</span>
        </div>
        <p className="user-tagline">Your journey begins here</p>

        {/* User Profile Card */}
        <div className="user-profile-card">
          <div className="user-profile-avatar">
            {user.firstName.charAt(0).toUpperCase()}
          </div>
          <h3 className="user-profile-name">
            {user.firstName} {user.lastName}
          </h3>
          <p className="user-profile-email">{user.email}</p>
        </div>

        {/* Navigation Menu */}
        <ul className="user-menu">
          <li className="user-menu-item">
            <button 
              className={`user-menu-link ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <span className="user-menu-icon">🏠</span>
              <span>Dashboard</span>
            </button>
          </li>

          <li className="user-menu-item">
            <button 
              className={`user-menu-link ${activeTab === 'trips' ? 'active' : ''}`}
              onClick={() => setActiveTab('trips')}
            >
              <span className="user-menu-icon">🗺️</span>
              <span>My Trips</span>
              <span className="user-menu-badge">3</span>
            </button>
          </li>

          <li className="user-menu-item">
            <button 
              className={`user-menu-link ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              <span className="user-menu-icon">📊</span>
              <span>Activity</span>
            </button>
          </li>

          <li className="user-menu-item">
            <button 
              className={`user-menu-link ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <span className="user-menu-icon">👤</span>
              <span>Profile</span>
            </button>
          </li>

          <li className="user-menu-item">
            <button 
              className={`user-menu-link ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <span className="user-menu-icon">⚙️</span>
              <span>Settings</span>
            </button>
          </li>

          <li className="user-menu-item">
            <button 
              className={`user-menu-link ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              <span className="user-menu-icon">ℹ️</span>
              <span>About Us</span>
            </button>
          </li>
        </ul>

        {/* Logout Button */}
        <button className="user-logout-button" onClick={handleLogout}>
          <span></span>
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="user-main">
        {/* Header */}
        <header className="user-header">
          <div className="user-header-left">
            <h1>Welcome Back, {user.firstName}! 👋</h1>
            <p className="user-header-subtitle">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </p>
          </div>

          <div className="user-header-right">
            <div className="header-search">
              <span className="header-search-icon">🔍</span>
              <input type="text" placeholder="Search destinations..." />
            </div>

            <button className="header-notification">
              🔔
              <span className="notification-badge">5</span>
            </button>
          </div>
        </header>

        {/* Content based on active tab */}
        {activeTab === 'dashboard' && (
          <>
            {/* Welcome Hero */}
            <div className="welcome-hero">
              <div className="welcome-hero-content">
                <h2>Ready for your next adventure? 🌍</h2>
                <p>Explore new destinations and create unforgettable memories</p>

                <div className="hero-stats">
                  <div className="hero-stat">
                    <div className="hero-stat-value">12</div>
                    <div className="hero-stat-label">Countries Visited</div>
                  </div>
                  <div className="hero-stat">
                    <div className="hero-stat-value">47</div>
                    <div className="hero-stat-label">Memories Captured</div>
                  </div>
                  <div className="hero-stat">
                    <div className="hero-stat-value">8</div>
                    <div className="hero-stat-label">Friends Connected</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-action-grid">
              <div className="quick-action-card" onClick={() => setActiveTab('trips')}>
                <div className="quick-action-icon">🗺️</div>
                <h3 className="quick-action-title">Plan New Trip</h3>
              </div>

              <div className="quick-action-card">
                <div className="quick-action-icon">📸</div>
                <h3 className="quick-action-title">Upload Photos</h3>
              </div>

              <div className="quick-action-card">
                <div className="quick-action-icon">👥</div>
                <h3 className="quick-action-title">Find Companions</h3>
              </div>

              <div className="quick-action-card">
                <div className="quick-action-icon">🎯</div>
                <h3 className="quick-action-title">Bucket List</h3>
              </div>
            </div>

            {/* Recent Trips */}
            <div className="user-content-card">
              <h3 style={{ 
                fontSize: '22px', 
                fontWeight: '700', 
                marginBottom: '24px',
                color: '#0f172a'
              }}>
                Your Recent Adventures 🌟
              </h3>
              <p style={{ 
                color: '#64748b', 
                textAlign: 'center', 
                padding: '60px 20px',
                fontSize: '16px'
              }}>
                No trips yet. Start planning your first adventure! ✈️
              </p>
            </div>
          </>
        )}

        {activeTab === 'trips' && (
          <div className="user-content-card">
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px', color: '#0f172a' }}>
              🗺️ My Trips
            </h2>
            <p style={{ color: '#64748b', fontSize: '16px' }}>
              View and manage all your trips here. Coming soon!
            </p>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="user-content-card">
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px', color: '#0f172a' }}>
              📊 Activity Feed
            </h2>
            <p style={{ color: '#64748b', fontSize: '16px' }}>
              Track your travel activities and milestones. Coming soon!
            </p>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="user-content-card">
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px', color: '#0f172a' }}>
              👤 My Profile
            </h2>
            <div style={{ display: 'grid', gap: '16px', maxWidth: '500px' }}>
              <div>
                <strong style={{ color: '#0f172a' }}>Name:</strong>
                <p style={{ color: '#64748b', margin: '8px 0 0 0' }}>
                  {user.firstName} {user.lastName}
                </p>
              </div>
              <div>
                <strong style={{ color: '#0f172a' }}>Username:</strong>
                <p style={{ color: '#64748b', margin: '8px 0 0 0' }}>{user.username}</p>
              </div>
              <div>
                <strong style={{ color: '#0f172a' }}>Email:</strong>
                <p style={{ color: '#64748b', margin: '8px 0 0 0' }}>{user.email}</p>
              </div>
              {user.bio && (
                <div>
                  <strong style={{ color: '#0f172a' }}>Bio:</strong>
                  <p style={{ color: '#64748b', margin: '8px 0 0 0' }}>{user.bio}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="user-content-card">
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px', color: '#0f172a' }}>
              ⚙️ Settings
            </h2>
            <p style={{ color: '#64748b', fontSize: '16px' }}>
              Manage your account settings and preferences. Coming soon!
            </p>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="user-content-card">
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px', color: '#0f172a' }}>
              ℹ️ About TripCompanion
            </h2>
            <p style={{ color: '#64748b', fontSize: '16px', lineHeight: '1.8' }}>
              TripCompanion is your ultimate travel companion app. We help you plan amazing trips, 
              capture beautiful memories, and connect with fellow travelers around the world.
              <br /><br />
              <strong style={{ color: '#0f172a' }}>✨ Features:</strong>
              <br />
              • Plan and organize trips
              <br />
              • Upload and share travel photos
              <br />
              • Connect with travel companions
              <br />
              • Track your travel statistics
              <br />
              • Create bucket lists
            </p>
          </div>
        )}
      </main>
    </div>
  );
}