import React, { useState, useEffect } from 'react';
import { csv, json } from 'd3-fetch';

import { getFData } from './utils';
import { fileExtensionRegex } from './constant';
import Chart, { UniqueKeyUnit, CommonLineChartProps } from './';

interface BlockChartProp extends CommonLineChartProps {
  dataPath: string;
  idKey: string;
  yKey: string;
}

export default function BlockChart(props: BlockChartProp) {
  const { dataPath, idKey, xKey, yKey, dateFormat } = props;

  const [chartData, setChartData] = useState<object[]>([]);
  const [uniqueKeys, setUniqueKeys] = useState<UniqueKeyUnits[]>([]);

  const newDataPath = dataPath.split('?')[0];
  const extension = fileExtensionRegex.exec(newDataPath)[1];

  useEffect(() => {
    const getData = async () => {
      const data =
        extension === 'csv' ? await csv(dataPath) : await json(dataPath);

      const { fData, uniqueKeys } = getFData({
        data,
        xKey,
        idKey,
        yKey,
        dateFormat
      });

      const formattedUniqueKeys = uniqueKeys.map((e) => ({
        label: e,
        value: e,
        active: true
      }));

      setChartData(fData);
      setUniqueKeys(formattedUniqueKeys);
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

  return (
    <Chart
      chartData={chartData}
      uniqueKeys={uniqueKeys}
      renderLegend={true}
      {...props}
    />
  );
}
