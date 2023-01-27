import mapboxgl from 'mapbox-gl';

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
export const createMbMarker = (map, opt) => {
  const mk = new mapboxgl.Marker(opt);
  let onClickListener = () => {}; // noop

  const onMapClick = (e) => {
    const targetElement = e.originalEvent.target;
    const element = mk._element;

    if (targetElement === element || element.contains(targetElement)) {
      const { lng, lat } = mk._lngLat;
      onClickListener([lng, lat]);
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
    mk._element.style.cursor = 'pointer';
    return mk;
  };

  mk.onClick = (fn) => {
    onClickListener = fn;
    return mk;
  };

  return mk;
};
