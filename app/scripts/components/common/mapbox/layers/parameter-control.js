import React from 'react';
import { useCallback } from 'react';
import { colormaps } from '@carbonplan/colormaps';

const sx = {
  label: {
    fontFamily: 'mono',
    letterSpacing: 'mono',
    textTransform: 'uppercase',
    fontSize: [1, 1, 1, 2],
    mt: [3]
  }
};

const CLIM_RANGES = {
  tavg: { max: 30, min: -20 },
  prec: { max: 300, min: 0 }
};

const DEFAULT_COLORMAPS = {
  tavg: 'warm',
  prec: 'cool'
};

const ParameterControls = ({ getters, setters }) => {
  const { display, debug, opacity, clim, month, band, colormapName } = getters;
  const {
    setDisplay,
    setDebug,
    setOpacity,
    setClim,
    setMonth,
    setBand,
    setColormapName
  } = setters;

  const handleBandChange = useCallback((e) => {
    const band = e.target.value;
    setBand(band);
    setClim([CLIM_RANGES[band].min, CLIM_RANGES[band].max]);
    setColormapName(DEFAULT_COLORMAPS[band]);
  });

  return (
    <>
      <div style={{ position: 'absolute', top: 20, right: 20 }}>
        <div style={{ 'background-color': '#ddd' }}> band </div>
        <select onChange={handleBandChange} value={band}>
          <option value='tavg'>Temperature</option>
          <option value='prec'>Precipitation</option>
        </select>

        <div style={{ 'background-color': '#ddd' }}>Colormap</div>
        <select
          onChange={(e) => setColormapName(e.target.value)}
          value={colormapName}
        >
          {colormaps.map((d) => (
            <option key={d.name}>{d.name}</option>
          ))}
        </select>
      </div>
    </>
  );
};

export default ParameterControls;
