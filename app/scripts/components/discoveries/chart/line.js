import React, { useEffect, useState } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { csv, json } from 'd3-fetch';
import { ResponsiveLine } from '@nivo/line';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import {
  fileExtensionRegex,
  legendConfig,
  getFormattedData,
  getBottomAxis,
  getColors
} from './utils';

const TooltipWrapper = styled.div`
  background-color: ${themeVal('color.surface')};
  border: 1px solid ${themeVal('color.base-300a')};
  padding: ${glsp(0.5)};
  > div:not(:last-child) {
    padding-bottom: ${glsp(0.25)};
  }
`;

const TooltipItem = styled.div`
  width: 12px;
  height: 12px;
  background-color: ${(props) => props.color};
  display: inline-block;
  margin-right: ${glsp(0.5)};
`;

const LineChart = ({
  dataPath,
  idKey,
  xKey,
  yKey,
  dateFormat,
  customLayerComponent
}) => {
  const [data, setData] = useState([]);
  const extension = fileExtensionRegex.exec(dataPath)[1];

  useEffect(() => {
    const getData = async () => {
      let data;
      if (extension === 'csv') data = await csv(dataPath);
      else data = await json(dataPath);
      const formattedData = getFormattedData({
        data,
        extension,
        idKey,
        xKey,
        yKey
      });
      setData(formattedData);
    };
    getData();
  }, [dataPath, idKey, xKey, yKey, extension]);
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ResponsiveLine
        data={data}
        animate={true}
        enableCrosshair={true}
        crosshairType='x'
        margin={{ top: 50, right: 100, bottom: 50, left: 60 }}
        xScale={{
          type: 'time',
          format: dateFormat,
          precision: 'day'
        }}
        colors={getColors(data.length)}
        xFormat={`time:${dateFormat}`}
        yScale={{
          type: 'linear',
          min: 'auto',
          max: 'auto',
          stacked: true,
          reverse: false
        }}
        enableGridX={false}
        enablePoints={false}
        enableSlices='x'
        axisBottom={getBottomAxis(dateFormat)}
        legends={legendConfig}
        layers={[
          'grid',
          'markers',
          'areas',
          customLayerComponent,
          'lines',
          'crosshair',
          'slices',
          'axes',
          'points',
          'legends'
        ]}
        sliceTooltip={({ slice }) => {
          return (
            <TooltipWrapper>
              <div>
                <strong>{slice?.points[0].data.xFormatted}</strong>
              </div>
              {slice.points.map((point) => (
                <div key={point.id}>
                  <TooltipItem color={point.serieColor} />
                  <strong>{point.serieId}</strong> : {point.data.yFormatted}
                </div>
              ))}
            </TooltipWrapper>
          );
        }}
      />
    </div>
  );
};

LineChart.propTypes = {
  dataPath: T.string,
  idKey: T.string,
  xKey: T.string,
  yKey: T.string,
  dateFormat: T.string,
  customLayerComponent: T.func
};

export default LineChart;
