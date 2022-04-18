import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';
import { media, multiply } from '$utils/devseed-ui';

import { variableGlsp } from '$styles/variable-utils';
import { ContentBlockProse } from '$styles/content-block';
import { utcString2userTzDate } from '$utils/date';
import { validateRangeNum } from '$utils/utils';

export interface ChapterProps {
  center: [number, number];
  zoom: number;
  datasetId: string;
  layerId: string;
  datetime?: string;
  children: any;
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
    pointer-events: auto;
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

const lngValidator = validateRangeNum(-180, 180);
const latValidator = validateRangeNum(-90, 90);

export function validateChapter(chapter: ChapterProps, index) {
  const reqProperties = ['center', 'zoom', 'datasetId', 'layerId'];
  const missing = reqProperties.filter((p) => chapter[p] === undefined);

  const missingError =
    !!missing.length &&
    `- Missing some properties: ${missing.map((p) => `[${p}]`).join(', ')}`;

  const dateError =
    chapter.datetime &&
    isNaN(utcString2userTzDate(chapter.datetime).getTime()) &&
    '- Invalid datetime. Use YYYY-MM-DD format';

  const contentError =
    !chapter.children &&
    '- Missing content. Add some between <Chapter ...props>content here</Chapter>';

  const centerValid =
    lngValidator(chapter?.center?.[0]) && latValidator(chapter?.center?.[1]);
  const centerError =
    !centerValid && '- Invalid center coordinates. Use [longitude, latitude]';

  if (missingError || dateError || contentError || centerError) {
    return [
      `Chapter ${index + 1}:`,
      missingError,
      dateError,
      contentError,
      centerError
    ].filter(Boolean) as string[];
  }

  return [];
}
