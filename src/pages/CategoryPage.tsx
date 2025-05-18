import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { fetchCategoryContent, fetchSuggest } from '../api/ticketmaster';
import { Event, Attraction, Venue } from '../types';
import EventCard from '../components/EventCard';
import ArtistCard from '../components/ArtistCard';
import VenueCard from '../components/VenueCard';

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  
  // Format the category title
  const categoryTitle = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : '';
  
  // Fetch category content when params change
  useEffect(() => {
    const fetchContent = async () => {
      if (!slug) return;
      
      try {
        setIsLoading(true);
        const filters = {
          date: dateFilter,
          country: countryFilter,
          city: cityFilter,
        };
        
        const data = await fetchCategoryContent(slug, filters);
        setAttractions(data.attractions);
        setEvents(data.events);
        setVenues(data.venues);
      } catch (err) {
        setError('Failed to load category content');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContent();
  }, [slug, dateFilter, countryFilter, cityFilter]);
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    try {
      setIsLoading(true);
      const data = await fetchSuggest(searchTerm);
      setAttractions(data.attractions);
      setEvents(data.events);
      setVenues(data.venues);
    } catch (err) {
      setError('Search failed');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container main-content category-page">
<div className="category-header">
  <h1 className="category-title">{categoryTitle} Arrangementer</h1>
  <p>Finn de beste {categoryTitle.toLowerCase()}-arrangementene, artistene og stedene.</p>
</div>

{/* Filters Section */}
<div className="filter-section">
  <h2 style={{ marginBottom: '1rem' }}>Filtrer og Søk</h2>

  <form className="filter-form" onSubmit={handleSearch}>
    <div className="form-group">
      <label htmlFor="search" className="form-label">Søk</label>
      <div style={{ display: 'flex' }}>
        <input 
          type="text" 
          id="search" 
          className="form-input"
          placeholder={`Søk etter ${categoryTitle.toLowerCase()}...`} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="search-button">
          <Search size={20} />
        </button>
      </div>
    </div>

    <div className="form-group">
      <label htmlFor="date" className="form-label">Dato</label>
      <input 
        type="date" 
        id="date" 
        className="form-input"
        value={dateFilter}
        onChange={(e) => setDateFilter(e.target.value)}
      />
    </div>

    <div className="form-group">
      <label htmlFor="country" className="form-label">Land</label>
      <select 
        id="country" 
        className="form-select"
        value={countryFilter}
        onChange={(e) => setCountryFilter(e.target.value)}
      >
        <option value="">Alle land</option>
        <option value="US">USA</option>
        <option value="GB">Storbritannia</option>
        <option value="NO">Norge</option>
        <option value="DE">Tyskland</option>
        <option value="FR">Frankrike</option>
      </select>
    </div>

    <div className="form-group">
      <label htmlFor="city" className="form-label">By</label>
      <input 
        type="text" 
        id="city" 
        className="form-input"
        placeholder="Skriv inn bynavn"
        value={cityFilter}
        onChange={(e) => setCityFilter(e.target.value)}
      />
    </div>
  </form>
</div>

{isLoading ? (
  <div className="loading">Laster {categoryTitle} innhold...</div>
) : error ? (
  <div className="error">{error}</div>
) : (
  <>
    {/* Events Section */}
    <div className="section-container">
      <h2 className="section-title">Arrangementer</h2>
      {events.length === 0 ? (
        <p>Ingen arrangementer funnet</p>
      ) : (
        <div className="card-grid">
          {events.map(event => (
            <EventCard key={event.id} event={event} linkToEvent={true} />
          ))}
        </div>
      )}
    </div>

    {/* Attractions Section */}
    <div className="section-container">
      <h2 className="section-title">Artister og Utøvere</h2>
      {attractions.length === 0 ? (
        <p>Ingen artister funnet</p>
      ) : (
        <div className="card-grid">
          {attractions.map(attraction => (
            <ArtistCard key={attraction.id} artist={attraction} />
          ))}
        </div>
      )}
    </div>

    {/* Venues Section */}
    <div className="section-container">
      <h2 className="section-title">Steder</h2>
      {venues.length === 0 ? (
        <p>Ingen steder funnet</p>
      ) : (
        <div className="card-grid">
          {venues.map(venue => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}
    </div>
  </>
)}
    </div>
  );
};

export default CategoryPage;