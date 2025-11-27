/**
 * @fileoverview Embed mode atom for URL parameter synchronization.
 * This module provides state management for the embed mode feature in the
 * E&A (Explore and Analyze) exploration view. When embed mode is enabled
 * (via the 'embed' URL parameter), the exploration view renders a minimal,
 * iframe-friendly interface optimized for external embedding.
 * @module exploration/atoms/embed
 */

import { atomWithUrlValueStability } from '$utils/params-location-atom/atom-with-url-value-stability';

const initialParams = new URLSearchParams(window.location.search);

/**
 * Hydrates a boolean value from a URL parameter string.
 * Converts the string representation 'true' to a boolean true value.
 * @param {string | null} serialized - The serialized URL parameter value
 * @returns {boolean} True if the serialized value equals 'true', false otherwise
 */
const hydrateBoolean = (serialized: string | null) => {
  return serialized === 'true';
};

/**
 * Dehydrates a boolean value to a URL parameter string.
 * Only adds the param to the URL if the value is true, returning an empty
 * string otherwise to keep URLs clean.
 * @param {boolean} value - The boolean value to serialize
 * @returns {string} 'true' if value is true, empty string otherwise
 */
const dehydrateBoolean = (value: boolean) => {
  // Only add the param to the URL if it's true.
  return value ? 'true' : '';
};

/**
 * Jotai atom that tracks whether the exploration view is in embed mode.
 * This atom synchronizes with the 'embed' URL parameter, allowing the embed
 * state to be controlled via URL and persisted across page loads.
 * 
 * When true, the exploration view will:
 * - Hide navigation elements (header, footer, nav)
 * - Display a minimal interface suitable for iframe embedding
 * - Show only essential visualization components (map, legend, date picker)
 * 
 * @example
 * // In a component:
 * const [isEmbedded] = useAtom(isEmbeddedAtom);
 * if (isEmbedded) {
 *   // Render minimal embed view
 * }
 */
export const isEmbeddedAtom = atomWithUrlValueStability<boolean>({
  initialValue: hydrateBoolean(initialParams.get('embed')),
  urlParam: 'embed',
  hydrate: hydrateBoolean,
  dehydrate: dehydrateBoolean,
  areEqual: (prev, next) => prev === next
});
