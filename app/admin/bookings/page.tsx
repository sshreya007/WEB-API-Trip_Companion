'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { adminBookingsAPI } from '@/lib/api/admin-bookings';
import { Booking } from '@/types/booking.types';
import '@/styles/admin.css';
import '@/styles/bookings.css';

export default function AdminBookingsPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchBookings();
    }
  }, [user, filterStatus]);

  const fetchBookings = async () => {
    setLoading(true);
    const filters = filterStatus !== 'all' ? { status: filterStatus } : {};
    const result = await adminBookingsAPI.getAllBookings(filters);
    if (result.success) {
      setBookings(result.data);
    }
    setLoading(false);
  };

  const handleConfirm = async (id: string) => {
    if (!confirm('Confirm this booking?')) return;

    const result = await adminBookingsAPI.confirmBooking(id);
    if (result.success) {
      alert('Booking confirmed successfully!');
      fetchBookings();
    } else {
      alert(result.error || 'Failed to confirm booking');
    }
  };

  const handleComplete = async (id: string) => {
    if (!confirm('Mark this booking as completed?')) return;

    const result = await adminBookingsAPI.completeBooking(id);
    if (result.success) {
      alert('Booking marked as completed!');
      fetchBookings();
    } else {
      alert(result.error || 'Failed to complete booking');
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'cancelled': return '#ef4444';
      case 'completed': return '#3b82f6';
      default: return '#64748b';
    }
  };

  if (authLoading || loading) {
    return <div>Loading...</div>;
  }

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
            <button 
              className="admin-menu-link"
              onClick={() => router.push('/admin/dashboard')}
            >
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
            <button className="admin-menu-link active">
              <span className="admin-menu-icon">📋</span>
              <span>Booking Management</span>
            </button>
          </li>
        </ul>

        <button className="logout-button" onClick={() => { logout(); router.push('/auth/login'); }}>
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <h1 className="admin-header-title">Booking Management</h1>
        </header>

        {/* Filter Tabs */}
        <div className="booking-tabs">
          <button
            className={`booking-tab ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All Bookings
          </button>
          <button
            className={`booking-tab ${filterStatus === 'pending' ? 'active' : ''}`}
            onClick={() => setFilterStatus('pending')}
          >
            Pending
          </button>
          <button
            className={`booking-tab ${filterStatus === 'confirmed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('confirmed')}
          >
            Confirmed
          </button>
          <button
            className={`booking-tab ${filterStatus === 'completed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('completed')}
          >
            Completed
          </button>
          <button
            className={`booking-tab ${filterStatus === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilterStatus('cancelled')}
          >
            Cancelled
          </button>
        </div>

        {/* Results Count */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.98)',
          padding: '16px 24px',
          borderRadius: '16px',
          marginBottom: '20px',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          Showing {bookings.length} bookings
        </div>

        {/* Bookings Table */}
        <div className="admin-content-card">
          {bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
              <div style={{ fontSize: '60px', marginBottom: '16px' }}>📋</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
                No bookings found
              </h3>
              <p>No bookings match your selected filter</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '14px', textAlign: 'left', fontWeight: '700' }}>Reference</th>
                    <th style={{ padding: '14px', textAlign: 'left', fontWeight: '700' }}>Package</th>
                    <th style={{ padding: '14px', textAlign: 'left', fontWeight: '700' }}>Customer</th>
                    <th style={{ padding: '14px', textAlign: 'left', fontWeight: '700' }}>Travel Date</th>
                    <th style={{ padding: '14px', textAlign: 'left', fontWeight: '700' }}>Travelers</th>
                    <th style={{ padding: '14px', textAlign: 'left', fontWeight: '700' }}>Total</th>
                    <th style={{ padding: '14px', textAlign: 'center', fontWeight: '700' }}>Status</th>
                    <th style={{ padding: '14px', textAlign: 'center', fontWeight: '700' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => {
                    const packageData = typeof booking.packageId === 'object' ? booking.packageId : null;
                    const userData = typeof booking.userId === 'object' ? booking.userId : null;

                    return (
                      <tr key={booking._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '14px', fontWeight: '700', fontSize: '13px' }}>
                          {booking.bookingReference}
                        </td>
                        <td style={{ padding: '14px' }}>
                          <div style={{ fontWeight: '700', marginBottom: '4px' }}>
                            {packageData?.title || 'N/A'}
                          </div>
                          <div style={{ fontSize: '13px', color: '#64748b' }}>
                            {packageData?.destination}
                          </div>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                            {booking.travelers[0]?.firstName} {booking.travelers[0]?.lastName}
                          </div>
                          <div style={{ fontSize: '13px', color: '#64748b' }}>
                            {booking.travelers[0]?.email}
                          </div>
                        </td>
                        <td style={{ padding: '14px' }}>
                          {formatDate(booking.travelDate)}
                        </td>
                        <td style={{ padding: '14px' }}>
                          {booking.numberOfTravelers.adults}A / {booking.numberOfTravelers.children}C
                        </td>
                        <td style={{ padding: '14px', fontWeight: '700' }}>
                          ${booking.totalPrice}
                        </td>
                        <td style={{ padding: '14px', textAlign: 'center' }}>
                          <span style={{
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '700',
                            background: getStatusColor(booking.status),
                            color: 'white',
                            textTransform: 'capitalize'
                          }}>
                            {booking.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button
                              onClick={() => router.push(`/bookings/${booking._id}`)}
                              style={{
                                padding: '8px 16px',
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >
                              View
                            </button>

                            {booking.status === 'pending' && (
                              <button
                                onClick={() => handleConfirm(booking._id)}
                                style={{
                                  padding: '8px 16px',
                                  background: '#10b981',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '8px',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  cursor: 'pointer'
                                }}
                              >
                                Confirm
                              </button>
                            )}

                            {booking.status === 'confirmed' && (
                              <button
                                onClick={() => handleComplete(booking._id)}
                                style={{
                                  padding: '8px 16px',
                                  background: '#f59e0b',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '8px',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  cursor: 'pointer'
                                }}
                              >
                                Complete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}