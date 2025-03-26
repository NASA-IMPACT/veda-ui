import React from 'react';

import { USWDSCardGroup } from '$uswds';
import TopicCard from '$components/common/card/uswds-cards/topic-card';
import FlagCard from '$components/common/card/uswds-cards/flag-card';
import DefaultCard from '$components/common/card/uswds-cards/default-card';
import { USWDSButton } from '$uswds';

function SandboxUswdsCards() {
  return (
    <div className='margin-2'>
      <div className='usa-card-group grid-row grid-gap'>
        <div className='tablet:grid-col-6 desktop:grid-col-4 mobile-lg:grid-col-12'>
          <TopicCard
            mediaUrl='https://s3-alpha-sig.figma.com/img/aeaa/571c/116155253eb40c008e73e203d0b80282?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=GlnKvYuRoJ~-3MbFdUKvNzA~WRReAvPqIeEI9EkXYgf-ompNKv4ILSl1nvnJNnyirEu1jxtKDZ1y6JERI9RIa8c3cxmYy1DNJnFoF6WOAsU~hXHLH5ja3r-J-R6HyKs6rPystqVfH5esOtxRUi3tCZXdSLWdjSpiHRyWwNcQ9P6Ga3LURQSeyPDG~sP6ma8Nbd32I8Eq67Ip6vaM6etesfLGgQ6tZv2ZkA3srd6qa~OrZ-atJmGgf7-6JLoFkrv058uc1s2oiFnUDQZ5fYc1IthWyYLr3FmYbDWyW-YowewKJkiSaJseCpOonrDzDFqwnuL-ZrpPNQI4kanL8FSwaQ__'
            mediaAlt='Foggy mountain landscape'
            fullBg={true}
            actionLabel='Sea Level Rise'
          />
        </div>

        <div className='tablet:grid-col-6 desktop:grid-col-4 mobile-lg:grid-col-12'>
          <TopicCard
            mediaUrl='https://s3-alpha-sig.figma.com/img/aeaa/571c/116155253eb40c008e73e203d0b80282?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=GlnKvYuRoJ~-3MbFdUKvNzA~WRReAvPqIeEI9EkXYgf-ompNKv4ILSl1nvnJNnyirEu1jxtKDZ1y6JERI9RIa8c3cxmYy1DNJnFoF6WOAsU~hXHLH5ja3r-J-R6HyKs6rPystqVfH5esOtxRUi3tCZXdSLWdjSpiHRyWwNcQ9P6Ga3LURQSeyPDG~sP6ma8Nbd32I8Eq67Ip6vaM6etesfLGgQ6tZv2ZkA3srd6qa~OrZ-atJmGgf7-6JLoFkrv058uc1s2oiFnUDQZ5fYc1IthWyYLr3FmYbDWyW-YowewKJkiSaJseCpOonrDzDFqwnuL-ZrpPNQI4kanL8FSwaQ__'
            mediaAlt='Foggy mountain landscape'
            fullBg={false}
            actionLabel='Explore Topic'
            description='Sea Level Rise'
          />
        </div>
      </div>

      <USWDSCardGroup>
        <FlagCard
          imgSrc='https://picsum.photos/id/1002/2048/1024'
          imgAlt='Generic placeholder by lorem picsum'
          heading='FlagCard - flagDefault layout'
          description='This is a test of the flagDefaultCard passing in only strings to heading & description'
          footer={<USWDSButton type='button'>test button</USWDSButton>}
        />
        <FlagCard
          layout='flagMediaRight'
          imgSrc='https://picsum.photos/id/1002/2048/1024'
          imgAlt='Generic placeholder by lorem picsum'
          heading={
            <h2 className='font-heading-md text-primary-vivid'>
              FlagCard - flagMediaRight layout
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
      <USWDSCardGroup>
        <DefaultCard
          imgSrc='https://picsum.photos/id/1002/2048/1024'
          imgAlt='Generic placeholder by lorem picsum'
          heading='DefautCard - out of the box'
          description='This is a test of the DefaultCard passing in only strings to heading & description.'
          footer={<USWDSButton type='button'>test button</USWDSButton>}
        />
        <DefaultCard
          gridLayout={{ desktop: { col: 5 } }}
          imgSrc='https://picsum.photos/id/1002/2048/1024'
          imgAlt='Generic placeholder by lorem picsum'
          heading={
            <h2 className='font-heading-md text-primary-vivid'>
              DefautCard - passing in Elements as Props
            </h2>
          }
          description={
            <p className='font-body-sm text-base'>
              This is a test of the DefaultCard passing in JSX.Elements to
              heading & description with different USWDS utility classes and
              passing in custom gridLayout.
            </p>
          }
          footer={<USWDSButton type='button'>test button</USWDSButton>}
        />
      </USWDSCardGroup>
    </div>
  );
}

export default SandboxUswdsCards;
