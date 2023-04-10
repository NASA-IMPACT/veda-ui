import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { sticky } from 'tippy.js';
import { FeatureCollection, Polygon } from 'geojson';
import { Button, ButtonProps } from '@devseed-ui/button';
import {
  CollecticonTickSmall,
  CollecticonXmarkSmall
} from '@devseed-ui/collecticons';
import { VerticalDivider } from '@devseed-ui/toolbar';
import { DatasetLayer } from 'veda';

import { analysisParams2QueryString } from '../results/use-analysis-params';
import useSavedSettings from '../use-saved-settings';
import SavedAnalysisControl from '../saved-analysis-control';

import { Tip } from '$components/common/tip';
import { composeVisuallyDisabled } from '$utils/utils';
import { useMediaQuery } from '$utils/use-media-query';
import { ANALYSIS_PATH, ANALYSIS_RESULTS_PATH } from '$utils/routes';

const SaveButton = composeVisuallyDisabled(Button);

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
  const { isLargeUp } = useMediaQuery();

  const analysisParamsQs = useMemo(() => {
    if (!start || !end || !datasetsLayers || !aoi) return '';
    return analysisParams2QueryString({
      start,
      end,
      datasetsLayers,
      aoi
    });
  }, [start, end, datasetsLayers, aoi]);

  const { onGenerateClick } = useSavedSettings({
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
          to={`${ANALYSIS_RESULTS_PATH}${location.search}`}
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
          to={`${ANALYSIS_RESULTS_PATH}${analysisParamsQs}`}
          onClick={onGenerateClick}
        >
          <CollecticonTickSmall /> Generate
        </Button>
      )}

      <VerticalDivider variation='light' />

      <SavedAnalysisControl size={size} urlBase={ANALYSIS_PATH} />
    </>
  );
}
