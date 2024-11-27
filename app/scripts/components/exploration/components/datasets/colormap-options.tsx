import React, { useEffect, useState } from 'react';
import { Icon } from "@trussworks/react-uswds";
import { CollecticonDrop } from '@devseed-ui/collecticons';
import {
  sequentialColorMaps,
  divergingColorMaps,
  restColorMaps
} from './colorMaps';

import './colormap-options.scss';
import { ColorRangeSlider } from './colorRangeSlider/index';
import { colorMapScale } from '$components/exploration/types.d.ts';
export const DEFAULT_COLORMAP = 'viridis';

const CURATED_SEQUENTIAL_COLORMAPS = [
  'viridis', 'plasma', 'inferno', 'magma', 'cividis',
  'purples', 'blues', 'reds', 'greens', 'oranges',
  'ylgnbu', 'ylgn', 'gnbu'
];

const CURATED_DIVERGING_COLORMAPS = [
  'rdbu', 'rdylbu', 'bwr', 'coolwarm'
];

export const classifyColormap = (colormapName: string): 'sequential' | 'diverging' | 'rest' | 'unknown' => {
  const baseName = normalizeColorMap(colormapName);

  if (sequentialColorMaps[baseName]) {
    return 'sequential';
  } else if (divergingColorMaps[baseName]) {
    return 'diverging';
  } else if (restColorMaps[baseName]) {
    return 'rest';
  }
  return 'unknown';
};

interface ColormapOptionsProps {
  colorMap: string | undefined;
  setColorMap: (colorMap: string) => void;
}

export const getColormapColors = (colormapName: string, isReversed: boolean): string[] => {
  const baseName = normalizeColorMap(colormapName);
  const colormapData =
    sequentialColorMaps[baseName] ||
    divergingColorMaps[baseName] ||
    restColorMaps[baseName] ||
    sequentialColorMaps.viridis;

  const colorKeys = Object.keys(colormapData);
  const colors = colorKeys.map((key) => {
    const [r, g, b, a] = colormapData[key];
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  });

  return isReversed ? colors.reduceRight((acc, color) => [...acc, color], []) : colors;
};

export function ColormapOptions({ colorMap = DEFAULT_COLORMAP, setColorMap}: ColormapOptionsProps) {
  const initialIsReversed = colorMap.endsWith('_r');
  const initialColorMap = normalizeColorMap(colorMap);

  const [isReversed, setIsReversed] = useState(initialIsReversed);
  const [selectedColorMap, setSelectedColorMap] = useState(initialColorMap);

  const colormapType = classifyColormap(selectedColorMap);
  const [customColorMap, setCustomColorMap] = useState<string | null>(null);

  useEffect(() => {
    if (colormapType === 'sequential' && !CURATED_SEQUENTIAL_COLORMAPS.includes(selectedColorMap)) {
      setCustomColorMap(selectedColorMap);
    } else if (colormapType === 'diverging' && !CURATED_DIVERGING_COLORMAPS.includes(selectedColorMap)) {
      setCustomColorMap(selectedColorMap);
    }
  }, [selectedColorMap, colormapType]);

  let availableColormaps: { name: string; label?: string }[] = [];

  if (colormapType === 'sequential') {
    if (customColorMap) {
      availableColormaps = [{ name: customColorMap }, ...CURATED_SEQUENTIAL_COLORMAPS.map(name => ({ name }))];
    } else {
      availableColormaps = CURATED_SEQUENTIAL_COLORMAPS.map(name => ({ name }));
    }
  } else if (colormapType === 'diverging') {
    if (customColorMap) {
      availableColormaps = [{ name: customColorMap }, ...CURATED_DIVERGING_COLORMAPS.map(name => ({ name }))];
    } else {
      availableColormaps = CURATED_DIVERGING_COLORMAPS.map(name => ({ name }));
    }
  } else if (colormapType === 'rest') {
    availableColormaps = [{ name: selectedColorMap }];
  } else {
    availableColormaps = [{ name: DEFAULT_COLORMAP }];
  }

  const handleReverseToggle = () => {
    const newIsReversed = !isReversed;
    setIsReversed(newIsReversed);
    const baseColorMap = normalizeColorMap(selectedColorMap);
    setColorMap(newIsReversed ? `${baseColorMap}_r` : baseColorMap);
  };

  const handleColorMapSelect = (colorMap: string) => {
    const baseColorMap = normalizeColorMap(colorMap);
    setSelectedColorMap(baseColorMap);
    setColorMap(isReversed ? `${baseColorMap}_r` : baseColorMap);
  };

  return (
    <div className='colormap-options__container bg-white shadow-1 maxh-mobile-lg'>
      <div className='display-flex flex-align-center text-gray-90 padding-2 font-heading-xs text-bold'>
        <CollecticonDrop className='margin-right-1' /> Colormap options
      </div>

      <div className='display-flex flex-align-center flex-column flex-justify border-top-1px border-bottom-1px border-base-lightest bg-base-lightest padding-2'>
        <ColorRangeSlider
          min={min}
          max={max}
          colorMapScale={colorMapScale}
          setColorMapScale={setColorMapScale}
        />
        <div
          className='display-flex flex-align-center width-full padding-top-1'
          onClick={handleReverseToggle}
        >
          <label className='font-ui-3xs text-gray-90 text-semibold margin-right-1'>
            Reverse
          </label>
          {isReversed ? (
            <Icon.ToggleOn className='text-primary' size={4} />
          ) : (
            <Icon.ToggleOff className='text-base-light' size={4} />
          )}
          <input className='colormap-options__input' checked={isReversed} type='checkbox' readOnly />
        </div>
      </div>

      <div>
        {availableColormaps.map(({ name }) => {
          const previewColors = getColormapColors(name, isReversed);

          return (
            <div
              className={`colormap-options__item display-flex flex-align-center flex-justify padding-2 border-bottom-1px border-base-lightest radius-md ${selectedColorMap.toLowerCase() === name.toLowerCase() ? 'selected' : ''}`}
              key={name}
              onClick={() => handleColorMapSelect(name.toLowerCase())}
            >
              <div
                className='colormap-options__preview display-flex border-1px border-base-lightest radius-md margin-right-2'
                style={{ background: `linear-gradient(to right, ${previewColors.join(', ')})` }}
              />
              <label className='colormap-options__label text-gray-90 font-heading-xs flex-1'>
                {name}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}


function normalizeColorMap(colorMap: string): string {
  return colorMap.replace(/_r$/, '');
}
