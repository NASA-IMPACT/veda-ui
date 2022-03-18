import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import { Figure } from '$components/common/figure';
import { figureDisplayName, CaptionDisplayName } from './block-constant';
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

const StyledContentBlockFigure = styled(FigureWithError)`
  /* styled-component */
`;
StyledContentBlockFigure.displayName = figureDisplayName;

export default StyledContentBlockFigure;
