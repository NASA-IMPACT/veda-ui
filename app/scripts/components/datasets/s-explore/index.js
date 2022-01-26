import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import {
  add,
  glsp,
  media,
  themeVal,
  visuallyHidden
} from '@devseed-ui/theme-provider';
import { Prose } from '@devseed-ui/typography';

import { resourceNotFound } from '../../uhoh';
import PageLocalNav from '../../common/page-local-nav';
import Constrainer from '../../../styles/constrainer';
import { PageMainContent } from '../../../styles/page';
import {
  Panel,
  PanelActions,
  PanelBody,
  PanelHeader,
  PanelHeadline,
  PanelTitle,
  PanelToggle,
  PanelWidget,
  PanelWidgetBody,
  PanelWidgetHeader,
  PanelWidgetTitle
} from '../../../styles/panel';
import { variableGlsp } from '../../../styles/variable-utils';
import { LayoutProps } from '../../common/layout-root';
import {
  useThematicArea,
  useThematicAreaDataset
} from '../../../utils/thematics';
import { CollecticonSlidersHorizontal } from '@devseed-ui/collecticons';

export const IntroFold = styled.div`
  position: relative;
  padding: ${glsp(2, 0)};

  ${media.mediumUp`
    padding: ${glsp(3, 0)};
  `}

  ${media.largeUp`
    padding: ${glsp(4, 0)};
  `}

  ${visuallyHidden}
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

export const Explorer = styled.div`
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-flow: row nowrap;
  overflow: hidden;
`;

export const Carto = styled.div`
  flex-grow: 1;
  padding: ${variableGlsp()};
  background: ${themeVal('color.base-50')};
`;

function DatasetsExplore() {
  const thematic = useThematicArea();
  const dataset = useThematicAreaDataset();
  const [panelRevealed, setpanelRevealed] = useState(true);

  if (!thematic || !dataset) return resourceNotFound();

  return (
    <>
      <LayoutProps title={dataset.data.name} hideFooter />
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
                <h1>Explore the dataset</h1>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  gravida sem quis ultrices vulputate. Ut eu pretium eros, eu
                  molestie augue. Etiam risus justo, consectetur at erat vel,
                  fringilla commodo felis. Suspendisse rutrum tortor ac nulla
                  volutpat lobortis. Phasellus tempus nunc risus, eu mollis erat
                  ullamcorper a.
                </p>
              </Prose>
            </IntroFoldCopy>
          </IntroFoldInner>
        </IntroFold>
        <Explorer>
          <Panel revealed={panelRevealed}>
            <PanelHeader>
              <PanelHeadline>
                <PanelTitle>Controls</PanelTitle>
              </PanelHeadline>
              <PanelActions>
                <PanelToggle
                  variation='primary-fill'
                  fitting='skinny'
                  onClick={() => setpanelRevealed((v) => !v)}
                  active={panelRevealed}
                >
                  <CollecticonSlidersHorizontal
                    title='Toggle panel visibility'
                    meaningful
                  />
                </PanelToggle>
              </PanelActions>
            </PanelHeader>
            <PanelBody>
              <PanelWidget>
                <PanelWidgetHeader>
                  <PanelWidgetTitle>Widget title</PanelWidgetTitle>
                </PanelWidgetHeader>
                <PanelWidgetBody>
                  <p>Panel content goes here.</p>
                </PanelWidgetBody>
              </PanelWidget>

              <PanelWidget>
                <PanelWidgetHeader>
                  <PanelWidgetTitle>Widget title</PanelWidgetTitle>
                </PanelWidgetHeader>
                <PanelWidgetBody>
                  <p>Panel content goes here.</p>
                </PanelWidgetBody>
              </PanelWidget>
            </PanelBody>
          </Panel>

          <Carto>
            <p>Map content goes here.</p>
          </Carto>
        </Explorer>
      </PageMainContent>
    </>
  );
}

export default DatasetsExplore;
