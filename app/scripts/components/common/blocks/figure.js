import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import { Figure } from '$components/common/figure';
import { CaptionDisplayName } from '$components/discoveries/images';
import { BlockErrorBoundary } from './';

const ContentBlockFigure = (props) => {
  const { children } = props;
  // Figure can be empty
  if (children) {
    const captionChild = children.filter(
      (e) => e.type.displayName === CaptionDisplayName
    );
    if (captionChild.length > 1)
      throw Error('More than one caption for a figure');
  }
  return <Figure {...props} />;
};

ContentBlockFigure.propTypes = {
  children: T.node
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
