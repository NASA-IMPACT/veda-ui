import React, { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import styled, { css } from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import { VerticalDivider } from '@devseed-ui/toolbar';
import {
  CollecticonArrowLoop,
  CollecticonChartLine,
  CollecticonCircleInformation,
  CollecticonSignDanger,
  CollecticonXmarkSmall
} from '@devseed-ui/collecticons';

import { selectedIntervalAtom, timelineDatasetsAtom } from '../../atoms/atoms';

import useAois from '$components/common/map/controls/hooks/use-aois';
import { calcFeatCollArea } from '$components/common/aoi/utils';
import { formatDateRange } from '$utils/date';
import { useAnalysisController } from '$components/exploration/hooks/use-analysis-data-request';
import useThemedControl from '$components/common/map/controls/hooks/use-themed-control';

const AnalysisMessageWrapper = styled.div`
  background-color: ${themeVal('color.base-400a')};
  color: ${themeVal('color.surface')};
  border-radius: ${themeVal('shape.rounded')};
  overflow: hidden;
  display: flex;
  align-items: center;
  min-height: 2rem;
  gap: ${glsp(0.5)};
  padding: ${glsp(0, 0.5)};
`;

interface MessageStatusIndicatorProps {
  status: 'info' | 'analyzing' | 'obsolete';
}
const MessageStatusIndicator = styled.div<MessageStatusIndicatorProps>`
  display: flex;
  align-items: center;
  padding: ${glsp(0, 0.5)};
  margin-left: ${glsp(-0.5)};
  align-self: stretch;

  ${({ status }) => {
    switch (status) {
      case 'info':
        return css`
          background-color: ${themeVal('color.info')};
        `;
      case 'analyzing':
        return css`
          background-color: ${themeVal('color.success')};
        `;
      case 'obsolete':
        return css`
          background-color: ${themeVal('color.danger')};
        `;
    }
  }}
`;
const MessageContent = styled.div``;
const MessageControls = styled.div`
  display: flex;
  gap: ${glsp(0.5)};
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
      {isAnalyzing ? (
        isObsolete ? (
          <MessageStatusIndicator status='obsolete'>
            <CollecticonSignDanger />
          </MessageStatusIndicator>
        ) : (
          <MessageStatusIndicator status='analyzing'>
            <CollecticonChartLine />
          </MessageStatusIndicator>
        )
      ) : (
        <MessageStatusIndicator status='info'>
          <CollecticonCircleInformation />
        </MessageStatusIndicator>
      )}
      <MessageContent>
        {isAnalyzing ? (
          isObsolete ? (
            <>
              Outdated! Refresh to analyze an area covering {area} km
              <sup>2</sup> {dateLabel && ` from ${dateLabel}.`}
            </>
          ) : (
            <>
              Analyzing an area covering {area} km<sup>2</sup>{' '}
              {dateLabel && ` from ${dateLabel}`}.
            </>
          )
        ) : (
          <>
            An area of {area} km<sup>2</sup> {dateLabel && ` from ${dateLabel}`}{' '}
            is selected.
          </>
        )}
      </MessageContent>
      <VerticalDivider variation='light' />
      <MessageControls>
        {isAnalyzing ? (
          <>
            {isObsolete && (
              <Button
                variation={'achromic-text' as any}
                size='small'
                fitting='skinny'
                onClick={() => {
                  runAnalysis(datasetIds);
                }}
              >
                <CollecticonArrowLoop meaningful title='Update analysis' />
              </Button>
            )}
            <Button
              variation={'achromic-text' as any}
              size='small'
              fitting='skinny'
              onClick={() => {
                cancelAnalysis();
              }}
            >
              <CollecticonXmarkSmall meaningful title='Cancel analysis' />
            </Button>
          </>
        ) : (
          <Button
            variation={'achromic-text' as any}
            size='small'
            onClick={() => {
              runAnalysis(datasetIds);
            }}
          >
            <CollecticonChartLine /> Analyze
          </Button>
        )}
      </MessageControls>
    </AnalysisMessageWrapper>
  );
}

export function AnalysisMessageControl() {
  useThemedControl(() => <AnalysisMessage />, { position: 'top-left' });

  return null;
}

AnalysisMessageControl.displayName = 'AnalysisMessageControl';
