import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Icon } from "@trussworks/react-uswds";
import { sequentialColorMaps, divergingColorMaps, restColorMaps } from './colorMaps';
import './colormap-options.scss';

const Container = styled.div`
  width: 383px;
  overflow-y: auto;
  max-height: 500px;
`;

const Header = styled.div``;

const ColormapWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ColormapItem = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  gap: 12px;

  &:hover {
    background-color: #f4f4f4;
  }

  ${({ selected }) =>
    selected &&
    `
    border-radius: 0;
    outline: 2px solid #007BFF;
    outline-offset: -2px;
    background-color: #E8F0FD;
    font-weight: 600;
  `}
`;

const ColormapLabel = styled.div`
  text-align: left;
  flex: 1;
`;

export const ColormapPreview = styled.span<{ colormap: string[], width?: string }>`
  width: ${({ width }) => width ?? '260px'};
  height: 12px;
  background: ${({ colormap }) =>
    `linear-gradient(to right, ${colormap.join(', ')})`};
  display: flex;
  cursor: default;
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const ToggleLabel = styled.label``;

const ToggleInput = styled.input.attrs({ type: 'checkbox' })`
  display: none;
`;

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
  colorMap: string;
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

export function ColormapOptions({ colorMap = 'viridis', setColorMap}: ColormapOptionsProps) {
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
      availableColormaps = [{ name: customColorMap, label: 'Default' }, ...CURATED_SEQUENTIAL_COLORMAPS.map(name => ({ name }))];
    } else {
      availableColormaps = CURATED_SEQUENTIAL_COLORMAPS.map(name => ({ name }));
    }
  } else if (colormapType === 'diverging') {
    if (customColorMap) {
      availableColormaps = [{ name: customColorMap, label: 'Default' }, ...CURATED_DIVERGING_COLORMAPS.map(name => ({ name }))];
    } else {
      availableColormaps = CURATED_DIVERGING_COLORMAPS.map(name => ({ name }));
    }
  } else if (colormapType === 'rest') {
    availableColormaps = [{ name: selectedColorMap }];
  } else {
    availableColormaps = [{ name: 'viridis' }];
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
    <Container className='bg-white shadow-1'>
      <Header className='text-gray-90 padding-2 font-heading-xs text-bold'>Colormap options</Header>

      <ToggleContainer className='border-top-1px border-bottom-1px border-base-lightest bg-base-lightest padding-2' onClick={handleReverseToggle}>
        <ToggleLabel className='text-gray-90 text-semibold margin-right-1'>Reverse</ToggleLabel>
        {isReversed ? (
          <Icon.ToggleOn className='text-primary' size={4} />
        ) : (
          <Icon.ToggleOff className='text-primary-dark' size={4} />
        )}
        <ToggleInput checked={isReversed} />
      </ToggleContainer>

      <ColormapWrapper>
        {availableColormaps.map(({ name, label }) => {
          const previewColors = getColormapColors(name, isReversed);

          return (
            <ColormapItem
              className='padding-2 border-bottom-1px border-base-lightest radius-md'
              key={name}
              selected={selectedColorMap.toLowerCase() === name.toLowerCase()}
              onClick={() => handleColorMapSelect(name.toLowerCase())}
            >
              <ColormapPreview className='border-1px border-base-lightest radius-md' colormap={previewColors} />
              <ColormapLabel className='text-gray-90 font-heading-xs'>
                {label ? 'Default' : name}
              </ColormapLabel>
            </ColormapItem>
          );
        })}
      </ColormapWrapper>
    </Container>
  );
}


function normalizeColorMap(colorMap: string): string {
  return colorMap.replace(/_r$/, '');
}
