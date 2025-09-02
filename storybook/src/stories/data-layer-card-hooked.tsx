import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef
} from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { GridContainer, Grid } from '@trussworks/react-uswds';
import { mockDatasets } from './mock-data.js';
import { ExplorationMap } from '$components/exploration/components/map';

import DataLayerCardPresentational from '$components/common/dataset-layer-card';
import { TimelineDataset } from '$components/exploration/types.d.ts';
export interface colorMapScale {
  min: number;
  max: number;
}

// providers
import ReactQueryProvider from '$context/react-query';
import { VedaUIProvider } from '$context/veda-ui-provider';

const HugResetter = styled.div`
  /* To break hug */
`;
const Title = styled.h1`
  margin-bottom: 2rem;
  color: #333;
`;

const StateDisplay = styled.iframe`
  padding: 1rem;
  background: #f0f0f0;
  border-radius: 4px;
  font-size: 0.85em;
  color: #666;
  margin-top: 1rem;
`;

const mockParentDataset = {
  id: 'no2',
  name: 'Nitrogen Dioxide'
};
const mockSelectedDay = new Date('2017-12-01T00:00:00.000Z');
const theme = {};

export default function DataLayerCardHooked() {
  // Use mockDatasets as state
  const [datasets, setDatasets] = useState(mockDatasets);
  const [lastAction, setLastAction] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Send message to iframe whenever datasets change
  useEffect(() => {
    if (datasets && iframeRef.current?.contentWindow) {
      // eslint-disable-next-line no-console
      iframeRef.current.contentWindow.postMessage(
        {
          plugin: 'data-layer-card',
          payload: {
            type: 'dataset-change',
            message: `Datasets updated (${datasets.length} layers)`,
            timestamp: Date.now(),
            datasets
          }
        },
        '*'
      );
    }
  }, [datasets]);

  // Memoized factory functions to create handlers for each dataset
  const createOpacityHandler = useCallback(
    (datasetIndex: number) => (newOpacity: number) => {
      setDatasets((prev) => {
        const updated = prev.map((dataset, index) =>
          index === datasetIndex
            ? {
                ...dataset,
                settings: { ...dataset.settings, opacity: newOpacity }
              }
            : dataset
        );
        setLastAction(
          `Opacity changed to ${newOpacity}% for ${prev[datasetIndex].data.name}`
        );
        return updated;
      });
    },
    []
  );

  const createColorMapHandler = useCallback(
    (datasetIndex: number) => (newColorMap: string) => {
      setDatasets((prev) => {
        const updated = prev.map((dataset, index) =>
          index === datasetIndex
            ? {
                ...dataset,
                settings: { ...dataset.settings, colorMap: newColorMap }
              }
            : dataset
        );
        setLastAction(
          `ColorMap changed to: ${newColorMap} for ${prev[datasetIndex].data.name}`
        );
        return updated;
      });
    },
    []
  );

  const createColorMapScaleHandler = useCallback(
    (datasetIndex: number) => (newScale: colorMapScale) => {
      setDatasets((prev) => {
        const updated = prev.map((dataset, index) =>
          index === datasetIndex
            ? { ...dataset, settings: { ...dataset.settings, scale: newScale } }
            : dataset
        );
        setLastAction(
          `Scale changed to: ${newScale.min} - ${newScale.max} for ${prev[datasetIndex].data.name}`
        );
        return updated;
      });
    },
    []
  );

  const createVisibilityHandler = useCallback(
    (datasetIndex: number) => (setter: any) => {
      setDatasets((prev) =>
        prev.map((dataset, index) => {
          if (index === datasetIndex) {
            const currentVisible = dataset.settings.isVisible;
            const newValue =
              typeof setter === 'function' ? setter(currentVisible) : setter;
            setLastAction(
              `Layer visibility: ${newValue ? 'shown' : 'hidden'} for ${
                dataset.data.name
              }`
            );
            return {
              ...dataset,
              settings: { ...dataset.settings, isVisible: newValue }
            };
          }
          return dataset;
        })
      );
    },
    []
  );

  const createLayerInfoHandler = useCallback(
    (datasetIndex: number) => () => {
      setDatasets((prev) => {
        setLastAction(
          `Layer info clicked for ${
            prev[datasetIndex].data.name
          } - ${new Date().toLocaleTimeString()}`
        );
        return prev;
      });
    },
    []
  );

  const createRemoveLayerHandler = useCallback(
    (datasetIndex: number) => () => {
      setDatasets((prev) => {
        const datasetName = prev[datasetIndex].data.name;
        setLastAction(
          `Removed layer: ${datasetName} - ${new Date().toLocaleTimeString()}`
        );
        return prev.filter((_, index) => index !== datasetIndex);
      });
    },
    []
  );

  const createMoveUpHandler = useCallback(
    (datasetIndex: number) => () => {
      if (datasetIndex > 0) {
        setDatasets((prev) => {
          const datasetName = prev[datasetIndex].data.name;
          setLastAction(
            `Moved up: ${datasetName} - ${new Date().toLocaleTimeString()}`
          );
          const arr = [...prev];
          [arr[datasetIndex], arr[datasetIndex - 1]] = [
            arr[datasetIndex - 1],
            arr[datasetIndex]
          ];
          return arr;
        });
      }
    },
    []
  );

  const createMoveDownHandler = useCallback(
    (datasetIndex: number) => () => {
      setDatasets((prev) => {
        if (datasetIndex < prev.length - 1) {
          const datasetName = prev[datasetIndex].data.name;
          setLastAction(
            `Moved down: ${datasetName} - ${new Date().toLocaleTimeString()}`
          );
          const arr = [...prev];
          [arr[datasetIndex], arr[datasetIndex + 1]] = [
            arr[datasetIndex + 1],
            arr[datasetIndex]
          ];
          return arr;
        }
        return prev;
      });
    },
    []
  );

  // Memoized handlers for each dataset
  const handlers = useMemo(() => {
    return datasets.map((_, index) => ({
      onClickLayerInfo: createLayerInfoHandler(index),
      setVisible: createVisibilityHandler(index),
      setColorMap: createColorMapHandler(index),
      setColorMapScale: createColorMapScaleHandler(index),
      onRemoveLayer: createRemoveLayerHandler(index),
      onMoveUp: createMoveUpHandler(index),
      onMoveDown: createMoveDownHandler(index),
      onOpacityChange: createOpacityHandler(index)
    }));
  }, [
    datasets.length,
    createVisibilityHandler,
    createColorMapHandler,
    createColorMapScaleHandler,
    createLayerInfoHandler,
    createRemoveLayerHandler,
    createMoveUpHandler,
    createMoveDownHandler,
    createOpacityHandler
  ]);

  // Generate props for each dataset
  const getDatasetProps = useCallback(
    (dataset: TimelineDataset, index: number) => {
      const isVisible = dataset.settings.isVisible;
      const colorMap = dataset.settings.colorMap;
      const colorMapScale = dataset.settings.scale;
      const opacity = dataset.settings.opacity;

      return {
        dataset,
        isVisible,
        setVisible: handlers[index]?.setVisible,
        colorMap,
        setColorMap: handlers[index]?.setColorMap,
        colorMapScale,
        setColorMapScale: handlers[index]?.setColorMapScale,
        onClickLayerInfo: handlers[index]?.onClickLayerInfo,
        layerInfo: dataset.data.info,
        min: colorMapScale?.min ?? 0,
        max: colorMapScale?.max ?? 1,
        parentDataset: mockParentDataset,
        showLoadingConfigurableCmapSkeleton: false,
        showConfigurableCmap: true,
        showNonConfigurableCmap: false,
        onRemoveLayer: handlers[index]?.onRemoveLayer,
        onMoveUp: handlers[index]?.onMoveUp,
        onMoveDown: handlers[index]?.onMoveDown,
        canMoveUp: index > 0,
        canMoveDown: index < datasets.length - 1,
        opacity,
        onOpacityChange: handlers[index]?.onOpacityChange,
        datasetLegend: dataset.data.legend
      };
    },
    [handlers, datasets.length]
  );

  return (
    <ThemeProvider theme={theme}>
      <HugResetter>
        <GridContainer>
          <Title>Data Layer Card Presentational Component Sandbox</Title>

          <div style={{ marginBottom: '2rem' }}>
            <h3>Dataset Stack ({datasets.length} layers)</h3>
            <p style={{ color: '#666', fontSize: '0.9em' }}>
              Each layer card shows real CASA-GFED3 carbon flux data. Interact
              with any layer to see how state changes persist.
            </p>
          </div>

          {lastAction && (
            <div
              style={{
                padding: '0.5rem',
                background: '#e8f5e8',
                border: '1px solid #4caf50',
                borderRadius: '4px',
                fontSize: '0.9em',
                color: '#2e7d32',
                marginBottom: '2rem'
              }}
            >
              <strong>Last Action:</strong> {lastAction}
            </div>
          )}
          <Grid row gap={3}>
            <Grid col={6}>
              {datasets.map((dataset, index) => (
                <div
                  key={dataset.data.id}
                  style={{
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    background: 'white'
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.8em',
                      color: '#666',
                      marginBottom: '0.5rem',
                      fontWeight: 'bold'
                    }}
                  >
                    Layer {index + 1} of {datasets.length}
                  </div>
                  <DataLayerCardPresentational
                    {...getDatasetProps(dataset, index)}
                  />
                </div>
              ))}
            </Grid>

            <Grid col={6}>
              <ReactQueryProvider>
                <ExplorationMap
                  datasets={datasets}
                  setDatasets={setDatasets}
                  selectedDay={mockSelectedDay}
                />
              </ReactQueryProvider>
            </Grid>
          </Grid>
        </GridContainer>
      </HugResetter>
    </ThemeProvider>
  );
}
