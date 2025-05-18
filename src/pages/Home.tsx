import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import EventCard from '../components/EventCard';
import { fetchSpecificFestivals, fetchEventsByCity, searchEvents } from '../api/ticketmaster';
import { Event } from '../types';
import { useAppContext } from '../context/AppContext';

const Home: React.FC = () => {
  const [festivals, setFestivals] = useState<Event[]>([]);
  const [cityEvents, setCityEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { currentCity, setCurrentCity } = useAppContext();

  // Byer som vises
  const cities = ['Oslo', 'London', 'Berlin', 'Paris', 'New York'];

  // Hent spesifikke festivaler ved komponentmontering
  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        setIsLoading(true);
        const data = await fetchSpecificFestivals();
        setFestivals(data);
      } catch (err) {
        setError('Klarte ikke å laste festivaler');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFestivals();
  }, []);

  // Hent arrangementer for valgt by
  useEffect(() => {
    const fetchCityEvents = async () => {
      try {
        setIsLoading(true);
        const data = await fetchEventsByCity(currentCity, 10);
        setCityEvents(data);
      } catch (err) {
        setError('Klarte ikke å laste arrangementer for byen');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCityEvents();
  }, [currentCity]);

  const handleCityChange = (city: string) => {
    setCurrentCity(city);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      setIsLoading(true);
      const results = await searchEvents(searchTerm);
      setCityEvents(results);
    } catch (err) {
      setError('Søk feilet');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="container">
        {/* Hero-seksjon */}
        <section className="hero-section" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Finn ditt neste arrangement</h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
            Oppdag fantastiske konserter, show og sportsarrangementer
          </p>

          {/* Søkelinje */}
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              className="search-input"
              placeholder="Søk etter arrangementer, artister, steder..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-button">
              <Search size={20} />
            </button>
          </form>
        </section>

        {/* Utvalgte festivaler */}
        <section className="features-section">
          <h2 className="section-title">Utvalgte Festivaler</h2>

          {isLoading && festivals.length === 0 ? (
            <div className="loading">Laster festivaler...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : festivals.length === 0 ? (
            <div>Ingen festivaler funnet</div>
          ) : (
            <div className="card-grid">
              {festivals.map((festival) => (
                <EventCard key={festival.id} event={festival} />
              ))}
            </div>
          )}
        </section>

        {/* Arrangementer etter by */}
        <section className="city-section">
          <h2 className="section-title">Arrangementer etter by</h2>

          <div className="city-filters">
            {cities.map((city) => (
              <button
                key={city}
                className={`city-button ${city === currentCity ? 'active' : ''}`}
                onClick={() => handleCityChange(city)}
              >
                {city}
              </button>
            ))}
          </div>

          <h3 style={{ marginBottom: '1rem' }}>
            I {currentCity} kan du oppleve:
          </h3>

          {isLoading && cityEvents.length === 0 ? (
            <div className="loading">Laster arrangementer...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : cityEvents.length === 0 ? (
            <div>Ingen arrangementer funnet i {currentCity}</div>
          ) : (
            <div className="card-grid">
              {cityEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  linkToEvent={false}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
