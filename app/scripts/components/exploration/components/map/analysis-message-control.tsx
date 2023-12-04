import React, { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import styled, { css } from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Button, createButtonStyles } from '@devseed-ui/button';
import {
  CollecticonChartLine,
  CollecticonCircleInformation
} from '@devseed-ui/collecticons';

import { timelineDatasetsAtom } from '../../atoms/datasets';
import { selectedIntervalAtom } from '../../atoms/dates';

import useAois from '$components/common/map/controls/hooks/use-aois';
import { calcFeatCollArea } from '$components/common/aoi/utils';
import { formatDateRange } from '$utils/date';
import { useAnalysisController } from '$components/exploration/hooks/use-analysis-data-request';
import useThemedControl from '$components/common/map/controls/hooks/use-themed-control';
import { AoIFeature } from '$components/common/map/types';
import { ShortcutCode } from '$styles/shortcut-code';

const AnalysisMessageWrapper = styled.div.attrs({
  'data-tour': 'analysis-message'
})`
  display: flex;
  align-items: center;
  min-height: 2rem;
  gap: ${glsp(0.5)};
`;

const AnalysisMessageInner = styled.div`
  background-color: ${themeVal('color.base-400a')};
  border-radius: ${themeVal('shape.rounded')};
  color: ${themeVal('color.surface')};
  overflow: hidden;
  display: flex;
  align-items: center;
  min-height: 1.5rem;
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

  useEffect(() => {
    // Set the analysis as obsolete when the selected features change.
    setObsolete();
  }, [setObsolete, features]);

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
        <AnalysisMessageInner>
          <StatusIconAnalyzing />
          <MessageContent>
            Analyzing an area covering {area} km<sup>2</sup>{' '}
            {dateLabel && ` from ${dateLabel}`}.
          </MessageContent>
        </AnalysisMessageInner>
        <MessageControls>
          <ButtonExit />
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
        <AnalysisMessageInner>
          <StatusIconObsolete />
          <MessageContent>
            <strong>Selection changed:</strong> area covering{' '}
            <strong>
              {area} km<sup>2</sup>
            </strong>{' '}
            {dateLabel && (
              <>
                {' '}
                from <strong>{dateLabel}</strong>{' '}
              </>
            )}
          </MessageContent>
        </AnalysisMessageInner>
        <MessageControls>
          <ButtonObsolete datasetIds={datasetIds} />
          <ButtonExit />
        </MessageControls>
      </AnalysisMessageWrapper>
    );
  } else {
    return (
      <AnalysisMessageWrapper>
        <AnalysisMessageInner>
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
        </AnalysisMessageInner>
        <MessageControls>
          <ButtonExit />
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
        <AnalysisMessageInner>
          <StatusIconPreAnalyzing />
          <MessageContent>
            An area of{' '}
            <strong>
              {area} km<sup>2</sup>
            </strong>{' '}
            {dateLabel && (
              <>
                {' '}
                from <strong>{dateLabel}</strong>{' '}
              </>
            )}
            is selected.
          </MessageContent>
        </AnalysisMessageInner>
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
        <AnalysisMessageInner>
          <StatusIconInfo />
          <MessageContent>
            <ShortcutCode>click</ShortcutCode> Select an area to start analysis.
            To select multiple areas use <ShortcutCode>shift+click</ShortcutCode>.
          </MessageContent>
        </AnalysisMessageInner>
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
      <CollecticonChartLine />
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

function StatusIconPreAnalyzing() {
  return (
    <MessageStatusIndicator status='info'>
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

const Btn = styled(Button)`
  &&& {
    ${({ variation, size }) => createButtonStyles({ variation, size })}
  }
`;

function ButtonObsolete(props: { datasetIds: string[] }) {
  const { datasetIds } = props;
  const { runAnalysis } = useAnalysisController();

  return (
    <Btn
      variation='primary-fill'
      size='small'
      onClick={() => {
        runAnalysis(datasetIds);
      }}
    >
      Apply changes
    </Btn>
  );
}

function ButtonExit() {
  const { cancelAnalysis } = useAnalysisController();
  return (
    <Btn
      variation='base-fill'
      size='small'
      onClick={() => {
        cancelAnalysis();
      }}
    >
      Exit analysis
    </Btn>
  );
}

function ButtonAnalyze(props: { datasetIds: string[] }) {
  const { datasetIds } = props;
  const { runAnalysis } = useAnalysisController();

  return (
    <Btn
      variation='primary-fill'
      size='small'
      onClick={() => {
        runAnalysis(datasetIds);
      }}
    >
      Run analysis
    </Btn>
  );
}
