import React from 'react';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import { CollecticonArrowLoop } from '@devseed-ui/collecticons';

import { pulsingAnimation } from '$components/common/loading-skeleton';
import { DATASET_TRACK_BLOCK_HEIGHT } from '$components/exploration/constants';

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

const TrackMessage = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  padding: ${glsp(0.5, 1)};
  background: ${themeVal('color.surface-300a')};
  z-index: ${themeVal('zIndices.overlay')};
  display: flex;
  gap: 1rem;
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
  message?: React.ReactNode;
  onRetryClick?: () => void;
}) {
  const { message, onRetryClick } = props;
  /* eslint-disable react/no-array-index-key */
  return (
    <>
      <TrackError>
        {errorPattern.map((letter, i) => (
          <TrackBlock key={i}>
            {letter.map((s, i2) => (
              <Item key={i2} code={s} />
            ))}
          </TrackBlock>
        ))}
      </TrackError>
      {message && (
        <TrackMessage>
          <p>{message}</p>
          {typeof onRetryClick === 'function' ? (
            <Button variation='danger-fill' size='small'>
              Retry <CollecticonArrowLoop size='small' />
            </Button>
          ) : null}
        </TrackMessage>
      )}
    </>
  );
  /* eslint-enable react/no-array-index-key */
}
