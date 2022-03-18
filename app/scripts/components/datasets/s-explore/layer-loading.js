import React from 'react';
import styled from 'styled-components';
import { variableGlsp } from '$styles/variable-utils';

import {
  LoadingSkeleton,
  LoadingSkeletonGroup
} from '$components/common/loading-skeleton';

const LoadingLayer = styled(LoadingSkeletonGroup)`
  padding: ${variableGlsp(0.5, 1)};
`;

export function InlineLayerLoadingSkeleton() {
  return (
    <LoadingLayer>
      <LoadingSkeleton />
      <LoadingSkeleton />
    </LoadingLayer>
  );
}
