import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import { media, themeVal, glsp } from '@devseed-ui/theme-provider';

import {
  ContentBlock,
  ContentBlockProse,
  ContentBlockFigure
} from '$styles/content-block';

export const ContentBlockPAlpha = styled(ContentBlock)`
  ${ContentBlockProse} {
    grid-column: content-start / content-end;

    ${media.largeUp`
      grid-column:  content-3 / content-11;
    `}
  }
`;

const ErrorBlock = styled(ContentBlockPAlpha)`
  color: ${themeVal('color.danger-500')};
  border: 3px solid ${themeVal('color.danger-500')};
  margin-bottom: ${glsp(1)};
  ${ContentBlockProse} {
    padding: ${glsp(2)};
    font-weight: bold;
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
  const typeName = type ? type : 'default';
  const hasMultiplechildren = Array.isArray(children);

  if (error)
    return (
      <ErrorBlock>
        <ContentBlockProse>
          There is an error in this block. Did you pass the wrong type name?
        </ContentBlockProse>
      </ErrorBlock>
    );
  else {
    // Prose or Figure
    if (!hasMultiplechildren) {
      // if (!blockType[`${typeName}${children.type.displayName}`])
      return React.createElement(
        blockType[`${typeName}${children.type.displayName}`],
        props
      );

      // Prose and Figure
    } else {
      const childrenComponents = children.reduce(
        (acc, curr) => acc + curr.type.displayName,
        ''
      );
      // if (!blockType[`${typeName}${childrenComponents}`])
      return React.createElement(
        blockType[`${typeName}${childrenComponents}`],
        props
      );
    }
  }
}

class Block extends React.Component {
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
BlockComponent.propTypes = {
  type: T.string
};

const BlockWithError = (props) => (
  <Block {...props} childToRender={BlockComponent} />
);

export default BlockWithError;
