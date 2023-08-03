import React from 'react';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';

import { DATASET_TRACK_BLOCK_HEIGHT } from './constants';

import { pulsingAnimation } from '$components/common/loading-skeleton';

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

export function DatasetTrackLoading() {
  /* eslint-disable react/no-array-index-key */
  return (
    <TrackLoading>
      {loadingPattern.map((letter, i) => (
        <TrackBlock key={i}>
          {letter.map((s, i2) => (
            <Item key={i2} code={s} />
          ))}
        </TrackBlock>
      ))}
    </TrackLoading>
  );
  /* eslint-enable react/no-array-index-key */
}

export function DatasetTrackError() {
  /* eslint-disable react/no-array-index-key */
  return (
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
  /* eslint-enable react/no-array-index-key */
}
