import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Heart } from 'lucide-react';
import { Event } from '../types';
import { useAppContext } from '../context/AppContext';

interface EventCardProps {
  event: Event;
  linkToEvent?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, linkToEvent = true }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useAppContext();
  const inWishlist = isInWishlist(event.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(event.id);
    } else {
      addToWishlist(event);
    }
  };

  // Get the main image or use a placeholder
  const imageUrl = event.images && event.images.length > 0
    ? event.images.find(img => img.ratio === '16_9')?.url || event.images[0].url
    : 'https://via.placeholder.com/400x225?text=No+Image+Available';

  // Format date if available
  const formattedDate = event.dates?.start?.localDate
    ? new Date(event.dates.start.localDate).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Date not available';

  // Get venue info if available
  const venue = event._embedded?.venues?.[0];
  const venueLocation = venue 
    ? `${venue.city?.name || ''}, ${venue.country?.name || ''}`
    : 'Location not available';

  const CardContent = () => (
    <div className="card">
      <div className="card-img-container">
        <img src={imageUrl} alt={event.name} className="card-img" />
      </div>
      <div className="card-content">
        <h3 className="card-title">{event.name}</h3>
        <div className="card-meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
            <Calendar size={16} />
            <span>{formattedDate}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={16} />
            <span>{venueLocation}</span>
          </div>
        </div>
        <div className="card-actions">
          {linkToEvent && (
            <Link to={`/event/${event.id}`} className="btn btn-primary">
              Les mer om
            </Link>
          )}
          <button 
            onClick={handleWishlistToggle} 
            className={`wishlist-icon ${inWishlist ? 'active' : ''}`}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={20} fill={inWishlist ? '#FF4081' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );

  if (linkToEvent) {
    return (
      <Link to={`/event/${event.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
};

export default EventCard;