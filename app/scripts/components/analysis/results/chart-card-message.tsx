import React, { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import {
  CollecticonChartLine,
  CollecticonCircleXmark
} from '@devseed-ui/collecticons';

import { variableGlsp } from '$styles/variable-utils';

const MessageWrapper = styled.div<{ isError?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column;
  text-align: center;
  padding: ${variableGlsp()};
  gap: ${glsp()};
  aspect-ratio: 16/9;

  ${({ isError }) =>
    isError &&
    css`
      color: ${themeVal('color.danger')};
    `}
`;

export function ChartCardNoData() {
  return (
    <MessageWrapper>
      <CollecticonChartLine size='xlarge' />
      <p>
        There is no data available for this dataset with the given parameters.
      </p>
    </MessageWrapper>
  );
}

export function ChartCardNoMetric() {
  return (
    <MessageWrapper>
      <CollecticonChartLine size='xlarge' />
      <p>There are no metrics selected to display.</p>
    </MessageWrapper>
  );
}

export function ChartCardAlert(props: { message: ReactNode }) {
  return (
    <MessageWrapper isError>
      <CollecticonCircleXmark size='xlarge' />
      <p>
        Chart failed loading:
        <br />
        <small>{props.message}</small>
      </p>
    </MessageWrapper>
  );
}
