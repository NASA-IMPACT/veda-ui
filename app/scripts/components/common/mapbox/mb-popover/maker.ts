import mapboxgl from 'mapbox-gl';

type MapboxMarkerClickableListener = (coords: [number, number]) => void;

interface MapboxMarkerClickable extends mapboxgl.Marker {
  onClick: (listener: MapboxMarkerClickableListener) => MapboxMarkerClickable;
}

/**
 * Creates a new mapbox marker which supports a click listener.
 * All the other api methods are the same as mapbox's marker.
 *
 * @example
 * Use:
 *  createMbMarker(mbMap, opt)
 *    .setLngLat([-77.03, 38.90])
 *    .addTo(mbMap)
 *    .onClick((coords) => {})
 *
 * Instead of:
 *  new mapboxgl.Marker(opt)
 *    .setLngLat([-77.03, 38.90])
 *    .addTo(mbMap)
 *
 * @param {object} map Mapbox ma instance.
 * @param {object} opt Mapbox marker options as defined in the documentation.
 */
export const createMbMarker = (
  map: mapboxgl.Map,
  opt?: mapboxgl.MarkerOptions
) => {
  const mk = new mapboxgl.Marker(opt);
  let onClickListener: MapboxMarkerClickableListener | undefined;

  const onMapClick = (e) => {
    const targetElement = e.originalEvent.target;
    // @ts-expect-error _element is an internal property.
    const element = mk._element;

    if (targetElement === element || element.contains(targetElement)) {
      // @ts-expect-error _lngLat is an internal property.
      const { lng, lat } = mk._lngLat;
      onClickListener?.([lng, lat]);
    }
  };

  const markerRemove = mk.remove;
  mk.remove = () => {
    markerRemove.apply(mk);
    map.off('click', onMapClick);
    map.off('touchend', onMapClick);
    return mk;
  };

  const makerAdd = mk.addTo;
  mk.addTo = (m) => {
    makerAdd.call(mk, m);
    map.on('click', onMapClick);
    map.on('touchend', onMapClick);
    // @ts-expect-error _element is an internal property.
    mk._element.style.cursor = 'pointer';
    return mk;
  };

  // @ts-expect-error onClick is a property being added.
  mk.onClick = (fn) => {
    onClickListener = fn;
    return mk;
  };

  return mk as MapboxMarkerClickable;
};
