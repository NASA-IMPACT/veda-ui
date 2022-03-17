import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import { media, themeVal, glsp } from '@devseed-ui/theme-provider';

import { ContentBlock, ContentBlockProse } from '$styles/content-block';

import ContentBlockFigure from './figure';

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
`;

const ContentBlockPFAlpha = styled(ContentBlock)`
  ${ContentBlockProse} {
    grid-column: content-start / content-end;

    ${media.largeUp`
      grid-column:  content-start / content-7;
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
  }

  ${ContentBlockFigure} {
    grid-column: content-start / content-end;

    ${media.mediumUp`
      grid-column: content-2 / content-8;
      grid-row: 2;
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
      grid-column:  content-2 / content-6;
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
`;

const ContentBlockPFDelta = styled(ContentBlock)`
  ${ContentBlockProse} {
    grid-column: content-start / content-end;

    ${media.mediumUp`
      grid-column:  content-2 / content-8;
    `}

    ${media.largeUp`
      grid-column:  content-8 / content-12;
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
`;

export const ErrorBlock = styled.div`
  width: 100%;
  color: ${themeVal('color.danger-500')};
  border: 3px solid ${themeVal('color.danger-500')};
  margin-bottom: ${glsp(1)};
  padding: ${glsp(3)};
  font-weight: bold;
`;

const blockType = {
  defaultProse: ContentBlockPAlpha,
  wideProse: ContentBlockPBeta,
  defaultFigure: ContentBlockFAlpha,
  wideFigure: ContentBlockFBeta,
  fullFigure: ContentBlockFGama,
  defaultProseFigure: ContentBlockPFAlpha,
  defaultFigureProse: ContentBlockPFBeta,
  fullProseFigure: ContentBlockPFGama,
  fullFigureProse: ContentBlockPFDelta
};

function BlockComponent(props) {
  const { children, error, type } = props;
  if (error) {
    return (
      <ErrorBlock>
        There is an error in this block: {error.message}
        <ul>
          <li>Did you pass a wrong type name?</li>
          <li>Did you pass more than one caption for one figure?</li>
        </ul>
      </ErrorBlock>
    );
  } else {
    // Concat block type name (default, wide, full)
    // and children component type name (Figure, Prose)
    // to return matching block type
    // ex. <Block type='wide'><Figure /></Block> will result in 'wideFigure'
    const typeName = type ? type : 'default';
    const childrenAsArray = Array.isArray(children) ? children : [children];

    const childrenComponents = childrenAsArray.reduce(
      (acc, curr) => acc + curr.type.displayName,
      ''
    );

    return React.createElement(
      blockType[`${typeName}${childrenComponents}`],
      props
    );
  }
}

BlockComponent.propTypes = {
  type: T.string,
  error: T.bool,
  children: T.node
};

class BlockErrorBoundary extends React.Component {
  static getDerivedStateFromError(error) {
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
    return React.createElement(this.props.childToRender, {
      error: this.state.error,
      clearError: this.clearError,
      ...this.props
    });
  }
}
const BlockWithError = (props) => (
  <BlockErrorBoundary {...props} childToRender={BlockComponent} />
);

export { BlockErrorBoundary };
export default BlockWithError;
