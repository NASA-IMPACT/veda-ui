import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { sticky } from 'tippy.js';
import { FeatureCollection, Polygon } from 'geojson';
import styled, { useTheme } from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Button, ButtonProps } from '@devseed-ui/button';
import {
  CollecticonTickSmall,
  CollecticonXmarkSmall,
  CollecticonClockBack
} from '@devseed-ui/collecticons';

import { ToolbarIconButton, VerticalDivider } from '@devseed-ui/toolbar';
import {
  Dropdown,
  DropMenu,
  DropMenuItem,
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
import { calcFeatCollArea } from '$components/common/aoi/utils';
import { formatDateRange } from '$utils/date';
import ItemTruncateCount from '$components/common/item-truncate-count';

// import DropMenuItemButton from '$styles/drop-menu-item-button';

const SaveButton = composeVisuallyDisabled(Button);

const PastAnalysesDropdown = styled(Dropdown)`
  max-width: 22rem;
`;

const PastAnalysesMenu = styled(DropMenu)``;

const PastAnalysisItem = styled(DropMenuItem)``;

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
  display: flex;
  flex-flow: column nowrap;
  gap: ${glsp(0.25)};
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
  aoi?: FeatureCollection<Polygon> | null;
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
    return analysisParams2QueryString({
      start,
      end,
      datasetsLayers,
      aoi
    });
  }, [start, end, datasetsLayers, aoi]);

  const { onGenerateClick, thematicAreaSavedSettingsList } = useSavedSettings({
    thematicAreaId: thematic.data.id,
    analysisParamsQs,
    params: {
      start,
      end,
      datasets: datasetsLayers?.map((d) => d.name),
      aoi: aoi ?? undefined
    }
  });

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

      <VerticalDivider variation='light' />

      <PastAnalysesDropdown
        alignment='right'
        triggerElement={(props) => (
          <ToolbarIconButton variation='base-text' {...props}>
            <Button
              size={size}
              variation='achromic-outline'
              disabled={!thematicAreaSavedSettingsList.length}
            >
              <CollecticonClockBack title='Show past analyses' meaningful />
            </Button>
          </ToolbarIconButton>
        )}
      >
        <DropTitle>Past analyses</DropTitle>
        <PastAnalysesMenu as='ol'>
          {thematicAreaSavedSettingsList.map((savedSettings) => {
            const { start, end, aoi, datasets } = savedSettings.params;
            return (
              <li key={savedSettings.url}>
                <article>
                  <Tip
                    content={
                      <>
                        <p>
                          {calcFeatCollArea(aoi)} km<sup>2</sup>
                        </p>
                        <p>
                          <ItemTruncateCount items={datasets} max={Infinity} />
                        </p>
                      </>
                    }
                  >
                    <PastAnalysisItem
                      as={Link}
                      to={`${thematicAnalysisPath(thematic)}/${
                        savedSettings.url
                      }`}
                    >
                      <PastAnalysisHeadline>
                        <PastAnalysisTitle>
                          {formatDateRange(
                            new Date(start),
                            new Date(end),
                            ' — '
                          )}
                        </PastAnalysisTitle>
                        <PastAnalysisSubtitle>
                          <ItemTruncateCount items={datasets} />
                        </PastAnalysisSubtitle>
                      </PastAnalysisHeadline>
                      <PastAnalysisMedia>
                        <SavedAnalysisThumbnail aoi={aoi} />
                      </PastAnalysisMedia>
                    </PastAnalysisItem>
                  </Tip>
                </article>
              </li>
            );
          })}
        </PastAnalysesMenu>
      </PastAnalysesDropdown>
    </>
  );
}

function SavedAnalysisThumbnail(props: { aoi: FeatureCollection<Polygon> }) {
  const { aoi } = props;

  const theme = useTheme();

  const styledFeatures = {
    ...aoi,
    features: aoi.features.map(({ geometry }) => ({
      type: 'Feature',
      properties: {
        fill: theme.color?.primary,
        'stroke-width': 2,
        stroke: theme.color?.primary
      },
      geometry
    }))
  };

  const encoded = encodeURIComponent(JSON.stringify(styledFeatures));

  const src = `https://api.mapbox.com/styles/v1/covid-nasa/cldac5c2c003k01oebmavw4q3/static/geojson(${encoded})/auto/480x320?access_token=${process.env.MAPBOX_TOKEN}`;

  return <img src={src} alt='Thumbnail showing AOI' />;
}
