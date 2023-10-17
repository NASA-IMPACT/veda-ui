import React, { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import {
  CollecticonChartLine,
  CollecticonXmarkSmall
} from '@devseed-ui/collecticons';

import { selectedIntervalAtom, timelineDatasetsAtom } from '../../atoms/atoms';

import useAois from '$components/common/map/controls/hooks/use-aois';
import { calcFeatCollArea } from '$components/common/aoi/utils';
import { formatDateRange } from '$utils/date';
import { useAnalysisController } from '$components/exploration/hooks/use-analysis-data-request';

const AnalysisMessageWrapper = styled.div`
  position: absolute;
  background-color: #fff;
  top: 2rem;
  left: 5rem;
  padding: 0.25rem 0.5rem;
`;

export function AnalysisMessage() {
  const { isObsolete, setObsolete, runAnalysis, cancelAnalysis, isAnalyzing } =
    useAnalysisController();

  const datasets = useAtomValue(timelineDatasetsAtom);
  const datasetIds = datasets.map((d) => d.data.id);

  const { features } = useAois();
  const selectedInterval = useAtomValue(selectedIntervalAtom);
  const dateLabel =
    selectedInterval &&
    formatDateRange(selectedInterval.start, selectedInterval.end);

  const selectedFeatures = features.filter((f) => f.selected);
  const selectedFeatureIds = selectedFeatures.map((f) => f.id).join(',');

  useEffect(() => {
    // Set the analysis as obsolete when the selected features change.
    setObsolete();
  }, [setObsolete, selectedFeatureIds]);

  if (!selectedFeatures.length) return null;

  const area = calcFeatCollArea({
    type: 'FeatureCollection',
    features: selectedFeatures
  });

  return (
    <AnalysisMessageWrapper>
      An area of {area} km<sup>2</sup> is selected
      {dateLabel && ` from ${dateLabel}`}.{' '}
      {isAnalyzing ? (
        <Button
          variation='base-text'
          size='small'
          onClick={() => {
            cancelAnalysis();
          }}
        >
          <CollecticonXmarkSmall /> Cancel
        </Button>
      ) : (
        <Button
          variation='base-text'
          size='small'
          onClick={() => {
            runAnalysis(datasetIds);
          }}
        >
          <CollecticonChartLine /> Analyze
        </Button>
      )}
      {isAnalyzing && isObsolete && (
        <>
          The current analysis is obsolete.{' '}
          <Button
            variation='base-text'
            size='small'
            onClick={() => {
              runAnalysis(datasetIds);
            }}
          >
            <CollecticonChartLine /> Update
          </Button>
        </>
      )}
    </AnalysisMessageWrapper>
  );
}
