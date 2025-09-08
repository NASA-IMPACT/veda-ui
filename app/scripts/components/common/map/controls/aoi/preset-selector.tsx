import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Feature, Polygon } from 'geojson';
import { Button } from '@devseed-ui/button';
import {
  CollecticonChevronDownSmall,
  CollecticonDiscXmark,
  CollecticonArrowSpinCcw
} from '@devseed-ui/collecticons';
import { glsp, truncated } from '@devseed-ui/theme-provider';

const selectorHeight = '25px';

const SelectorWrapper = styled.div`
  position: relative;
`;

const PresetSelect = styled.select.attrs({
  'data-testid': 'preset-selector'
})`
  max-width: 200px;
  height: ${selectorHeight};
  color: transparent;
  background: none;
  option {
    color: black;
  }
`;
// This div is just to display the value with trucnated texts
const OptionValueDisplay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  padding: ${glsp(0.125)} ${glsp(0.5)};
  display: flex;
  align-items: center;
  justify-content: space-between;
  pointer-events: none;
  span {
    width: 85%;
    ${truncated()}
  }
`;

const SelectorSubAction = css`
  position: absolute;
  top: 0;
  right: ${glsp(1.25)};
  height: ${selectorHeight};
`;

const spinAnimation = keyframes`
  from {
      transform:rotate(360deg);
  }
  to {
      transform:rotate(0deg);
  }
`;

const CancelButton = styled(Button)`
  ${SelectorSubAction}
`;

const LoadingWrapper = styled.div`
  ${SelectorSubAction}
  display: flex;
  align-items: center;
  right: ${glsp(2)};
`;

const AnimatingCollecticonArrowSpinCcw = styled(CollecticonArrowSpinCcw)`
  animation: ${spinAnimation} 1s infinite linear;
`;

export interface PresetOption {
  label: string;
  value: string;
  path: string;
  group: 'state' | 'country';
}

export interface PresetSelectorProps {
  selectedState: PresetOption | null;
  setSelectedState: (state: PresetOption | null) => void;
  resetPreset: () => void;
  isLoading: boolean;
  presets: PresetOption[];
}

export default function PresetSelector({
  selectedState,
  setSelectedState,
  resetPreset,
  isLoading,
  presets
}: PresetSelectorProps) {
  const countryPresets = presets.filter(p => p.group === 'country');
  const statePresets = presets.filter(p => p.group === 'state').sort((a, b) => a.label.localeCompare(b.label));

  return (
    <SelectorWrapper>
      <OptionValueDisplay>
        <span>
          {selectedState ? selectedState.label : 'Analyze an area'}{' '}
        </span>
        <CollecticonChevronDownSmall />
      </OptionValueDisplay>

      <PresetSelect
        id='preset-selector'
        name='Select a new area of interest'
        value={selectedState?.value || ''}
        onChange={(e) => {
          const selectedPreset = presets.find(p => p.value === e.target.value);
          setSelectedState(selectedPreset || null);
        }}
      >
        <option> Analyze an area </option>
        <optgroup label='Country' />
        {countryPresets.map((e) => {
          return (
            <option key={`${e.value}-option-analysis`} value={e.value}>
              {e.label}
            </option>
          );
        })}
        <optgroup label='State' />
        {statePresets.map((e) => {
          return (
            <option key={`${e.value}-option-analysis`} value={e.value}>
              {e.label}
            </option>
          );
        })}
      </PresetSelect>
      {selectedState && !isLoading && (
        <CancelButton
          fitting='skinny'
          onClick={() => {
            resetPreset();
          }}
        >
          <CollecticonDiscXmark
            meaningful
            width='12px'
            height='12px'
            title='Clear preset'
          />
        </CancelButton>
      )}
      {isLoading && (
        <LoadingWrapper>
          <AnimatingCollecticonArrowSpinCcw
            meaningful
            width='12px'
            height='12px'
            title='Loading'
          />
        </LoadingWrapper>
      )}
    </SelectorWrapper>
  );
}
