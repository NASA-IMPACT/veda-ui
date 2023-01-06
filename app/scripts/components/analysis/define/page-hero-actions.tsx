import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { sticky } from 'tippy.js';
import { Feature, MultiPolygon, Polygon } from 'geojson';
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
import { Tip } from '$components/common/tip';
import { resourceNotFound } from '$components/uhoh';
import { thematicAnalysisPath } from '$utils/routes';
import { useThematicArea } from '$utils/thematics';
import { composeVisuallyDisabled } from '$utils/utils';
import { useMediaQuery } from '$utils/use-media-query';
import DropMenuItemButton from '$styles/drop-menu-item-button';
import { getDateRangeFormatted } from '../utils';
import styled from 'styled-components';

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
interface SavedSettings {
  url: string;
  label: string;
}

const SAVED_SETTINGS_KEY = 'analysisSavedSettings';
const MAX_SAVED_SETTINGS = 5;

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

  const onGenerateClick = useCallback(() => {
    console.log(datasetsLayers);
    const savedSettingsRaw = localStorage.getItem(SAVED_SETTINGS_KEY);
    try {
      let savedSettings: SavedSettings[] = savedSettingsRaw
        ? JSON.parse(savedSettingsRaw)
        : [];
      if (!savedSettings.find((s) => s.url === analysisParamsQs)) {
        savedSettings = [
          {
            url: analysisParamsQs,
            label: `${datasetsLayers
              ?.map((dL) => dL.name)
              .join(', ')} - ${getDateRangeFormatted(start, end)}`
          },
          ...savedSettings,
        ];
        if (savedSettings.length > MAX_SAVED_SETTINGS) {
          savedSettings = savedSettings.slice(1);
        }
        localStorage.setItem(SAVED_SETTINGS_KEY, JSON.stringify(savedSettings));
      }
    } catch (e) {}
  }, [analysisParamsQs]);

  // Only need to read localStorage at component mount, because whenever the localStorage item is updated,
  // this components gets unmounted anyways (navigating from the page using the 'Generate' button)
  const [savedSettingsList, setSavedSettingsList] = useState<SavedSettings[]>(
    []
  );
  useEffect(() => {
    const savedSettingsRaw = localStorage.getItem('analysisSavedSettings');
    try {
      if (savedSettingsRaw) {
        setSavedSettingsList(JSON.parse(savedSettingsRaw));
      }
    } catch (e) {}
  }, []);

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
      {savedSettingsList.length > 0 && (
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
              {savedSettingsList.map((savedSettings) => (
                <li>
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
