import React from 'react';

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
  VerticalDivider
} from '@devseed-ui/toolbar';
import {
  CollecticonChevronDownSmall,
  CollecticonCircleInformation,
  CollecticonDownload2
} from '@devseed-ui/collecticons';

import { LayoutProps } from '$components/common/layout-root';
import {
  CardList,
  CardSelf,
  CardHeader,
  CardHeadline,
  CardTitle,
  CardActions,
  CardBody
} from '$components/common/card';
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
import {
  Legend,
  LegendTitle,
  LegendList,
  LegendSwatch,
  LegendLabel
} from '$styles/infographics';

import { useThematicArea } from '$utils/thematics';

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

        <CardList>
          <li>
            <CardSelf>
              <CardHeader>
                <CardHeadline>
                  <CardTitle>Dataset name</CardTitle>
                </CardHeadline>
                <CardActions>
                  <Toolbar size='small'>
                    <ToolbarIconButton variation='base-text'>
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
                </CardActions>
              </CardHeader>
              <CardBody>
                <p>Content goes here.</p>
              </CardBody>
            </CardSelf>
          </li>
        </CardList>
      </Fold>
    </PageMainContent>
  );
}
