import React from 'react';
import { useTheme } from 'styled-components';
import { GridContainer, Grid } from '@trussworks/react-uswds';

import { HugResetter } from './index';

export const USWDSColors = () => {
  // Get all theme color tokens
  const theme = useTheme();
  // TODO: use uswds theme tokens to display color swatches

  return (
    <HugResetter>
      <GridContainer>
        <Grid row>
          <Grid col={12} className='margin-top-2 margin-bottom-3'>
            <h2>Browse USWDS Colors</h2>
          </Grid>
        </Grid>
        <Grid row gap={3}>
          {Object.keys(theme.color ?? {})
            .filter((key) => !!theme.color?.[key])
            .map((key) => (
              <Grid col={2} key={key} className='margin-bottom-3'>
                <div className='width-8 height-8 margin-bottom-2 border border-width-1px border-dashed border-base-light radius-md'>
                  <div className={`height-full width-full bg-${key}`} />
                </div>
                <strong>color.{key}</strong>
                <p>{theme.color?.[key] ?? 'n.a.'}</p>
              </Grid>
            ))}
        </Grid>
      </GridContainer>
    </HugResetter>
  );
};
