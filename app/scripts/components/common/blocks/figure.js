import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import { figureDisplayName, captionDisplayName } from './block-constant';
import { BlockErrorBoundary } from '.';
import { Figure } from '$components/common/figure';

const ContentBlockFigure = (props) => {
  const { children } = props;
  // Figure can be empty
  if (children && children.length) {
    const captionChild = children.filter(
      (e) => e.type.displayName === captionDisplayName
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
  img {
    width: 100%;
  }
`;
StyledContentBlockFigure.displayName = figureDisplayName;

export default StyledContentBlockFigure;
