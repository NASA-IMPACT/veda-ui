import React, { useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Feature, Polygon } from 'geojson';
import { Button } from '@devseed-ui/button';
import {
  CollecticonChevronDownSmall,
  CollecticonDiscXmark,
  CollecticonArrowSpinCcw,
} from '@devseed-ui/collecticons';
import { glsp, truncated } from '@devseed-ui/theme-provider';
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
].map(e => ({group: 'state', label: e, value: e}));

const analysisCountryPreset = [
  {
    group: 'country',
    label: 'Contiguous United States (CONUS)',
    value: 'United States (Contiguous)'
  }
];
const analysisPresets = [
  ...analysisStatesPreset,
  ...analysisCountryPreset
];

// Disabling no mutating rule since we are mutating the copy
// eslint-disable-next-line fp/no-mutating-methods
const sortedPresets = [...analysisStatesPreset].sort((a,b) => {
  return a.label.localeCompare(b.label);
});

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

  const currentlySelected = analysisPresets.find(e => e.value === selectedState);

  return (
    <SelectorWrapper>
      <OptionValueDisplay><span>{currentlySelected? currentlySelected.label: 'Analyze an area'} </span><CollecticonChevronDownSmall /></OptionValueDisplay>

      <PresetSelect
        id='preset-selector'
        name='presetSelector'
        value={selectedState}
        onChange={(e) => setSelectedState(e.target.value)}
      >
        <option> Analyze an area </option>
        <optgroup label='Country' />
        {
          analysisCountryPreset.map(e => {
            return (<option key={`${e.value}-option-analysis`} value={e.value}>{e.label}</option>);
          })
        }
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