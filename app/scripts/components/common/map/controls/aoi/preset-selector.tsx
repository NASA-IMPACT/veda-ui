import React, { useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Feature, Polygon } from 'geojson';
import { Button } from '@devseed-ui/button';
import {
  CollecticonChevronDownSmall,
  CollecticonDiscXmark,
  CollecticonArrowSpinCcw
} from '@devseed-ui/collecticons';
import { glsp, truncated } from '@devseed-ui/theme-provider';
import usePresetAOI from '../hooks/use-preset-aoi';

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
  group?: string;
}

export interface PresetSelectorProps {
  selectedState: PresetOption | null;
  setSelectedState: (state: PresetOption | null) => void;
  resetPreset: () => void;
  presets: PresetOption[];
  onConfirm: (features: Feature<Polygon>[]) => void;
  placeholderText?: string;
}

export default function PresetSelector({
  selectedState,
  setSelectedState,
  resetPreset,
  presets,
  onConfirm,
  placeholderText = 'Analyze an area'
}: PresetSelectorProps) {
  const { features, isLoading } = usePresetAOI(selectedState?.path);

  useEffect(() => {
    if (features?.length && onConfirm) onConfirm(features);

    // Excluding onConfirm from the dependencies array to prevent an infinite loop:
    // onConfirm depends on the Map instance, and invoking it modifies the Map,
    // which can re-trigger this effect if included as a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [features]);

  const groupedPresets = presets.reduce((acc, preset) => {
    const group = preset.group || 'default';
    if (!acc[group]) acc[group] = [];
    acc[group] = [...acc[group], preset];
    return acc;
  }, {} as Record<string, PresetOption[]>);

  const groups = Object.keys(groupedPresets);
  const showGroups = groups.length > 1;

  return (
    <SelectorWrapper>
      <OptionValueDisplay>
        <span>{selectedState ? selectedState.label : placeholderText} </span>
        <CollecticonChevronDownSmall />
      </OptionValueDisplay>

      <PresetSelect
        id='preset-selector'
        name='Select a new area of interest'
        value={selectedState?.value || ''}
        onChange={(e) => {
          const selectedPreset = presets.find(
            (p) => p.value === e.target.value
          );
          setSelectedState(selectedPreset || null);
        }}
      >
        <option> {placeholderText} </option>
        {groups.map((groupName) => {
          const groupPresets = groupedPresets[groupName];
          return (
            <React.Fragment key={groupName}>
              {showGroups && groupName !== 'default' && (
                <optgroup
                  label={groupName.charAt(0).toUpperCase() + groupName.slice(1)}
                />
              )}
              {groupPresets.map((preset) => (
                <option
                  key={`${preset.value}-option-analysis`}
                  value={preset.value}
                >
                  {preset.label}
                </option>
              ))}
            </React.Fragment>
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
