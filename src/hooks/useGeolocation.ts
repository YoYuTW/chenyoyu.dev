import { useState, useEffect } from 'react';

export interface GeoLocation {
  latitude: number;
  longitude: number;
  isDefault: boolean; // true if using fallback
}

const TAIPEI: GeoLocation = {
  latitude: 25.033,
  longitude: 121.565,
  isDefault: true,
};

const STORAGE_KEY = 'starfield-location';

/**
 * Hook to get user's geolocation with Taipei fallback.
 * Caches granted position in localStorage.
 */
export function useGeolocation(): GeoLocation {
  // Initialize with fallback immediately
  const [location, setLocation] = useState<GeoLocation>(TAIPEI);

  useEffect(() => {
    // 1. Check if we have valid stored location
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (typeof parsed.latitude === 'number' && typeof parsed.longitude === 'number') {
          setLocation({ ...parsed, isDefault: false });
          // Even if we have stored location, we might want to refresh it?
          // For now, trust the cache to avoid prompt spam, but maybe verify permission?
          // Let's proceed to check real location if we want to update it.
          // But the requirement says "Caches granted position", implying we can use it.
        }
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    // 2. Request new location
    if (!navigator.geolocation) {
      return; // Stick with fallback
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation: GeoLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          isDefault: false,
        };
        setLocation(newLocation);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newLocation));
      },
      (err) => {
        console.warn('Geolocation failed, using fallback:', err.message);
        // Stick with fallback (already set)
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 600000, // 10 minutes
      }
    );
  }, []);

  return location;
}
