import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';
import { media, multiply } from '$utils/devseed-ui';

import { variableGlsp } from '$styles/variable-utils';
import { ContentBlockProse } from '$styles/content-block';

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

const ChapterSelf = styled.div`
  padding-bottom: 80vh;
  grid-column: content-start / content-end;

  ${media.mediumUp`
    grid-column: content-start / content-7;
  `}

  > ${ContentBlockProse} {
    background: ${themeVal('color.surface')};
    padding: ${variableGlsp()};
    border-radius: ${multiply(themeVal('shape.rounded'), 2)};
    box-shadow: ${themeVal('boxShadow.elevationD')};
  }
`;

export function Chapter(props) {
  const { children } = props;
  return (
    <ChapterSelf data-step>
      <ContentBlockProse>{children}</ContentBlockProse>
    </ChapterSelf>
  );
}

Chapter.displayName = chapterDisplayName;

Chapter.propTypes = {
  children: T.node
};
