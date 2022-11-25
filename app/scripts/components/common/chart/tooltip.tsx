import React from 'react';
import styled from 'styled-components';
import { TooltipProps } from 'recharts';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

import { timeFormatter, getNumForChart } from './utils';
import { UniqueKeyUnit } from '.';

interface TooltipComponentProps extends TooltipProps<number, string> {
  dateFormat: string;
  uniqueKeys: UniqueKeyUnit[];
}

const TooltipWrapper = styled.div`
  background-color: ${themeVal('color.surface')};
  border: 1px solid ${themeVal('color.base-300a')};
  padding: ${glsp(0.5)};
  border-radius: ${themeVal('shape.rounded')};
  font-size: 0.75rem;

  > div:not(:last-child) {
    padding-bottom: ${glsp(0.25)};
  }
`;

export const ListItem = styled.div`
  width: 12px;
  height: 12px;
  background-color: ${(props) => props.color};
  display: inline-block;
  margin-right: ${glsp(0.2)};
`;

const TooltipItem = styled(ListItem)`
  margin-right: ${glsp(0.5)};
`;

export default function TooltipComponent(props: TooltipComponentProps) {
  const { dateFormat, uniqueKeys, active, payload, label } =
    props;
  
  const inactiveKeys = uniqueKeys.filter((e) => !e.active).map((e) => e.label);
  if (active && payload && payload.length) {
    return (
      <TooltipWrapper>
        <div>
          <strong>{timeFormatter(label, dateFormat)}</strong>
        </div>
        {uniqueKeys
          .filter((key) =>!inactiveKeys.includes(key.label))
          .map((key) => {
            const point = payload[0].payload[key.label];
            return (
              <div key={`${key.label}-key`}>
                <TooltipItem color={key.color} />
                <strong>{key.label}</strong> {!!key.label.length && ":" }{getNumForChart(point)}
              </div>
            );
          })}
      </TooltipWrapper>
    );
  }

  return null;
}
