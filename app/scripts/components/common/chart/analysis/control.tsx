import React from 'react';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';

import { LegendWrapper, LegendItem } from '$components/common/chart/legend';
import { ListItem } from '$components/common/chart/tooltip';

interface LegendEntryUnit {
  label: string;
  color: string;
  value: string;
  active: boolean;
  onClick: (arg: string) => void;
}

interface AnalysisLegendComponentProps {
  payload?: LegendEntryUnit[];
}

const ClickableLegendItem = styled(LegendItem)`
  cursor: pointer;
`;

const TogglableListItem = styled(ListItem)<{ active: boolean; color: string }>`
  background-color: ${({ active, color }) =>
    active ? color : themeVal('color.base-400')};
`;

export const AnalysisLegendComponent = (
  props: AnalysisLegendComponentProps
) => {
  const { payload } = props;

  if (payload) {
    return (
      <LegendWrapper>
        {payload.map((entry) => (
          <ClickableLegendItem
            key={`item-${entry.value}`}
            onClick={(event) => {
              event.preventDefault();
              entry.onClick(entry.value);
            }}
          >
            <TogglableListItem color={entry.color} active={entry.active} />
            {entry.label}
          </ClickableLegendItem>
        ))}
      </LegendWrapper>
    );
  }
  return null;
};
