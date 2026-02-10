'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { packagesAPI } from '@/lib/api/packages';
import { Package } from '@/types/package.types';
import PackageDetail from '@/components/packages/PackageDetail';
import BookingForm from '@/components/packages/BookingForm';
import '@/styles/packages.css';
import '@/styles/bookings.css';
import '@/styles/user-dashboard.css';

export default function PackageDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (params.id) {
      fetchPackage();
    }
  }, [params.id]);

  const fetchPackage = async () => {
    setLoading(true);
    const result = await packagesAPI.getPackageById(params.id as string);
    if (result.success && result.data) {
      setPkg(result.data);
    } else {
      setError(result.error || 'Failed to load package');
    }
    setLoading(false);
  };

  if (authLoading || loading) {
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
        Loading package details...
      </div>
    );
  }

  if (!user) return null;

  if (error || !pkg) {
    return (
      <div className="user-dashboard-layout">
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
                className="user-menu-link active"
                onClick={() => router.push('/packages')}
              >
                <span className="user-menu-icon">🗺️</span>
                <span>Browse Packages</span>
              </button>
            </li>
            <li className="user-menu-item">
              <button 
                className="user-menu-link"
                onClick={() => router.push('/bookings')}
              >
                <span className="user-menu-icon">📋</span>
                <span>My Bookings</span>
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

        <main className="user-main">
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.98)',
            padding: '80px 40px',
            borderRadius: '24px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>😞</div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
              Package Not Found
            </h2>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>
              {error || 'The package you are looking for does not exist'}
            </p>
            <button
              onClick={() => router.push('/packages')}
              style={{
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Browse Packages
            </button>
          </div>
        </main>
      </div>
    );
  }

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
              className="user-menu-link active"
              onClick={() => router.push('/packages')}
            >
              <span className="user-menu-icon">🗺️</span>
              <span>Browse Packages</span>
            </button>
          </li>

          <li className="user-menu-item">
            <button 
              className="user-menu-link"
              onClick={() => router.push('/bookings')}
            >
              <span className="user-menu-icon">📋</span>
              <span>My Bookings</span>
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
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 400px', 
          gap: '30px',
          alignItems: 'start'
        }}>
          {/* Package Details */}
          <div>
            <PackageDetail package={pkg} />
          </div>

          {/* Booking Form */}
          <div>
            <BookingForm package={pkg} />
          </div>
        </div>
      </main>
    </div>
  );
}