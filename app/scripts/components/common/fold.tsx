import React, { ComponentProps, ReactNode } from 'react';

import styled from 'styled-components';
import { glsp, media, themeVal } from '@devseed-ui/theme-provider';

import { variableGlsp } from '$styles/variable-utils';
import { VarHeading, VarLead, VarProse } from '$styles/variable-components';
import Constrainer from '$styles/constrainer';
import Hug from '$styles/hug';

export const FoldBase = styled.div`
  padding-top: ${variableGlsp(2)};
  padding-bottom: ${variableGlsp(2)};

  & + & {
    padding-top: 0;
  }
`;

export const FoldGrid = styled(Hug)`
  padding-top: ${variableGlsp(2)};
  padding-bottom: ${variableGlsp(2)};

  & + &,
  & + ${FoldBase} {
    padding-top: 0;
  }
`;

const FoldInner = styled(Constrainer)`
  /* styled-component */
`;

export const FoldHeader = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-flow: column nowrap;
  gap: ${variableGlsp()};

  ${media.largeUp`
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: flex-end;
  `}

  > a {
    flex-shrink: 0;
  }
`;

export const FoldHeadline = styled.div`
  /* styled-component */
`;

export const FoldHeadActions = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: ${variableGlsp(0.5)};
`;

export const FoldHGroup = styled.div`
  gap: ${variableGlsp(0.125)};
`;

export const FoldTitle = styled(VarHeading).attrs({
  as: 'h2',
  size: 'xlarge'
})`
  column-span: all;
  max-width: 52rem;
  display: flex;
  flex-direction: column;
  gap: calc(${glsp()} - ${glsp(0.25)});

  &::before {
    content: '';
    width: ${glsp(2)};
    height: ${glsp(0.25)};
    border-radius: ${themeVal('shape.rounded')};
    background: ${themeVal('color.primary')};
  }
`;

export const FoldLead = styled(VarLead)`
  color: inherit;
`;

export const FoldBody = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-flow: column nowrap;
  gap: ${variableGlsp()};
`;

const Content = styled(VarProse)`
  grid-column: 1 / span 4;

  ${media.mediumUp`
    grid-column: 2 / span 6;
  `}

  ${media.largeUp`
    grid-column: 3 / span 8;
  `}
`;

function FoldComponent(
  props: ComponentProps<typeof FoldBase> & { children: ReactNode }
) {
  const { children, ...rest } = props;

  return (
    <FoldBase {...rest}>
      <FoldInner>{children}</FoldInner>
    </FoldBase>
  );
}

export const Fold = styled(FoldComponent)`
  /* Convert to styled-component: https://styled-components.com/docs/advanced#caveat */
`;

export function FoldProse(props: { children: ReactNode }) {
  const { children } = props;

  return (
    <FoldBase>
      <FoldInner>
        <Content>{children}</Content>
      </FoldInner>
    </FoldBase>
  );
}
