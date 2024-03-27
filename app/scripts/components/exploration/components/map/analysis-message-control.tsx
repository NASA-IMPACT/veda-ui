import React, { useCallback, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import styled, { css } from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Button, createButtonStyles } from '@devseed-ui/button';
import bbox from '@turf/bbox';
import {
  CollecticonChartLine,
  CollecticonCircleInformation
} from '@devseed-ui/collecticons';
import useMaps from '$components/common/map/hooks/use-maps';
import { timelineDatasetsAtom } from '../../atoms/datasets';
import { selectedIntervalAtom } from '../../atoms/dates';

import useAois from '$components/common/map/controls/hooks/use-aois';
import { calcFeatCollArea, boundsFromFeature } from '$components/common/aoi/utils';
import { formatDateRange } from '$utils/date';
import { useAnalysisController } from '$components/exploration/hooks/use-analysis-data-request';
import useThemedControl from '$components/common/map/controls/hooks/use-themed-control';
import { AoIFeature } from '$components/common/map/types';
import { ShortcutCode } from '$styles/shortcut-code';
export function getZoomFromBbox(bbox: [number, number, number, number]): number {
  const latMax = Math.max(bbox[3], bbox[1]);
  const lngMax = Math.max(bbox[2], bbox[0]);
  const latMin = Math.min(bbox[3], bbox[1]);
  const lngMin = Math.min(bbox[2], bbox[0]);
  const maxDiff = Math.max(latMax - latMin, lngMax - lngMin);
  if (maxDiff < 360 / Math.pow(2, 20)) {
    return 21;
} else {
    const zoomLevel = Math.floor(-1*( (Math.log(maxDiff)/Math.log(2)) - (Math.log(360)/Math.log(2))));
    if (zoomLevel < 1) return 1;
    else return zoomLevel;
  }
}


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
const MessageContent = styled.div`
  line-height: 1.5rem;
  max-height: 1.5rem;

  sup {
    vertical-align: top;
  }
`;
const MessageControls = styled.div`
  display: flex;
  gap: ${glsp(0.5)};
`;

export function AnalysisMessage({ maps }) {
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
        mapInstance={maps?.main}
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
        mapInstance={maps?.main}
        datasetIds={datasetIds}
        dateLabel={dateLabel}
      />
    );
  }
}

export function AnalysisMessageControl() {
  const maps = useMaps()
  useThemedControl(() => <AnalysisMessage maps={maps} />, { position: 'top-left' });

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
  const { isObsolete, features, selectedFeatures, datasetIds, dateLabel, mapInstance } =
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
          <ButtonObsolete datasetIds={datasetIds} features={selectedFeatures} mapInstance={mapInstance} />
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
                <strong>Selection changed:</strong> select an area to analyze{' '}
                {dateLabel && (
                  <>
                    {' '}
                    from <strong>{dateLabel}</strong>{' '}
                  </>
                )}
              </>
            ) : (
              // Prompt to draw or upload features.
              <>
                <strong>Selection changed:</strong> draw or upload an area to
                analyze{' '}
                {dateLabel && (
                  <>
                    {' '}
                    from <strong>{dateLabel}</strong>{' '}
                  </>
                )}
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
  const { features, selectedFeatures, datasetIds, dateLabel, mapInstance } = props;

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
          <ButtonAnalyze mapInstance={mapInstance} features={selectedFeatures} datasetIds={datasetIds} />
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
            To select multiple areas use{' '}
            <ShortcutCode>shift+click</ShortcutCode>.
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
  const { datasetIds, features, mapInstance } = props;
  const { runAnalysis } = useAnalysisController();

  const handleClick = useCallback(() => {
    runAnalysis(datasetIds);
    const bboxToFit = bbox({
      type: 'FeatureCollection',
      features
    })

    const zoom = bboxToFit? getZoomFromBbox(bboxToFit): 14;
    mapInstance?.flyTo({
      center:[ (bboxToFit[2] + bboxToFit[0])/2, (bboxToFit[3] + bboxToFit[1])/2],
      zoom
    });
  },[datasetIds, mapInstance, features])

  return (
    <Btn
      variation='primary-fill'
      size='small'
      onClick={handleClick}
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
  const { datasetIds, mapInstance, features } = props;
  const { runAnalysis } = useAnalysisController();

  const handleClick = useCallback(() => {
    runAnalysis(datasetIds);
    const bboxToFit = bbox({
      type: 'FeatureCollection',
      features
    })

    const zoom = bboxToFit? getZoomFromBbox(bboxToFit): 14;
    mapInstance?.flyTo({
      center:[ (bboxToFit[2] + bboxToFit[0])/2, (bboxToFit[3] + bboxToFit[1])/2],
      zoom
    });
  },[datasetIds, mapInstance, features])

  return (
    <Btn
      variation='primary-fill'
      size='small'
      onClick={handleClick}
    >
      Run analysis
    </Btn>
  );
}
