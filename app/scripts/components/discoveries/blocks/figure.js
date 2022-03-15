import React from 'react';
import styled from 'styled-components';
import { Figure } from '$components/common/figure';
import { CaptionDisplayName } from '$components/discoveries/images';
import { BlockErrorBoundary } from './';

const ContentBlockFigure = (props) => {
  const { children } = props;
  const captionChild = children.filter(
    (e) => e.type.displayName === CaptionDisplayName
  );
  if (captionChild.length > 1) throw Error;

  return <Figure {...props} />;
};

const FigureWithError = (props) => (
  <BlockErrorBoundary {...props} childToRender={ContentBlockFigure} />
);

export const figureDisplayName = 'Figure';
const StyledContentBlockFigure = styled(FigureWithError)`
  /* styled-component */
`;
StyledContentBlockFigure.displayName = figureDisplayName;

export default StyledContentBlockFigure;
