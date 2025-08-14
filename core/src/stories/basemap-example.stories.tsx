import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StorybookProviders } from '../storybook-providers';
import Map, { MapControls } from '$components/common/map';
import {
  NavigationControl,
  ScaleControl
} from '$components/common/map/controls';

import { Basemap } from '$components/common/map/style-generators/basemap';
import { useBasemap } from '$components/common/map/controls/hooks/use-basemap';
import MapCoordsControl from '$components/common/map/controls/coords';

const BaseMapExample: React.FC = () => {
  const { mapBasemapId, labelsOption, boundariesOption } = useBasemap();
  return (
    <div>
      <div
        style={{
          height: '300px',
          width: '100%',
          position: 'relative'
        }}
      >
        <StorybookProviders>
          <Map id='custom-map'>
            <Basemap
              basemapStyleId={mapBasemapId}
              labelsOption={labelsOption}
              boundariesOption={boundariesOption}
            />
            <MapControls>
              <NavigationControl position='top-right' />
              <ScaleControl />
              <MapCoordsControl />
            </MapControls>
          </Map>
        </StorybookProviders>
      </div>
    </div>
  );
};

const meta: Meta<typeof BaseMapExample> = {
  title: 'Components/CustomAOIControl',
  component: BaseMapExample,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof BaseMapExample>;

export const Default: Story = {
  render: () => <BaseMapExample />
};
