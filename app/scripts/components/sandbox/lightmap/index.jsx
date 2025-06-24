import React from 'react';
import { GridContainer, Grid } from '@trussworks/react-uswds';
import LightMap from '$components/common/blocks/light-map';

export default function LightMapDemo() {
  return (
    <GridContainer>
      <Grid row gap={3}>
        <Grid col={12} className='margin-top-2 margin-bottom-3'>
          <div style={{ width: '800px' }}>
            <LightMap
              stacIDs={['no2-monthly', 'nightlights-hd-monthly']}
              center={[-84.39, 33.75]}
              zoom={9.5}
              dateTime='2019-06-01'
              compareDateTime='2021-02-01'
            />
          </div>
        </Grid>
      </Grid>
    </GridContainer>
  );
}
