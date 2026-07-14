import { useEffect, useRef, useState, useCallback } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import type { Coordinates } from '../types';
import { PERIMO_MAP_STYLE } from '../utils/mapStyles';

interface UseGoogleMapsProps {
  containerId: string;
  center: Coordinates;
  zoom?: number;
  tilt?: number;
  heading?: number;
  interactive?: boolean;
}

export const useGoogleMaps = ({
  containerId,
  center,
  zoom = 17,
  tilt = 45,
  heading = 0,
  interactive = true,
}: UseGoogleMapsProps) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const retry = useCallback(() => {
    setError(null);
    setIsLoaded(false);
    setRetryKey(prev => prev + 1);
  }, []);

  // 1. Initialization Effect
  useEffect(() => {
    const token = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!token || token === 'your_google_maps_key_here') {
      setError('Google Maps API Key not configured. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.');
      return;
    }

    setOptions({
      key: token,
      v: 'weekly',
    });

    // Global Auth Failure hook
    (window as any).gm_authFailure = () => {
      console.error('[Google Maps Error] gm_authFailure triggered. Billing or API key is invalid.');
      setError('Authentication or billing error (ApiNotActivatedMapError). Check Google Cloud Console.');
    };

    const initMap = async () => {
      try {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Start loading the libraries needed
        await importLibrary("marker");
        await importLibrary("visualization");
        const { Map } = await importLibrary("maps") as google.maps.MapsLibrary;

      const map = new Map(container, {
        center,
        zoom,
        tilt,
        heading,
        mapId: 'DEMO_MAP_ID', // Required for AdvancedMarkerElement
        disableDefaultUI: true,
        gestureHandling: interactive ? 'auto' : 'none',
        styles: PERIMO_MAP_STYLE
      });

      mapRef.current = map;

        google.maps.event.addListenerOnce(map, 'tilesloaded', () => {
          setIsLoaded(true);
        });

      } catch (e: any) {
        const errCode = e?.name || e?.code || 'UnknownMapError';
        console.error(`[Google Maps Error] Code: ${errCode}`, e);
        setError(`Failed to load Google Maps script. (${errCode})`);
      }
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current = null;
      }
      // Cleanup global callback if needed
      (window as any).gm_authFailure = undefined;
    };
  }, [containerId, retryKey]); // ONLY run on mount or when retryKey changes

  // 2. Sync Effect for updating Map without recreation
  useEffect(() => {
    if (!mapRef.current) return;
    
    const m = mapRef.current;
    
    // Smoothly pan or set zoom
    if (m.getZoom() !== zoom) {
      m.setZoom(zoom);
    }
    
    const currentCenter = m.getCenter();
    if (currentCenter && (currentCenter.lat() !== center.lat || currentCenter.lng() !== center.lng)) {
      m.panTo(center);
    }
    
    m.setTilt(tilt);
    m.setHeading(heading);
    m.setOptions({ gestureHandling: interactive ? 'auto' : 'none' });
    
  }, [zoom, center.lat, center.lng, tilt, heading, interactive]);

  return { map: mapRef.current, isLoaded, error, retry };
};
