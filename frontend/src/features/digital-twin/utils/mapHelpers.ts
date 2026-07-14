import type { Coordinates } from '../types';

export const BERNA_COORDS: Coordinates = {
  lng: -3.688344,
  lat: 40.453053
};

/**
 * Calculates a bounding box around a center point
 * Useful for limiting camera movement to stadium area
 */
export const getStadiumBounds = (center: Coordinates, radiusKm: number = 0.5): [[number, number], [number, number]] => {
  // Approximate conversion: 1 degree latitude is ~111km
  const latOffset = radiusKm / 111.0;
  // Longitude distance varies by latitude
  const lngOffset = radiusKm / (111.0 * Math.cos(center.lat * (Math.PI / 180)));

  return [
    [center.lng - lngOffset, center.lat - latOffset], // SW
    [center.lng + lngOffset, center.lat + latOffset]  // NE
  ];
};

/**
 * Randomize coordinates slightly to mock movement within the stadium
 */
export const randomizePosition = (base: Coordinates, variance: number = 0.0005): Coordinates => {
  return {
    lng: base.lng + (Math.random() - 0.5) * variance,
    lat: base.lat + (Math.random() - 0.5) * variance
  };
};
