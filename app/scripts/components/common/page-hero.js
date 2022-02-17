import React from 'react';
import T from 'prop-types';
import { format } from 'date-fns';
import styled, { css } from 'styled-components';

import { glsp, media, themeVal } from '@devseed-ui/theme-provider';
import { reveal } from '@devseed-ui/animation';

import { PageLead, PageMainTitle, PageOverline } from '../../styles/page';
import Constrainer from '../../styles/constrainer';
import { variableGlsp } from '../../styles/variable-utils';
import MediaAttribution from './media-attribution';

const PageHeroSelf = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-flow: column nowrap;
  gap: ${glsp()};
  justify-content: flex-end;
  padding: ${variableGlsp(2, 1)};
  background: ${themeVal('color.base-50')};
  min-height: 12rem;
  animation: ${reveal} 0.32s ease 0s 1;

  ${({ isCover }) =>
    isCover &&
    css`
      color: ${themeVal('color.surface')};
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

  ${MediaAttribution} {
    bottom: ${variableGlsp()};
    right: ${variableGlsp()};
  }
`;

const PageHeroInner = styled(Constrainer)`
  align-items: end;
`;

const PageHeroHGroup = styled.div`
  position: relative;
  z-index: 3;
  display: flex;
  flex-flow: column;
  gap: ${variableGlsp(0.125)};
  grid-column: 1 / span 4;

  ${media.mediumUp`
    grid-column: 1 / span 6;
  `}

  ${media.largeUp`
    grid-column: 1 / span 6;
  `}
`;

const PageHeroCover = styled.figure`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: ${themeVal('color.base-400a')};
    mix-blend-mode: multiply;
    z-index: 2;
  }
`;

const PageHeroCoverItem = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;

  img {
    position: relative;
    height: 100%;
    width: 100%;
    z-index: 1;
    object-fit: cover;
  }
`;

function PageHero(props) {
  const {
    title,
    description,
    publishedDate,
    coverSrc,
    coverAlt,
    attributionAuthor,
    attributionUrl
  } = props;

  const hasImage = coverSrc && coverAlt;

  const date =
    publishedDate && typeof publishedDate === 'string'
      ? new Date(publishedDate)
      : publishedDate;

  return (
    <PageHeroSelf isCover={hasImage}>
      <PageHeroInner>
        <PageHeroHGroup>
          <PageMainTitle>{title}</PageMainTitle>
          {date && (
            <PageOverline>
              Published on{' '}
              <time dateTime={format(date, 'yyyy-MM-dd')} pubdate='pubdate'>
                {format(date, 'MMM d, yyyy')}
              </time>
            </PageOverline>
          )}
        </PageHeroHGroup>
        {description && <PageLead>{description}</PageLead>}
        {hasImage && (
          <PageHeroCover>
            <PageHeroCoverItem>
              <img src={coverSrc} alt={coverAlt} />
            </PageHeroCoverItem>
            <MediaAttribution author={attributionAuthor} url={attributionUrl} />
          </PageHeroCover>
        )}
      </PageHeroInner>
    </PageHeroSelf>
  );
}

export default PageHero;

PageHero.propTypes = {
  title: T.string,
  description: T.string,
  publishedDate: T.oneOfType([T.string, T.instanceOf(Date)]),
  coverSrc: T.string,
  coverAlt: T.string,
  attributionAuthor: T.string,
  attributionUrl: T.string
};
