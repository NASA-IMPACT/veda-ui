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

import { timelineDatasetsAtom } from '../../atoms/datasets';
import { selectedIntervalAtom } from '../../atoms/dates';

import useAois from '$components/common/map/controls/hooks/use-aois';
import { calcFeatCollArea } from '$components/common/aoi/utils';
import { formatDateRange } from '$utils/date';
import { useAnalysisController } from '$components/exploration/hooks/use-analysis-data-request';
import useThemedControl from '$components/common/map/controls/hooks/use-themed-control';
import { AoIFeature } from '$components/common/map/types';

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
  const { isObsolete, setObsolete, isAnalyzing } = useAnalysisController();

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

  if (isAnalyzing) {
    return (
      <MessagesWhileAnalyzing
        isObsolete={isObsolete}
        features={features}
        selectedFeatures={selectedFeatures}
        datasetIds={datasetIds}
        dateLabel={dateLabel}
      />
    );
  } else {
    return (
      <MessagesWhileNotAnalyzing
        features={features}
        selectedFeatures={selectedFeatures}
        datasetIds={datasetIds}
        dateLabel={dateLabel}
      />
    );
  }
}

export function AnalysisMessageControl() {
  useThemedControl(() => <AnalysisMessage />, { position: 'top-left' });

  return null;
}

// / / / / / /      Analysis messages for different states        / / / / / / //
interface MessagesProps {
  features: AoIFeature[];
  selectedFeatures: AoIFeature[];
  datasetIds: string[];
  dateLabel: string | null;
}

function MessagesWhileAnalyzing(
  props: MessagesProps & { isObsolete: boolean }
) {
  const { isObsolete, features, selectedFeatures, datasetIds, dateLabel } =
    props;

  const area = calcFeatCollArea({
    type: 'FeatureCollection',
    features: selectedFeatures
  });

  if (!isObsolete) {
    // Analyzing and not obsolete.
    return (
      <AnalysisMessageWrapper>
        <StatusIconAnalyzing />
        <MessageContent>
          Analyzing an area covering {area} km<sup>2</sup>{' '}
          {dateLabel && ` from ${dateLabel}`}.
        </MessageContent>
        <VerticalDivider variation='light' />
        <MessageControls>
          <ButtonCancel />
        </MessageControls>
      </AnalysisMessageWrapper>
    );
  }

  // Analyzing, and obsolete.
  if (selectedFeatures.length) {
    // Features are selected.
    // Prompt for a refresh.
    return (
      <AnalysisMessageWrapper>
        <StatusIconObsolete />
        <MessageContent>
          Outdated! Refresh to analyze an area covering {area} km
          <sup>2</sup> {dateLabel && ` from ${dateLabel}.`}
        </MessageContent>
        <VerticalDivider variation='light' />
        <MessageControls>
          <ButtonObsolete datasetIds={datasetIds} />
          <ButtonCancel />
        </MessageControls>
      </AnalysisMessageWrapper>
    );
  } else {
    return (
      <AnalysisMessageWrapper>
        <StatusIconObsolete />
        <MessageContent>
          {features.length ? (
            // Prompt to select features.
            <>
              Outdated! Select an area to analyze{' '}
              {dateLabel && ` from ${dateLabel}.`}
            </>
          ) : (
            // Prompt to draw or upload features.
            <>
              Outdated! Draw or upload an area to analyze{' '}
              {dateLabel && ` from ${dateLabel}.`}
            </>
          )}
        </MessageContent>
        <VerticalDivider variation='light' />
        <MessageControls>
          <ButtonCancel />
        </MessageControls>
      </AnalysisMessageWrapper>
    );
  }
}

function MessagesWhileNotAnalyzing(props: MessagesProps) {
  const { features, selectedFeatures, datasetIds, dateLabel } = props;

  if (selectedFeatures.length) {
    // Not analyzing, but there are selected features.
    // Can start analysis
    const area = calcFeatCollArea({
      type: 'FeatureCollection',
      features: selectedFeatures
    });

    return (
      <AnalysisMessageWrapper>
        <StatusIconInfo />
        <MessageContent>
          An area of {area} km<sup>2</sup> {dateLabel && ` from ${dateLabel}`}{' '}
          is selected.
        </MessageContent>
        <VerticalDivider variation='light' />
        <MessageControls>
          <ButtonAnalyze datasetIds={datasetIds} />
        </MessageControls>
      </AnalysisMessageWrapper>
    );
  } else if (features.length) {
    // Not analyzing, nothing selected, but there are features.
    // Prompt to select features.
    return (
      <AnalysisMessageWrapper>
        <StatusIconInfo />
        <MessageContent>
          Select one or more of the areas (using shift key) to start analysis.
        </MessageContent>
      </AnalysisMessageWrapper>
    );
  } else {
    // Not analyzing, nothing selected, no features.
    // Do not display anything.
    return null;
  }
}

// / / / / / /   Components to construct the analysis messages    / / / / / / //
function StatusIconObsolete() {
  return (
    <MessageStatusIndicator status='obsolete'>
      <CollecticonSignDanger />
    </MessageStatusIndicator>
  );
}

function StatusIconAnalyzing() {
  return (
    <MessageStatusIndicator status='analyzing'>
      <CollecticonChartLine />
    </MessageStatusIndicator>
  );
}

function StatusIconInfo() {
  return (
    <MessageStatusIndicator status='info'>
      <CollecticonCircleInformation />
    </MessageStatusIndicator>
  );
}

function ButtonObsolete(props: { datasetIds: string[] }) {
  const { datasetIds } = props;
  const { runAnalysis } = useAnalysisController();

  return (
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
  );
}

function ButtonCancel() {
  const { cancelAnalysis } = useAnalysisController();
  return (
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
  );
}

function ButtonAnalyze(props: { datasetIds: string[] }) {
  const { datasetIds } = props;
  const { runAnalysis } = useAnalysisController();

  return (
    <Button
      variation={'achromic-text' as any}
      size='small'
      onClick={() => {
        runAnalysis(datasetIds);
      }}
    >
      <CollecticonChartLine /> Analyze
    </Button>
  );
}
