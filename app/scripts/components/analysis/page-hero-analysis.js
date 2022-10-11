import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import {
  glsp,
  media,
  themeVal,
  visuallyHidden
} from '@devseed-ui/theme-provider';
import { reveal } from '@devseed-ui/animation';
import { Button } from '@devseed-ui/button';
import {
  CollecticonTickSmall,
  CollecticonXmarkSmall
} from '@devseed-ui/collecticons';

import MapboxMap from '$components/common/mapbox';
import { PageLead, PageMainTitle } from '$styles/page';
import Constrainer from '$styles/constrainer';
import { variableGlsp } from '$styles/variable-utils';
import Try from '../common/try-render';

const PageHeroSelf = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-flow: column nowrap;
  gap: ${glsp()};
  justify-content: flex-end;
  background: ${themeVal('color.primary')};
  color: ${themeVal('color.surface')};
  min-height: 12rem;
  animation: ${reveal} 0.32s ease 0s 1;

  ${({ isHidden }) => isHidden && visuallyHidden()}
`;

const PageHeroInner = styled(Constrainer)`
  padding-top: ${variableGlsp(4)};
  padding-bottom: ${variableGlsp(2)};
  align-items: end;
`;

const PageHeroMedia = styled(MapboxMap)`
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;

  > * {
    mix-blend-mode: screen;
    filter: grayscale(100%);

    /* Improve performance */
    transform: translate3d(0, 0, 0);
  }

  &::after {
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(
      to top,
      ${themeVal('color.primary-500')} 0%,
      ${themeVal('color.primary-500')}00 100%
    );
    content: '';
  }
`;

export const PageHeroHGroup = styled.div`
  display: flex;
  flex-flow: column;
  gap: ${variableGlsp(0.125)};
`;

const PageHeroBlockAlpha = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${variableGlsp()};

  grid-column: 1 / span 4;

  ${media.mediumUp`
    grid-column: 1 / span 6;
  `}

  ${media.largeUp`
    grid-column: 1 / span 6;
  `}
`;

const PageHeroBlockBeta = styled.div`
  grid-column: 1 / span 4;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  gap: ${variableGlsp()};

  ${media.mediumUp`
    grid-column: 1 / span 6;
    grid-row: 2;
  `}

  ${media.largeUp`
    grid-column: 7 / span 6;
    grid-row: 1;
  `}
`;

const PageHeroActions = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: end;
  gap: ${variableGlsp(0.25)};
`;

function PageHeroAnalysis(props) {
  const { title, description, renderAlphaBlock, renderBetaBlock, isHidden } =
    props;

  return (
    <PageHeroSelf isHidden={isHidden}>
      <PageHeroInner>
        <Try fn={renderAlphaBlock} wrapWith={PageHeroBlockAlpha}>
          <PageHeroHGroup>
            <PageMainTitle>{title}</PageMainTitle>
          </PageHeroHGroup>
          {description && <PageLead>{description}</PageLead>}
        </Try>
        <Try fn={renderBetaBlock} wrapWith={PageHeroBlockBeta}>
          <PageHeroActions>
            <Button type='button' size='large' variation='achromic-outline'>
              <CollecticonXmarkSmall /> Cancel
            </Button>
            <Button type='button' size='large' variation='achromic-outline'>
              <CollecticonTickSmall /> Save
            </Button>
          </PageHeroActions>
        </Try>
      </PageHeroInner>
      <PageHeroMedia mapOptions={{ interactive: false }} />
    </PageHeroSelf>
  );
}

export default PageHeroAnalysis;

PageHeroAnalysis.propTypes = {
  title: T.string,
  description: T.string,
  renderAlphaBlock: T.func,
  renderBetaBlock: T.func,
  isHidden: T.bool
};
