import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import styled from 'styled-components';

mapboxgl.accessToken =
  'pk.eyJ1Ijoicm1pLWNpcCIsImEiOiJja3ZzeDB6cWkwM2cyMm5rdGhyZW5rcXltIn0.ZnYuexDuTZGcN-btmoeCTQ';

const MapContainer = styled.div`
  width: 800px;
  height: 400px;
`;
function MbMap() {
  const mapContainer = useRef(null);
  const [isLoaded, setLoaded] = useState(false);

  const mapRef = useRef(null);
  const setMap = (map) => {
    mapRef.current = map;
  };
  // Initialize map + add necessary events and layers to map
  useEffect(() => {
    const mbMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      logoPosition: 'bottom-left',
      scrollZoom: false,
      pitchWithRotate: false,
      dragRotate: false
    });

    setMap(mbMap);

    // Add zoom controls.
    mbMap.addControl(new mapboxgl.NavigationControl(), 'top-left');
    // Remove compass.
    document.querySelector('.mapboxgl-ctrl .mapboxgl-ctrl-compass').remove();
    mbMap.on('style.load', function () {
      setLoaded(true);
    });

    async function fetchData() {
      const map = mapRef.current;

      map.on('load', () => {});

      map.fitBounds(bounds);
    }

    fetchData();
    return () => {
      mbMap.remove();
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    const map = mapRef.current;
  }, [isLoaded]);

  return (
    <React.Fragment>
      <MapContainer ref={mapContainer} />
    </React.Fragment>
  );
}

MbMap.propTypes = {};

export default MbMap;
