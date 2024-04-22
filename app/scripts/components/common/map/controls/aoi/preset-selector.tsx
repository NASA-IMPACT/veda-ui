import React, { useEffect } from 'react';
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
    <div style={{position: 'relative'}}>
      <select
        id='preset-selector'
        name='presetSelector'
        style={{maxWidth: '200px', height: '25px'}} 
        value={selectedState}
        onChange={(e) => setSelectedState(e.target.value)}
      >
        <option> Select an area to analyze</option>
        <optgroup label='Country' />
          <option value='United States'> United States</option>
        <optgroup label='State' />
        {analysisStatesPreset.map(e => {
          return (<option key={`${e.value}-option-analysis`} value={e.value}>{e.label}</option>);
        })}
      </select>
      {selectedState &&
      
      <Button
      style={{position: 'absolute', right: '10px', height: '25px'}}
      fitting='skinny'
      onClick={() => {
        resetPreset();
      }}
      >
        <CollecticonDiscXmark meaningful width='12px' height='12px' title='Clear preset' />
      </Button>}
    </div>
  );


}