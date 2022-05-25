import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext
} from 'pure-react-carousel';
// required CSS for pure-react-carousel
import 'pure-react-carousel/dist/react-carousel.es.css';

import {
  CollecticonChevronLeft,
  CollecticonChevronRight
} from '@devseed-ui/collecticons';
import { listReset, media } from '@devseed-ui/theme-provider';

import { Card } from '$components/common/card';

const FeaturedList = styled.div`
  ${listReset()}
`;

const FeaturedContent = styled.div`
  width: 100%;

  article {
    min-height: 16rem;

    ${media.smallUp`
    min-height: 20rem;
  `}

    ${media.mediumUp`
    min-height: 20rem;
  `}

  ${media.largeUp`
    min-height: 24rem;
  `}

  ${media.xlargeUp`
    min-height: 28rem;
  `}
  }

  // overriding pure-react-carousel styles
  > div {
    width: 100% !important;
  }
`;

function Carousel({ items }) {
  return (
    <CarouselProvider
      isIntrinsicHeight={true}
      totalSlides={items.length}
      style={{ gridColumn: '1 / -1', gridRow: '2' }}
    >
      <FeaturedList>
        <Slider>
          {items.map((t, idx) => (
            <FeaturedContent key={t.id}>
              <Slide index={idx}>
                <Card
                  cardType='featured'
                  linkLabel='View more'
                  linkTo={t.linkTo}
                  title={t.name}
                  parentName='Dataset'
                  parentTo={t.parentTo}
                  description={t.description}
                  imgSrc={t.media.src}
                  imgAlt={t.media.alt}
                />
              </Slide>
            </FeaturedContent>
          ))}
        </Slider>
      </FeaturedList>

      {items.length > 1 && (
        <>
          <ButtonBack>
            <CollecticonChevronLeft />
          </ButtonBack>
          <ButtonNext>
            <CollecticonChevronRight />
          </ButtonNext>
        </>
      )}
    </CarouselProvider>
  );
}

Carousel.propTypes = {
  items: T.array
};

export default Carousel;
