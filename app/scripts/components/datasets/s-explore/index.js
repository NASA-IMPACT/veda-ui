import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  add,
  glsp,
  media,
  themeVal,
  visuallyHidden
} from '@devseed-ui/theme-provider';
import { Prose } from '@devseed-ui/typography';
import { CollecticonSlidersHorizontal } from '@devseed-ui/collecticons';

import { resourceNotFound } from '$components/uhoh';
import PageLocalNav, {
  DatasetsLocalMenu
} from '$components/common/page-local-nav';
import Constrainer from '$styles/constrainer';
import { PageMainContent } from '$styles/page';
import {
  Panel,
  PanelActions,
  PanelBody,
  PanelHeader,
  PanelHeadline,
  PanelInner,
  PanelTitle,
  PanelToggle,
  PanelWidget,
  PanelWidgetBody,
  PanelWidgetHeader,
  PanelWidgetTitle
} from '$styles/panel';
import { LayoutProps } from '$components/common/layout-root';

import { variableGlsp } from '$styles/variable-utils';
import { useThematicArea, useThematicAreaDataset } from '$utils/thematics';
import { useMediaQuery } from '$utils/use-media-query';
import { thematicDatasetsPath } from '$utils/routes';
import PageHero from '$components/common/page-hero';

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
  background: ${themeVal('color.surface')};
`;

function DatasetsExplore() {
  const thematic = useThematicArea();
  const dataset = useThematicAreaDataset();

  const { isMediumDown } = useMediaQuery();

  const [panelRevealed, setPanelRevealed] = useState(!isMediumDown);

  const panelBodyRef = useRef(null);
  // Click listener for the whole body panel so we can close it when clicking
  // the overlay on medium down media query.
  const onPanelClick = useCallback((e) => {
    if (!panelBodyRef.current?.contains(e.target)) {
      setPanelRevealed(false);
    }
  }, []);

  // Close panel when media query changes.
  useEffect(() => {
    setPanelRevealed(!isMediumDown);
  }, [isMediumDown]);

  if (!thematic || !dataset) throw resourceNotFound();

  return (
    <>
      <LayoutProps title={dataset.data.name} hideFooter />
      <PageLocalNav
        parentName='Dataset'
        parentLabel='Datasets'
        parentTo={thematicDatasetsPath(thematic)}
        items={thematic.data.datasets}
        currentId={dataset.data.id}
        localMenuCmp={
          <DatasetsLocalMenu thematic={thematic} dataset={dataset} />
        }
      />
      <PageMainContent>
        <PageHero title={`${dataset.data.name} exploration`} isHidden />
        <Explorer>
          <Panel revealed={panelRevealed} onClick={onPanelClick}>
            <PanelInner ref={panelBodyRef}>
              <PanelHeader>
                <PanelHeadline>
                  <PanelTitle>Controls</PanelTitle>
                </PanelHeadline>
                <PanelActions>
                  <PanelToggle
                    variation='primary-fill'
                    fitting='skinny'
                    onClick={() => setPanelRevealed((v) => !v)}
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
            </PanelInner>
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
