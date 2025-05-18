import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Event, Attraction, Venue } from '../types';

interface AppContextProps {
  wishlist: Event[];
  addToWishlist: (event: Event) => void;
  removeFromWishlist: (eventId: string) => void;
  isInWishlist: (eventId: string) => boolean;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  currentCity: string;
  setCurrentCity: (city: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Event[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentCity, setCurrentCity] = useState('Oslo');

  const addToWishlist = (event: Event) => {
    setWishlist((prev) => {
      // Check if event is already in wishlist
      if (prev.some((e) => e.id === event.id)) {
        return prev;
      }
      return [...prev, event];
    });
  };

  const removeFromWishlist = (eventId: string) => {
    setWishlist((prev) => prev.filter((event) => event.id !== eventId));
  };

  const isInWishlist = (eventId: string) => {
    return wishlist.some((event) => event.id === eventId);
  };

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AppContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        isLoggedIn,
        login,
        logout,
        currentCity,
        setCurrentCity,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};