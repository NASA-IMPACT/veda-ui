import React, { useState, useEffect, useRef } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import styled, { ThemeProvider } from 'styled-components';
import { GridContainer, Grid } from '@trussworks/react-uswds';
import { mockRawData, mockDatasets } from '../mock-data.js';
import { PluginCommunication } from './plugin-communication.js';
import theme from '$styles/theme';
import { externalDatasetsAtom } from '$components/exploration/atoms/datasetLayers';
// import DataLayerCardPresentational from '$components/exploration/components/datasets/data-layer-card-presentational';
import DataLayerCard from '$components/exploration/components/datasets/data-layer-card';
import { TimelineDataset } from '$components/exploration/types.d.ts';
import useTimelineDatasetAtom from '$components/exploration/hooks/use-timeline-dataset-atom';

export interface colorMapScale {
  min: number;
  max: number;
}

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

export default function DataLayerCardWithAtom() {
  // Initialize external datasets BEFORE accessing timeline datasets to prevent race condition
  const setExternalDatasets = useSetAtom(externalDatasetsAtom);

  // Set external datasets synchronously during component initialization
  React.useMemo(() => {
    setExternalDatasets(mockRawData);
  }, [setExternalDatasets]);

  const [externalDatasets] = useAtom(externalDatasetsAtom);
  const [timelineDatasets, setTimelineDatasets] = useTimelineDatasetAtom();

  useEffect(() => {
    // Only set fallback mock datasets if no timeline datasets exist from URL and external data is ready
    if (timelineDatasets.length === 0 && externalDatasets.length > 0) {
      setTimelineDatasets([...mockDatasets]);
    }
  }, [setTimelineDatasets, timelineDatasets.length, externalDatasets.length]);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [pluginComm, setPluginComm] = useState<PluginCommunication | null>(
    null
  );
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState(0);

  // Listen for messages from iframe (comm-receiver) - parent needs direct event listener, not PluginCommunication
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from the iframe
      if (event.source !== iframeRef.current?.contentWindow) return;

      const data = event.data;
      if (data?.plugin !== 'data-layer-card') return;

      const payload = data.payload;
      console.log('Received message from iframe:', payload);

      // Prevent infinite loops by checking timestamp and message type
      if (
        payload?.timestamp <= lastMessageTimestamp ||
        payload?.type === 'dataset-change-atom'
      ) {
        return;
      }

      // Handle dataset changes from comm-receiver
      if (
        payload?.type === 'dataset-update-from-receiver' &&
        payload?.datasets
      ) {
        console.log(
          'Received dataset update from comm-receiver:',
          payload.datasets
        );
        setTimelineDatasets(payload.datasets);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [lastMessageTimestamp, setTimelineDatasets]);

  // Send message to iframe whenever datasets change
  useEffect(() => {
    if (timelineDatasets.length && iframeRef.current?.contentWindow) {
      const timestamp = Date.now();
      iframeRef.current.contentWindow.postMessage(
        {
          plugin: 'data-layer-card',
          payload: {
            type: 'dataset-change-atom',
            message: `Datasets updated via atoms (${timelineDatasets.length} layers)`,
            timestamp,
            datasets: timelineDatasets
          }
        },
        '*'
      );
      setLastMessageTimestamp(timestamp);
    }
  }, [timelineDatasets, externalDatasets]);

  // Individual dataset card component using atom hooks
  const DatasetCard: React.FC<{
    dataset: TimelineDataset;

    index: number;
  }> = ({ dataset, index }) => {
    return (
      <div
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
          Layer {index + 1} of {timelineDatasets.length} (Atom-based)
        </div>
        <DataLayerCard dataset={dataset} />
      </div>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <HugResetter>
        <GridContainer>
          <Title>Data Layer Card with Atom Hooks Sandbox</Title>

          <div style={{ marginBottom: '2rem' }}>
            <h3>
              Dataset Stack ({timelineDatasets.length} layers) - Using Jotai
              Atoms
            </h3>
            <p style={{ color: '#666', fontSize: '0.9em' }}>
              This version uses Jotai atoms and hooks for state management,
              similar to data-layer-card-container.
            </p>
          </div>

          <Grid row gap={3}>
            <Grid col={6}>
              {timelineDatasets.map((dataset, index) => (
                <DatasetCard
                  key={dataset.data.id}
                  dataset={dataset}
                  index={index}
                />
              ))}
            </Grid>

            <Grid col={6}>
              <StateDisplay
                ref={iframeRef}
                style={{ width: '100%', height: '400px' }}
                src='comm-receiver'
              />
            </Grid>
          </Grid>
        </GridContainer>
      </HugResetter>
    </ThemeProvider>
  );
}
