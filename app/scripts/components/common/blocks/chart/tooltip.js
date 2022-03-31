import React from 'react';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

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

const TooltipItem = styled.div`
  width: 12px;
  height: 12px;
  background-color: ${(props) => props.color};
  display: inline-block;
  margin-right: ${glsp(0.5)};
`;

const TooltipComponent = ({ slice }) => {
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
};

export default TooltipComponent;
