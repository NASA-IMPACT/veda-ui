import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import { media } from '@devseed-ui/theme-provider';

import {
  ContentBlock,
  ContentBlockProse,
  ContentBlockFigure
} from '$styles/content-block';

import Image from '$components/discoveries/images';

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

// This does't handle the case where prose has inline images
function getImgsAndParagraphs(pChildren) {
  const children = Array.isArray(pChildren) ? pChildren : [pChildren];

  const imageChild = children.find((e) => e.type.name === 'Image');
  const notImageChildren = children.filter((e) => e.type.name !== 'Image');

  return {
    imageChild,
    notImageChildren
  };
}

function Block(props) {
  const { type } = props;
  switch (type) {
    case 'prose':
      return (
        <ContentBlockPAlpha>
          <ContentBlockProse {...props} />
        </ContentBlockPAlpha>
      );
    case 'prose-wide':
      return (
        <ContentBlockPBeta>
          <ContentBlockProse {...props} />
        </ContentBlockPBeta>
      );
    case 'figure':
      return (
        <ContentBlockFAlpha>
          <ContentBlockFigure {...props} />
        </ContentBlockFAlpha>
      );
    case 'figure-wide':
      return (
        <ContentBlockFBeta>
          <ContentBlockFigure {...props} />
        </ContentBlockFBeta>
      );
    case 'figure-full':
      return (
        <ContentBlockFGama>
          <ContentBlockFigure {...props} />
        </ContentBlockFGama>
      );
    case 'prose-left-figure-right': {
      const { imageChild, notImageChildren } = getImgsAndParagraphs(
        props.children
      );
      return (
        <ContentBlockPFAlpha>
          <ContentBlockProse children={notImageChildren} />
          <ContentBlockFigure>
            {imageChild && <Image {...imageChild.props} />}
          </ContentBlockFigure>
        </ContentBlockPFAlpha>
      );
    }
    case 'prose-right-figure-left': {
      const { imageChild, notImageChildren } = getImgsAndParagraphs(
        props.children
      );
      return (
        <ContentBlockPFBeta>
          <ContentBlockFigure>
            {imageChild && <Image {...imageChild.props} />}
          </ContentBlockFigure>
          <ContentBlockProse children={notImageChildren} />
        </ContentBlockPFBeta>
      );
    }
    case 'prose-left-figure-right-full': {
      const { imageChild, notImageChildren } = getImgsAndParagraphs(
        props.children
      );
      return (
        <ContentBlockPFGama>
          <ContentBlockProse children={notImageChildren} />
          <ContentBlockFigure>
            {imageChild && <Image {...imageChild.props} />}
          </ContentBlockFigure>
        </ContentBlockPFGama>
      );
    }
    case 'prose-right-figure-left-full': {
      const { imageChild, notImageChildren } = getImgsAndParagraphs(
        props.children
      );

      return (
        <ContentBlockPFDelta>
          <ContentBlockFigure>
            {imageChild && <Image {...imageChild.props} />}
          </ContentBlockFigure>
          <ContentBlockProse children={notImageChildren} />
        </ContentBlockPFDelta>
      );
    }
    default:
      return (
        <ContentBlockPAlpha>
          <ContentBlockProse {...props} />
        </ContentBlockPAlpha>
      );
  }
}

Block.propTypes = {
  type: T.string
};

export default Block;
