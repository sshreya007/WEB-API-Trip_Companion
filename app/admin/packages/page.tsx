'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { packagesAPI } from '@/lib/api/packages';
import { adminPackagesAPI } from '@/lib/api/admin-packages';
import { Package } from '@/types/package.types';
import '@/styles/admin.css';
import '@/styles/packages.css';

export default function AdminPackagesPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchPackages();
    }
  }, [user]);

  const fetchPackages = async () => {
    setLoading(true);
    const result = await packagesAPI.getAllPackages({ limit: 1000 });
    if (result.success) {
      setPackages(result.data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    const result = await adminPackagesAPI.deletePackage(id);
    if (result.success) {
      alert('Package deleted successfully!');
      fetchPackages();
    } else {
      alert(result.error || 'Failed to delete package');
    }
  };

  const handleToggleStatus = async (id: string) => {
    const result = await adminPackagesAPI.togglePackageStatus(id);
    if (result.success) {
      alert('Package status updated!');
      fetchPackages();
    } else {
      alert(result.error || 'Failed to update status');
    }
  };

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || pkg.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && pkg.isActive) ||
                         (filterStatus === 'inactive' && !pkg.isActive);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

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
            <button className="admin-menu-link active">
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
        </ul>

        <button className="logout-button" onClick={() => { logout(); router.push('/auth/login'); }}>
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <h1 className="admin-header-title">Package Management</h1>
          <button
            onClick={() => router.push('/admin/packages/create')}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ➕ Create New Package
          </button>
        </header>

        {/* Filters */}
        <div className="admin-content-card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                Search
              </label>
              <input
                type="text"
                placeholder="Search by title or destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '14px'
                }}
              >
                <option value="">All Categories</option>
                <option value="beach">Beach</option>
                <option value="adventure">Adventure</option>
                <option value="cultural">Cultural</option>
                <option value="luxury">Luxury</option>
                <option value="budget">Budget</option>
                <option value="family">Family</option>
                <option value="honeymoon">Honeymoon</option>
                <option value="group">Group</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '14px'
                }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
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
          Showing {filteredPackages.length} of {packages.length} packages
        </div>

        {/* Packages Table */}
        <div className="admin-content-card">
          {filteredPackages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
              <div style={{ fontSize: '60px', marginBottom: '16px' }}>📦</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
                No packages found
              </h3>
              <p>Try adjusting your filters or create a new package</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '14px', textAlign: 'left', fontWeight: '700' }}>Package</th>
                    <th style={{ padding: '14px', textAlign: 'left', fontWeight: '700' }}>Category</th>
                    <th style={{ padding: '14px', textAlign: 'left', fontWeight: '700' }}>Price</th>
                    <th style={{ padding: '14px', textAlign: 'left', fontWeight: '700' }}>Duration</th>
                    <th style={{ padding: '14px', textAlign: 'center', fontWeight: '700' }}>Status</th>
                    <th style={{ padding: '14px', textAlign: 'center', fontWeight: '700' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPackages.map((pkg) => (
                    <tr key={pkg._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={pkg.coverImage}
                            alt={pkg.title}
                            style={{ 
                              width: '60px', 
                              height: '60px', 
                              borderRadius: '8px', 
                              objectFit: 'cover' 
                            }}
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/60?text=No+Image';
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: '700', marginBottom: '4px' }}>
                              {pkg.title}
                            </div>
                            <div style={{ fontSize: '13px', color: '#64748b' }}>
                              {pkg.destination}, {pkg.country}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: 'rgba(102, 126, 234, 0.1)',
                          color: '#667eea',
                          textTransform: 'capitalize'
                        }}>
                          {pkg.category}
                        </span>
                      </td>
                      <td style={{ padding: '14px', fontWeight: '700' }}>
                        ${pkg.price.amount}
                      </td>
                      <td style={{ padding: '14px' }}>
                        {pkg.duration.days}D/{pkg.duration.nights}N
                      </td>
                      <td style={{ padding: '14px', textAlign: 'center' }}>
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '700',
                          background: pkg.isActive 
                            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                            : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                          color: 'white'
                        }}>
                          {pkg.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            onClick={() => router.push(`/admin/packages/${pkg._id}/edit`)}
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
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleStatus(pkg._id)}
                            style={{
                              padding: '8px 16px',
                              background: pkg.isActive ? '#f59e0b' : '#10b981',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '13px',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            {pkg.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDelete(pkg._id, pkg.title)}
                            style={{
                              padding: '8px 16px',
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '13px',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}