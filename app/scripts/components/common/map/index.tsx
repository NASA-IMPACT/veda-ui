import React from 'react';
import styled from 'styled-components';
import Map from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxStyleOverride from './mapbox-style-override';

const MapContainer = styled.div`
  && {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
  ${MapboxStyleOverride}
`;

export default function MapWrapper() {
  return (
    <MapContainer>
      <Map
        mapboxAccessToken={process.env.MAPBOX_TOKEN}
        initialViewState={{
          longitude: 0,
          latitude: 0,
          zoom: 1
        }}
        mapStyle='mapbox://styles/mapbox/streets-v9'
      />
    </MapContainer>
  );
}
