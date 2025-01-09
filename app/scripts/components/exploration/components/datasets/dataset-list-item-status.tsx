import React from 'react';
import styled, { css } from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import { CollecticonArrowLoop } from '@devseed-ui/collecticons';

import { pulsingAnimation } from '$components/common/loading-skeleton';
import {
  DATASET_TRACK_BLOCK_HEIGHT,
  MAX_QUERY_NUM
} from '$components/exploration/constants';
import { ExtendedError } from '$components/exploration/data-utils-no-faux-module';

const loadingPattern = '.-.. --- .- -.. .. -. --.'
  .split(' ')
  .map((c) => c.split(''));

const errorPattern = '. .-. .-. --- .-. . -..'
  .split(' ')
  .map((c) => c.split(''));

const Track = styled.div`
  display: flex;
  gap: 1.5rem;
  margin: auto;
  padding: 0 1rem;
`;

const Item = styled.div<{ code: string }>`
  height: ${DATASET_TRACK_BLOCK_HEIGHT}px;
  width: ${({ code }) => (code === '.' ? '1rem' : '2rem')};
  border-radius: 4px;
`;

const TrackBlock = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const TrackMessage = styled.div<{ isError?: boolean }>`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  padding: ${glsp(0.5, 1)};
  background: ${themeVal('color.surface-300a')};
  z-index: ${themeVal('zIndices.overlay')};
  display: flex;
  gap: 1rem;
  font-weight: ${themeVal('type.base.bold')};
  font-size: 0.875rem;
  text-align: center;

  ${({ isError }) =>
    isError &&
    css`
      color: ${themeVal('color.danger')};
    `}
`;

const TrackLoading = styled(Track)`
  ${pulsingAnimation}

  ${Item} {
    background: ${themeVal('color.base-200')};
  }
`;

const TrackError = styled(Track)`
  ${Item} {
    background: ${themeVal('color.danger-200')};
  }
`;

export function DatasetTrackLoading(props: { message?: React.ReactNode }) {
  const { message } = props;
  /* eslint-disable react/no-array-index-key */
  return (
    <>
      <TrackLoading>
        {loadingPattern.map((letter, i) => (
          <TrackBlock key={i}>
            {letter.map((s, i2) => (
              <Item key={i2} code={s} />
            ))}
          </TrackBlock>
        ))}
      </TrackLoading>
      {message && <TrackMessage>{message}</TrackMessage>}
    </>
  );
  /* eslint-enable react/no-array-index-key */
}

export function DatasetTrackError(props: {
  error?: any;
  message?: React.ReactNode;
  onRetryClick?: () => void;
}) {
  const { message, onRetryClick, error } = props;

  /* eslint-disable react/no-array-index-key */
  const patternContent = (
    <TrackError>
      {errorPattern.map((letter, i) => (
        <TrackBlock key={i}>
          {letter.map((s, i2) => (
            <Item key={i2} code={s} />
          ))}
        </TrackBlock>
      ))}
    </TrackError>
  );

  if (
    error instanceof ExtendedError &&
    error.code === 'ANALYSIS_TOO_MANY_ASSETS'
  ) {
    return (
      <>
        {patternContent}
        <TrackMessage isError>
          <p>
            Analysis is limited to {MAX_QUERY_NUM} data points. Your selection
            includes {error.details?.assetCount} points. Please select a shorter
            time range.
          </p>
        </TrackMessage>
      </>
    );
  }

  if (
    error instanceof ExtendedError &&
    error.code === 'ANALYSIS_NOT_SUPPORTED'
  ) {
    return (
      <>
        {patternContent}
        <TrackMessage>
          <p>Analysis is not supported for this dataset.</p>
        </TrackMessage>
      </>
    );
  }

  if (error instanceof ExtendedError && error.code === 'ANALYSIS_NO_DATA') {
    return (
      <>
        {patternContent}
        <TrackMessage>
          <p>No data for the selected time range and area of interest.</p>
        </TrackMessage>
      </>
    );
  }
  if (
    error instanceof ExtendedError &&
    error.code === 'ANALYSIS_NO_VALID_DATA'
  ) {
    return (
      <>
        {patternContent}
        <TrackMessage>
          <p>{error.message}</p>
        </TrackMessage>
      </>
    );
  }

  return (
    <>
      {patternContent}
      {message && (
        <TrackMessage isError>
          <p>{message}</p>
          {typeof onRetryClick === 'function' ? (
            <Button variation='danger-fill' size='small' onClick={onRetryClick}>
              Retry <CollecticonArrowLoop size='small' />
            </Button>
          ) : null}
        </TrackMessage>
      )}
    </>
  );
  /* eslint-enable react/no-array-index-key */
}
