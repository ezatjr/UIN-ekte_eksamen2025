import React from 'react';
import { Attraction } from '../types';

interface ArtistCardProps {
  artist: Attraction;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  // Get the main image or use a placeholder
  const imageUrl = artist.images && artist.images.length > 0
    ? artist.images.find(img => img.ratio === '1_1')?.url || artist.images[0].url
    : 'https://via.placeholder.com/300x300?text=No+Image+Available';

  // Get genre if available
  const genre = artist.classifications?.[0]?.genre?.name || 'Unknown Genre';

  return (
    <div className="card">
      <div className="card-img-container" style={{ height: '180px' }}>
        <img 
          src={imageUrl} 
          alt={artist.name} 
          className="card-img" 
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="card-content">
        <h3 className="card-title">{artist.name}</h3>
        <div className="card-meta">
          <p>{genre}</p>
          {artist.upcomingEvents && (
            <p>{artist.upcomingEvents._total} upcoming events</p>
          )}
        </div>
        {artist.url && (
          <a 
            href={artist.url} 
            className="btn btn-outline"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Profile
          </a>
        )}
      </div>
    </div>
  );
};

export default ArtistCard;