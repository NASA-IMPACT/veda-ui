import React from 'react';
import styled from 'styled-components';

import { listReset, media } from '@devseed-ui/theme-provider';

import {
  Dropdown,
  DropMenu,
  DropMenuItem,
  DropTitle
} from '@devseed-ui/dropdown';
import { Button } from '@devseed-ui/button';
import {
  Toolbar,
  ToolbarIconButton,
  ToolbarLabel,
  VerticalDivider
} from '@devseed-ui/toolbar';
import {
  CollecticonChevronDownSmall,
  CollecticonCircleInformation,
  CollecticonDownload2
} from '@devseed-ui/collecticons';

import { LayoutProps } from '$components/common/layout-root';
import {
  Fold,
  FoldHeader,
  FoldHeadline,
  FoldHeadActions,
  FoldTitle
} from '$components/common/fold';

import PageHeroAnalysis from '$components/analysis/page-hero-analysis';
import { resourceNotFound } from '$components/uhoh';

import { PageMainContent } from '$styles/page';
import { VarHeading } from '$styles/variable-components';
import { variableGlsp } from '$styles/variable-utils';
import {
  Legend,
  LegendTitle,
  LegendList,
  LegendSwatch,
  LegendLabel
} from '$styles/infographics';

import { useThematicArea } from '$utils/thematics';

export const ResultsList = styled.ol`
  ${listReset()};
  display: grid;
  gap: ${variableGlsp()};
  grid-template-columns: repeat(2, 1fr);

  ${media.mediumUp`
    grid-template-columns: repeat(3, 1fr);
  `}

  ${media.xlargeUp`
    grid-template-columns: repeat(4, 1fr);
  `}
`;

const Result = styled.article`
  /* styled-component */
`;

const ResultHeader = styled.header`
  /* styled-component */
`;

const ResultHeadline = styled.div`
  /* styled-component */
`;

export const ResultTitle = styled(VarHeading).attrs({
  as: 'h3',
  size: 'large'
})`
  /* styled-component */
`;

const ResultActions = styled.div`
  /* styled-component */
`;

const ResultBody = styled.div`
  /* styled-component */
`;

export default function AnalysisResults() {
  const thematic = useThematicArea();
  if (!thematic) throw resourceNotFound();

  return (
    <PageMainContent>
      <LayoutProps
        title='Analysis'
        description='Covering 8 datasets over a 50 M km2 area from Apr 7 to Sep 7, 2022.'
        thumbnail={thematic.data.media?.src}
      />
      <PageHeroAnalysis
        title='Analysis'
        description='Covering 8 datasets over a 50 M km2 area from Apr 7 to Sep 7, 2022.'
      />
      <Fold>
        <FoldHeader>
          <FoldHeadline>
            <FoldTitle>Results</FoldTitle>
          </FoldHeadline>
          <FoldHeadActions>
            <Legend>
              <LegendTitle>Legend</LegendTitle>
              <LegendList>
                <LegendSwatch>Red</LegendSwatch>
                <LegendLabel>Min</LegendLabel>
              </LegendList>
            </Legend>

            <Dropdown
              alignment='right'
              triggerElement={(props) => (
                <Button variation='base-text' {...props}>
                  View <CollecticonChevronDownSmall />
                </Button>
              )}
            >
              <DropTitle>View options</DropTitle>
              <DropMenu>
                <li>
                  <DropMenuItem href='#'>Option A</DropMenuItem>
                </li>
                <li>
                  <DropMenuItem href='#'>Option B</DropMenuItem>
                </li>
                <li>
                  <DropMenuItem href='#'>Option C</DropMenuItem>
                </li>
              </DropMenu>
            </Dropdown>
          </FoldHeadActions>
        </FoldHeader>
        <ResultsList>
          <li>
            <Result>
              <ResultHeader>
                <ResultHeadline>
                  <ResultTitle>Dataset name</ResultTitle>
                </ResultHeadline>
                <ResultActions>
                  <Toolbar size='small'>
                    <ToolbarLabel>Actions</ToolbarLabel>
                    <ToolbarIconButton variation='base-text' disabled>
                      <CollecticonDownload2 title='Download' meaningful />
                    </ToolbarIconButton>
                    <VerticalDivider variation='dark' />
                    <ToolbarIconButton variation='base-text'>
                      <CollecticonCircleInformation
                        title='More info'
                        meaningful
                      />
                    </ToolbarIconButton>
                  </Toolbar>
                </ResultActions>
              </ResultHeader>
              <ResultBody>
                <p>Content goes here.</p>
              </ResultBody>
            </Result>
          </li>
        </ResultsList>
      </Fold>
    </PageMainContent>
  );
}
