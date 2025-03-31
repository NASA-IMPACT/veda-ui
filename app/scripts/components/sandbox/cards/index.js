import React from 'react';

import { USWDSCardGroup } from '$uswds';
import TopicCard from '$components/common/card/uswds-cards/topic-card';
import FlagCard from '$components/common/card/uswds-cards/flag-card';
import DefaultCard from '$components/common/card/uswds-cards/default-card';
import { USWDSButton } from '$uswds';

const TOPIC_CARD_IMG_SRC =
  'https://s3-alpha-sig.figma.com/img/aeaa/571c/116155253eb40c008e73e203d0b80282?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=GlnKvYuRoJ~-3MbFdUKvNzA~WRReAvPqIeEI9EkXYgf-ompNKv4ILSl1nvnJNnyirEu1jxtKDZ1y6JERI9RIa8c3cxmYy1DNJnFoF6WOAsU~hXHLH5ja3r-J-R6HyKs6rPystqVfH5esOtxRUi3tCZXdSLWdjSpiHRyWwNcQ9P6Ga3LURQSeyPDG~sP6ma8Nbd32I8Eq67Ip6vaM6etesfLGgQ6tZv2ZkA3srd6qa~OrZ-atJmGgf7-6JLoFkrv058uc1s2oiFnUDQZ5fYc1IthWyYLr3FmYbDWyW-YowewKJkiSaJseCpOonrDzDFqwnuL-ZrpPNQI4kanL8FSwaQ__';

function SandboxUswdsCards() {
  return (
    <div className='margin-2'>
      <div className='usa-card-group grid-row grid-gap'>
        <div className='tablet:grid-col-6 desktop:grid-col-4 mobile-lg:grid-col-12'>
          <TopicCard
            imgSrc={TOPIC_CARD_IMG_SRC}
            imgAlt='Foggy mountain landscape'
            fullBg={true}
            footerTitle='Sea Level Rise'
            cardLabel='topic'
          />
        </div>

        <div className='tablet:grid-col-6 desktop:grid-col-4 mobile-lg:grid-col-12'>
          <TopicCard
            imgSrc={TOPIC_CARD_IMG_SRC}
            imgAlt='Foggy mountain landscape'
            fullBg={false}
            footerTitle='Explore Topic'
            description='Sea Level Rise'
            cardLabel='topic'
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
          cardLabel='data_collection'
        />
      </USWDSCardGroup>
      <USWDSCardGroup>
        <DefaultCard
          imgSrc='https://picsum.photos/id/1002/2048/1024'
          imgAlt='Generic placeholder by lorem picsum'
          heading='DefautCard - out of the box'
          description='This is a test of the DefaultCard passing in only strings to heading & description.'
          footer={<USWDSButton type='button'>test button</USWDSButton>}
          cardLabel='data_collection'
        />
      </USWDSCardGroup>
    </div>
  );
}

export default SandboxUswdsCards;
