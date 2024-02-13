import React, { useState } from 'react';
import { PrimitiveAtom, useAtomValue, useAtom } from 'jotai';
import { Dropdown, DropMenu, DropTitle } from '@devseed-ui/dropdown';
import { TimelineDataset } from '$components/exploration/types.d.ts';
import { Button } from '@devseed-ui/button';
import { TipButton } from '$components/common/tip-button';
import { timelineDatasetsAtom } from '$components/exploration/atoms/datasets';
import { useTimelineDatasetSettings } from '$components/exploration/atoms/hooks';
import {
  CollecticonEllipsisVertical,
  CollecticonDrop,
  CollecticonXmarkSmall,
  CollecticonEyeDisabled,
  CollecticonEye,
  CollecticonArrowDown,
  CollecticonArrowUp,
  CollecticonUpload,
  CollecticonShare,
} from '@devseed-ui/collecticons';
import { TileUrlModal } from './tile-link-modal';
import { SliderInput, SliderInputProps } from '$styles/range-slider';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Overline } from '@devseed-ui/typography';
import styled from 'styled-components';

interface LayerMenuOptionsProps {
  datasetAtom: PrimitiveAtom<TimelineDataset>;
  isVisible: boolean;
  setVisible: (v: any) => void;
}

// @NOTE: Class Name prefix is named after file name
const classNamePrefix = "layer-options-menu";

const StyledDropdown = styled(Dropdown)`
  padding: ${glsp(1.5)};

  li {
    padding: ${glsp(0.5)};
    border-bottom: 1px solid ${themeVal('color.base-200')};
  }

  li:last-child {
    border-bottom: 0;
  }
  li:first-child {
    padding-top: 0;
  }
  
  & .${classNamePrefix}-opacity {
    min-width: 1.5rem;
    font-size: 0.875rem;
    padding: 0 0.5rem;

    // @NOTE: This replicates the ui-library-seed's button components styling so this menu item stays consistent with the buttons
    & .${classNamePrefix}-opacity-title {
      padding: 0 0.5rem;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
    }
  }

  & .${classNamePrefix}-remove-layer {
    button {
      color: #CF3F02 !important;
    }
  }
`;

const LayerMenuButton = styled(Button)`
  justify-content: flex-start;
`;

export default function LayerMenuOptions (props: LayerMenuOptionsProps) {
  const { datasetAtom, isVisible, setVisible } = props;

  const [, setDatasets] = useAtom(timelineDatasetsAtom);
  const dataset = useAtomValue(datasetAtom);
  const [getSettings, setSetting] = useTimelineDatasetSettings(datasetAtom);
  const opacity = (getSettings('opacity') ?? 100) as number;

  const [tileModalRevealed, setTileModalRevealed] = useState(false);

  const handleRemove = () => {
      setDatasets((datasets) =>
      datasets.filter((d) => d.data.id !== dataset.data.id)
    );
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
              <CollecticonDrop/>
              Layer opacity
            </div>
            <OpacityControl
              value={opacity}
              onInput={(v) => setSetting('opacity', v)}
            />
          </li>
          <li>
            <LayerMenuButton 
              variation="base-text"
              size="small"
              fitting="baggy"
              onClick={() => setVisible((v) => !v)}>
              {isVisible ? (
                <CollecticonEye
                  meaningful
                  title='Toggle dataset visibility'
                />
              ) : (
                <CollecticonEyeDisabled
                  meaningful
                  title='Toggle dataset visibility'
                />
              )}
              {isVisible ? 'Hide layer' : 'Show layer'}
            </LayerMenuButton>
          </li>
          <li>
            {/* // @TODO: Implement moving up action */}
              <LayerMenuButton
                variation="base-text"
                size="small"
                fitting="baggy"
                onClick={() => true}
              >
                <CollecticonArrowUp/>
                Move up
              </LayerMenuButton>
          </li>
          <li>
            {/* // @TODO: Implement moving down action */}
            <LayerMenuButton
              variation="base-text"
              size="small"
              fitting="baggy"
              onClick={() => true}
            >
              <CollecticonArrowDown/>
                Move down
            </LayerMenuButton>

          </li>
          <li>
            <LayerMenuButton
              variation="base-text"
              size="small"
              fitting="baggy"
              onClick={handleLoadIntoGIS}
            >
              <CollecticonShare/>
              Load into GIS
            </LayerMenuButton>
          </li>
          <li className={`${classNamePrefix}-remove-layer`}>
            <LayerMenuButton
              variation="base-text"
              size="small"
              fitting="baggy"
              onClick={handleRemove}
            >
              <CollecticonXmarkSmall/>
              Remove layer
            </LayerMenuButton>
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
        <SliderInput value={value} onInput={onInput} />
        <OpacityValue>{value}</OpacityValue>
      </OpacityControlElements>
    </OpacityControlWrapper>
  );
}