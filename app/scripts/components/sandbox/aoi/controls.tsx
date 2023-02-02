import React from 'react';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import {
  CollecticonArea,
  CollecticonClockBack,
  CollecticonPencil
} from '@devseed-ui/collecticons';
import {
  Toolbar,
  ToolbarIconButton,
  VerticalDivider
} from '@devseed-ui/toolbar';
import { Button, ButtonGroup } from '@devseed-ui/button';

import { calcFeatCollArea } from '../../common/aoi/utils';
import { AoiChangeListenerOverload, AoiState } from '../../common/aoi/types';

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
} & Pick<AoiState, 'featureCollection' | 'drawing'>;

export default function AoiControls(props: AoiControlsProps) {
  const { featureCollection, drawing, onAoiChange } = props;

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
          variation='base-outline'
          onClick={() => onAoiChange('aoi.clear')}
          disabled={!featureCollection?.features.length}
        >
          <CollecticonClockBack title='Clear map' meaningful />
        </ToolbarIconButton>
        <VerticalDivider variation='dark' />
        <ButtonGroup variation='base-outline'>
          <Button
            onClick={() => onAoiChange('aoi.select-click')}
            active={!drawing}
            fitting='skinny'
          >
            <CollecticonArea title='Selection mode' meaningful />
          </Button>
          <Button
            onClick={() => onAoiChange('aoi.draw-click')}
            active={drawing}
            fitting='skinny'
          >
            <CollecticonPencil title='Drawing mode' meaningful />
          </Button>
        </ButtonGroup>
      </Toolbar>
    </Filter>
  );
}
