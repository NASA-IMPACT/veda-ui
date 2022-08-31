import React from 'react';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { ListItem } from './tooltip';

const LegendWrapper = styled.ul`
  max-width: ${(props) => props.width};
  margin: 0 auto;
  margin-top: ${glsp(0.6)};
  text-align: center;
`;

const LegendItem = styled.li`
  display: inline-flex;
  list-style: none;
  margin-right: ${glsp(0.25)};
  font-size: 0.75rem;
  color: ${themeVal('color.base-400')};
  * {
    align-self: center;
  }
`;

const LegendComponent = (props) => {
  const { payload, width } = props;
  return (
    <LegendWrapper width={width}>
      {payload.map((entry, index) => (
        <LegendItem key={`item-${index}`}>
          <ListItem color={entry.color} />
          {entry.value}
        </LegendItem>
      ))}
    </LegendWrapper>
  );
};
export default LegendComponent;
