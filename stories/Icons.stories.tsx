import React from 'react';
import styled from 'styled-components';
import { DevseedUiThemeProvider } from '@devseed-ui/theme-provider';
import themeOverrides from '../app/scripts/styles/theme';

import { CollecticonCalendarMinus } from '../app/scripts/components/common/icons/calendar-minus';

const IconGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  padding: 2rem;
`;

const IconCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const IconName = styled.h3`
  margin: 0.5rem 0 0 0;
  font-size: 0.875rem;
  color: #666;
  text-align: center;
  font-weight: 500;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: inherit;
`;

export default {
  title: 'Components/Icons',
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
};

export const CalendarMinus = {
  render: () => (
    // @ts-expect-error: DevseedUiThemeProvider typing is incomplete but works at runtime
    <DevseedUiThemeProvider theme={themeOverrides()}>
      <IconGrid>
        <IconCard>
          <IconWrapper>
            <CollecticonCalendarMinus />
          </IconWrapper>
          <IconName>Calendar Minus</IconName>
        </IconCard>
      </IconGrid>
    </DevseedUiThemeProvider>
  )
};
