import React, { useState } from 'react';
import styled from 'styled-components';
import { Dropdown, DropMenu, DropMenuItem } from '@devseed-ui/dropdown';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Icon } from '@trussworks/react-uswds';
import { TileUrlModal } from '../../exploration/components/datasets/tile-link-modal';
import { TipButton } from '$components/common/tip-button';
import { NativeSliderInput, SliderInputProps } from '$styles/range-slider';
import { VizDataset } from '$components/exploration/types.d.ts';
import { DropIcon } from '$components/common/custom-icon';

interface LayerMenuOptionsProps {
  dataset: VizDataset;
  canMoveUp: boolean;
  canMoveDown: boolean;
  opacity: number;
  onRemoveLayer: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onOpacityChange: (opacity: number) => void;
}

// @NOTE: Class Name prefix is named after file name
const classNamePrefix = 'layer-options-menu';

const StyledDropdown = styled(Dropdown)`
  padding: ${glsp(1.5)};

  li {
    padding: ${glsp(0.25)};
    border-bottom: 1px solid ${themeVal('color.base-200')};
    ${DropMenuItem} {
      cursor: pointer;
    }
  }

  li:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }
  li:first-child {
    padding-top: 0;
  }

  & .${classNamePrefix}-opacity {
    min-width: 1.5rem;
    font-size: 0.875rem;
    padding: 0 0.5rem;

    & .${classNamePrefix}-opacity-title {
      padding: 0 0.5rem;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
    }
  }
`;

export default function LayerMenuOptions(props: LayerMenuOptionsProps) {
  const {
    dataset,
    onRemoveLayer,
    onMoveUp,
    onMoveDown,
    canMoveUp,
    canMoveDown,
    opacity,
    onOpacityChange
  } = props;

  const [tileModalRevealed, setTileModalRevealed] = useState(false);

  const handleLoadIntoGIS = () => {
    setTileModalRevealed(true);
  };

  return (
    <>
      <StyledDropdown
        alignment='right'
        direction='up'
        triggerElement={(props) => (
          <TipButton
            tipContent='Layer options'
            variation='base-text'
            size='small'
            fitting='skinny'
            {...props}
          >
            <Icon.MoreVert size={3} aria-hidden='true' />
          </TipButton>
        )}
      >
        <DropMenu>
          <li className={`${classNamePrefix}-opacity`}>
            <div className={`${classNamePrefix}-opacity-title`}>
              <DropIcon aria-hidden='true' />
              Layer opacity
            </div>
            <OpacityControl value={opacity} onInput={onOpacityChange} />
          </li>
          <li>
            <DropMenuItem
              disabled={!canMoveUp}
              aria-disabled={!canMoveUp}
              onClick={onMoveUp}
              data-dropdown='click.close'
            >
              <Icon.ArrowUpward size={3} aria-hidden='true' />
              Move up
            </DropMenuItem>
          </li>
          <li>
            <DropMenuItem
              disabled={!canMoveDown}
              aria-disabled={!canMoveDown}
              onClick={onMoveDown}
              data-dropdown='click.close'
            >
              <Icon.ArrowDownward size={3} aria-hidden='true' />
              Move down
            </DropMenuItem>
          </li>
          <li>
            <DropMenuItem onClick={handleLoadIntoGIS}>
              <Icon.Share size={3} aria-hidden='true' />
              Load into GIS
            </DropMenuItem>
          </li>
          <li className={`${classNamePrefix}-remove-layer`}>
            <DropMenuItem onClick={onRemoveLayer}>
              <Icon.Close size={3} aria-hidden='true' />
              Remove layer
            </DropMenuItem>
          </li>
        </DropMenu>
      </StyledDropdown>
      <TileUrlModal
        datasetName={dataset.data.name}
        revealed={tileModalRevealed}
        onClose={() => setTileModalRevealed(false)}
        tileUrls={dataset.meta?.tileUrls}
      />
    </>
  );
}

const OpacityControlWrapper = styled.div`
  padding: ${glsp(0.5, 1)};
  display: flex;
  flex-flow: column;
  gap: ${glsp(0.25)};
`;

const OpacityControlElements = styled.div`
  display: flex;
  gap: ${glsp(0.5)};
  align-items: center;
`;

const OpacityValue = styled.span`
  font-size: 0.75rem;
  font-weight: ${themeVal('type.base.regular')};
  color: ${themeVal('color.base-400')};
  width: 2rem;
  text-align: right;
`;

function OpacityControl(props: SliderInputProps) {
  const { value, onInput } = props;

  return (
    <OpacityControlWrapper>
      <OpacityControlElements>
        <NativeSliderInput value={value} onInput={onInput} />
        <OpacityValue>{value}</OpacityValue>
      </OpacityControlElements>
    </OpacityControlWrapper>
  );
}
