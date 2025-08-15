import React, { useState, useEffect } from 'react';
import { PluginCommunication } from './plugin-communication.js';

interface ReceivedData {
  message?: string;
  timestamp?: number;
  type?: string;
  data?: any;
}

const CommunicationReceiver: React.FC = () => {
  const [receivedData, setReceivedData] = useState<ReceivedData | null>(null);
  const [pluginComm, setPluginComm] = useState<PluginCommunication | null>(
    null
  );

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
    <div
      style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}
    >
      <h3>Communication Receiver</h3>

      <div style={{ marginBottom: '10px' }}>
        <button type='button' onClick={clearData}>
          Clear Data
        </button>
      </div>

      <div
        style={{
          minHeight: '200px',
          border: '1px solid #ddd',
          padding: '10px',
          backgroundColor: '#f9f9f9',
          overflowY: 'auto',
          maxHeight: '400px'
        }}
      >
        <h4>Received Data:</h4>
        {receivedData === null ? (
          <p>No data received yet...</p>
        ) : (
          <div
            style={{
              marginBottom: '10px',
              padding: '8px',
              border: '1px solid #eee',
              backgroundColor: 'white',
              borderRadius: '4px'
            }}
          >
            <div>
              <strong>Type:</strong> {receivedData.type}
            </div>
            <div>
              <strong>Message:</strong> {receivedData.message}
            </div>
            <div>
              <strong>Timestamp:</strong>{' '}
              {new Date(receivedData.timestamp || 0).toLocaleTimeString()}
            </div>
            <details>
              <summary>Raw Data</summary>
              <pre style={{ fontSize: '12px', marginTop: '5px' }}>
                {JSON.stringify(receivedData.data, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunicationReceiver;
