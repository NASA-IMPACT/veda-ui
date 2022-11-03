import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import { media } from '@devseed-ui/theme-provider';

import { FigcaptionInner } from '../figure';
import {
  defaultBlockName,
  wideBlockName,
  fullBlockName,
  generalErrorMessage,
  blockTypeErrorMessage,
  contentTypeErrorMessage,
  figureDisplayName,
  proseDisplayName
} from './block-constant';
import ContentBlockFigure from './figure';
import { ContentBlock, ContentBlockProse } from '$styles/content-block';

import { variableGlsp } from '$styles/variable-utils';
import { HintedErrorDisplay } from '$utils/hinted-error';

export const ContentBlockPAlpha = styled(ContentBlock)`
  ${ContentBlockProse} {
    grid-column: content-start / content-end;

    ${media.largeUp`
      grid-column:  content-3 / content-11;
    `}
  }
`;

const ContentBlockPBeta = styled(ContentBlock)`
  ${ContentBlockProse} {
    grid-column: content-start / content-end;

    ${media.mediumUp`
      column-count: 2;
    `}
  }
`;

const ContentBlockFAlpha = styled(ContentBlock)`
  ${ContentBlockFigure} {
    grid-column: content-start / content-end;

    ${media.largeUp`
      grid-column:  content-3 / content-11;
    `}
  }
`;

const ContentBlockFBeta = styled(ContentBlock)`
  ${ContentBlockFigure} {
    grid-column: content-start / content-end;
  }
`;

const ContentBlockFGama = styled(ContentBlock)`
  ${ContentBlockFigure} {
    grid-column: full-start / full-end;
  }

  ${FigcaptionInner} {
    padding: ${variableGlsp(0.5, 1, 0, 1)};
  }
`;

const ContentBlockPFAlpha = styled(ContentBlock)`
  ${ContentBlockProse} {
    grid-column: content-start / content-end;

    ${media.largeUp`
      grid-column:  content-start / content-7;
    `}

    ${media.xlargeUp`
      grid-column:  content-start / content-6;
    `}
  }

  ${ContentBlockFigure} {
    grid-column: content-start / content-end;
    grid-row: 2;

    ${media.mediumUp`
      grid-column: content-2 / content-8;
    `}

    ${media.largeUp`
      grid-column: content-7 / content-end;
      grid-row: 1;
    `}
  }
`;

const ContentBlockPFBeta = styled(ContentBlock)`
  ${ContentBlockProse} {
    grid-column: content-start / content-end;

    ${media.largeUp`
      grid-column: content-7 / content-end;
    `}

    ${media.xlargeUp`
      grid-column: content-8 / content-end;
    `}
  }

  ${ContentBlockFigure} {
    grid-column: content-start / content-end;
    grid-row: 2;

    ${media.mediumUp`
      grid-column: content-2 / content-8;
    `}

    ${media.largeUp`
      grid-column:  content-start / content-7;
      grid-row: 1;
    `}
  }
`;

const ContentBlockPFGama = styled(ContentBlock)`
  ${ContentBlockProse} {
    grid-column: content-start / content-end;

    ${media.mediumUp`
      grid-column:  content-2 / content-8;
    `}

    ${media.largeUp`
      grid-column:  content-start / content-7;
    `}

    ${media.xlargeUp`
      grid-column:  content-start / content-6;
    `}
  }

  ${ContentBlockFigure} {
    grid-column: content-start / full-end;
    grid-row: 2;

    ${media.smallUp`
      grid-column: content-2 / full-end;
    `}

    ${media.mediumUp`
      grid-column: content-3 / full-end;
    `}

    ${media.largeUp`
      grid-column: content-7 / full-end;
      grid-row: 1;
    `}
  }

  ${FigcaptionInner} {
    padding: ${variableGlsp(0.5, 1, 0, 1)};
  }
`;

