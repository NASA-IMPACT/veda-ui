import React from 'react';
import { GridContainer, Grid } from '@trussworks/react-uswds';

import { Figure } from '$components/common/figure';
import { Caption } from '$components/common/blocks/images';
import { LazyMap as Map } from '$components/common/blocks/lazy-components';
import {
  FullscreenWidget,
  FullpageModalWidget
} from '$components/common/widget';

export default function WidgetSandbox() {
  return (
    <GridContainer>
      <Grid row gap={3}>
        <Grid col={12} className='margin-top-2 margin-bottom-3'>
          <h2>Explore widget possibilities</h2>
        </Grid>
        <Grid col={6} className='margin-bottom-3'>
          <FullscreenWidget heading='Fullscreen API'>
            <p>
              This is using the fullscreen API, displaying the content in full
              screen size.
            </p>
            <img
              src='https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXZrcmlkeGVreDFlbGRpNm9leTMxOTh1ZTFocHhtdmxhODZvaWt1biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPnAiaMCws8nOsE/giphy.gif'
              width='457'
              height='480'
            />
            <p>
              <a href='https://giphy.com/gifs/cat-kitten-computer-3oKIPnAiaMCws8nOsE'>
                via GIPHY
              </a>
            </p>
          </FullscreenWidget>
        </Grid>
        <Grid col={6} className='margin-bottom-3'>
          <FullpageModalWidget heading='Fullpage Modal'>
            <p>
              This is using the a modal approach with a micro animation. The
              extend spans the whole page, but does not cover the browser tools.
            </p>
            <img
              src='https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXc3azJsZmxoaTE1cXR4dDlvem5taHFlMXJwOWcwZDJrMnoza2YzMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/q5Wtr34IBE1KOYHkyN/giphy.gif'
              width='480'
              height='360'
            />
            <p>
              <a href='https://giphy.com/gifs/epic-bots-epicbots-q5Wtr34IBE1KOYHkyN'>
                via GIPHY
              </a>
            </p>
          </FullpageModalWidget>
        </Grid>
        <Grid col={4} className='margin-bottom-3'>
          <FullpageModalWidget heading='Small Widget'>
            <p>
              This is using the a modal approach with a micro animation. The
              extend spans the whole page, but does not cover the browser tools.
            </p>
            <img
              src='https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWJqMzdnMTUxZG5mc3R2aWlka3ZtaTZvaXdvZjRkOGx1MjB1NGU2bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lzz3B3xLZluuY/giphy.gif'
              width='480'
              height='350'
            />
            <p>
              <a href='https://giphy.com/gifs/cat-hacker-lzz3B3xLZluuY'>
                via GIPHY
              </a>
            </p>
          </FullpageModalWidget>
        </Grid>

        <Grid col={8} className='margin-bottom-3'>
          <FullpageModalWidget heading='Widget with Map'>
            <Figure>
              <Map
                datasetId='no2'
                layerId='no2-monthly'
                center={[-84.39, 33.75]}
                zoom={9.5}
                dateTime='2019-06-01'
                compareDateTime='2020-06-01'
              />
              <Caption attrAuthor='NASA' attrUrl='https://nasa.gov/'>
                Levels in 10¹⁵ molecules cm⁻². Darker colors indicate higher
                nitrogen dioxide (NO₂) levels associated and more activity.
                Lighter colors indicate lower levels of NO₂ and less activity.
              </Caption>
            </Figure>
          </FullpageModalWidget>
        </Grid>
      </Grid>
    </GridContainer>
  );
}
