import React, { useEffect, useState } from 'react';
import { csv } from 'd3-fetch';
import { ResponsiveLineCanvas } from '@nivo/line';

const Chart = ({ dataPath }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const getData = async () => {
      const data = await csv(dataPath);
      const dataWId = data.reduce((acc, curr) => {
        if (!acc.find((e) => e.id === curr.County)) {
          const newEntry = {
            id: curr.County,
            data: []
          };
          acc.push(newEntry);
        }
        acc
          .find((e) => e.id === curr.County)
          .data.push({
            x: curr['Test Date'],
            y: curr['New Positives']
          });
        return acc;
      }, []);
      setData(dataWId);
    };
    getData();
  }, [dataPath]);
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ResponsiveLineCanvas
        data={data}
        margin={{ top: 50, right: 10, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: 'auto',
          max: 'auto',
          stacked: true,
          reverse: false
        }}
      />
    </div>
  );
};

export default Chart;
