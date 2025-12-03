import { useEffect } from 'react';
import MapboxCompare from 'mapbox-gl-compare';
import useMaps, { useMapsContext } from './use-maps';

export default function useMapCompare() {
  const { main, compared } = useMaps();
  const { containerId } = useMapsContext();
  const hasMapCompare = !!compared;
  useEffect(() => {
    if (!main) return;

    if (compared) {
      const compare = new MapboxCompare(main, compared, `#${containerId}`, {
        mousemove: false,
        orientation: 'vertical'
      });

      // Mapbox-compare does not block mousedown events from interacting with map controls
      // Because mapbox-compare does not prevent this by default, nor does it expose the sliderbegin event
      // we use this hack to prevent these interactions when starting to drag the compare swiper.
      // https://github.com/NASA-IMPACT/veda-ui/issues/1068
      compare._swiper.addEventListener(
        'mousedown',
        preventSwiperPropagationHack
      );

      return () => {
        compare._swiper.removeEventListener(
          'mousedown',
          preventSwiperPropagationHack
        );
        compare.remove();
      };
    }
    // main should be stable, while we are only interested here in the absence or presence of compared
  }, [containerId, hasMapCompare]);
}

const preventSwiperPropagationHack = (e: Event) => {
  e.preventDefault();
};
