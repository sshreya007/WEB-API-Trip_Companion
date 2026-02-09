'use client';

import { useState } from 'react';
import { PackageFilter } from '@/types/package.types';

interface PackageFilterProps {
  onFilterChange: (filters: PackageFilter) => void;
  onReset: () => void;
}

export default function PackageFilterComponent({ onFilterChange, onReset }: PackageFilterProps) {
  const [filters, setFilters] = useState<PackageFilter>({
    category: '',
    minPrice: undefined,
    maxPrice: undefined,
    minDays: undefined,
    maxDays: undefined,
    destination: '',
    country: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value === '' ? undefined : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const handleReset = () => {
    setFilters({
      category: '',
      minPrice: undefined,
      maxPrice: undefined,
      minDays: undefined,
      maxDays: undefined,
      destination: '',
      country: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    onReset();
  };

  return (
    <div className="packages-filters">
      <form onSubmit={handleSubmit}>
        <div className="filter-row">
          <div className="filter-group">
            <label>Category</label>
            <select name="category" value={filters.category} onChange={handleChange}>
              <option value="">All Categories</option>
              <option value="beach">🏖️ Beach</option>
              <option value="adventure">🏔️ Adventure</option>
              <option value="cultural">🏛️ Cultural</option>
              <option value="luxury">💎 Luxury</option>
              <option value="budget">💰 Budget</option>
              <option value="family">👨‍👩‍👧‍👦 Family</option>
              <option value="honeymoon">💑 Honeymoon</option>
              <option value="group">👥 Group</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Min Price ($)</label>
            <input
              type="number"
              name="minPrice"
              placeholder="0"
              value={filters.minPrice || ''}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="filter-group">
            <label>Max Price ($)</label>
            <input
              type="number"
              name="maxPrice"
              placeholder="10000"
              value={filters.maxPrice || ''}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="filter-group">
            <label>Duration (Days)</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="number"
                name="minDays"
                placeholder="Min"
                value={filters.minDays || ''}
                onChange={handleChange}
                min="1"
                style={{ width: '50%' }}
              />
              <input
                type="number"
                name="maxDays"
                placeholder="Max"
                value={filters.maxDays || ''}
                onChange={handleChange}
                min="1"
                style={{ width: '50%' }}
              />
            </div>
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <label>Destination</label>
            <input
              type="text"
              name="destination"
              placeholder="e.g. Bali, Paris"
              value={filters.destination}
              onChange={handleChange}
            />
          </div>

          <div className="filter-group">
            <label>Country</label>
            <input
              type="text"
              name="country"
              placeholder="e.g. Indonesia, France"
              value={filters.country}
              onChange={handleChange}
            />
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select name="sortBy" value={filters.sortBy} onChange={handleChange}>
              <option value="createdAt">Newest First</option>
              <option value="price">Price</option>
              <option value="rating">Rating</option>
              <option value="duration">Duration</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Order</label>
            <select name="sortOrder" value={filters.sortOrder} onChange={handleChange}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        <div className="filter-actions">
          <button type="button" className="filter-button secondary" onClick={handleReset}>
            Reset Filters
          </button>
          <button type="submit" className="filter-button primary">
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
}