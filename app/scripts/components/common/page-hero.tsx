import React from 'react';
import { format } from 'date-fns';
import styled, { css } from 'styled-components';

import {
  glsp,
  media,
  themeVal,
  visuallyHidden
} from '@devseed-ui/theme-provider';
import { reveal } from '@devseed-ui/animation';

import { Figcaption, Figure, FigureAttribution } from './figure';
import Try from './try-render';
import { PageLead, PageMainTitle, PageOverline } from '$styles/page';
import Constrainer from '$styles/constrainer';
import { variableGlsp } from '$styles/variable-utils';

const PageHeroSelf = styled.div<{ isCover: boolean; isHidden: boolean }>`
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

      &::before {
        position: absolute;
        z-index: 2;
        inset: 0 0 auto 0;
        height: ${themeVal('layout.border')};
        background: ${themeVal('color.base-300a')};
        content: '';
      }
    `}

  ${({ isHidden }) => isHidden && visuallyHidden()}

  ${FigureAttribution} {
    top: ${variableGlsp()};
    right: ${variableGlsp()};
  }
`;

const PageHeroInner = styled(Constrainer)`
  padding-top: ${variableGlsp(4)};
  padding-bottom: ${variableGlsp(2)};
  align-items: end;
  
  /** The constrainer's padding was going over the imagine attribution icon
  * causing it not to work. We remove the pointer events from it and add them
  * again to the descendants. */
  pointer-events: none;
  * {
    pointer-events: auto;
  }
`;

export const PageHeroHGroup = styled.div`
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

interface PageHeroProps {
  title: string;
  description?: string;
  renderAlphaBlock?: () => JSX.Element;
  renderBetaBlock?: () => JSX.Element;
  renderDetailsBlock?: () => JSX.Element;
  publishedDate?: string | Date;
  coverSrc?: string;
  coverAlt?: string;
  attributionAuthor?: string;
  attributionUrl?: string;
  isHidden?: boolean;
}

function PageHero(props: PageHeroProps) {
  const {
    title,
    description,
    renderAlphaBlock,
    renderBetaBlock,
    renderDetailsBlock,
    publishedDate,
    coverSrc,
    coverAlt,
    attributionAuthor,
    attributionUrl,
    isHidden,
    ...rest
  } = props;

  const hasImage = !!(coverSrc && coverAlt);

  const date = publishedDate
    ? typeof publishedDate === 'string'
      ? new Date(publishedDate)
      : publishedDate
    : undefined;

  return (
    <PageHeroSelf isCover={hasImage} isHidden={!!isHidden} {...rest}>
      <PageHeroInner>
        <Try fn={renderAlphaBlock} wrapWith={PageHeroBlockAlpha}>
          <PageHeroHGroup>
            <PageMainTitle>{title}</PageMainTitle>
            <PageOverlineDate date={date} />
          </PageHeroHGroup>
          {description && <PageLead>{description}</PageLead>}
        </Try>
        <Try fn={renderBetaBlock} wrapWith={PageHeroBlockBeta} />
        {typeof renderDetailsBlock === 'function' && renderDetailsBlock()}
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

export default styled(PageHero)`
  /* Convert to styled-component: https://styled-components.com/docs/advanced#caveat */
`;


export function PageOverlineDate(props: { date?: Date }) {
  const { date } = props;
  if (!date) {
    return null;
  }

  return (
    <PageOverline>
      Published on{' '}
      <time dateTime={format(date, 'yyyy-MM-dd')}>
        {format(date, 'MMM d, yyyy')}
      </time>
    </PageOverline>
  );
}
