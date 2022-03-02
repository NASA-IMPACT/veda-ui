import styled from 'styled-components';

import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Subtitle } from '@devseed-ui/typography';

import { variableGlsp, variableProseVSpace } from './variable-utils';
import { VarProse } from './variable-components';

import Hug from './hug';

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

  [class*='align-'] {
    margin-bottom: ${variableProseVSpace()};

    figcaption {
      padding: ${glsp(1, 0, 0, 0)};
    }
  }

  .align-left {
    float: left;
    margin-right: ${variableProseVSpace()};

    figcaption {
      text-align: left;
    }
  }

  .align-right {
    float: right;
    margin-left: ${variableProseVSpace()};

    figcaption {
      text-align: right;
    }
  }
`;

export const ContentBlockFigure = styled.figure`
  /* styled-component */
`;

export const ContentBlockFigcaption = styled(Subtitle).attrs({
  as: 'figcaption'
})`
  position: relative;
  padding: ${variableGlsp(0.5, 1)};

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: ${variableGlsp(1)};
    width: ${glsp(2)};
    height: 1px;
    background: ${themeVal('color.base-100a')};
  }
`;
