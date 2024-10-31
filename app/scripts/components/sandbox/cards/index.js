import React from 'react';
import { getString } from 'veda';

import { Fold } from '$components/common/fold';
import { Card } from '$components/common/card';
import { CardListGrid } from '$components/common/card/styles';

function SandboxCards() {
  return (
    <Fold>
      <CardListGrid>
        <li>
          <Card
            linkLabel='View more'
            linkTo='/'
            title='Cities Experiencing Clearer Air During Lockdowns'
            description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce varius erat in vulputate.'
            date={new Date('2021-10-26')}
            tagLabels={[getString('stories').one]}
            parentTo='/sandbox'
            imgSrc='https://picsum.photos/id/1002/2048/1024'
            imgAlt='Generic placeholder by lorem picsum'
          />
        </li>

        <li>
          <Card
            cardType='cover'
            linkLabel='View more'
            linkTo='/'
            title='Nitrogen Dioxide (NO₂)'
            description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce varius erat in vulputate.'
            tagLabels={['Dataset']}
            parentTo='/sandbox'
            imgSrc='https://picsum.photos/id/1002/2048/1024'
            imgAlt='Generic placeholder by lorem picsum'
          />
        </li>
      </CardListGrid>
    </Fold>
  );
}

export default SandboxCards;
