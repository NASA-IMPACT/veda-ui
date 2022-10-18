import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import {
  glsp,
  media,
  themeVal,
  truncated,
  visuallyHidden
} from '@devseed-ui/theme-provider';
import { reveal } from '@devseed-ui/animation';

import { PageLead, PageMainTitle } from '$styles/page';
import Constrainer from '$styles/constrainer';
import PageHeroMedia from './page-hero-media';

import { variableGlsp } from '$styles/variable-utils';
import { useMediaQuery } from '$utils/use-media-query';
import { useSlidingStickyHeaderProps } from '../common/layout-root';
import { Feature, MultiPolygon } from 'geojson';

const PageHeroBlockAlpha = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${variableGlsp()};
  min-width: 0;

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

const PageHeroSelf = styled.div`
  position: sticky;
  z-index: 1;
  display: flex;
  flex-flow: column nowrap;
  gap: ${glsp()};
  justify-content: flex-end;
  background: ${themeVal('color.primary')};
  color: ${themeVal('color.surface')};
  min-height: 14rem;
  animation: ${reveal} 0.32s ease 0s 1;
  transition: top 0.32s ease-out, min-height 0.32s ease-out;

  ${({ isHidden }) => isHidden && visuallyHidden()}

  ${({ shouldSlideHeader, minTop, maxTop }) => {
    const topVal = shouldSlideHeader ? minTop : maxTop;
    return css`
      top: ${topVal}px;
    `;
  }}

  ${({ isStuck }) =>
    isStuck &&
    css`
      min-height: 0;
    `}

  ${PageHeroMedia} {
    transition: opacity 0.32s ease-out;
    opacity: ${({ isStuck }) => Number(!isStuck)};
  }

  ${PageLead} {
    transition: font-size 0.32s ease-out;
    ${({ isStuck }) =>
      isStuck &&
      css`
        ${truncated()}
        font-size: ${themeVal('type.base.size')};
      `}
  }

  ${PageHeroBlockAlpha} {
    transition: gap 0.32s ease-out;
    ${({ isStuck }) =>
      isStuck &&
      css`
        gap: 0;
      `}
  }

  ${PageHeroBlockBeta} {
    ${({ isStuck }) =>
      isStuck &&
      css`
        margin-left: auto;
      `}
  }
`;

const PageHeroInner = styled(Constrainer)`
  align-items: end;
  transition: padding 0.32s ease-out;

  ${({ isStuck }) =>
    isStuck
      ? css`
          display: flex;
          flex-flow: row nowrap;
          padding-top: ${variableGlsp()};
          padding-bottom: ${variableGlsp()};
        `
      : css`
          padding-top: ${variableGlsp(4)};
          padding-bottom: ${variableGlsp(2)};
        `}
`;

export const PageHeroHGroup = styled.div`
  display: flex;
  flex-flow: column;
  gap: ${variableGlsp(0.125)};
`;

const PageHeroActions = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: ${variableGlsp(0.25)};

  ${media.largeUp`
    justify-content: end;
  `}
`;

interface PageHeroAnalysisProps {
  title: string;
  description: string;
  isHidden?: boolean;
  isResults?: boolean;
  aoiFeature?: Feature<MultiPolygon>;
  renderActions: ({ size }: { size: string }) => React.ReactNode;
}

function PageHeroAnalysis(props: PageHeroAnalysisProps) {
  const {
    title,
    description,
    isHidden,
    isResults = false,
    aoiFeature,
    renderActions
  } = props;

  const { isHeaderHidden, headerHeight, wrapperHeight } =
    useSlidingStickyHeaderProps();

  // The page hero must be sticky at a certain distance from the top which is
  // equal to the NavWrapper's height.
  const maxTop = wrapperHeight;
  // Except when the header get hidden by sliding out of the viewport. When this
  // happens the header height must be removed from the equation.
  const minTop = wrapperHeight - headerHeight;

  const isStuck = useIsStuck(headerHeight);

  const { isLargeUp } = useMediaQuery();

  return (
    <PageHeroSelf
      isHidden={isHidden}
      shouldSlideHeader={isHeaderHidden}
      minTop={minTop}
      maxTop={maxTop}
      isStuck={isStuck}
    >
      <PageHeroInner isStuck={isStuck}>
        <PageHeroBlockAlpha>
          <PageHeroHGroup>
            <PageMainTitle size={isStuck ? 'xsmall' : undefined}>
              {title}
            </PageMainTitle>
          </PageHeroHGroup>
          {description && <PageLead>{description}</PageLead>}
        </PageHeroBlockAlpha>
        <PageHeroBlockBeta>
          <PageHeroActions>
            {renderActions?.({
              size: isStuck ? 'small' : isLargeUp ? 'large' : 'medium'
            })}
          </PageHeroActions>
        </PageHeroBlockBeta>
      </PageHeroInner>
      {isResults && <PageHeroMedia feature={aoiFeature} />}
    </PageHeroSelf>
  );
}

export default PageHeroAnalysis;

const OBSERVER_PIXEL_ID = 'page-hero-pixel';

function useIsStuck(threshold: number) {
  const [isStuck, setStuck] = useState(window.scrollY > threshold);

  useEffect(() => {
    // Check for the observer pixel.
    // https://mediatemple.net/blog/web-development-tech/using-intersectionobserver-to-check-if-page-scrolled-past-certain-point-2/
    const pixel = document.createElement('div');
    pixel.id = OBSERVER_PIXEL_ID;

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
    const el = document.getElementById(OBSERVER_PIXEL_ID);
    if (el) {
      el.style.top = `${threshold}px`;
    }
  }, [threshold]);

  return isStuck;
}
