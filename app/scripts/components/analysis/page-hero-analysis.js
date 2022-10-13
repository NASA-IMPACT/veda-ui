import React, { useEffect, useState } from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
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
import Try from '../common/try-render';

import { variableGlsp } from '$styles/variable-utils';
import { useSlidingStickyHeaderProps } from '../common/layout-root';

const PageHeroSelf = styled.div`
  position: sticky;
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

  transition: top 0.32s ease-out;
  ${({ shouldSlideHeader, minTop, maxTop }) => {
    const topVal = shouldSlideHeader ? minTop : maxTop;
    return css`
      top: ${topVal}px;
    `;
  }}
`;

const PageHeroInner = styled(Constrainer)`
  transition: padding 0.32s ease-out;
  align-items: end;

  ${({ isStuck }) =>
    css`
      padding-top: ${variableGlsp(isStuck ? 1 : 4)};
      padding-bottom: ${variableGlsp(isStuck ? 1 : 2)};
    `}
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
    background: ${themeVal('color.primary-500')};
    content: '';
    mix-blend-mode: multiply;
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

  const { isHeaderHidden, headerHeight, wrapperHeight } =
    useSlidingStickyHeaderProps();

  // The page hero must be sticky at a certain distance from the top which is
  // equal to the NavWrapper's height.
  const maxTop = wrapperHeight;
  // Except when the header get hidden by sliding out of the viewport. When this
  // happens the header height must be removed from the equation.
  const minTop = wrapperHeight - headerHeight;

  const isStuck = useIsStuck(headerHeight);

  return (
    <PageHeroSelf
      isHidden={isHidden}
      shouldSlideHeader={isHeaderHidden}
      minTop={minTop}
      maxTop={maxTop}
      isStuck={isStuck}
    >
      <PageHeroInner isStuck={isStuck}>
        <Try fn={renderAlphaBlock} wrapWith={PageHeroBlockAlpha}>
          <PageHeroHGroup>
            <PageMainTitle size={isStuck ? 'medium' : undefined}>
              {title}
            </PageMainTitle>
          </PageHeroHGroup>
          {description && <PageLead>{description}</PageLead>}
        </Try>
        <Try fn={renderBetaBlock} wrapWith={PageHeroBlockBeta}>
          <PageHeroActions>
            <Button
              type='button'
              size={isStuck ? 'small' : 'large'}
              variation='achromic-outline'
            >
              <CollecticonXmarkSmall /> Cancel
            </Button>
            <Button
              type='button'
              size={isStuck ? 'small' : 'large'}
              variation='achromic-outline'
            >
              <CollecticonTickSmall /> Save
            </Button>
          </PageHeroActions>
        </Try>
      </PageHeroInner>
      <PageHeroMedia />
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

function useIsStuck(threshold) {
  const [isStuck, setStuck] = useState(window.scrollY > threshold);

  useEffect(() => {
    // Check for the observer pixel.
    // https://mediatemple.net/blog/web-development-tech/using-intersectionobserver-to-check-if-page-scrolled-past-certain-point-2/
    const pixel = document.createElement('div');
    pixel.id = 'page-hero-pixel';

    const style = {
      position: 'absolute',
      width: '1px',
      height: '1px',
      left: 0,
      pointerEvents: 'none'
    };

    for (const [key, value] of Object.entries(style)) {
      pixel.style[key] = value;
    }

    document.body.appendChild(pixel);

    const observer = new IntersectionObserver(
      ([e]) => {
        setStuck(e.intersectionRatio < 1);
      },
      { threshold: 1 }
    );

    observer.observe(pixel);

    return () => {
      observer.unobserve(pixel);
      pixel.remove();
    };
  }, []);

  useEffect(() => {
    const el = document.querySelector('#page-hero-pixel');
    if (el) {
      el.style.top = `${threshold}px`;
    }
  }, [threshold]);

  return isStuck;
}
