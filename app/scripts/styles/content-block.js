import styled from 'styled-components';

import { glsp } from '@devseed-ui/theme-provider';

import { variableGlsp, variableProseVSpace } from './variable-utils';
import { VarProse } from './variable-components';

import Hug from './hug';

import { FigcaptionInner, Figure } from '$components/common/figure';

export const ContentBlock = styled(Hug)`
  padding-top: ${variableGlsp(2)};
  padding-bottom: ${variableGlsp(2)};
  align-items: center;

  & + & {
    padding-top: 0;
  }
`;

export const ContentBlockProse = styled(VarProse)`
  gap: ${variableGlsp()};

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    &:first-child {
      column-span: all;
      break-inside: avoid;
    }
  }

  ${FigcaptionInner} {
    padding: ${glsp(1, 0, 0, 0)};

    &::after {
      display: none;
    }
  }

  [class*='align-'] {
    margin-bottom: ${variableProseVSpace()};

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

export const ContentBlockFigure = styled(Figure)`
  /* styled-component */
`;
