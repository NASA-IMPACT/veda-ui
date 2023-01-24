import React from 'react';
import styled from 'styled-components';
import { CollecticonArea, CollecticonTrashBin } from '@devseed-ui/collecticons';
import {
  Toolbar,
  ToolbarIconButton,
  VerticalDivider
} from '@devseed-ui/toolbar';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

import { calcFeatCollArea } from './utils';
import { AoiChangeListenerOverload, AoiState } from './types';

export const Filter = styled.section`
  display: flex;
  align-items: flex-start;
  padding: ${glsp()};
  box-shadow: inset 0 -1px 0 0 ${themeVal('color.base-200a')};
`;

export const FilterHeadline = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

export const FilterTitle = styled.h1`
  font-size: 0.75rem;
  line-height: 1rem;
  margin: 0;
  order: 2;
`;

export const FilterSubtitle = styled.p`
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: ${themeVal('type.base.bold')};

  sup {
    top: -0.25em;
  }
`;

export const FilterHeadToolbar = styled.div`
  display: flex;
  flex-flow: row nowrap;
  margin-left: auto;
  padding-left: ${glsp()};
  align-items: flex-start;
`;

type AoiControlsProps = {
  onAoiChange: AoiChangeListenerOverload;
} & Pick<AoiState, 'featureCollection' | 'drawing' | 'selected'>;

export default function AoiControls(props: AoiControlsProps) {
  const { featureCollection, selected, drawing, onAoiChange } = props;

  return (
    <Filter>
      <FilterHeadline>
        <FilterTitle>Area of interest</FilterTitle>
        <FilterSubtitle>
          {calcFeatCollArea(featureCollection)} km<sup>2</sup>
        </FilterSubtitle>
      </FilterHeadline>
      <Toolbar>
        <ToolbarIconButton
          onClick={() => onAoiChange('aoi.trash-click')}
          disabled={!featureCollection?.features.length}
        >
          <CollecticonTrashBin meaningful title='Clear AOI' />
        </ToolbarIconButton>
        <VerticalDivider variation='dark' />
        <ToolbarIconButton
          onClick={() => onAoiChange('aoi.draw-click')}
          active={selected || drawing}
        >
          <CollecticonArea meaningful title='AOI' />
        </ToolbarIconButton>
      </Toolbar>
    </Filter>
  );
}
