import React, { useEffect, useState } from 'react';
import T from 'prop-types';
import { csv, json } from 'd3-fetch';
import { ResponsiveLineCanvas } from '@nivo/line';

const fileExtensionRegex = /(?:\.([^.]+))?$/;
function formatData({ data, idKey, xKey, yKey }) {
  const dataWId = data.reduce((acc, curr) => {
    if (!acc.find((e) => e.id === curr.County)) {
      const newEntry = {
        id: curr[idKey],
        data: []
      };
      acc.push(newEntry);
    }
    acc
      .find((e) => e.id === curr.County)
      .data.push({
        x: curr[xKey],
        y: curr[yKey]
      });
    return acc;
  }, []);
  return dataWId;
}

const Chart = ({ dataPath, idKey, xKey, yKey }) => {
  const [data, setData] = useState([]);
  const extension = fileExtensionRegex.exec(dataPath)[1];

  useEffect(() => {
    const getData = async () => {
      let data;
      if (extension === 'csv') data = await csv(dataPath);
      else data = await json(dataPath);
      const formattedData = formatData({ data, extension, idKey, xKey, yKey });
      setData(formattedData);
    };
    getData();
  }, [dataPath, idKey, xKey, yKey, extension]);
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
        enableGridX={false}
      />
    </div>
  );
};

Chart.propTypes = {
  dataPath: T.string,
  idKey: T.string,
  xKey: T.string,
  yKey: T.string
};

export default Chart;
