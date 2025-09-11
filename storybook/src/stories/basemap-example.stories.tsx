import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Map, { MapControls } from '$components/common/map';
import {
  NavigationControl,
  ScaleControl
} from '$components/common/map/controls';

import { Basemap } from '$components/common/map/style-generators/basemap';
import { useBasemap } from '$components/common/map/controls/hooks/use-basemap';
import MapCoordsControl from '$components/common/map/controls/coords';
import AoiControl from '$components/common/map/controls/aoi/aoi-control';
import useAois from '$components/common/map/controls/hooks/use-aois';
import AoiLayer from '$components/exploration/components/map/aoi-layer';

const BaseMapExample: React.FC = () => {
  const { mapBasemapId, labelsOption, boundariesOption } = useBasemap();
  const { aoi } = useAois();
  return (
    <div style={{ height: '100vh' }}>
      <Map id='custom-map'>
        <Basemap
          basemapStyleId={mapBasemapId}
          labelsOption={labelsOption}
          boundariesOption={boundariesOption}
        />
        <MapControls>
          <AoiControl />
          {aoi && <AoiLayer aoi={aoi} />}
          <NavigationControl position='top-right' />
          <ScaleControl />
          <MapCoordsControl />
        </MapControls>
      </Map>
    </div>
  );
};

const meta: Meta<typeof BaseMapExample> = {
  title: 'Components/BaseMapExample',
  component: BaseMapExample,
  parameters: {
    layout: 'fullscreen',
    withProviders: true
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof BaseMapExample>;

export const Default: Story = {
  render: () => <BaseMapExample />
};
