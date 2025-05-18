import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Tag, Users, Heart } from 'lucide-react';
import { fetchEventById } from '../api/ticketmaster';
import { Event, Classification } from '../types';
import { useAppContext } from '../context/AppContext';
import ArtistCard from '../components/ArtistCard';

const EventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { addToWishlist, removeFromWishlist, isInWishlist } = useAppContext();
  
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await fetchEventById(id);
        setEvent(data);
      } catch (err) {
        setError('Failed to load event details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvent();
  }, [id]);
  
  if (isLoading) {
    return <div className="container main-content loading">Laster arrangementdetaljer...</div>;
  }
  
  if (error || !event) {
    return (
      <div className="container main-content error">
        <p>{error || 'Arrangement ikke funnet'}</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Tilbake til Hjem
        </Link>
      </div>
    );
  }
  
  // Sjekk om arrangementet er inne wishlist
  const inWishlist = isInWishlist(event.id);
  
  const imageUrl = event.images && event.images.length > 0
    ? event.images.find(img => img.ratio === '16_9')?.url || event.images[0].url
    : 'https://via.placeholder.com/800x450?text=No+Image+Available';
  
  const formattedDate = event.dates?.start?.localDate
    ? new Date(event.dates.start.localDate).toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Date not available';
  
  const formattedTime = event.dates?.start?.localTime
    ? new Date(`2023-01-01T${event.dates.start.localTime}`).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Time not available';
  
  const venue = event._embedded?.venues?.[0];
  const venueLocation = venue 
    ? `${venue.name || ''}, ${venue.city?.name || ''}, ${venue.country?.name || ''}`
    : 'Location not available';
  
  // Få sjangere/klassifiseringer
  const getGenres = (classifications?: Classification[]) => {
    if (!classifications || classifications.length === 0) {
      return 'Genre not available';
    }
    
    return classifications.map(classification => {
      const segments = [];
      
      if (classification.segment?.name && classification.segment.name !== 'Undefined') {
        segments.push(classification.segment.name);
      }
      
      if (classification.genre?.name && classification.genre.name !== 'Undefined') {
        segments.push(classification.genre.name);
      }
      
      if (classification.subGenre?.name && classification.subGenre.name !== 'Undefined') {
        segments.push(classification.subGenre.name);
      }
      
      return segments.join(' - ');
    }).join(', ');
  };
  
  //Få artister/attraksjoner
  const artists = event._embedded?.attractions || [];
  
  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(event.id);
    } else {
      addToWishlist(event);
    }
  };
  
  return (
    <div className="container main-content">
          <div className="event-header">
            <h1 className="event-title">{event.name}</h1>

            <div className="event-meta">
              <div className="event-meta-item">
                <Calendar size={18} />
                <span>{formattedDate}</span>
              </div>

              <div className="event-meta-item">
                <Clock size={18} />
                <span>{formattedTime}</span>
              </div>

              <div className="event-meta-item">
                <MapPin size={18} />
                <span>{venueLocation}</span>
              </div>

              <div className="event-meta-item">
                <Tag size={18} />
                <span>{getGenres(event.classifications)}</span>
              </div>

              <button 
                onClick={handleWishlistToggle} 
                className={`wishlist-icon ${inWishlist ? 'active' : ''}`}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease'
                }}
              >
                <Heart size={18} fill={inWishlist ? '#FF4081' : 'none'} />
                <span>{inWishlist ? 'Lagret' : 'Lagre arrangement'}</span>
              </button>
            </div>
          </div>

          <div className="event-detail">
            <div className="event-main">
              <img src={imageUrl} alt={event.name} className="event-image" />

              {event.info && (
                <div className="event-info-section">
                  <h2 className="event-info-title">Informasjon om arrangementet</h2>
                  <p>{event.info}</p>
                </div>
              )}

              {event.pleaseNote && (
                <div className="event-info-section">
                  <h2 className="event-info-title">Vennligst merk</h2>
                  <p>{event.pleaseNote}</p>
                </div>
              )}

              {artists.length > 0 && (
                <div className="event-info-section">
                  <h2 className="event-info-title">Artister</h2>
                  <div className="card-grid">
                    {artists.map(artist => (
                      <ArtistCard key={artist.id} artist={artist} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="event-sidebar">
              <div className="event-info-section">
                <h2 className="event-info-title">Billetter</h2>
                {event.url ? (
                  <a 
                    href={event.url} 
                    className="btn btn-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'block', textAlign: 'center', marginBottom: '1rem' }}
                  >
                    Kjøp billetter
                  </a>
                ) : (
                  <p>Billetter ikke tilgjengelig</p>
                )}

                {event.priceRanges && event.priceRanges.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>Prisområde</h3>
                    {event.priceRanges.map((range, index) => (
                      <div key={index} style={{ marginBottom: '0.5rem' }}>
                        <p>
                          {range.min} - {range.max} {range.currency}
                        </p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          {range.type}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {venue && (
                <div className="event-info-section">
                  <h2 className="event-info-title">Informasjon om stedet</h2>
                  <h3>{venue.name}</h3>
                  <p>{venue.address?.line1}</p>
                  <p>{venue.city?.name}, {venue.country?.name}</p>

                  {venue.url && (
                    <a 
                      href={venue.url} 
                      className="btn btn-outline"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginTop: '1rem', display: 'inline-block' }}
                    >
                      Vis sted
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
    </div>
  );
};

export default EventPage;