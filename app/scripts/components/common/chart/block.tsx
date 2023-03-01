import React, { useState, useEffect } from 'react';
import { csv, json, DSVRowArray } from 'd3';

import { FormattedTimeSeriesData, getFData } from './utils';
import { fileExtensionRegex } from './constant';
import Chart, { CommonLineChartProps, UniqueKeyUnit } from '.';

import { BlockErrorBoundary } from '$components/common/blocks';
import useAsyncError from '$utils/use-async-error';
interface BlockChartProp extends CommonLineChartProps {
  dataPath: string;
  idKey?: string;
  xKey: string;
  yKey: string;
}

const subIdKey = 'subIdeKey';

function BlockChart(props: BlockChartProp) {
  const { dataPath, idKey, xKey, yKey, dateFormat } = props;

  const [chartData, setChartData] = useState<FormattedTimeSeriesData[]>([]);
  const [uniqueKeys, setUniqueKeys] = useState<UniqueKeyUnit[]>([]);

  const newDataPath = dataPath.split('?')[0];
  const extension = fileExtensionRegex.exec(newDataPath)[1];

  const throwAsyncError = useAsyncError();

  useEffect(() => {
    const getData = async () => {
      try {
      const data =
      extension === 'csv'
        ? (await csv(dataPath)) as DSVRowArray
        : (await json(dataPath).then(d => [d].flat())) as object[];
      
        // if no idKey is provided (when there are only two columns in the data), sub it with empty data
        const dataToUse = idKey? data: data.map(e => ({...e, [subIdKey]: ''}));
        
        const { fData, uniqueKeys } = getFData({  
          data: dataToUse,
          idKey: idKey? idKey: subIdKey,
          xKey,
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
      } catch(e) {
        throwAsyncError(e);
      }
      
    };

    getData();
  }, [
    setChartData,
    setUniqueKeys,
    throwAsyncError,
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


export default function ChartBlock(props) {
  return <BlockErrorBoundary {...props} childToRender={BlockChart} />;
}
