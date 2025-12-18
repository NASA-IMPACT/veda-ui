import React from 'react';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

const TrackMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  padding: ${glsp(0.5)};
  font-size: 0.75rem;
  fill: ${themeVal('color.base')};
`;

interface DatasetTrackMessageProps {
  children: React.ReactNode;
}
export function DatasetTrackMessage(props: DatasetTrackMessageProps) {
  const { children } = props;

  return <TrackMessage>{children}</TrackMessage>;
}
