import React from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';

import { glsp, media, themeVal } from '@devseed-ui/theme-provider';
import { reveal } from '@devseed-ui/animation';

import { PageMainTitle, PageOverline } from '../../styles/page';
import Constrainer from '../../styles/constrainer';
import { variableGlsp } from '../../styles/variable-utils';
import { VarLead } from '../../styles/variable-components';
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

  ${({ variation }) =>
    variation === 'dark' &&
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

const PageHeroDescription = styled(VarLead)`
  position: relative;
  z-index: 3;
  grid-column: 1 / span 4;
  grid-row: 2;
  color: inherit;

  ${media.mediumUp`
    grid-column: 1 / span 6;
    grid-row: 2;
  `}

  ${media.largeUp`
    grid-column: 7 / span 6;
    grid-row: 1;
  `}
`;

export const PageHeroCover = styled.figure`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;

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

export const PageHeroCoverItem = styled.div`
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
  const { title, description } = props;

  return (
    <PageHeroSelf variation='dark'>
      <PageHeroInner>
        <PageHeroHGroup>
          <PageMainTitle>{title}</PageMainTitle>
          <PageOverline>
            Published on{' '}
            <time dateTime='2021-06-16' pubdate='pubdate'>
              June 16, 2021
            </time>
          </PageOverline>
        </PageHeroHGroup>
        {description && (
          <PageHeroDescription>{description}</PageHeroDescription>
        )}
        <PageHeroCover>
          <PageHeroCoverItem>
            <img
              src='https://picsum.photos/id/1002/2048/1024'
              alt='Page cover'
            />
          </PageHeroCoverItem>
          <MediaAttribution
            author='Lorem Picsum'
            url='https://picsum.photos/'
          />
        </PageHeroCover>
      </PageHeroInner>
    </PageHeroSelf>
  );
}

export default PageHero;

PageHero.propTypes = {
  title: T.string,
  description: T.string
};
