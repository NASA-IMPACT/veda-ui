import React from 'react';
import styled from 'styled-components';
import { TooltipProps } from 'recharts/types';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

import { UniqueKeyUnit } from './';
import { dateFormatter } from './utils';

interface TooltipComponentProps extends TooltipProps<number, string> {
  colors: string[];
  dateFormat: string;
  uniqueKeys: UniqueKeyUnit[];
  xKey: string;
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
  const { colors, dateFormat, xKey, uniqueKeys, active, payload, label } =
    props;
  const inactiveKeys = uniqueKeys.filter((e) => !e.active).map((e) => e.label);
  if (active && payload && payload.length) {
    return (
      <TooltipWrapper>
        <div>
          <strong>{dateFormatter(label, dateFormat)}</strong>
        </div>
        {Object.keys(payload[0].payload)
          .filter((key) => key !== xKey && !inactiveKeys.includes(key))
          .map((key, idx) => {
            const point = payload[0].payload[key];
            return (
              <div key={`${key}`}>
                <TooltipItem color={colors[idx]} />
                <strong>{key}</strong> :{point}
              </div>
            );
          })}
      </TooltipWrapper>
    );
  }

  return null;
}
