import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Feature } from 'geojson';
import PresetSelector, {
  PresetOption
} from '$components/common/map/controls/aoi/preset-selector';

// Mock preset data for different scenarios
const statesAndCountriesPresets: PresetOption[] = [
  {
    group: 'country',
    label: 'Sample',
    value: 'sample',
    path: '/sample.geojson'
  },
  {
    group: 'state',
    label: 'California',
    value: 'California',
    path: '/texas.geojson'
  },
  {
    group: 'state',
    label: 'Texas',
    value: 'Texas',
    path: '/california.geojson'
  },
  {
    group: 'state',
    label: 'New York',
    value: 'New York',
    path: '/newyork.geojson'
  }
];

const noGroupPresets: PresetOption[] = [
  {
    label: 'Area of Interest 1',
    value: 'aoi-1',
    path: '/california.geojson'
  },
  {
    label: 'Area of Interest 2',
    value: 'aoi-2',
    path: '/texas.geojson'
  },
  {
    label: 'Area of Interest 3',
    value: 'aoi-3',
    path: '/newyork.geojson'
  }
];
const PresetSelectorExample: React.FC<{
  presets: PresetOption[];
  placeholderText?: string;
}> = ({ presets, placeholderText }) => {
  const [selectedFeature, setSelectedFeature] = useState<Feature[] | null>(
    null
  );
  const [selectedOption, setSelectedOption] = useState<PresetOption | null>(
    null
  );

  return (
    <>
      <PresetSelector
        selectedState={selectedOption}
        setSelectedState={setSelectedOption}
        resetPreset={() => {
          setSelectedOption(null);
          setSelectedFeature(null);
        }}
        presets={presets}
        placeholderText={placeholderText}
        onConfirm={(features) => {
          setSelectedFeature(features);
        }}
      />

      <div>
        <strong>selected features:</strong>
        <p>{JSON.stringify(selectedFeature)}</p>
      </div>
    </>
  );
};

const meta: Meta<typeof PresetSelectorExample> = {
  title: 'Components/Map Controls/PresetSelector',
  component: PresetSelectorExample,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    presets: {
      description: 'Array of preset options to display in the selector'
    },
    placeholderText: {
      description: 'Text to show when no option is selected',
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof PresetSelectorExample>;

export const StatesAndCountries: Story = {
  args: {
    presets: statesAndCountriesPresets
  }
};

export const NoGroups: Story = {
  args: {
    presets: noGroupPresets
  }
};

export const CustomPlaceholder: Story = {
  args: {
    presets: statesAndCountriesPresets,
    placeholderText: 'Select a region to explore'
  }
};
