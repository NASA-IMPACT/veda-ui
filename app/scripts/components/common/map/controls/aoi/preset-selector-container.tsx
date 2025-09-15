import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Feature, Polygon } from 'geojson';
import PresetSelector, { PresetOption } from './preset-selector';
import { useVedaUI } from '$context/veda-ui-provider';

const PresetSelectorContainerDiv = styled.div`
  max-width: 200px;
  height: 25px;
`;
export interface PresetSelectorContainerProps {
  selectedState: PresetOption | null;
  setSelectedState: (state: PresetOption | null) => void;
  onConfirm: (features: Feature<Polygon>[]) => void;
  resetPreset: () => void;
}
const stateNames = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'District of Columbia',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Puerto Rico',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming'
];

export default function PresetSelectorContainer({
  selectedState,
  setSelectedState,
  onConfirm,
  resetPreset
}: PresetSelectorContainerProps) {
  const { geoDataPath } = useVedaUI();

  const presets: PresetOption[] = useMemo(() => {
    const baseUrl = geoDataPath ? geoDataPath.replace(/\/$/, '') : '';

    // map returns the new array which is safe to mutate
    // eslint-disable-next-line fp/no-mutating-methods
    const statePresets: PresetOption[] = stateNames
      .map((name) => ({
        group: 'state' as const,
        label: name,
        value: name,
        path: `${baseUrl}/states/${name}.geojson`
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const countryPresets: PresetOption[] = [
      {
        group: 'country' as const,
        label: 'Contiguous United States (CONUS)',
        value: 'United States (Contiguous)',
        path: `${baseUrl}/states/United States (Contiguous).geojson`
      }
    ];

    return [...countryPresets, ...statePresets];
  }, [geoDataPath]);

  return (
    <PresetSelectorContainerDiv>
      <PresetSelector
        selectedPreset={selectedState}
        setSelectedPreset={setSelectedState}
        resetPreset={resetPreset}
        presets={presets}
        onConfirm={onConfirm}
      />
    </PresetSelectorContainerDiv>
  );
}
