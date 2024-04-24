import React, { useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Feature, Polygon } from 'geojson';
import { Button } from '@devseed-ui/button';
import {
  CollecticonDiscXmark,
  CollecticonArrowSpinCcw,
} from '@devseed-ui/collecticons';
import usePresetAOI from '../hooks/use-preset-aoi';

const analysisStatesPreset = ["Alabama",
"Alaska",
"Arizona",
"Arkansas",
"California",
"Colorado",
"Connecticut",
"Delaware",
"District of Columbia",
"Florida",
"Georgia",
"Hawaii",
"Idaho",
"Illinois",
"Indiana",
"Iowa",
"Kansas",
"Kentucky",
"Louisiana",
"Maine",
"Maryland",
"Massachusetts",
"Michigan",
"Minnesota",
"Mississippi",
"Missouri",
"Montana",
"Nebraska",
"Nevada",
"New Hampshire",
"New Jersey",
"New Mexico",
"New York",
"North Carolina",
"North Dakota",
"Ohio",
"Oklahoma",
"Oregon",
"Pennsylvania",
"Puerto Rico",
"Rhode Island",
"South Carolina",
"South Dakota",
"Tennessee",
"Texas",
"Utah",
"Vermont",
"Virginia",
"Washington",
"West Virginia",
"Wisconsin",
"Wyoming"
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

const SelectorSubAction = css`
  position: absolute;
  top: 0;
  right: 10px;
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
  right: 18px;
`;

const AnimatingCollecticonArrowSpinCcw = styled(CollecticonArrowSpinCcw)`
  animation: ${spinAnimation} 1s infinite linear;
`;

export default function PresetSelector({ selectedState, setSelectedState, onConfirm, resetPreset }: {
  selectedState: string,
  setSelectedState: (state: string) => void,
  onConfirm: (features: Feature<Polygon>[]) => void,
  resetPreset: () => void
}) {
  const { features, isLoading } = usePresetAOI(selectedState);

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
          <option value='United States (Contiguous)'> Contiguous United States (CONUS)</option>
        <optgroup label='State' />
        {sortedPresets.map(e => {
          return (<option key={`${e.value}-option-analysis`} value={e.value}>{e.label}</option>);
        })}
      </PresetSelect>
      {(selectedState && !isLoading) && 
        <CancelButton
        fitting='skinny'
        onClick={() => {
          resetPreset();
        }}
        >
          <CollecticonDiscXmark meaningful width='12px' height='12px' title='Clear preset' />
        </CancelButton>}
      {isLoading &&
        <LoadingWrapper>
          <AnimatingCollecticonArrowSpinCcw meaningful width='12px' height='12px' title='Loading' />
        </LoadingWrapper>}
    </SelectorWrapper>
  );


}