import React, { useState } from 'react';

import { Map, Raster } from '@carbonplan/maps';
import { useColormap } from '@carbonplan/colormaps';

const bucket = 'https://storage.googleapis.com/carbonplan-maps/';

const Index = () => {
  const [display, setDisplay] = useState(true);
  const [debug, setDebug] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [clim, setClim] = useState([-20, 30]);
  const [month, setMonth] = useState(1);
  const [band, setBand] = useState('tavg');
  const [colormapName, setColormapName] = useState('warm');
  const colormap = useColormap(colormapName, {});

  return (
    <>
      <div
        style={{
          width: '100%',
          height: '100%'
        }}
      >
        <Map zoom={2} center={[0, 0]} debug={debug} style={{zIndex: '2000'}}>
          <Raster
            colormap={colormap}
            clim={clim}
            display={display}
            opacity={opacity}
            mode='texture'
            source={bucket + 'v2/demo/4d/tavg-prec-month'}
            variable='climate'
            selector={{ month, band }}
          />
        </Map>
      </div>
    </>
  );
};

export default Index;
