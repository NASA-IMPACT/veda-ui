import { useEffect } from 'react';
import {
  LayerSpecification,
  SourceSpecification,
  GeoJSONSourceSpecification,
  SymbolLayerSpecification
} from 'mapbox-gl';
import { useTheme } from 'styled-components';
import { featureCollection, point } from '@turf/helpers';
import useMapStyle from '../hooks/use-map-style';

import useLayerInteraction from '../hooks/use-layer-interaction';
import { MARKER_LAYOUT } from '../hooks/use-custom-marker';
import useGeneratorParams from '../hooks/use-generator-params';

interface PointsLayerProps {
  id: string;
  points: any;
  zoomExtent?: number[];
  onPointsClick?: (feature: any) => void;
}

export default function PointsLayer(props: PointsLayerProps) {
  const { id, points, zoomExtent, onPointsClick } = props;

  const generatorParams = useGeneratorParams({
    generatorOrder: 1000000,
    hidden: false,
    opacity: 1
  });

  const { updateStyle } = useMapStyle();
  const minZoom = zoomExtent?.[0] ?? 0;
  const generatorId = `points-${id}`;

  const theme = useTheme();

  useEffect(() => {
    let layers: LayerSpecification[] = [];
    let sources: Record<string, SourceSpecification> = {};
    const pointsSourceId = `${id}-points`;
    if (points && minZoom > 0) {
      const pointsSource: GeoJSONSourceSpecification = {
        type: 'geojson',
        data: featureCollection(
          points.map((p) => point(p.center, { bounds: p.bounds }))
        )
      };

      const pointsLayer: SymbolLayerSpecification = {
        type: 'symbol',
        id: pointsSourceId,
        source: pointsSourceId,
        layout: {
          ...(MARKER_LAYOUT as any),
          'icon-allow-overlap': true
        },
        paint: {
          'icon-color': theme.color?.primary,
          'icon-halo-color': theme.color?.base,
          'icon-halo-width': 1
        },
        maxzoom: minZoom,
        metadata: {
          layerOrderPosition: 'markers'
        }
      };
      sources = {
        [pointsSourceId]: pointsSource as SourceSpecification
      };
      layers = [pointsLayer];
    }

    updateStyle({
      generatorId,
      sources,
      layers,
      params: generatorParams
    });
  }, [points, minZoom, generatorParams]);

  //
  // Listen to mouse events on the markers layer
  //

  useLayerInteraction({
    layerId: `${id}-points`,
    onClick: onPointsClick
  });

  return null;
}
