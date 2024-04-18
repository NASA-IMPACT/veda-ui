import React, { useState, useEffect } from 'react';
import { Feature, Polygon } from 'geojson';
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



export default function PresetSelector({ onConfirm }: {onConfirm:  (features: Feature<Polygon>[]) => void}) {
  const [selectedState, setSeletcedState] = useState('');
  const { features } = usePresetAOI(selectedState);

  useEffect(() => {
    if (features?.length) onConfirm(features);
  },[features, onConfirm]);

  return (
    <select style={{maxWidth: '300px'}} onChange={(e) => setSeletcedState(e.target.value)} name='presetSelector' id='preset-selector'>
      <option> Select area to analyze</option>
      <optgroup label='Country' />
        <option value='United States'> United States</option>
      <optgroup label='State' />
      {analysisStatesPreset.map(e => {
        return (<option key={`${e.value}-option-analysis`} value={e.value}>{e.label}</option>);
      })}
    </select>
  );


}