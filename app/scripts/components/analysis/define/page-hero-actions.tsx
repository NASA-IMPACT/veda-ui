import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { sticky } from 'tippy.js';
import { Feature, MultiPolygon, Polygon } from 'geojson';
// import styled from 'styled-components';
import { Button, ButtonProps } from '@devseed-ui/button';
import {
  CollecticonTickSmall,
  CollecticonXmarkSmall,
  CollecticonArrowSpinCcw
} from '@devseed-ui/collecticons';

import { Toolbar, ToolbarIconButton } from '@devseed-ui/toolbar';
import {
  Dropdown,
  DropMenu,
  DropTitle,
  DropMenuItem
} from '@devseed-ui/dropdown';

import { DatasetLayer } from 'veda/thematics';

import { analysisParams2QueryString } from '../results/use-analysis-params';

import useSavedSettings from './use-saved-settings';

import { Tip } from '$components/common/tip';
import { resourceNotFound } from '$components/uhoh';
import { thematicAnalysisPath } from '$utils/routes';
import { useThematicArea } from '$utils/thematics';
import { composeVisuallyDisabled } from '$utils/utils';
import { useMediaQuery } from '$utils/use-media-query';

// import DropMenuItemButton from '$styles/drop-menu-item-button';

const SaveButton = composeVisuallyDisabled(Button);

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
      {thematicAreaSavedSettingsList.length > 0 && (
        <Toolbar size='small'>
          <Dropdown
            alignment='right'
            triggerElement={(props) => (
              <ToolbarIconButton variation='base-text' {...props}>
                <Button size={size} variation='achromic-outline'>
                  <CollecticonArrowSpinCcw
                    title='Retrieve previous settings'
                    meaningful
                  />
                </Button>
              </ToolbarIconButton>
            )}
          >
            <DropTitle>Retrieve previous settings</DropTitle>
            <DropMenu>
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
            </DropMenu>
          </Dropdown>
        </Toolbar>
      )}
    </>
  );
}
