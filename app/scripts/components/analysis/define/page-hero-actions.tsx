import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { sticky } from 'tippy.js';
import { Feature, MultiPolygon, Polygon } from 'geojson';
import styled from 'styled-components';

import { glsp, listReset, themeVal } from '@devseed-ui/theme-provider';
import { Button, ButtonProps } from '@devseed-ui/button';
import {
  CollecticonTickSmall,
  CollecticonXmarkSmall,
  CollecticonClockBack
} from '@devseed-ui/collecticons';

import { Toolbar, ToolbarIconButton, VerticalDivider } from '@devseed-ui/toolbar';
import {
  Dropdown,
  DropTitle
} from '@devseed-ui/dropdown';
import { Subtitle } from '@devseed-ui/typography';

import { DatasetLayer } from 'veda/thematics';

import { analysisParams2QueryString } from '../results/use-analysis-params';

import useSavedSettings from './use-saved-settings';

import { Tip } from '$components/common/tip';
import { resourceNotFound } from '$components/uhoh';
import { thematicAnalysisPath } from '$utils/routes';
import { useThematicArea } from '$utils/thematics';
import { composeVisuallyDisabled } from '$utils/utils';
import { useMediaQuery } from '$utils/use-media-query';
import { VarHeading } from '$styles/variable-components';

// import DropMenuItemButton from '$styles/drop-menu-item-button';

const SaveButton = composeVisuallyDisabled(Button);

const PastAnalysesMenu = styled.ol`
  ${listReset()}
  display: flex;
  flex-flow: column nowrap;
  gap: ${glsp(0.25)};

  li {
    display: flex;
    flex-flow: row nowrap;
    gap: ${glsp(0.5)};
    align-items: top;

    > svg {
      flex-shrink: 0;
      margin-top: ${glsp(0.25)};
    }
  }
`;

const PastAnalysis = styled.a`
  display: flex;
  flex-flow: row nowrap;
  gap: ${glsp(0.5)};
`;

const PastAnalysisMedia = styled.figure`
  position: relative;
  order: -1;
  height: 3rem;
  overflow: hidden;
  border-radius: ${themeVal('shape.rounded')};
  flex-shrink: 0;
  aspect-ratio: 1.5 / 1;
  background: ${themeVal('color.base-50')};

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    content: '';
    box-shadow: inset 0 0 0 1px ${themeVal('color.base-100a')};
    border-radius: ${themeVal('shape.rounded')};
    pointer-events: none;
  }
`;

const PastAnalysisHeadline = styled.div`
  /* styled-component */
`;

const PastAnalysisTitle = styled(VarHeading).attrs({
  as: 'h4',
  size: 'xxsmall'
})`
  /* styled-component */
`;

const PastAnalysisSubtitle = styled(Subtitle)`
  /* styled-component */
`;
interface PageHeroActionsProps {
  size: ButtonProps['size'];
  isNewAnalysis: boolean;
  showTip: boolean;
  start?: Date;
  end?: Date;
  datasetsLayers?: DatasetLayer[];
  aoi?: Feature<Polygon> | null;
}

export default function PageHeroActions({
  size,
  isNewAnalysis,
  showTip,
  start,
  end,
  datasetsLayers,
  aoi
}: PageHeroActionsProps) {
  const thematic = useThematicArea();
  const { isLargeUp } = useMediaQuery();
  if (!thematic) throw resourceNotFound();

  const analysisParamsQs = useMemo(() => {
    if (!start || !end || !datasetsLayers || !aoi) return '';
    // Quick and dirty conversion to MultiPolygon - might be avoided if using
    // Google-polyline?
    const toMultiPolygon: Feature<MultiPolygon> = {
      type: 'Feature',
      properties: { ...aoi.properties },
      geometry: {
        type: 'MultiPolygon',
        coordinates: [aoi.geometry.coordinates]
      }
    };

    return analysisParams2QueryString({
      start,
      end,
      datasetsLayers,
      aoi: toMultiPolygon
    });
  }, [start, end, datasetsLayers, aoi]);

  const { onGenerateClick, thematicAreaSavedSettingsList } = useSavedSettings(
    thematic.data.id,
    analysisParamsQs,
    start,
    end,
    datasetsLayers
  );

  let tipContents;

  if (showTip) {
    tipContents = 'To get results, ';
    let instructions: string[] = [];
    if (!start || !end)
      instructions = [...instructions, 'pick start and end dates'];
    if (!aoi) instructions = [...instructions, 'define an area'];
    if (!datasetsLayers?.length)
      instructions = [...instructions, 'select datasets'];

    const instructionsString = instructions
      .join(', ')
      .replace(/,\s([^,]+)$/, ' and $1.');

    tipContents = [tipContents, instructionsString].join('');
  }

  return (
    <>
      {thematicAreaSavedSettingsList.length > 0 && (
        <Dropdown
          alignment='right'
          triggerElement={(props) => (
            <ToolbarIconButton variation='base-text' {...props}>
              <Button size={size} variation='achromic-outline'>
                <CollecticonClockBack title='Show past analyses' meaningful />
              </Button>
            </ToolbarIconButton>
          )}
        >
          <DropTitle>Past analyses</DropTitle>
          <PastAnalysesMenu>
            <li>
              <PastAnalysis>
                <PastAnalysisMedia>
                  <img
                    src='https://via.placeholder.com/480x320'
                    alt='Thumbnail showing AOI'
                  />
                </PastAnalysisMedia>
                <PastAnalysisHeadline>
                  <PastAnalysisTitle>
                    19 M km2 area from Feb 1st, 2020 to Jan 23rd, 2023
                  </PastAnalysisTitle>
                  <PastAnalysisSubtitle>
                    N02, Dataset B, Dataset C (+2)
                  </PastAnalysisSubtitle>
                </PastAnalysisHeadline>
              </PastAnalysis>
            </li>
          </PastAnalysesMenu>
          {/* <DropMenu>
            {thematicAreaSavedSettingsList.map((savedSettings) => (
              <li key={savedSettings.url}>
                <DropMenuItem data-dropdown='click.close'>
                  <Button
                    forwardedAs={Link}
                    to={`${thematicAnalysisPath(thematic)}/${
                      savedSettings.url
                    }`}
                  >
                    {savedSettings.label}
                  </Button>
                </DropMenuItem>
              </li>
            ))}
          </DropMenu> */}
        </Dropdown>
      )}

      <VerticalDivider variation='light' />

      {!isNewAnalysis && (
        <Button
          forwardedAs={Link}
          to={`${thematicAnalysisPath(thematic)}/results${location.search}`}
          type='button'
          size={size}
          variation='achromic-outline'
        >
          <CollecticonXmarkSmall /> Cancel
        </Button>
      )}
      {showTip ? (
        <Tip
          visible={isLargeUp ? true : undefined}
          placement={isLargeUp ? 'left' : 'bottom-end'}
          content={tipContents}
          sticky='reference'
          plugins={[sticky]}
        >
          <SaveButton
            type='button'
            size={size}
            variation='achromic-outline'
            visuallyDisabled={true}
          >
            <CollecticonTickSmall /> Generate
          </SaveButton>
        </Tip>
      ) : (
        <Button
          forwardedAs={Link}
          variation='achromic-outline'
          size={size}
          to={`${thematicAnalysisPath(thematic)}/results${analysisParamsQs}`}
          onClick={onGenerateClick}
        >
          <CollecticonTickSmall /> Generate
        </Button>
      )}
    </>
  );
}
