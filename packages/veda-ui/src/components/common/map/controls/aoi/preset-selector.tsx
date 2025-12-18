import React, { useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Feature, Polygon } from 'geojson';
import usePresetAOI from '../hooks/use-preset-aoi';
import { USWDSButton, USWDSIcon } from '$uswds';

const PresetSelect = styled.select.attrs({
  'data-testid': 'preset-selector'
})`
  width: 100%;
  height: 100%;
  color: transparent;
  background: none;
  option {
    color: black;
  }
`;

// This div is to display the value with trucnated texts
const OptionValueDisplay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  padding: 0.125rem 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  pointer-events: none;
  span {
    width: 85%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const SelectorSubAction = css`
  position: absolute;
  top: 0;
  right: 1.25rem;
  height: 100%;
`;

const spinAnimation = keyframes`
  from {
      transform:rotate(360deg);
  }
  to {
      transform:rotate(0deg);
  }
`;

const CancelButton = styled(USWDSButton)`
  ${SelectorSubAction}
`;

const LoadingWrapper = styled.div`
  ${SelectorSubAction}
  display: flex;
  align-items: center;
  right: 2rem;
`;

const AnimatingUSWDSIconAutorenew = styled(USWDSIcon.Autorenew)`
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
  selectedPreset: PresetOption | null;
  /** Function to update the selected preset */
  setSelectedPreset: (state: PresetOption | null) => void;
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
 * @param props.selectedPreset - Currently selected preset option
 * @param props.setSelectedPreset - Function to update the selected preset
 * @param props.resetPreset - Function to clear the current selection
 * @param props.presets - Array of available preset options to display
 * @param props.onConfirm - Callback function called when preset data is loaded and confirmed, return features of selected option as return value
 * @param props.placeholderText - Custom placeholder text to show when no option is selected
 * @returns JSX element containing the preset selector interface
 *
 * @example
 * ```tsx
 * <PresetSelector
 *   selectedPreset={selectedPreset}
 *   setSelectedPreset={setSelectedPreset}
 *   resetPreset={() => setSelectedPreset(null)}
 *   presets={availablePresets}
 *   onConfirm={(features) => handleConfirm(features)}
 *   placeholderText="Choose a region"
 * />
 * ```
 */
interface PresetSelectorRootProps {
  children: React.ReactNode;
  className?: string;
}

// Individual component parts for composition
// User can choose either to compose their own components or use a default built-in.
export const PresetSelectorRoot: React.FC<PresetSelectorRootProps> = (
  props
) => {
  return (
    <div
      className={`position-relative width-full height-full ${
        props.className || ''
      }`}
      {...props}
    >
      {props.children}
    </div>
  );
};

export const PresetSelectorTrigger = ({
  selectedPreset,
  placeholderText = 'Analyze an area'
}: {
  selectedPreset: PresetOption | null;
  placeholderText?: string;
}) => (
  <OptionValueDisplay>
    <span>{selectedPreset ? selectedPreset.label : placeholderText} </span>
    <USWDSIcon.ExpandMore />
  </OptionValueDisplay>
);

interface PresetSelectorSelectProps {
  selectedPreset: PresetOption | null;
  setSelectedPreset: (state: PresetOption | null) => void;
  presets: PresetOption[];
  placeholderText?: string;
}

export const PresetSelectorSelect = ({
  selectedPreset,
  setSelectedPreset,
  presets,
  placeholderText = 'Analyze an area'
}: PresetSelectorSelectProps) => {
  const groupedPresets = presets.reduce((acc, preset) => {
    const group = preset.group || 'default';
    if (!acc[group]) acc[group] = [];
    acc[group] = [...acc[group], preset];
    return acc;
  }, {} as Record<string, PresetOption[]>);

  const groups = Object.keys(groupedPresets);
  const showGroups = groups.length > 1;

  return (
    <PresetSelect
      id='preset-selector'
      name='Select a new area of interest'
      value={selectedPreset?.value || ''}
      onChange={(e) => {
        const selectedPreset = presets.find((p) => p.value === e.target.value);
        setSelectedPreset(selectedPreset || null);
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
  );
};

export const PresetSelectorClearButton = ({
  resetPreset
}: {
  resetPreset: () => void;
}) => (
  <CancelButton
    type='button'
    unstyled
    onClick={() => {
      resetPreset();
    }}
  >
    <USWDSIcon.Close role='img' aria-label='Clear preset' />
  </CancelButton>
);

export const PresetSelectorLoadingIndicator = () => (
  <LoadingWrapper>
    <AnimatingUSWDSIconAutorenew role='img' aria-label='Loading' />
  </LoadingWrapper>
);

// Composed default component
const PresetSelectorComponent = ({
  selectedPreset,
  setSelectedPreset,
  resetPreset,
  presets,
  onConfirm,
  placeholderText = 'Analyze an area'
}: PresetSelectorProps) => {
  const { features, isLoading } = usePresetAOI(selectedPreset?.path);

  useEffect(() => {
    if (features?.length && onConfirm) onConfirm(features);

    // Excluding onConfirm from the dependencies array to prevent an infinite loop:
    // onConfirm depends on the Map instance, and invoking it modifies the Map,
    // which can re-trigger this effect if included as a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [features]);

  return (
    <PresetSelectorRoot>
      <PresetSelectorTrigger
        selectedPreset={selectedPreset}
        placeholderText={placeholderText}
      />
      <PresetSelectorSelect
        selectedPreset={selectedPreset}
        setSelectedPreset={setSelectedPreset}
        presets={presets}
        placeholderText={placeholderText}
      />
      {selectedPreset && !isLoading && (
        <PresetSelectorClearButton resetPreset={resetPreset} />
      )}
      {isLoading && <PresetSelectorLoadingIndicator />}
    </PresetSelectorRoot>
  );
};

// Create namespace pattern exports
const PresetSelector = Object.assign(PresetSelectorComponent, {
  Root: PresetSelectorRoot,
  Trigger: PresetSelectorTrigger,
  Select: PresetSelectorSelect,
  ClearButton: PresetSelectorClearButton,
  LoadingIndicator: PresetSelectorLoadingIndicator
});

export default PresetSelector;
