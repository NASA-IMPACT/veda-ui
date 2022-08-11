import React from 'react';
import styled from 'styled-components';
import { themeVal, media, multiply } from '@devseed-ui/theme-provider';
import { ProjectionOptions } from 'delta/thematics';

import { variableGlsp } from '$styles/variable-utils';
import { ContentBlockProse } from '$styles/content-block';
import { utcString2userTzDate } from '$utils/date';
import { validateRangeNum } from '$utils/utils';
import { validateProjectionBlockProps } from '$components/common/mapbox/projection-selector-utils';

/* eslint-disable react/no-unused-prop-types */
export interface ChapterProps {
  center: [number, number];
  zoom: number;
  datasetId: string;
  layerId: string;
  datetime?: string;
  showBaseMap?: boolean;
  projectionId?: ProjectionOptions['id'];
  projectionCenter?: ProjectionOptions['center'];
  projectionParallels?: ProjectionOptions['parallels'];
  children: React.ReactNode;
}
/* eslint-enable react/no-unused-prop-types */

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

export function Chapter(props: ChapterProps) {
  const { children } = props;
  return (
    <ChapterSelf data-step>
      <ContentBlockProse>{children}</ContentBlockProse>
    </ChapterSelf>
  );
}

Chapter.displayName = chapterDisplayName;

const lngValidator = validateRangeNum(-180, 180);
const latValidator = validateRangeNum(-90, 90);

export function validateChapter(chapter: ChapterProps, index) {
  const dataProperties = ['layerId', 'datasetId'];
  const mapProperties = ['center', 'zoom'];

  const missingDataProps = dataProperties.filter((p) => {
    // When showBaseMap is set the layer related properties are not needed.
    return chapter.showBaseMap ? false : chapter[p] === undefined;
  });
  const missingMapProps = mapProperties.filter((p) => chapter[p] === undefined);

  const missing = [...missingDataProps, ...missingMapProps];

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

  const projectionErrors = validateProjectionBlockProps({
    id: chapter.projectionId,
    center: chapter.projectionCenter,
    parallels: chapter.projectionParallels
  });

  const errors = [
    missingError,
    dateError,
    contentError,
    centerError,
    ...projectionErrors
  ].filter(Boolean) as string[];

  return errors.length ? [`Chapter ${index + 1}:`, ...errors] : [];
}
