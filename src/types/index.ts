export interface Image {
  ratio?: string;
  url: string;
  width?: number;
  height?: number;
}

export interface Venue {
  id: string;
  name: string;
  url?: string;
  city?: {
    name: string;
  };
  state?: {
    name: string;
  };
  country?: {
    name: string;
    countryCode: string;
  };
  address?: {
    line1: string;
  };
  location?: {
    longitude: string;
    latitude: string;
  };
  images?: Image[];
}

export interface Artist {
  name: string;
  id: string;
  url?: string;
  images?: Image[];
}

export interface Classification {
  primary: boolean;
  segment: {
    id: string;
    name: string;
  };
  genre?: {
    id: string;
    name: string;
  };
  subGenre?: {
    id: string;
    name: string;
  };
}

export interface Date {
  start: {
    localDate: string;
    localTime?: string;
    dateTime?: string;
  };
  end?: {
    localDate?: string;
    localTime?: string;
    dateTime?: string;
  };
  timezone?: string;
  status?: {
    code: string;
  };
}

export interface PriceRange {
  type: string;
  currency: string;
  min: number;
  max: number;
}

export interface Ticket {
  id: string;
  name: string;
  type: string;
  url: string;
  price?: {
    min: number;
    max?: number;
    currency: string;
  };
}

export interface Event {
  id: string;
  name: string;
  url: string;
  images?: Image[];
  dates?: Date;
  classifications?: Classification[];
  priceRanges?: PriceRange[];
  _embedded?: {
    venues?: Venue[];
    attractions?: Artist[];
  };
  promoter?: {
    id: string;
    name: string;
  };
  info?: string;
  pleaseNote?: string;
  products?: Ticket[];
  sales?: {
    public: {
      startDateTime: string;
      endDateTime: string;
    }
  };
}

export interface Attraction {
  id: string;
  name: string;
  url?: string;
  images?: Image[];
  classifications?: Classification[];
  upcomingEvents?: {
    _total: number;
  };
}