import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Feature, Polygon } from 'geojson';
import { Button } from '@devseed-ui/button';
import {
  CollecticonDiscXmark
} from '@devseed-ui/collecticons';
import usePresetAOI from '../hooks/use-preset-aoi';

const analysisStatesPreset = ["Pennsylvania",
"New Mexico",
"Illinois",
"Utah",
"Puerto Rico",
"Wyoming",
"Oregon",
"Missouri",
"Iowa",
"Vermont",
"Arkansas",
"South Carolina",
"Kentucky",
"New York",
"North Dakota",
"Kansas",
"Minnesota",
"American Samoa",
"Montana",
"Connecticut",
"West Virginia",
"Commonwealth of the Northern Mariana Islands",
"Maryland",
"Washington",
"Oklahoma",
"Mississippi",
"Rhode Island",
"Nebraska",
"Nevada",
"North Carolina",
"Michigan",
"Indiana",
"Louisiana",
"Arizona",
"Delaware",
"New Hampshire",
"South Dakota",
"Massachusetts",
"District of Columbia",
"Maine",
"Hawaii",
"United States Virgin Islands",
"Alabama",
"Guam",
"New Jersey",
"Wisconsin",
"Florida",
"Idaho",
"Colorado",
"Texas",
"California",
"Virginia",
"Alaska",
"Ohio",
"Tennessee",
"Georgia"
].map(e => ({label: e, value: e}));

// Disabling no mutating rule since we are mutating the copy
// eslint-disable-next-line fp/no-mutating-methods
const sortedPresets = [...analysisStatesPreset].sort((a,b) => {
  return a.label.localeCompare(b.label);
});

const selectorHeight = '25px';

const SelectorWrapper = styled.div`
  position: relative;
`;

const PresetSelect = styled.select`
  max-width: 200px;
  height: ${selectorHeight};
`;

const CancelButton = styled(Button)`
  position: absolute;
  right: 10px;
  height: ${selectorHeight};
`;

export default function PresetSelector({ selectedState, setSelectedState, onConfirm, resetPreset }: {
  selectedState: string,
  setSelectedState: (state: string) => void,
  onConfirm: (features: Feature<Polygon>[]) => void,
  resetPreset: () => void
}) {
  const { features } = usePresetAOI(selectedState);

  useEffect(() => {
    if (features?.length) onConfirm(features);
  
  // Excluding onConfirm from the dependencies array to prevent an infinite loop:
  // onConfirm depends on the Map instance, and invoking it modifies the Map, 
  // which can re-trigger this effect if included as a dependency.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[features]);

  return (
    <SelectorWrapper>
      <PresetSelect
        id='preset-selector'
        name='presetSelector'
        value={selectedState}
        onChange={(e) => setSelectedState(e.target.value)}
      >
        <option> Analyze an area </option>
        <optgroup label='Country' />
          <option value='United States'> United States</option>
        <optgroup label='State' />
        {sortedPresets.map(e => {
          return (<option key={`${e.value}-option-analysis`} value={e.value}>{e.label}</option>);
        })}
      </PresetSelect>
      {selectedState &&
      
      <CancelButton
      fitting='skinny'
      onClick={() => {
        resetPreset();
      }}
      >
        <CollecticonDiscXmark meaningful width='12px' height='12px' title='Clear preset' />
      </CancelButton>}
    </SelectorWrapper>
  );


}