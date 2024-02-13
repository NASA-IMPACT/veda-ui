import React, { useCallback, useState } from 'react';
import { PrimitiveAtom, useAtomValue, useAtom } from 'jotai';
import 'react-range-slider-input/dist/style.css';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Dropdown, DropMenu, DropTitle } from '@devseed-ui/dropdown';
import {
  CollecticonCog,
  CollecticonMap,
  CollecticonTrashBin
} from '@devseed-ui/collecticons';
import { Overline } from '@devseed-ui/typography';

import AnalysisMetrics from './analysis-metrics';
import { TileUrlModal } from './tile-link-modal';

import DropMenuItemButton from '$styles/drop-menu-item-button';
import { SliderInput, SliderInputProps } from '$styles/range-slider';
import { composeVisuallyDisabled } from '$utils/utils';
import { Tip } from '$components/common/tip';
import { TimelineDataset } from '$components/exploration/types.d.ts';
import { timelineDatasetsAtom } from '$components/exploration/atoms/datasets';
import { useTimelineDatasetSettings } from '$components/exploration/atoms/hooks';
import { TipButton } from '$components/common/tip-button';

// @DEPRECATED: This is soon to be replaced with `layer-options-menu`
// @DELETE: May just delete once layer-options-menu has been merged
const RemoveButton = composeVisuallyDisabled(DropMenuItemButton);
const TileModalButton = composeVisuallyDisabled(DropMenuItemButton);

interface DatasetOptionsProps {
  datasetAtom: PrimitiveAtom<TimelineDataset>;
}

export default function DatasetOptions(props: DatasetOptionsProps) {
  const { datasetAtom } = props;

  const [, setDatasets] = useAtom(timelineDatasetsAtom);
  const dataset = useAtomValue(datasetAtom);
  const [getSettings, setSetting] = useTimelineDatasetSettings(datasetAtom);

  const [tileModalRevealed, setTileModalRevealed] = useState(false);
  const closeTileModal = useCallback(() => setTileModalRevealed(false), []);

  const opacity = (getSettings('opacity') ?? 100) as number;

  const activeMetrics = getSettings('analysisMetrics') ?? [];

  return (
    <>
      <Dropdown
        alignment='right'
        direction='up'
        triggerElement={(props) => (
          <TipButton
            tipContent='Layer control options'
            variation='base-text'
            size='small'
            fitting='skinny'
            {...props}
          >
            <CollecticonCog meaningful title='View layer options' />
          </TipButton>
        )}
      >
        <DropTitle>Display options</DropTitle>
        <DropMenu>
          <li>
            <OpacityControl
              value={opacity}
              onInput={(v) => setSetting('opacity', v)}
            />
          </li>
        </DropMenu>
        <AnalysisMetrics
          activeMetrics={activeMetrics}
          onMetricsChange={(m) => setSetting('analysisMetrics', m)}
        />
        <DropMenu>
          <li>
            <Tip
              disabled={!!dataset.meta?.tileUrls}
              content='This dataset does not offer tile URLs'
              placement='left'
            >
              <TileModalButton
                visuallyDisabled={!dataset.meta?.tileUrls}
                type='button'
                onClick={() => setTileModalRevealed(true)}
              >
                <CollecticonMap title='Open tile URL options' /> Load into GIS
              </TileModalButton>
            </Tip>
          </li>
        </DropMenu>
        <DropMenu>
          <li>
            <RemoveButton
              variation='danger'
              onClick={() => {
                setDatasets((datasets) =>
                  datasets.filter((d) => d.data.id !== dataset.data.id)
                );
              }}
            >
              <CollecticonTrashBin /> Remove dataset
            </RemoveButton>
          </li>
        </DropMenu>
      </Dropdown>

      <TileUrlModal
        datasetName={dataset.data.name}
        revealed={tileModalRevealed}
        onClose={closeTileModal}
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
      <Overline>Map Opacity</Overline>
      <OpacityControlElements>
        <SliderInput value={value} onInput={onInput} />
        <OpacityValue>{value}</OpacityValue>
      </OpacityControlElements>
    </OpacityControlWrapper>
  );
}
