import React, { useState, useCallback, useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import styled, { ThemeProvider } from 'styled-components';
import { GridContainer, Grid } from '@trussworks/react-uswds';

import { mockDatasets } from './mock-data';
import DataLayerCardOptionsMenu from '$components/common/dataset-layer-card/layer-options-menu';
import { ExplorationMap } from '$components/exploration/components/map';
import ReactQueryProvider from '$context/react-query';

const DataLayerCardOptionMenuExample: React.FC = () => {
  return (
    <>
      {mockDatasets.map((dataset) => (
        <div
          key={dataset.data.id}
          style={{
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            padding: '0.5rem',
            background: 'white'
          }}
        >
          <DataLayerCardOptionsMenu
            dataset={dataset}
            opacity={1.0}
            canMoveUp={true}
            canMoveDown={true}
            onRemoveLayer={() => {}}
            onMoveUp={() => {}}
            onMoveDown={() => {}}
            onOpacityChange={() => {}}
          />
        </div>
      ))}
    </>
  );
};

const HugResetter = styled.div`
  /* To break hug */
`;

const Title = styled.h1`
  margin-bottom: 2rem;
  color: #333;
`;

const mockSelectedDay = new Date('2017-12-01T00:00:00.000Z');
const theme = {};

const DataLayerCardOptionMenuHooked: React.FC = () => {
  const [datasets, setDatasets] = useState(mockDatasets);
  const [lastAction, setLastAction] = useState('');

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

  const handlers = useMemo(() => {
    return datasets.map((_, index) => ({
      onRemoveLayer: createRemoveLayerHandler(index),
      onMoveUp: createMoveUpHandler(index),
      onMoveDown: createMoveDownHandler(index),
      onOpacityChange: createOpacityHandler(index)
    }));
  }, [
    datasets.length,
    createRemoveLayerHandler,
    createMoveUpHandler,
    createMoveDownHandler,
    createOpacityHandler
  ]);

  return (
    <ThemeProvider theme={theme}>
      <HugResetter>
        <GridContainer>
          <Title>Layer Options Menu with Interactive Map</Title>

          <div style={{ marginBottom: '2rem' }}>
            <h3>Layer Options Menu - Hooked ({datasets.length} layers)</h3>
            <p style={{ color: '#666', fontSize: '0.9em' }}>
              Interactive layer options menu with functional handlers for
              editing layers. Changes are reflected on the map in real-time.
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

          <Grid row gap={3} style={{ height: '400px' }}>
            <Grid col={6}>
              <h4>Layer Controls</h4>
              {datasets.map((dataset, index) => (
                <div
                  key={dataset.data.id}
                  style={{
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    background: 'white',
                    marginBottom: '1rem'
                  }}
                >
                  <h4> {dataset.data.name} </h4>
                  <p>{dataset.data.description} </p>
                  <div style={{ display: 'flex' }}>
                    <p>
                      <strong>Click three dots to see options</strong>
                    </p>
                    <DataLayerCardOptionsMenu
                      dataset={dataset}
                      opacity={dataset.settings.opacity}
                      canMoveUp={index > 0}
                      canMoveDown={index < datasets.length - 1}
                      onRemoveLayer={handlers[index]?.onRemoveLayer}
                      onMoveUp={handlers[index]?.onMoveUp}
                      onMoveDown={handlers[index]?.onMoveDown}
                      onOpacityChange={handlers[index]?.onOpacityChange}
                    />
                  </div>
                </div>
              ))}
            </Grid>

            <Grid col={6}>
              <h4>Interactive Map</h4>
              <ReactQueryProvider>
                <ExplorationMap
                  datasets={datasets}
                  setDatasets={setDatasets}
                  selectedDay={mockSelectedDay}
                  selectedCompareDay={null}
                />
              </ReactQueryProvider>
            </Grid>
          </Grid>
        </GridContainer>
      </HugResetter>
    </ThemeProvider>
  );
};
const meta: Meta<typeof DataLayerCardOptionMenuExample> = {
  title: 'Library Components/Data Layers/Card Options Menu',
  component: DataLayerCardOptionMenuExample,
  parameters: {
    layout: 'fullscreen'
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof DataLayerCardOptionMenuExample>;

export const Default: Story = {
  render: () => <DataLayerCardOptionMenuExample />
};

export const HookedWithMap: Story = {
  render: () => <DataLayerCardOptionMenuHooked />
};
