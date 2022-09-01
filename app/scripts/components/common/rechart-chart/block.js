import React, { useState, useEffect } from 'react';
import T from 'prop-types';
import { csv } from 'd3-fetch';

import Chart from './';

import { getFData } from './utils';

const BlockChart = function (props) {
  const [chartData, setChartData] = useState([]);
  const [uniqueKeys, setUniqueKeys] = useState([]);
  const { dataPath, idKey, xKey, yKey, dateFormat } = props;

  useEffect(() => {
    const getData = async () => {
      let data = await csv(dataPath);
      const { fData, uniqueKeys } = getFData({
        data,
        xKey,
        idKey,
        yKey,
        dateFormat
      });
      setChartData(fData);
      setUniqueKeys(uniqueKeys);
    };

    getData();
  }, [setChartData, setUniqueKeys, idKey, xKey, yKey, dataPath, dateFormat]);

  return <Chart chartData={chartData} uniqueKeys={uniqueKeys} {...props} />;
};

BlockChart.propTypes = {
  dataPath: T.string,
  idKey: T.string,
  xKey: T.string,
  yKey: T.string,
  xAxisLabel: T.string,
  yAxisLabel: T.string,
  altTitle: T.string,
  altDesc: T.string,
  dateFormat: T.string,
  colors: T.array,
  colorScheme: T.string,
  highlightStart: T.string,
  highlightEnd: T.string,
  highlightLabel: T.string
};

export default BlockChart;
