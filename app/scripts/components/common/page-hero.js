import React from 'react';
import styled from 'styled-components';

import { glsp, media, themeVal } from '@devseed-ui/theme-provider';

import { PageMainTitle, PageOverline, PageSubtitle } from '../../styles/page';
import Constrainer from '../../styles/constrainer';
import { variableGlsp } from '../../styles/variable-utils';
import { VarLead } from '../../styles/variable-components';

const PageHeroSelf = styled.div`
  padding: ${variableGlsp()};
  display: flex;
  flex-flow: column nowrap;
  gap: ${glsp()};
  justify-content: flex-end;
  background: ${themeVal('color.base-50')};
  min-height: 12rem;

  ${media.mediumUp`
    min-height: 16rem;
  `}

  ${media.largeUp`
    min-height: 18rem;
  `}

  ${media.xlargeUp`
    min-height: 20rem;
  `}
`;

const PageHeroInner = styled(Constrainer)`
  align-items: end;
`;

const PageHeroHGroup = styled.div`
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

const PageHeroIntro = styled(VarLead)`
  grid-column: 1 / span 4;
  grid-row: 2;

  ${media.mediumUp`
    grid-column: 1 / span 6;
    grid-row: 2;
  `}

  ${media.largeUp`
    grid-column: 7 / span 6;
    grid-row: 1;
  `}
`;

function PageHero() {
  return (
    <PageHeroSelf>
      <PageHeroInner>
        <PageHeroHGroup>
          <PageMainTitle>Lorem ipsum dolor sit amet</PageMainTitle>
          <PageOverline>
            Published on{' '}
            <time dateTime='2021-06-16' pubdate>
              June 16, 2021
            </time>
          </PageOverline>
        </PageHeroHGroup>
        <PageHeroIntro>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          commodo tempus dolor vel placerat. Sed imperdiet nulla.
        </PageHeroIntro>
      </PageHeroInner>
    </PageHeroSelf>
  );
}

export default PageHero;
