/**
 * @fileoverview Map zoom level atom for URL parameter synchronization.
 * This module provides state management for the map zoom level in the
 * E&A (Explore and Analyze) exploration view, particularly for embed mode.
 * The zoom level is synced with URL parameters to allow deep linking
 * and sharing of specific map views at particular zoom levels.
 * @module exploration/atoms/zoom
 */

import { atomWithUrlValueStability } from '$utils/params-location-atom/atom-with-url-value-stability';

/**
 * Default map zoom level.
 * Set to 1 (world view) as a fallback when no zoom is specified in the URL.
 * @constant {number}
 */
const DEFAULT_ZOOM = 1;

const initialParams = new URLSearchParams(window.location.search);

/**
 * Hydrates a zoom level from a URL parameter string.
 * Parses the string to a number and validates it, returning the default
 * zoom if the value is invalid (NaN).
 * @param {string | null} serialized - The serialized URL parameter value (e.g., "10")
 * @returns {number} The parsed zoom level, or DEFAULT_ZOOM if invalid
 */
const hydrateZoom = (serialized: string | null) => {
  if (serialized === null) return DEFAULT_ZOOM;
  const num = parseFloat(serialized);
  return isNaN(num) ? DEFAULT_ZOOM : num;
};

/**
 * Dehydrates a zoom level to a URL parameter string.
 * Converts the numeric zoom value to a string representation.
 * Returns an empty string if the value equals the default to keep URLs clean.
 * @param {number} value - The zoom level to serialize
 * @returns {string} String representation of the zoom level, or empty if default
 */
const dehydrateZoom = (value: number) => {
  return value === DEFAULT_ZOOM ? '' : value.toString();
};

/**
 * Jotai atom that tracks the map zoom level.
 * This atom synchronizes with the 'zoom' URL parameter, enabling:
 * - Deep linking to specific map zoom levels
 * - Sharing of map views with preserved zoom state
 * - Persistent zoom level across page reloads in embed mode
 * 
 * Higher values mean more zoomed in (street level ~15-18),
 * lower values mean more zoomed out (world view ~1-3).
 * 
 * @example
 * // In a component:
 * const [zoom, setZoom] = useAtom(zoomAtom);
 * // zoom = 12 for city-level view
 */
export const zoomAtom = atomWithUrlValueStability<number>({
  initialValue: hydrateZoom(initialParams.get('zoom')),
  urlParam: 'zoom',
  hydrate: hydrateZoom,
  dehydrate: dehydrateZoom,
  areEqual: (prev, next) => prev === next
});
