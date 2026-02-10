'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { adminPackagesAPI } from '@/lib/api/admin-packages';
import '@/styles/admin.css';

export default function CreatePackagePage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    country: '',
    description: '',
    shortDescription: '',
    days: 5,
    nights: 4,
    price: 0,
    currency: 'USD',
    originalPrice: 0,
    category: 'beach' as any,
    hotelName: '',
    hotelRating: 5,
    roomType: '',
    startDate: '',
    endDate: '',
    maxBookings: 100,
    featured: false,
    cancellationPolicy: '',
    termsAndConditions: ''
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [includes, setIncludes] = useState<string[]>(['']);
  const [excludes, setExcludes] = useState<string[]>(['']);
  const [highlights, setHighlights] = useState<string[]>(['']);
  const [tags, setTags] = useState<string[]>(['']);
  const [itinerary, setItinerary] = useState<Array<{
    day: number;
    title: string;
    description: string;
    activities: string[];
    meals: string[];
  }>>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              (type === 'number' ? parseFloat(value) || 0 : value)
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleArrayChange = (
    array: string[], 
    setArray: React.Dispatch<React.SetStateAction<string[]>>, 
    index: number, 
    value: string
  ) => {
    const updated = [...array];
    updated[index] = value;
    setArray(updated);
  };

  const addArrayItem = (
    array: string[], 
    setArray: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setArray([...array, '']);
  };

  const removeArrayItem = (
    array: string[], 
    setArray: React.Dispatch<React.SetStateAction<string[]>>, 
    index: number
  ) => {
    setArray(array.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!coverImage) {
      setError('Please upload a cover image');
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      
      // Basic info
      data.append('title', formData.title);
      data.append('destination', formData.destination);
      data.append('country', formData.country);
      data.append('description', formData.description);
      data.append('shortDescription', formData.shortDescription);
      data.append('category', formData.category);
      
      // Duration
      data.append('duration[days]', formData.days.toString());
      data.append('duration[nights]', formData.nights.toString());
      
      // Price
      data.append('price[amount]', formData.price.toString());
      data.append('price[currency]', formData.currency);
      if (formData.originalPrice) {
        data.append('price[originalPrice]', formData.originalPrice.toString());
      }
      
      // Image
      data.append('coverImage', coverImage);
      
      // Accommodation
      if (formData.hotelName) {
        data.append('accommodation[hotelName]', formData.hotelName);
        data.append('accommodation[hotelRating]', formData.hotelRating.toString());
        data.append('accommodation[roomType]', formData.roomType);
      }
      
      // Availability
      data.append('availability[startDate]', formData.startDate);
      data.append('availability[endDate]', formData.endDate);
      data.append('availability[maxBookings]', formData.maxBookings.toString());
      
      // Arrays
      includes.filter(i => i.trim()).forEach(item => {
        data.append('includes[]', item);
      });
      
      excludes.filter(e => e.trim()).forEach(item => {
        data.append('excludes[]', item);
      });
      
      highlights.filter(h => h.trim()).forEach(item => {
        data.append('highlights[]', item);
      });
      
      tags.filter(t => t.trim()).forEach(item => {
        data.append('tags[]', item);
      });
      
      // Itinerary
      if (itinerary.length > 0) {
        data.append('itinerary', JSON.stringify(itinerary));
      }
      
      // Other
      data.append('featured', formData.featured.toString());
      if (formData.cancellationPolicy) {
        data.append('cancellationPolicy', formData.cancellationPolicy);
      }
      if (formData.termsAndConditions) {
        data.append('termsAndConditions', formData.termsAndConditions);
      }

      const result = await adminPackagesAPI.createPackage(data);

      if (result.success) {
        alert('Package created successfully!');
        router.push('/admin/packages');
      } else {
        setError(result.error || 'Failed to create package');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div>Loading...</div>;
  if (!user || user.role !== 'admin') {
    router.push('/auth/login');
    return null;
  }

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
              className="admin-menu-link active"
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
        </ul>

        <button className="logout-button" onClick={() => { logout(); router.push('/auth/login'); }}>
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <h1 className="admin-header-title">Create New Package</h1>
          <button
            onClick={() => router.push('/admin/packages')}
            style={{
              padding: '10px 20px',
              background: 'white',
              color: '#667eea',
              border: '2px solid #667eea',
              borderRadius: '10px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            ← Back to Packages
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="admin-content-card">
            {error && (
              <div style={{
                backgroundColor: '#fee',
                color: '#c33',
                padding: '12px',
                borderRadius: '12px',
                marginBottom: '20px'
              }}>
                {error}
              </div>
            )}

            {/* Basic Information */}
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>
              Basic Information
            </h3>

            <div style={{ display: 'grid', gap: '20px', marginBottom: '32px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                  Package Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                    Destination *
                  </label>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Bali"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Indonesia"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                  Short Description * (Max 200 characters)
                </label>
                <input
                  type="text"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  required
                  maxLength={200}
                  placeholder="Brief description for cards"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                  Full Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Detailed package description"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px'
                  }}
                >
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
            </div>

            {/* Duration & Price */}
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', marginTop: '32px' }}>
              Duration & Pricing
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                  Days *
                </label>
                <input
                  type="number"
                  name="days"
                  value={formData.days}
                  onChange={handleChange}
                  required
                  min="1"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                  Nights *
                </label>
                <input
                  type="number"
                  name="nights"
                  value={formData.nights}
                  onChange={handleChange}
                  required
                  min="0"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                  Original Price ($)
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="For showing discount"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px'
                  }}
                />
              </div>
            </div>

            {/* Cover Image */}
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', marginTop: '32px' }}>
              Cover Image
            </h3>

            <div style={{ marginBottom: '32px' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                style={{
                  padding: '12px',
                  border: '2px dashed #e5e7eb',
                  borderRadius: '10px',
                  width: '100%'
                }}
              />
              {coverImage && (
                <p style={{ marginTop: '8px', fontSize: '14px', color: '#10b981' }}>
                  ✓ {coverImage.name} selected
                </p>
              )}
            </div>

            {/* Continued in next part... */}
            
            {/* Submit Button */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                {loading ? 'Creating Package...' : 'Create Package'}
              </button>

              <button
                type="button"
                onClick={() => router.push('/admin/packages')}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'white',
                  color: '#64748b',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}