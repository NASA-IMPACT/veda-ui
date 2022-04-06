import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';

import { VarProse } from '$styles/variable-components';
import { variableGlsp } from '$styles/variable-utils';

export interface ChapterProps {
  center: [number, number];
  zoom: number;
  datasetId: string;
  layerId: string;
  datetime?: string;
}

export interface ScrollyChapter extends Omit<ChapterProps, 'datetime'> {
  datetime?: Date;
}

export const chapterDisplayName = 'Chapter';

const ChapterSelf = styled(VarProse)`
  padding-bottom: 80vh;
  grid-column: content-start / content-7;

  > div {
    background: ${themeVal('color.surface')};
    padding: ${variableGlsp()};
  }
`;

export function Chapter(props) {
  const { children } = props;
  return (
    <ChapterSelf data-step>
      <div>{children}</div>
    </ChapterSelf>
  );
}

Chapter.displayName = chapterDisplayName;

Chapter.propTypes = {
  children: T.node
};
