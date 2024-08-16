import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3-scale-chromatic';
import { Icon } from "@trussworks/react-uswds";

import { themeVal } from '@devseed-ui/theme-provider';
import { variableGlsp } from '$styles/variable-utils';

import './colormap-options.scss';

const Container = styled.div`
  background: white;
  box-shadow: ${themeVal('boxShadow.elevationB')};
  width: 373px;
  overflow-y: auto;
  max-height: 500px;
`;

const Header = styled.div`
  padding: 16px;
`;

const ColormapWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ColormapItem = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: ${variableGlsp(0.5)};
  border-bottom: 1px solid ${themeVal('color.base-200')};
  border-radius: ${themeVal('shape.rounded')};
  gap: 12px;
  &:hover {
    background-color: #f4f4f4;
  }
  ${({ selected }) =>
    selected &&
    `
    outline: 2px solid #007BFF;
    outline-offset: -2px;
    background-color: #E8F0FD;
  `}
`;

const ColormapLabel = styled.div`
  text-align: left;
  flex: 1;
`;

interface ColormapPreviewProps {
  colormap: string[];
}

export const ColormapPreview = styled.span<ColormapPreviewProps & { width?: string }>`
  width: ${({ width }) => width ?? '260px'};
  height: 12px;
  background: ${({ colormap }) =>
    `linear-gradient(to right, ${colormap.join(', ')})`};
  border-radius: ${themeVal('shape.rounded')};
  border: 1px solid ${themeVal('color.base-200')};
  display: flex;
  cursor: default;
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 16px;
  background-color: #FAFAFA;
  border-top: 1px solid ${themeVal('color.base-200')};
`;

const ToggleLabel = styled.label`
  margin-right: 8px;
`;

const ToggleInput = styled.input.attrs({ type: 'checkbox' })`
  display: none;
`;

const Divider = styled.div`
  width: calc(100% - 32px);
  height: 1px;
  background-color: #E0E0EB;
  margin: 0 auto;
`;

export const SEQUENTIAL_COLORMAPS = [
  { name: 'Viridis', scale: d3.interpolateViridis },
  { name: 'Plasma', scale: d3.interpolatePlasma },
  { name: 'Inferno', scale: d3.interpolateInferno },
  { name: 'Magma', scale: d3.interpolateMagma },
  { name: 'Cividis', scale: d3.interpolateCividis },
  { name: 'Purples', scale: d3.interpolatePurples },
  { name: 'Blues', scale: d3.interpolateBlues },
  { name: 'Reds', scale: d3.interpolateReds },
  { name: 'Greens', scale: d3.interpolateGreens },
  { name: 'Oranges', scale: d3.interpolateOranges },
  { name: 'YlGnBu', scale: d3.interpolateYlGnBu },
  { name: 'YlGn', scale: d3.interpolateYlGn },
  { name: 'GnBu', scale: d3.interpolateGnBu },
];

export const DIVERGING_COLORMAPS = [
  { name: 'RdBu', scale: d3.interpolateRdBu },
  { name: 'RdYlBu', scale: d3.interpolateRdYlBu },
  { name: 'Bwr', scale: d3.interpolateBrBG },
  { name: 'Coolwarm', scale: d3.interpolateCool }
];

export const classifyColormap = (colormapName) => {
  if (!colormapName) return 'unknown';

  const normalizedColormapName = colormapName.replace(/_r$/, '');

  if (SEQUENTIAL_COLORMAPS.some(cmap => cmap.name.toLowerCase() === normalizedColormapName.toLowerCase())) {
    return 'sequential';
  } else if (DIVERGING_COLORMAPS.some(cmap => cmap.name.toLowerCase() === normalizedColormapName.toLowerCase())) {
    return 'diverging';
  }
  return 'unknown';
};


export const isCategoricalColormap = (colormap) => {
  try {
    const parsed = JSON.parse(colormap);
    return typeof parsed === 'object' && parsed !== null;
  } catch (e) {
    return false;
  }
};

interface ColormapOptionsProps {
  colorMap: string;
  setColorMap: (colorMap: string) => void;
  min?: number;
  max?: number;
}

export function ColormapOptions({ colorMap, setColorMap, min = 0, max = 1 }: ColormapOptionsProps) {
  const [isReversed, setIsReversed] = useState(false);
  const [selectedColorMap, setSelectedColorMap] = useState(colorMap);

  const isValidColormap = (name: string) => d3[`interpolate${name}`];

  const colormapType = classifyColormap(selectedColorMap);
  let availableColormaps =
    colormapType === 'diverging' ? DIVERGING_COLORMAPS : SEQUENTIAL_COLORMAPS;

  if (colormapType === 'unknown' && isValidColormap(selectedColorMap)) {
    const newDefault = {
      name: 'Default',
      scale: d3[`interpolate${selectedColorMap}`],
    };
    availableColormaps = [newDefault, ...availableColormaps];
  } else if (colormapType === 'unknown') {
    setSelectedColorMap(SEQUENTIAL_COLORMAPS[0].name.toLowerCase());
    setColorMap(SEQUENTIAL_COLORMAPS[0].name.toLowerCase());
  }

  useEffect(() => {
    if (colorMap && colorMap.endsWith('_r')) {
      setIsReversed(true);
    }
  }, [colorMap]);

  const handleReverseToggle = () => {
    const newIsReversed = !isReversed;
    setIsReversed(newIsReversed);
    setColorMap(newIsReversed ? `${selectedColorMap}_r` : selectedColorMap);
  };

  const handleColorMapSelect = (colorMap) => {
    setSelectedColorMap(colorMap);
    setColorMap(isReversed ? `${colorMap}_r` : colorMap);
  };

  const rescale = (t: number) => (t - min) / (max - min);

  return (
    <Container>
      <Header className='text-gray-90 font-heading-xs text-bold'>Colormap options</Header>

      <ToggleContainer className='text-semibold' onClick={handleReverseToggle}>
        <ToggleLabel className='text-gray-90'>Reverse</ToggleLabel>
        {isReversed ? (
            <Icon.ToggleOn
                className='text-primary'
                size={4}
            />
        ) : (
            <Icon.ToggleOff
                className='text-primary-dark'
                size={4}
            />
        )}
        <ToggleInput checked={isReversed} />
      </ToggleContainer>

      <Divider />
      <ColormapWrapper>
        {availableColormaps.map((colormap) => {
          const colors = [0, 0.5, 1].map((t) => colormap.scale(rescale(t)));
          const previewColors = isReversed ? colors.reverse() : colors;

          return (
              <ColormapItem
                key={colormap.name}
                selected={selectedColorMap === colormap.name.toLowerCase()}
                onClick={() => handleColorMapSelect(colormap.name.toLowerCase())}
              >
                <ColormapPreview colormap={previewColors} />
                <ColormapLabel className='text-gray-90 font-heading-xs'>{colormap.name}</ColormapLabel>
              </ColormapItem>
          );
        })}
      </ColormapWrapper>
    </Container>
  );
}
