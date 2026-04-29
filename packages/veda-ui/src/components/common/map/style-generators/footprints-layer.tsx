import { useEffect } from 'react';
import {
  LayerSpecification,
  SourceSpecification,
  GeoJSONSourceSpecification,
  FillLayerSpecification,
  LineLayerSpecification
} from 'mapbox-gl';
import { useTheme } from 'styled-components';
import { featureCollection, polygon, Feature, Polygon } from '@turf/helpers';
import bboxPolygon from '@turf/bbox-polygon';
import useMapStyle from '../hooks/use-map-style';

import useLayerInteraction from '../hooks/use-layer-interaction';
import useGeneratorParams from '../hooks/use-generator-params';

interface Footprint {
  bounds: [[number, number], [number, number]];
  geometry?: Polygon;
}

interface FootprintsLayerProps {
  id: string;
  footprints: Footprint[] | null;
  zoomExtent?: number[];
  hidden?: boolean;
  opacity?: number;
  generatorOrder?: number;
  onFootprintsClick?: (features: Feature[]) => void;
}

export default function FootprintsLayer(props: FootprintsLayerProps) {
  const {
    id,
    footprints,
    zoomExtent,
    hidden,
    opacity,
    generatorOrder,
    onFootprintsClick
  } = props;

  const generatorParams = useGeneratorParams({
    generatorOrder: generatorOrder ?? 1000000, // on top of any layers
    hidden: !!hidden,
    opacity: opacity ?? 1
  });

  const { updateStyle } = useMapStyle();
  const minZoom = zoomExtent?.[0] ?? 0;
  const generatorId = `footprints-${id}`;

  const theme = useTheme();

  useEffect(() => {
    let layers: LayerSpecification[] = [];
    let sources: Record<string, SourceSpecification> = {};

    const footprintsSourceId = `${id}-footprints`;
    if (footprints && minZoom > 0) {
      const features: Feature<Polygon>[] = footprints.map((f) => {
        const props = { bounds: f.bounds };
        if (f.geometry) {
          return polygon(f.geometry.coordinates, props);
        }
        const [[w, s], [e, n]] = f.bounds;
        return bboxPolygon([w, s, e, n], {
          properties: props
        }) as Feature<Polygon>;
      });

      const footprintsSource: GeoJSONSourceSpecification = {
        type: 'geojson',
        data: featureCollection(features)
      };

      const fillLayer: FillLayerSpecification = {
        type: 'fill',
        id: footprintsSourceId,
        source: footprintsSourceId,
        paint: {
          'fill-color': theme.color?.primary,
          'fill-opacity': 0.4,
          'fill-outline-color': theme.color?.primary
        },
        maxzoom: minZoom,
        metadata: {
          layerOrderPosition: 'markers'
        }
      };

      const lineLayer: LineLayerSpecification = {
        type: 'line',
        id: `${footprintsSourceId}-outline`,
        source: footprintsSourceId,
        paint: {
          'line-color': theme.color?.primary,
          'line-width': 3,
          'line-opacity': 1
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        maxzoom: minZoom,
        metadata: {
          layerOrderPosition: 'markers'
        }
      };

      sources = {
        [footprintsSourceId]: footprintsSource as SourceSpecification
      };
      layers = [fillLayer, lineLayer];
    }

    updateStyle({
      generatorId,
      sources,
      layers,
      params: generatorParams
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, footprints, minZoom, generatorParams]);

  //
  // Cleanup layers on unmount.
  //
  useEffect(() => {
    return () => {
      updateStyle({
        generatorId,
        sources: {},
        layers: []
      });
    };
  }, [updateStyle, generatorId]);

  useLayerInteraction({
    layerId: `${id}-footprints`,
    onClick: onFootprintsClick
  });

  return null;
}
