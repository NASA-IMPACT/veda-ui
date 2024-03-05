import React, { useState } from 'react';
import { PrimitiveAtom, useAtomValue, useAtom } from 'jotai';
import styled from 'styled-components';
import { Dropdown, DropMenu, DropMenuItem } from '@devseed-ui/dropdown';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import {
  CollecticonEllipsisVertical,
  CollecticonDrop,
  CollecticonXmarkSmall,
  CollecticonArrowDown,
  CollecticonArrowUp,
  CollecticonShare,
} from '@devseed-ui/collecticons';
import { TileUrlModal } from './tile-link-modal';
import { TipButton } from '$components/common/tip-button';
import { timelineDatasetsAtom } from '$components/exploration/atoms/datasets';
import { useTimelineDatasetSettings } from '$components/exploration/atoms/hooks';
import { NativeSliderInput, SliderInputProps } from '$styles/range-slider';
import { TimelineDataset } from '$components/exploration/types.d.ts';


interface LayerMenuOptionsProps {
  datasetAtom: PrimitiveAtom<TimelineDataset>;
}

// @NOTE: Class Name prefix is named after file name
const classNamePrefix = 'layer-options-menu';

const StyledDropdown = styled(Dropdown)`
  padding: ${glsp(1.5)};

  li {
    padding: ${glsp(0.25)};
    border-bottom: 1px solid ${themeVal('color.base-200')};
    ${DropMenuItem} {
      cursor:pointer;
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

export default function LayerMenuOptions (props: LayerMenuOptionsProps) {
  const { datasetAtom } = props;

  const [datasets, setDatasets] = useAtom(timelineDatasetsAtom);
  const dataset = useAtomValue(datasetAtom);
  const [getSettings, setSetting] = useTimelineDatasetSettings(datasetAtom);
  const opacity = (getSettings('opacity') ?? 100) as number;

  const [tileModalRevealed, setTileModalRevealed] = useState(false);

  const currentIndex = datasets.findIndex(d => d.data.id === dataset.data.id);

  const handleRemove = () => {
      setDatasets((prevDatasets) =>
      prevDatasets.filter((d) => d.data.id !== dataset.data.id)
    );
  };

  const moveUp = () => {
    if (currentIndex > 0 ) {
      setDatasets((prevDatasets) => {
        const arr = [...prevDatasets];
        [arr[currentIndex], arr[currentIndex - 1]] = [arr[currentIndex - 1], arr[currentIndex]];
        return arr;
      });
    }
  };

  const moveDown = () => {
    if (currentIndex < datasets.length - 1) {
      setDatasets((prevDatasets) => {
        const arr = [...prevDatasets];
        [arr[currentIndex], arr[currentIndex + 1]] = [arr[currentIndex + 1], arr[currentIndex]];
        return arr;
      });
    }
  };

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
            <CollecticonEllipsisVertical />
          </TipButton>
        )}
      >
        <DropMenu>
          <li className={`${classNamePrefix}-opacity`}>
            <div className={`${classNamePrefix}-opacity-title`}>
              <CollecticonDrop />
              Layer opacity
            </div>
            <OpacityControl
              value={opacity}
              onInput={(v) => setSetting('opacity', v)}
            />
          </li>
          <li>
            <DropMenuItem
              disabled={currentIndex === 0}
              aria-disabled={currentIndex === 0}
              onClick={moveUp}
              data-dropdown='click.close'
            >
              <CollecticonArrowUp />
              Move up
            </DropMenuItem>
          </li>
          <li>
            <DropMenuItem
              disabled={currentIndex === datasets.length -1}
              aria-disabled={currentIndex === 0}
              onClick={moveDown}
              data-dropdown='click.close'
            >
              <CollecticonArrowDown />
                Move down
            </DropMenuItem>
          </li>
          <li>
            <DropMenuItem
              onClick={handleLoadIntoGIS}
            >
              <CollecticonShare />
              Load into GIS
            </DropMenuItem>
          </li>
          <li className={`${classNamePrefix}-remove-layer`}>
            <DropMenuItem
              onClick={handleRemove}
            >
              <CollecticonXmarkSmall />
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