import React from 'react';
import { Brush, LineChart, Line } from 'recharts';
import { UniqueKeyUnit } from './';
import { dateFormatter } from './utils';
import { brushHeight } from './constant';

// Recharts has problem rendering composed components in React
// so we are using the function returns the  component with desired props/data instead of making this into a component
// Details: https://github.com/recharts/recharts/issues/412

interface BrushParam {
  chartData: object[];
  xKey: string;
  uniqueKeys: UniqueKeyUnit[];
  lineColors: string[];
  dateFormat: string;
}

export default function renderBrushComponent(param: BrushParam) {
  const { chartData, xKey, uniqueKeys, lineColors, dateFormat } = param;
  return (
    <Brush
      data={chartData}
      dataKey={xKey}
      height={brushHeight}
      tickFormatter={(t) => dateFormatter(t, dateFormat)}
    >
      <LineChart data={chartData}>
        {uniqueKeys.map((k, idx) => {
          return (
            <Line
              type='linear'
              isAnimationActive={false}
              dot={false}
              activeDot={false}
              key={`${k.value}-line-brush`}
              dataKey={k.label}
              strokeWidth={0.5}
              stroke={k.active ? lineColors[idx] : 'transparent'}
            />
          );
        })}
      </LineChart>
    </Brush>
  );
}
