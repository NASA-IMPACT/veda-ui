import React from 'react';
import { getString } from 'veda';

import { Fold } from '$components/common/fold';
import { Card } from '$components/common/card';
import { USWDSButton, USWDSCardGroup } from '$uswds';
import FlagLayoutCard from '$components/common/card/flag-layout-card';
import { CardListGrid } from '$components/common/card/styles';

function SandboxCards() {
  return (
    <>
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
      <FlagLayoutCard
        imgSrc='https://picsum.photos/id/1002/2048/1024'
        imgAlt='Generic placeholder by lorem picsum'
        heading='FlagLayoutCard - flagDefault layout'
        description='This is a test of the flagDefaultCard passing in only strings to heading & description'
        footer={<USWDSButton type='button'>test button</USWDSButton>}
      />
      <USWDSCardGroup>
        <FlagLayoutCard
          layout='flagMediaRight'
          imgSrc='https://picsum.photos/id/1002/2048/1024'
          imgAlt='Generic placeholder by lorem picsum'
          heading={
            <h2 className='font-heading-md text-primary-vivid'>
              FlagLayoutCard - flagMediaRight layout
            </h2>
          }
          description={
            <p className='font-body-sm text-base'>
              This is a test of the flagMediaRight passing in JSX.Elements to
              heading & description with different USWDS utility classes
            </p>
          }
          footer={<USWDSButton type='button'>test button</USWDSButton>}
        />
      </USWDSCardGroup>
    </>
  );
}

export default SandboxCards;
