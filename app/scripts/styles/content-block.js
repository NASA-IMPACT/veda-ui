import styled from 'styled-components';

import { glsp, themeVal } from '@devseed-ui/theme-provider';

import { variableGlsp, variableProseVSpace } from './variable-utils';
import { VarProse } from './variable-components';

import Hug from './hug/index.ts';

import { FigcaptionInner, Figure } from '$components/common/figure';

import { proseDisplayName } from '$components/common/blocks/block-constant';

export const ContentBlock = styled(Hug)`
  padding-top: ${variableGlsp(2)};
  padding-bottom: ${variableGlsp(2)};
  align-items: center;

  & + & {
    padding-top: 0;
  }
`;

const ContentBlockProse = styled(VarProse)`
  gap: ${variableGlsp()};

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    &:first-child {
      column-span: all;
      max-width: 52rem;
      display: flex;
      flex-direction: column;
      gap: calc(${glsp()} - ${glsp(0.25)});
      margin-bottom: ${variableProseVSpace()};

      &::before {
        content: '';
        width: ${glsp(2)};
        height: ${glsp(0.25)};
        border-radius: ${themeVal('shape.rounded')};
        background: ${themeVal('color.primary')};
      }
    }
  }

  * {
    break-inside: avoid;
  }

  ${FigcaptionInner} {
    padding: ${glsp(1, 0, 0, 0)};

    &::after {
      display: none;
    }
  }

  [class*='align-'] {
    figcaption {
      padding: 0;
    }
  }

  .align-left {
    float: left;
    margin-right: ${variableProseVSpace()};
  }

  .align-right {
    float: right;
    margin-left: ${variableProseVSpace()};

    ${FigcaptionInner} {
      align-items: end;
      text-align: right;
    }
  }

  .align-center {
    margin-left: 50%;
    transform: translate(-50%, 0);

    ${FigcaptionInner} {
      align-items: center;
      text-align: center;
    }
  }
`;

// assign displayName that a block can tell
ContentBlockProse.displayName = proseDisplayName;

const ContentBlockFigure = styled(Figure)`
  img {
    width: 100%;
  }
`;

export { ContentBlockFigure, ContentBlockProse };
