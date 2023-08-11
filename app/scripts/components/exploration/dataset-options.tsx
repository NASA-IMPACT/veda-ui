import React from 'react';
import { PrimitiveAtom, useAtomValue, useSetAtom } from 'jotai';
import 'react-range-slider-input/dist/style.css';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Dropdown, DropMenu, DropTitle } from '@devseed-ui/dropdown';
import { Button } from '@devseed-ui/button';
import { CollecticonCog, CollecticonTrashBin } from '@devseed-ui/collecticons';
import { Overline } from '@devseed-ui/typography';

import { useTimelineDatasetSettings } from './hooks';
import { TimelineDataset } from './constants';
import { timelineDatasetsAtom } from './atoms';

import DropMenuItemButton from '$styles/drop-menu-item-button';
import { SliderInput, SliderInputProps } from '$styles/range-slider';

interface DatasetOptionsProps {
  datasetAtom: PrimitiveAtom<TimelineDataset>;
}

export default function DatasetOptions(props: DatasetOptionsProps) {
  const { datasetAtom } = props;

  const setDatasets = useSetAtom(timelineDatasetsAtom);
  const dataset = useAtomValue(datasetAtom);
  const [getSettings, setSetting] = useTimelineDatasetSettings(datasetAtom);

  const opacity = (getSettings('opacity') ?? 100) as number;

  return (
    <Dropdown
      alignment='right'
      triggerElement={(props) => (
        <Button variation='base-text' size='small' fitting='skinny' {...props}>
          <CollecticonCog meaningful title='View dataset options' />
        </Button>
      )}
    >
      <DropTitle>View options</DropTitle>
      <DropMenu>
        <li>
          <OpacityControl
            value={opacity}
            onInput={(v) => setSetting('opacity', v)}
          />
        </li>
      </DropMenu>
      <DropMenu>
        <li>
          <DropMenuItemButton
            variation='danger'
            onClick={() => {
              setDatasets((datasets) =>
                datasets.filter((d) => d.data.id !== dataset.data.id)
              );
            }}
          >
            <CollecticonTrashBin /> Remove dataset
          </DropMenuItemButton>
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
      <Overline>Opacity</Overline>
      <OpacityControlElements>
        <SliderInput value={value} onInput={onInput} />
        <OpacityValue>{value}</OpacityValue>
      </OpacityControlElements>
    </OpacityControlWrapper>
  );
}
