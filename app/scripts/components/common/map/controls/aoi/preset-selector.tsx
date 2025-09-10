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

/**
 * Configuration object for a preset option in the selector
 */
export interface PresetOption {
  /** Display name shown to the user */
  label: string;
  /** Unique identifier for the preset */
  value: string;
  /** Path to the GeoJSON file containing the preset data */
  path: string;
  /** Optional group name for organizing presets. If not provided, preset will be ungrouped */
  group?: string;
}

/**
 * Props for the PresetSelector component
 */
export interface PresetSelectorProps {
  /** Currently selected preset option */
  selectedState: PresetOption | null;
  /** Function to update the selected preset */
  setSelectedState: (state: PresetOption | null) => void;
  /** Function to clear the current selection */
  resetPreset: () => void;
  /** Array of available preset options to display */
  presets: PresetOption[];
  /** Callback function called when preset data is loaded and confirmed, return features of selected option as return value */
  onConfirm: (features: Feature<Polygon>[]) => void;
  /** Custom placeholder text to show when no option is selected. Defaults to 'Analyze an area' */
  placeholderText?: string;
}

/**
 * A flexible dropdown selector component for choosing preset areas of interest (AOI).
 *
 * This component automatically groups presets by their `group` property and only shows
 * group labels when there are multiple groups. It loads GeoJSON data for selected presets
 * using the usePresetAOI hook and provides loading states and error handling.
 *
 * @param props - The component props
 * @param props.selectedState - Currently selected preset option
 * @param props.setSelectedState - Function to update the selected preset
 * @param props.resetPreset - Function to clear the current selection
 * @param props.presets - Array of available preset options to display
 * @param props.onConfirm - Callback function called when preset data is loaded and confirmed, return features of selected option as return value
 * @param props.placeholderText - Custom placeholder text to show when no option is selected
 * @returns JSX element containing the preset selector interface
 *
 * @example
 * ```tsx
 * <PresetSelector
 *   selectedState={selectedPreset}
 *   setSelectedState={setSelectedPreset}
 *   resetPreset={() => setSelectedPreset(null)}
 *   presets={availablePresets}
 *   onConfirm={(features) => handleConfirm(features)}
 *   placeholderText="Choose a region"
 * />
 * ```
 */
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
