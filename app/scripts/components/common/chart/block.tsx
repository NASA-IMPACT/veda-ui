import React, { useState, useEffect } from 'react';
import { csv, json, DSVRowArray } from 'd3';

import { getFData } from './utils';
import { fileExtensionRegex } from './constant';
import Chart, { CommonLineChartProps, UniqueKeyUnit } from './';

interface BlockChartProp extends CommonLineChartProps {
  dataPath: string;
  idKey?: string;
  yKey: string;
}

const subIdKey = 'subIdeKey';

export default function BlockChart(props: BlockChartProp) {
  const { dataPath, idKey, xKey, yKey, dateFormat } = props;

  const [chartData, setChartData] = useState<object[]>([]);
  const [uniqueKeys, setUniqueKeys] = useState<UniqueKeyUnit[]>([]);

  const newDataPath = dataPath.split('?')[0];
  const extension = fileExtensionRegex.exec(newDataPath)[1];

  useEffect(() => {
    const getData = async () => {

      const data =
      extension === 'csv'
        ? (await csv(dataPath)) as DSVRowArray
        : (await json(dataPath)) as unknown as object[];


      if (data) {
        const dataToUse = idKey? data: data.map(e => ({...e, [subIdKey]: ''}));
        const { fData, uniqueKeys } = getFData({
          data: dataToUse,
          xKey,
          idKey: idKey? idKey: subIdKey,
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
      } else {
        throw Error('Something went wrong with chart data.');
      }
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
      {...props}
      chartData={chartData}
      uniqueKeys={uniqueKeys}
      renderLegend={true}
    />
  );
}
