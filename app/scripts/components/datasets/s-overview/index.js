import React from 'react';
import styled from 'styled-components';

import { add, glsp, media, themeVal } from '@devseed-ui/theme-provider';
import { Prose } from '@devseed-ui/typography';

import { LayoutProps } from '../../common/layout-root';
import { resourceNotFound } from '../../uhoh';
import Constrainer from '../../../styles/constrainer';
import { PageMainContent } from '../../../styles/page';
import PageLocalNav from '../../common/page-local-nav';

import {
  useMdxPageLoader,
  useThematicArea,
  useThematicAreaDataset
} from '../../../utils/thematics';

export const IntroFold = styled.div`
  position: relative;
  padding: ${glsp(2, 0)};

  ${media.mediumUp`
    padding: ${glsp(3, 0)};
  `}

  ${media.largeUp`
    padding: ${glsp(4, 0)};
  `}
`;

export const IntroFoldInner = styled(Constrainer)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${glsp(
    add(themeVal('layout.glspMultiplier.xsmall'), 1),
    themeVal('layout.glspMultiplier.xsmall')
  )};
  max-width: ${themeVal('layout.max')};
  margin: 0 auto;

  ${media.smallUp`
    gap: ${glsp(
      add(themeVal('layout.glspMultiplier.small'), 1),
      themeVal('layout.glspMultiplier.small')
    )};
  `}

  ${media.mediumUp`
    grid-template-columns: repeat(8, 1fr);
    gap: ${glsp(
      add(themeVal('layout.glspMultiplier.medium'), 1),
      themeVal('layout.glspMultiplier.medium')
    )};
  `}

  ${media.largeUp`
    grid-template-columns: repeat(12, 1fr);
    gap: ${glsp(
      add(themeVal('layout.glspMultiplier.large'), 1),
      themeVal('layout.glspMultiplier.large')
    )};
  `}

  ${media.xlargeUp`
    gap: ${glsp(
      add(themeVal('layout.glspMultiplier.xlarge'), 1),
      themeVal('layout.glspMultiplier.xlarge')
    )};
  `}

  > * {
    grid-column: 1 / -1;
  }
`;

export const IntroFoldCopy = styled.div`
  grid-column: 1 / span 8;
  display: flex;
  flex-direction: column;
  gap: ${glsp(2)};
`;

export const IntroFoldActions = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: ${glsp(0.75)};
  align-items: center;
`;

function DatasetsOverview() {
  const thematic = useThematicArea();
  const dataset = useThematicAreaDataset();
  const pageMdx = useMdxPageLoader(dataset?.content);

  if (!thematic || !dataset) return resourceNotFound();

  return (
    <>
      <LayoutProps title={`${dataset.data.name} overview`} />
      <PageLocalNav
        title={dataset.data.name}
        thematic={thematic}
        dataset={dataset}
      />
      <PageMainContent>
        <IntroFold>
          <IntroFoldInner>
            <IntroFoldCopy>
              <Prose>
                <h1>Overview</h1>
                {pageMdx.status === 'loading' && <p>Loading page content</p>}
                {pageMdx.status === 'success' && <pageMdx.MdxContent />}
              </Prose>
            </IntroFoldCopy>
          </IntroFoldInner>
        </IntroFold>
      </PageMainContent>
    </>
  );
}

export default DatasetsOverview;
