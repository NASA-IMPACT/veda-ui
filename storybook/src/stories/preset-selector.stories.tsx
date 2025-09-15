import React, { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Feature } from 'geojson';
import PresetSelector, {
  PresetOption,
  PresetSelectorRoot,
  PresetSelectorTrigger,
  PresetSelectorSelect,
  PresetSelectorClearButton,
  PresetSelectorLoadingIndicator
} from '$components/common/map/controls/aoi/preset-selector';
import usePresetAOI from '$components/common/map/controls/hooks/use-preset-aoi';

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
    <div className='width-full height-full'>
      <div className='width-card-lg height-5'>
        <PresetSelector
          selectedPreset={selectedOption}
          setSelectedPreset={setSelectedOption}
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
      </div>
      <div className='width-full'>
        <strong>selected features:</strong>
        <p>{JSON.stringify(selectedFeature)}</p>
      </div>
    </div>
  );
};

const meta: Meta<typeof PresetSelectorExample> = {
  title: 'Components/Map Controls/PresetSelector',
  component: PresetSelectorExample,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible preset selector component that can be used as a complete component or composed from individual parts. Built with USWDS components and following Ark UI composition patterns.'
      }
    }
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

// Custom composition example showing individual parts
const CustomComposedPresetSelector: React.FC<{
  presets: PresetOption[];
  placeholderText?: string;
}> = ({ presets, placeholderText = 'Analyze an area' }) => {
  const [selectedPreset, setSelectedPreset] = useState<PresetOption | null>(
    null
  );
  const [selectedFeatures, setSelectedFeatures] = useState<Feature[] | null>(
    null
  );
  const { features, isLoading } = usePresetAOI(selectedPreset?.path);

  useEffect(() => {
    if (features?.length) {
      setSelectedFeatures(features);
    }
  }, [features]);

  const resetPreset = () => {
    setSelectedPreset(null);
    setSelectedFeatures(null);
  };

  return (
    <div className='width-full height-full'>
      <h4> Custom composition with custom clear button</h4>
      <PresetSelectorRoot>
        <PresetSelectorTrigger
          selectedPreset={selectedPreset}
          placeholderText={placeholderText}
        />
        <PresetSelectorSelect
          selectedPreset={selectedPreset}
          setSelectedPreset={setSelectedPreset}
          presets={presets}
          placeholderText={placeholderText}
        />
        {selectedPreset && !isLoading && (
          <div
            onClick={resetPreset}
            style={{
              position: 'absolute',
              top: '0',
              right: '1.25rem',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#dc2626',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '3px',
              padding: '2px 6px',
              userSelect: 'none'
            }}
            title='Clear selection'
          >
            ✕
          </div>
        )}
        <PresetSelectorLoadingIndicator isLoading={isLoading} />
      </PresetSelectorRoot>

      <div className='width-full' style={{ marginTop: '16px' }}>
        <strong>Selected features:</strong>
        <p style={{ fontSize: '12px', wordBreak: 'break-all' }}>
          {selectedFeatures
            ? JSON.stringify(selectedFeatures, null, 2)
            : 'None'}
        </p>
      </div>
    </div>
  );
};

// Individual parts showcase
const IndividualPartsShowcase: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<PresetOption | null>(
    null
  );

  return (
    <div style={{ display: 'grid', gap: '24px', maxWidth: '600px' }}>
      <h3>Individual Component Parts</h3>

      <div
        style={{
          border: '1px solid #e5e7eb',
          padding: '16px',
          borderRadius: '4px'
        }}
      >
        <h4 style={{ margin: '0 0 8px 0' }}>PresetSelectorRoot</h4>
        <p style={{ fontSize: '14px', color: '#666', margin: '0 0 12px 0' }}>
          The main container with positioning styles. It fills up the wrapper
          div.
        </p>
        <div
          style={{ width: '250px', height: '25px', border: '1px dashed #ccc' }}
        >
          <PresetSelectorRoot>Container</PresetSelectorRoot>
        </div>
      </div>

      <div
        style={{
          border: '1px solid #e5e7eb',
          padding: '16px',
          borderRadius: '4px'
        }}
      >
        <h4 style={{ margin: '0 0 8px 0' }}>PresetSelectorTrigger</h4>
        <p style={{ fontSize: '14px', color: '#666', margin: '0 0 12px 0' }}>
          Displays selected value and dropdown arrow
        </p>
        <div style={{ width: '200px', height: '25px', position: 'relative' }}>
          <PresetSelectorTrigger
            selectedPreset={selectedPreset}
            placeholderText='Choose an option'
          />
        </div>
      </div>

      <div
        style={{
          border: '1px solid #e5e7eb',
          padding: '16px',
          borderRadius: '4px'
        }}
      >
        <h4 style={{ margin: '0 0 8px 0' }}>PresetSelectorSelect</h4>
        <p style={{ fontSize: '14px', color: '#666', margin: '0 0 12px 0' }}>
          The actual select dropdown with options
        </p>
        <div style={{ width: '200px', height: '25px', position: 'relative' }}>
          <PresetSelectorSelect
            selectedPreset={selectedPreset}
            setSelectedPreset={setSelectedPreset}
            presets={statesAndCountriesPresets.slice(0, 3)}
            placeholderText='Select an option'
          />
        </div>
      </div>

      <div
        style={{
          border: '1px solid #e5e7eb',
          padding: '16px',
          borderRadius: '4px'
        }}
      >
        <h4 style={{ margin: '0 0 8px 0' }}>
          PresetSelectorClearButton & LoadingIndicator
        </h4>
        <p style={{ fontSize: '14px', color: '#666', margin: '0 0 12px 0' }}>
          Clear button and loading states.
        </p>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div
            style={{
              width: '200px',
              height: '25px',
              position: 'relative',
              border: '1px dashed #ccc'
            }}
          >
            <PresetSelectorClearButton
              selectedPreset={statesAndCountriesPresets[0]}
              resetPreset={() => setSelectedPreset(null)}
              isLoading={false}
            />
          </div>
          <div
            style={{
              width: '200px',
              height: '25px',
              position: 'relative',
              border: '1px dashed #ccc'
            }}
          >
            <PresetSelectorLoadingIndicator isLoading={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const CustomComposition: StoryObj = {
  render: () => (
    <CustomComposedPresetSelector
      presets={statesAndCountriesPresets}
      placeholderText='Pick a location'
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Example showing how to compose the preset selector using individual parts for maximum customization.'
      }
    }
  }
};

export const IndividualParts: StoryObj = {
  render: () => <IndividualPartsShowcase />,
  parameters: {
    docs: {
      description: {
        story:
          'Showcase of individual component parts that can be used for custom compositions.'
      }
    }
  }
};