const ContentBlockPFDelta = styled(ContentBlock)`
  ${ContentBlockProse} {
    grid-column: content-start / content-end;

    ${media.mediumUp`
      grid-column:  content-2 / content-8;
    `}

    ${media.largeUp`
      grid-column:  content-7 / content-end;
    `}

    ${media.xlargeUp`
      grid-column:  content-8 / content-end;
    `}
  }

  ${ContentBlockFigure} {
    grid-column: full-start / content-end;
    grid-row: 2;

    ${media.smallUp`
      grid-column: full-start / content-4;
    `}

    ${media.mediumUp`
      grid-column: full-start / content-7;
    `}

    ${media.largeUp`
      grid-row: 1;
    `}
  }

  ${FigcaptionInner} {
    padding: ${variableGlsp(0.5, 1, 0, 1)};
  }
`;

// This will result an object like below
// { defaultProse: ContentBlockPAlpha,
// wideProse: ContentBlockPBeta,
// defaultFigure; ContentBlockFAlpha,
// ...
// fullProseFigure: ContentBlockPFGama
// fullFigureProse: ContentBlockPFDelta }
const matchingBlocks = {
  [`${defaultBlockName}${proseDisplayName}`]: ContentBlockPAlpha,
  [`${wideBlockName}${proseDisplayName}`]: ContentBlockPBeta,
  [`${defaultBlockName}${figureDisplayName}`]: ContentBlockFAlpha,
  [`${wideBlockName}${figureDisplayName}`]: ContentBlockFBeta,
  [`${fullBlockName}${figureDisplayName}`]: ContentBlockFGama,
  [`${defaultBlockName}${proseDisplayName}${figureDisplayName}`]:
    ContentBlockPFAlpha,
  [`${defaultBlockName}${figureDisplayName}${proseDisplayName}`]:
    ContentBlockPFBeta,
  [`${fullBlockName}${proseDisplayName}${figureDisplayName}`]:
    ContentBlockPFGama,
  [`${fullBlockName}${figureDisplayName}${proseDisplayName}`]:
    ContentBlockPFDelta
};

function BlockComponent(props) {
  const { children, type } = props;

  // Concat block type name (default, wide, full)
  // and children component type name (Figure, Prose)
  // to return matching block type
  // ex. <Block type='wide'><Figure /></Block> will result in 'wideFigure'
  const typeName = type ? type : 'default';
  const childrenAsArray = React.Children.toArray(children);

  const childrenComponents = childrenAsArray.reduce(
    (acc, curr) => acc + curr.type.displayName,
    ''
  );

  if (![defaultBlockName, wideBlockName, fullBlockName].includes(typeName)) {
    throw Error(`${blockTypeErrorMessage} '${typeName}'`);
  }

  if (!matchingBlocks[`${typeName}${childrenComponents}`]) {
    throw Error(contentTypeErrorMessage);
  }

  return React.createElement(
    matchingBlocks[`${typeName}${childrenComponents}`],
    props
  );
}

BlockComponent.propTypes = {
  type: T.string,
  children: T.node
};

export class BlockErrorBoundary extends React.Component {
  static getDerivedStateFromError(error) {
    error.CRAOverlayIgnore = true;
    return { error: error };
  }

  constructor(props) {
    super(props);
    this.state = { error: null };
    this.clearError = this.clearError.bind(this);
  }

  clearError() {
    this.setState({ error: null });
  }

  render() {
    const { error } = this.state;
    const { childToRender: Block, passErrorToChild, ...rest } = this.props;

    if (error && !passErrorToChild) {
      return (
        <HintedErrorDisplay
          title={generalErrorMessage}
          message={error.message}
          className={rest.className}
          hints={error.hints}
        />
      );
    }

    return <Block error={error} clearError={this.clearError} {...rest} />;
  }
}

BlockErrorBoundary.propTypes = {
  // Let the block handle the error instead of the Boundary.
  passErrorToChild: T.bool,
  childToRender: T.elementType
};

const BlockWithError = (props) => (
  <BlockErrorBoundary {...props} childToRender={BlockComponent} />
);

export default BlockWithError;
