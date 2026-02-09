'use client';

import PackageCard from './PackageCard';
import { Package } from '@/types/package.types';

interface PackageGridProps {
  packages: Package[];
  loading?: boolean;
}

export default function PackageGrid({ packages, loading }: PackageGridProps) {
  if (loading) {
    return (
      <div className="packages-loading">
        <div className="loading-spinner"></div>
        <p style={{ fontSize: '18px', fontWeight: '600', color: '#0d9488', margin: 0 }}>
          Loading amazing packages for you...
        </p>
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className="packages-empty">
        <div className="packages-empty-icon">🏖️</div>
        <h3>No packages found</h3>
        <p>Try adjusting your filters or check back later for new packages</p>
      </div>
    );
  }

  return (
    <div className="packages-grid">
      {packages.map((pkg) => (
        <PackageCard key={pkg._id} package={pkg} />
      ))}
    </div>
  );
}