import React, { useState, useEffect } from 'react';
import T from 'prop-types';
import { csv, json } from 'd3-fetch';

import Chart from './';

import { getFData } from './utils';
import { fileExtensionRegex } from './constant';

const BlockChart = function (props) {
  const { dataPath, idKey, xKey, yKey, dateFormat } = props;

  const [chartData, setChartData] = useState([]);
  const [uniqueKeys, setUniqueKeys] = useState([]);

  const newDataPath = dataPath.split('?')[0];
  const extension = fileExtensionRegex.exec(newDataPath)[1];

  useEffect(() => {
    const getData = async () => {
      let data;
      if (extension === 'csv') data = await csv(dataPath);
      else data = await json(dataPath);

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
  }, [
    setChartData,
    setUniqueKeys,
    extension,
    idKey,
    xKey,
    yKey,
    dataPath,
    dateFormat
  ]);

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
