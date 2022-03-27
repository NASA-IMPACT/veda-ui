import React from 'react';
import T from 'prop-types';
import { format } from 'date-fns';
import styled, { css } from 'styled-components';

import {
  glsp,
  media,
  themeVal,
  visuallyHidden
} from '@devseed-ui/theme-provider';
import { reveal } from '@devseed-ui/animation';

import { PageMainTitle, PageOverline } from '../../styles/page';
import Constrainer from '../../styles/constrainer';
import { variableGlsp } from '../../styles/variable-utils';
import { Figcaption, Figure, FigureAttribution } from './figure';

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
  box-shadow: inset 0 1px 0 0 ${themeVal('color.surface-100a')};
  animation: ${reveal} 0.32s ease 0s 1;

  ${({ isCover }) =>
    isCover &&
    css`
      min-height: 16rem;

      ${media.mediumUp`
        min-height: 20rem;
      `}

      ${media.largeUp`
        min-height: 24rem;
      `}

      ${media.xlargeUp`
        min-height: 28rem;
      `}
    `}

  ${({ isHidden }) => isHidden && visuallyHidden()}

  ${FigureAttribution} {
    top: ${variableGlsp()};
    right: ${variableGlsp()};
  }
`;

const PageHeroInner = styled(Constrainer)`
  padding-top: ${variableGlsp(2)};
  padding-bottom: ${variableGlsp(2)};
  align-items: end;
`;

const PageHeroHGroup = styled.div`
  display: flex;
  flex-flow: column;
  gap: ${variableGlsp(0.125)};
`;

const PageHeroCover = styled(Figure)`
  position: absolute;
  inset: 0;
  z-index: -1;
  background: ${themeVal('color.base-400')};

  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    mix-blend-mode: multiply;
  }
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

function PageHero(props) {
  const {
    title,
    heroBlockBetaContent,
    heroBlockAlphaAddon,
    publishedDate,
    coverSrc,
    coverAlt,
    attributionAuthor,
    attributionUrl,
    isHidden
  } = props;

  const hasImage = coverSrc && coverAlt;

  const date =
    publishedDate && typeof publishedDate === 'string'
      ? new Date(publishedDate)
      : publishedDate;

  return (
    <PageHeroSelf isCover={hasImage} isHidden={isHidden}>
      <PageHeroInner>
        <PageHeroBlockAlpha>
          <PageHeroHGroup>
            <PageMainTitle>{title}</PageMainTitle>
            {date && (
              <PageOverline>
                Published on{' '}
                <time dateTime={format(date, 'yyyy-MM-dd')}>
                  {format(date, 'MMM d, yyyy')}
                </time>
              </PageOverline>
            )}
          </PageHeroHGroup>
          {heroBlockAlphaAddon && <>{heroBlockAlphaAddon}</>}
        </PageHeroBlockAlpha>
        {heroBlockBetaContent && (
          <PageHeroBlockBeta>{heroBlockBetaContent}</PageHeroBlockBeta>
        )}
        {hasImage && (
          <PageHeroCover>
            <img src={coverSrc} alt={coverAlt} />
            <Figcaption>
              <FigureAttribution
                author={attributionAuthor}
                url={attributionUrl}
              />
            </Figcaption>
          </PageHeroCover>
        )}
      </PageHeroInner>
    </PageHeroSelf>
  );
}

export default PageHero;

PageHero.propTypes = {
  title: T.string,
  heroBlockBetaContent: T.node,
  heroBlockAlphaAddon: T.node,
  publishedDate: T.oneOfType([T.string, T.instanceOf(Date)]),
  coverSrc: T.string,
  coverAlt: T.string,
  attributionAuthor: T.string,
  attributionUrl: T.string,
  isHidden: T.bool
};
