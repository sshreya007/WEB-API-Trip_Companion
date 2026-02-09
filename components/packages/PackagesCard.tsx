'use client';

import { useRouter } from 'next/navigation';
import { Package } from '@/types/package.types';

interface PackageCardProps {
  package: Package;
}

export default function PackageCard({ package: pkg }: PackageCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/packages/${pkg._id}`);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    if (hasHalfStar) {
      stars.push('⭐');
    }

    return stars.join('');
  };

  const discount = pkg.price.originalPrice 
    ? Math.round(((pkg.price.originalPrice - pkg.price.amount) / pkg.price.originalPrice) * 100)
    : 0;

  return (
    <div className="package-card" onClick={handleClick}>
      <div style={{ position: 'relative' }}>
        <img 
          src={pkg.coverImage} 
          alt={pkg.title}
          className="package-card-image"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400x250?text=No+Image';
          }}
        />
        {pkg.featured && (
          <div className="package-card-badge">
            ⭐ Featured
          </div>
        )}
        {discount > 0 && (
          <div className="package-card-badge" style={{ right: 'auto', left: '16px', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
            {discount}% OFF
          </div>
        )}
      </div>

      <div className="package-card-content">
        <span className="package-card-category">
          {pkg.category}
        </span>

        <h3 className="package-card-title">{pkg.title}</h3>

        <div className="package-card-destination">
          <span>📍</span>
          <span>{pkg.destination}, {pkg.country}</span>
        </div>

        <div className="package-card-rating">
          <span className="package-stars">
            {renderStars(pkg.rating.average)}
          </span>
          <span className="package-reviews">
            ({pkg.rating.count} reviews)
          </span>
        </div>

        <p style={{ 
          fontSize: '14px', 
          color: '#64748b', 
          margin: '12px 0',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {pkg.shortDescription}
        </p>

        <div className="package-card-details">
          <div className="package-detail-item">
            <span className="package-detail-icon">📅</span>
            <span>{pkg.duration.days}D/{pkg.duration.nights}N</span>
          </div>
          <div className="package-detail-item">
            <span className="package-detail-icon">🏨</span>
            <span>Hotel Included</span>
          </div>
        </div>

        <div className="package-card-footer">
          <div className="package-price">
            <span className="package-price-label">Starting from</span>
            <div>
              <span className="package-price-amount">
                <span className="package-price-currency">$</span>
                {pkg.price.amount}
              </span>
              {pkg.price.originalPrice && (
                <span className="package-price-original">
                  ${pkg.price.originalPrice}
                </span>
              )}
            </div>
          </div>

          <button 
            className="package-book-button"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/packages/${pkg._id}`);
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}