'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { packagesAPI } from '@/lib/api/packages';
import { Package, PackageFilter } from '@/types/package.types';
import PackageGrid from '@/components/packages/PackageGrid';
import PackageFilterComponent from '@/components/packages/PackageFilter';
import '@/styles/packages.css';
import '@/styles/user-dashboard.css';

export default function PackagesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PackageFilter>({
    page: 1,
    limit: 12
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    fetchPackages();
  }, [filters]);

  const fetchPackages = async () => {
    setLoading(true);
    const result = await packagesAPI.getAllPackages(filters);
    if (result.success) {
      setPackages(result.data);
      setPagination(result.pagination);
    }
    setLoading(false);
  };

  const handleFilterChange = (newFilters: PackageFilter) => {
    setFilters({
      ...newFilters,
      page: 1,
      limit: 12
    });
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 12
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <button className="user-menu-link active">
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
        <div className="packages-container" style={{ padding: 0, background: 'transparent' }}>
          {/* Header */}
          <div className="packages-header">
            <h1>Explore Holiday Packages 🌴</h1>
            <p>Discover amazing destinations and book your dream vacation</p>
          </div>

          {/* Filters */}
          <PackageFilterComponent 
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />

          {/* Results Info */}
          {!loading && (
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.98)',
              padding: '16px 24px',
              borderRadius: '16px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
            }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                Found {pagination.total} packages
              </span>
              <span style={{ fontSize: '14px', color: '#64748b' }}>
                Page {pagination.page} of {pagination.pages}
              </span>
            </div>
          )}

          {/* Package Grid */}
          <PackageGrid packages={packages} loading={loading} />

          {/* Pagination */}
          {!loading && pagination.pages > 1 && (
            <div className="packages-pagination">
              <button
                className="pagination-button"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                ← Previous
              </button>

              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current
                if (
                  page === 1 ||
                  page === pagination.pages ||
                  (page >= pagination.page - 1 && page <= pagination.page + 1)
                ) {
                  return (
                    <button
                      key={page}
                      className={`pagination-button ${page === pagination.page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === pagination.page - 2 ||
                  page === pagination.page + 2
                ) {
                  return <span key={page} style={{ padding: '10px' }}>...</span>;
                }
                return null;
              })}

              <button
                className="pagination-button"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}