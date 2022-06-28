import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  CollecticonArea,
  CollecticonPencil,
  CollecticonTrashBin
} from '@devseed-ui/collecticons';
import { Toolbar, ToolbarIconButton, VerticalDivider } from '@devseed-ui/toolbar';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Dropdown, DropTitle } from '@devseed-ui/dropdown';
import { Button } from '@devseed-ui/button';

import BoundsFieldset from '$components/common/bounds-fieldset';
import {
  areBoundsValid,
  boundsFromFeature,
  calcFeatArea,
  featureFromBounds
} from './utils';
import { AoiBounds, AoiChangeListenerOverload, AoiState } from './types';

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

const DropdownWide = styled(Dropdown)`
  max-width: 22rem;
`;

interface DropdownRef {
  reposition: () => void;
  open: () => void;
  close: () => void;
}

type AoiControlsProps = {
  onAoiChange: AoiChangeListenerOverload;
} & Pick<AoiState, 'feature' | 'drawing' | 'selected'>;

export default function AoiControls(props: AoiControlsProps) {
  const { feature, selected, drawing, onAoiChange } = props;

  const dropRef = useRef<DropdownRef>();
  const [bounds, setBounds] = useState(boundsFromFeature(feature));

  const onApplyClick = useCallback(() => {
    if (areBoundsValid(bounds)) {
      onAoiChange('aoi.set-feature', {
        feature: featureFromBounds(feature, bounds as AoiBounds)
      });
      dropRef.current?.close();
    }
  }, [bounds, feature, onAoiChange]);

  useEffect(() => {
    setBounds(boundsFromFeature(feature));
  }, [feature]);

  return (
    <Filter>
      <FilterHeadline>
        <FilterTitle>Area of interest</FilterTitle>
        <FilterSubtitle>
          {calcFeatArea(feature)} km<sup>2</sup>
        </FilterSubtitle>
      </FilterHeadline>
      <Toolbar>
        <ToolbarIconButton
          onClick={() => onAoiChange('aoi.clear')}
          disabled={!feature}
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
        <DropdownWide
          ref={dropRef}
          alignment='left'
          direction='down'
          triggerElement={({ active, ...rest }) => (
            <ToolbarIconButton {...rest}>
              <CollecticonPencil meaningful title='Edit AOI bounds' />
            </ToolbarIconButton>
          )}
        >
          <DropTitle>Edit AOI</DropTitle>

          <BoundsFieldset
            id='ne'
            title='Northeast bounds'
            value={bounds.ne || []}
            onChange={(value) => setBounds((b) => ({ ...b, ne: value }))}
            placeholders={[-8.9, 39.0]}
          />

          <BoundsFieldset
            id='sw'
            title='Southwest bounds'
            value={bounds.sw || []}
            onChange={(value) => setBounds((b) => ({ ...b, sw: value }))}
            placeholders={[-9.6, 38.6]}
          />

          <div>
            <Button
              disabled={!areBoundsValid(bounds)}
              onClick={onApplyClick}
              variation='primary-fill'
              fitting='baggy'
            >
              Save
            </Button>
          </div>
        </DropdownWide>
      </Toolbar>
    </Filter>
  );
}
