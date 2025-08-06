import React from 'react';
import Map, { MapControls } from '$components/common/map';
import { Basemap } from '$components/common/map/style-generators/basemap';

import {
  NavigationControl,
  ScaleControl
} from '$components/common/map/controls';
import MapCoordsControl from '$components/common/map/controls/coords';
import { useBasemap } from '$components/common/map/controls/hooks/use-basemap';
import { VedaUIProvider } from '$context/veda-ui-provider';

const SandboxCustomMap: React.FC = () => {
  const { mapBasemapId, labelsOption, boundariesOption } = useBasemap();
  return (
    <div>
      <h2>Exploration Map</h2>
      <p>This is the Exploration Map component.</p>
      <div
        style={{
          height: '300px',
          width: '100%',
          position: 'relative'
        }}
      >
        <VedaUIProvider
          config={{
            envMapboxToken: process.env.MAPBOX_TOKEN ?? '',
            envApiStacEndpoint: process.env.API_STAC_ENDPOINT ?? '',
            envApiRasterEndpoint: process.env.API_RASTER_ENDPOINT ?? '',
            envApiCMREndpoint: process.env.API_CMR_ENDPOINT ?? ''
          }}
        >
          <Map id='sandbox-map'>
            <Basemap
              basemapStyleId={mapBasemapId}
              labelsOption={labelsOption}
              boundariesOption={boundariesOption}
            />
            <MapControls>
              <ScaleControl />
              <MapCoordsControl />
              <NavigationControl />
              {/* Add any map controls you want here */}
            </MapControls>
          </Map>
        </VedaUIProvider>
      </div>
    </div>
  );
};

export default SandboxCustomMap;
