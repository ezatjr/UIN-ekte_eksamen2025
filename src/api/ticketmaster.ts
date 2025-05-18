import { Event, Attraction, Venue } from '../types';

const API_KEY = 'Ox90qokGcqgD08yQVKM9iDpXjic6b8hD';
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';

export async function fetchEventsByCity(city: string, size: number = 10): Promise<Event[]> {
  try {
    const encodedCity = encodeURIComponent(city);
    const response = await fetch(
      `${BASE_URL}/events.json?apikey=${API_KEY}&city=${encodedCity}&size=${size}&locale=no`
    );
    
    if (!response.ok) {
      throw new Error('Nettverksfeil ved henting av hendelser');
    }
    
    const data = await response.json();
    return data._embedded?.events || [];
  } catch (error) {
    console.error('Feil ved henting av hendelser etter by:', error);
    return [];
  }
}

export async function fetchEventById(id: string): Promise<Event | null> {
  try {
    const encodedId = encodeURIComponent(id);
    const response = await fetch(
      `${BASE_URL}/events/${encodedId}.json?apikey=${API_KEY}&locale=no`
    );
    
    if (!response.ok) {
      throw new Error('Nettverksfeil ved henting av hendelse');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Feil ved henting av hendelsesdetaljer:', error);
    return null;
  }
}

export async function searchEvents(keyword: string): Promise<Event[]> {
  try {
    const encodedKeyword = encodeURIComponent(keyword);
    const response = await fetch(
      `${BASE_URL}/events.json?apikey=${API_KEY}&keyword=${encodedKeyword}&locale=no`
    );
    
    if (!response.ok) {
      throw new Error('Nettverksfeil ved søk');
    }
    
    const data = await response.json();
    return data._embedded?.events || [];
  } catch (error) {
    console.error('Feil ved søk etter hendelser:', error);
    return [];
  }
}

export async function fetchCategoryContent(
  type: string,
  filters: { date?: string; country?: string; city?: string } = {}
): Promise<{ attractions: Attraction[]; events: Event[]; venues: Venue[] }> {
  try {
    const queryParams = new URLSearchParams({
      apikey: API_KEY,
      keyword: encodeURIComponent(type),
      locale: 'no'
    });
    
    if (filters.date) queryParams.append('startDateTime', filters.date);
    if (filters.country) queryParams.append('countryCode', filters.country);
    if (filters.city) queryParams.append('city', encodeURIComponent(filters.city));
    
    const attractionsResponse = await fetch(
      `${BASE_URL}/attractions.json?${queryParams.toString()}`
    );
    
    const eventsResponse = await fetch(
      `${BASE_URL}/events.json?${queryParams.toString()}`
    );
    
    const venuesResponse = await fetch(
      `${BASE_URL}/venues.json?${queryParams.toString()}`
    );
    
    const attractionsData = await attractionsResponse.json();
    const eventsData = await eventsResponse.json();
    const venuesData = await venuesResponse.json();
    
    return {
      attractions: attractionsData._embedded?.attractions || [],
      events: eventsData._embedded?.events || [],
      venues: venuesData._embedded?.venues || [],
    };
  } catch (error) {
    console.error('Feil ved henting av kategoriinnhold:', error);
    return { attractions: [], events: [], venues: [] };
  }
}

export async function fetchSuggest(keyword: string): Promise<{
  attractions: Attraction[];
  events: Event[];
  venues: Venue[];
}> {
  try {
    const encodedKeyword = encodeURIComponent(keyword);
    const response = await fetch(
      `${BASE_URL}/suggest.json?apikey=${API_KEY}&keyword=${encodedKeyword}&locale=no`
    );
    
    if (!response.ok) {
      throw new Error('Nettverksfeil ved forslag');
    }
    
    const data = await response.json();
    
    return {
      attractions: data._embedded?.attractions || [],
      events: data._embedded?.events || [],
      venues: data._embedded?.venues || [],
    };
  } catch (error) {
    console.error('Feil ved henting av forslag:', error);
    return { attractions: [], events: [], venues: [] };
  }
}

export async function fetchSpecificFestivals(): Promise<Event[]> {
  try {
    const festivalNames = [
      'Øyafestivalen',
      'Tons of Rock',
      'Findings Festival',
      'Palmesus',
      'Norwegian Wood',
      'Over Oslo',
      'Piknik i Parken',
      'Stavernfestivalen'
    ];
    
    const festivalPromises = festivalNames.map(async (name) => {
      try {
        const queryParams = new URLSearchParams({
          apikey: API_KEY,
          keyword: name,
          classificationName: 'festival',
          size: '1',
          sort: 'date,asc',
          locale: 'no'
        });

        const response = await fetch(`${BASE_URL}/events.json?${queryParams}`);
        
        if (!response.ok) {
          console.warn(`Kunne ikke hente ${name} festival: ${response.status} ${response.statusText}`);
          return null;
        }
        
        const data = await response.json();
        return data._embedded?.events?.[0] || null;
      } catch (error) {
        console.warn(`Feil ved henting av ${name} festival:`, error);
        return null;
      }
    });
    
    const festivals = (await Promise.all(festivalPromises)).filter((festival): festival is Event => festival !== null);
    
    return festivals;
  } catch (error) {
    console.error('Feil ved henting av festivaler:', error);
    return [];
  }
}