import React, { useState, useCallback, useEffect } from 'react';
import { GridContainer, Grid, Button } from '@trussworks/react-uswds';
import { PluginCommunication } from './plugin-communication.js';
import Map from './map';

interface ReceivedData {
  message?: string;
  timestamp?: number;
  type?: string;
  data?: any;
}
const mockSelectedDay = new Date('2017-12-01T00:00:00.000Z');
const CommunicationReceiver: React.FC = () => {
  const [receivedData, setReceivedData] = useState<ReceivedData | null>(null);
  const [pluginComm, setPluginComm] = useState<PluginCommunication | null>(
    null
  );

  const setDatasets = useCallback((datasets) => {
    setReceivedData((prev) => ({
      ...prev,
      data: {
        datasets
      }
    }));
  }, []);

  useEffect(() => {
    const handleMessage = (payload: any) => {
      const newData: ReceivedData = {
        message: payload.message || 'No message',
        timestamp: Date.now(),
        type: payload.type || 'unknown',
        data: payload
      };
      // eslint-disable-next-line no-console
      console.log('got it');
      console.log(newData);
      setReceivedData(newData);
    };

    const communication = new PluginCommunication(
      'data-layer-card',
      handleMessage
    );
    communication.init();
    setPluginComm(communication);

    return () => {
      communication.destroy();
    };
  }, []);

  const clearData = () => {
    setReceivedData(null);
  };

  return (
    <GridContainer>
      <Grid row className='margin-bottom-5'>
        <Grid col={12}>
          <h3>Communication Receiver</h3>
          <Grid row gap='md'>
            <Grid col={12}>
              <Button type='button' onClick={clearData}>
                Clear Data
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid row className='margin-bottom-5'>
        <Grid col={12} style={{ height: '400px' }}>
          <h4>Map Visualization</h4>
          <Map
            datasets={receivedData?.data.datasets ?? []}
            setDatasets={setDatasets}
            selectedDay={mockSelectedDay}
          />
        </Grid>
      </Grid>

      <Grid row className='margin-bottom-5'>
        <Grid col={12}>
          <div
            style={{
              minHeight: '200px',
              overflowY: 'auto',
              maxHeight: '400px'
            }}
          >
            {receivedData === null ? (
              <p>No data received yet...</p>
            ) : (
              <Grid row gap='sm'>
                <Grid col={12} tablet={{ col: 4 }}>
                  <div>
                    <strong>Type:</strong> {receivedData.type}
                  </div>
                </Grid>
                <Grid col={12} tablet={{ col: 8 }}>
                  <div>
                    <strong>Message:</strong> {receivedData.message}
                  </div>
                </Grid>
                <Grid col={12}>
                  <div>
                    <strong>Timestamp:</strong>{' '}
                    {new Date(receivedData.timestamp || 0).toLocaleTimeString()}
                  </div>
                </Grid>
                <Grid col={12}>
                  <details>
                    <summary>Raw Data</summary>
                    <pre style={{ fontSize: '12px', marginTop: '5px' }}>
                      {JSON.stringify(receivedData.data, null, 2)}
                    </pre>
                  </details>
                </Grid>
              </Grid>
            )}
          </div>
        </Grid>
      </Grid>
    </GridContainer>
  );
};

export default CommunicationReceiver;
