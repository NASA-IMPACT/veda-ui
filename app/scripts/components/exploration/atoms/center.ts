/**
 * @fileoverview Map center position atom for URL parameter synchronization.
 * This module provides state management for the map center coordinates in the
 * E&A (Explore and Analyze) exploration view, particularly for embed mode.
 * The center position is synced with URL parameters to allow deep linking
 * and sharing of specific map views.
 * @module exploration/atoms/center
 */

import { atomWithUrlValueStability } from '$utils/params-location-atom/atom-with-url-value-stability';

/**
 * Default map center coordinates [longitude, latitude].
 * Set to [0, 0] (null island) to allow the map to set its own default view
 * when no center is specified in the URL.
 * @constant {[number, number]}
 */
const DEFAULT_CENTER: [number, number] = [0, 0];

const initialParams = new URLSearchParams(window.location.search);

/**
 * Hydrates map center coordinates from a URL parameter string.
 * Parses a comma-separated string of coordinates into a [longitude, latitude] tuple.
 * Handles malformed input gracefully by returning the default center.
 * @param {string | null} serialized - The serialized URL parameter value (e.g., "-122.4,37.8")
 * @returns {[number, number]} The parsed [longitude, latitude] tuple, or DEFAULT_CENTER if invalid
 */
const hydrateCenter = (serialized: string | null): [number, number] => {
  if (!serialized) return DEFAULT_CENTER;
  const cleaned = serialized.replace(/[[\]]/g, '');
  const parts = cleaned.split(',').map(parseFloat);
  // Ensure there are exactly two parts (lng, lat) and both are valid numbers.
  if (parts.length !== 2 || parts.some(isNaN)) {
    return DEFAULT_CENTER;
  }

  return [parts[0], parts[1]];
};

/**
 * Dehydrates map center coordinates to a URL parameter string.
 * Converts a [longitude, latitude] tuple to a comma-separated string
 * with fixed decimal precision for cleaner URLs.
 * @param {[number, number]} value - The [longitude, latitude] tuple to serialize
 * @returns {string} Comma-separated coordinate string (e.g., "-122.4000,37.8000"), or empty if null
 */
const dehydrateCenter = (value: [number, number]): string => {
  if (value === null) return '';
  return value.map((v) => v.toFixed(6)).join(',');
};

/**
 * Jotai atom that tracks the map center position.
 * This atom synchronizes with the 'center' URL parameter, enabling:
 * - Deep linking to specific map locations
 * - Sharing of map views with preserved center position
 * - Persistent map state across page reloads in embed mode
 * 
 * The center is represented as [longitude, latitude] coordinates.
 * 
 * @example
 * // In a component:
 * const [center, setCenter] = useAtom(centerAtom);
 * // center = [-122.4194, 37.7749] for San Francisco
 */
export const centerAtom = atomWithUrlValueStability<[number, number]>({
  initialValue: hydrateCenter(initialParams.get('center')),
  urlParam: 'center',
  hydrate: hydrateCenter,
  dehydrate: dehydrateCenter,
  areEqual: (prev, next) =>
    prev[0] === next[0] && prev[1] === next[1]
});
