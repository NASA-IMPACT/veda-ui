import React from 'react';
import { PrimitiveAtom, useAtomValue, useAtom } from 'jotai';
import 'react-range-slider-input/dist/style.css';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Dropdown, DropMenu, DropTitle } from '@devseed-ui/dropdown';
import { Button } from '@devseed-ui/button';
import { CollecticonCog, CollecticonTrashBin } from '@devseed-ui/collecticons';
import { Overline } from '@devseed-ui/typography';

import AnalysisMetrics from './analysis-metrics';

import DropMenuItemButton from '$styles/drop-menu-item-button';
import { SliderInput, SliderInputProps } from '$styles/range-slider';
import { composeVisuallyDisabled } from '$utils/utils';
import { Tip } from '$components/common/tip';
import { TimelineDataset } from '$components/exploration/types.d.ts';
import { timelineDatasetsAtom } from '$components/exploration/atoms/atoms';
import { useTimelineDatasetSettings } from '$components/exploration/atoms/hooks';
const RemoveButton = composeVisuallyDisabled(DropMenuItemButton);

interface DatasetOptionsProps {
  datasetAtom: PrimitiveAtom<TimelineDataset>;
}

export default function DatasetOptions(props: DatasetOptionsProps) {
  const { datasetAtom } = props;

  const [datasets, setDatasets] = useAtom(timelineDatasetsAtom);
  const dataset = useAtomValue(datasetAtom);
  const [getSettings, setSetting] = useTimelineDatasetSettings(datasetAtom);

  const opacity = (getSettings('opacity') ?? 100) as number;

  const activeMetrics = (getSettings('analysisMetrics') ?? []);

  return (
    <Dropdown
      alignment='right'
      triggerElement={(props) => (
        <Button variation='base-text' size='small' fitting='skinny' {...props}>
          <CollecticonCog meaningful title='View dataset options' />
        </Button>
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
            disabled={datasets.length > 1}
            content="It's not possible to remove the last dataset. Add another before removing this one."
          >
            <RemoveButton
              variation='danger'
              visuallyDisabled={datasets.length === 1}
              onClick={() => {
                setDatasets((datasets) =>
                  datasets.filter((d) => d.data.id !== dataset.data.id)
                );
              }}
            >
              <CollecticonTrashBin /> Remove dataset
            </RemoveButton>
          </Tip>
        </li>
      </DropMenu>
    </Dropdown>
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
