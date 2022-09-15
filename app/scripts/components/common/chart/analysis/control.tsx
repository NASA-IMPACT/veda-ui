import React from 'react';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

import { LegendWrapper, LegendItem } from '$components/common/chart/legend';
import { ListItem } from '$components/common/chart/tooltip';

const ClickableLegendItem = styled(LegendItem)`
  cursor: pointer;
`;

interface AnalysisLegendComponentProps {}

export const AnalysisLegendComponent = (props) => {
  const { payload, width } = props;

  if (payload) {
    return (
      <LegendWrapper width={width}>
        {payload.map((entry) => (
          <ClickableLegendItem
            key={`item-${entry.value}`}
            onClick={(e) => {
              e.preventDefault();
              entry.onClick(entry.value);
            }}
          >
            <ListItem color={entry.color} />
            {entry.label}
          </ClickableLegendItem>
        ))}
      </LegendWrapper>
    );
  }
  return null;
};
