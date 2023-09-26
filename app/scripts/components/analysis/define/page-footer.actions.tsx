import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Button, ButtonProps } from '@devseed-ui/button';
import { CollecticonTickSmall } from '@devseed-ui/collecticons';

import { analysisParams2QueryString } from '../results/use-analysis-params';
import useSavedSettings from '../use-saved-settings';

import { composeVisuallyDisabled } from '$utils/utils';
import { ANALYSIS_RESULTS_PATH } from '$utils/routes';
import { DatasetLayer } from 'veda';
import { FeatureCollection, Polygon } from 'geojson';
import styled from 'styled-components';
import { calcFeatCollArea } from '$components/common/aoi/utils';

const SaveButton = composeVisuallyDisabled(Button);

interface PageFooterActionsProps {
  isNewAnalysis: boolean;
  start?: Date;
  end?: Date;
  datasetsLayers?: DatasetLayer[];
  aoi?: FeatureCollection<Polygon> | null;
  disabled?: boolean;
}

const FooterActions = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const FooterRight = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 1rem;
`;

const AnalysisDescription = styled.div`
  font-size: 0.875rem;
  opacity: 0.5;
`

export default function PageFooterActions({
  // size,
  isNewAnalysis,
  start,
  end,
  datasetsLayers,
  aoi,
  disabled
}: PageFooterActionsProps) {
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

  const analysisDescription = useMemo(() => {
    if (!start || !end || !datasetsLayers || !aoi) return '';
    const dataset =
      datasetsLayers.length === 1
        ? datasetsLayers[0].name
        : `${datasetsLayers.length} datasets`;
    const area = `over a ${calcFeatCollArea(aoi)} km² area`
    const dates = `from ${format(start, 'MMM d, yyyy')} to ${format(end, 'MMM d, yyyy')}`
    return [dataset, area, dates].join(' ');
  }, [start, end, datasetsLayers, aoi]);

  return (
    <FooterActions>
      <div>
        {!isNewAnalysis && (
          <Button
            forwardedAs={Link}
            to={`${ANALYSIS_RESULTS_PATH}${location.search}`}
            type='button'
            size='xlarge'
            radius='square'
            variation='primary-outline'
          >
            Cancel
          </Button>
        )}
      </div>
      <FooterRight>
        <AnalysisDescription>{analysisDescription}</AnalysisDescription>

        {disabled ? (
          <SaveButton
            type='button'
            size='xlarge'
            radius='square'
            variation='primary-fill'
            visuallyDisabled={true}
          >
            <CollecticonTickSmall /> Generate analysis
          </SaveButton>
        ) : (
          <Button
            forwardedAs={Link}
            radius='square'
            variation='primary-fill'
            size='xlarge'
            to={`${ANALYSIS_RESULTS_PATH}${analysisParamsQs}`}
            onClick={onGenerateClick}
          >
            <CollecticonTickSmall /> Generate analysis
          </Button>
        )}
      </FooterRight>
    </FooterActions>
  );
}
