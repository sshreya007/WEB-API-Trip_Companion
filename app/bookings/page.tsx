'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { bookingsAPI } from '@/lib/api/bookings';
import { Booking } from '@/types/booking.types';
import BookingList from '@/components/bookings/BookingList';
import '@/styles/bookings.css';
import '@/styles/user-dashboard.css';

export default function BookingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user, activeTab]);

  const fetchBookings = async () => {
    setLoading(true);
    const filters = activeTab !== 'all' ? { status: activeTab } : {};
    const result = await bookingsAPI.getUserBookings(filters);
    if (result.success) {
      setBookings(result.data);
    }
    setLoading(false);
  };

  if (authLoading) {
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
        Loading...
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

        <div className="user-profile-card">
          <div className="user-profile-avatar">
            {user.firstName.charAt(0).toUpperCase()}
          </div>
          <h3 className="user-profile-name">
            {user.firstName} {user.lastName}
          </h3>
          <p className="user-profile-email">{user.email}</p>
        </div>

        <ul className="user-menu">
          <li className="user-menu-item">
            <button 
              className="user-menu-link"
              onClick={() => router.push('/auth/dashboard')}
            >
              <span className="user-menu-icon">🏠</span>
              <span>Dashboard</span>
            </button>
          </li>

          <li className="user-menu-item">
            <button 
              className="user-menu-link"
              onClick={() => router.push('/packages')}
            >
              <span className="user-menu-icon">🗺️</span>
              <span>Browse Packages</span>
            </button>
          </li>

          <li className="user-menu-item">
            <button className="user-menu-link active">
              <span className="user-menu-icon">📋</span>
              <span>My Bookings</span>
            </button>
          </li>

          <li className="user-menu-item">
            <button 
              className="user-menu-link"
              onClick={() => router.push('/auth/dashboard')}
            >
              <span className="user-menu-icon">👤</span>
              <span>Profile</span>
            </button>
          </li>
        </ul>

        <button 
          className="user-logout-button" 
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/auth/login');
          }}
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="user-main">
        <div style={{ padding: 0, background: 'transparent' }}>
          {/* Header */}
          <div className="bookings-header">
            <h1>My Bookings 📋</h1>
            <p>Manage and view all your holiday bookings</p>
          </div>

          {/* Tabs */}
          <div className="booking-tabs">
            <button
              className={`booking-tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Bookings
            </button>
            <button
              className={`booking-tab ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending
            </button>
            <button
              className={`booking-tab ${activeTab === 'confirmed' ? 'active' : ''}`}
              onClick={() => setActiveTab('confirmed')}
            >
              Confirmed
            </button>
            <button
              className={`booking-tab ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              Completed
            </button>
            <button
              className={`booking-tab ${activeTab === 'cancelled' ? 'active' : ''}`}
              onClick={() => setActiveTab('cancelled')}
            >
              Cancelled
            </button>
          </div>

          {/* Bookings List */}
          <BookingList bookings={bookings} loading={loading} />
        </div>
      </main>
    </div>
  );
}