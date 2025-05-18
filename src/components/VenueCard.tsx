import React from 'react';
import { MapPin } from 'lucide-react';
import { Venue } from '../types';

interface VenueCardProps {
  venue: Venue;
}

const VenueCard: React.FC<VenueCardProps> = ({ venue }) => {
  // Get the main image or use a placeholder
  const imageUrl = venue.images && venue.images.length > 0
    ? venue.images[0].url
    : 'https://via.placeholder.com/400x200?text=No+Image+Available';

  // Format location
  const location = 
    `${venue.city?.name || ''}, ${venue.country?.name || 'Location not available'}`;

  return (
    <div className="card">
      <div className="card-img-container">
        <img 
          src={imageUrl}
          alt={venue.name}
          className="card-img"
        />
      </div>
      <div className="card-content">
        <h3 className="card-title">{venue.name}</h3>
        <div className="card-meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
            <MapPin size={16} />
            <span>{location}</span>
          </div>
          {venue.address?.line1 && (
            <p>{venue.address.line1}</p>
          )}
        </div>
        {venue.url && (
          <a 
            href={venue.url} 
            className="btn btn-outline"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Venue
          </a>
        )}
      </div>
    </div>
  );
};

export default VenueCard;