import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
  DotGroup
} from 'pure-react-carousel';
// required CSS for pure-react-carousel
import 'pure-react-carousel/dist/react-carousel.es.css';

import {
  CollecticonChevronLeft,
  CollecticonChevronRight
} from '@devseed-ui/collecticons';
import { createButtonStyles } from '@devseed-ui/button';
import {
  glsp,
  listReset,
  media,
  themeVal,
  visuallyHidden
} from '@devseed-ui/theme-provider';
import { variableGlsp } from '$styles/variable-utils';

import { Card } from '$components/common/card';

const FeaturedList = styled.div`
  ${listReset()}

  .carousel__slider {
    border-radius: ${themeVal('shape.rounded')};
  }
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

const ButtonGroup = styled.div`
  position: absolute;
  display: flex;
  gap: ${variableGlsp(1)};
  top: ${variableGlsp(1)};
  left: ${variableGlsp(1)};

  ${media.largeUp`
    top: unset;
    left: unset;
    bottom: ${variableGlsp(1)};
    right: ${variableGlsp(1)};
  `};
`;

const buttonStyle = createButtonStyles({
  variation: 'achromic-text',
  fitting: 'skinny'
});

const ButtonBackStyled = styled(ButtonBack)`
  ${buttonStyle}
`;

const ButtonNextStyled = styled(ButtonNext)`
  ${buttonStyle}
`;

const DotGroupPositioned = styled(DotGroup)`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: ${glsp(0.5)};

  /* overriding pure react carousel style */
  .carousel__dot {
    width: 0.625rem;
    height: 0.625rem;
    padding: 0;
    border-radius: ${themeVal('shape.ellipsoid')};
    background-color: ${themeVal('color.base-100a')};
    border: 1px solid white;

    span {
      ${visuallyHidden()}
    }
  }

  .carousel__dot--selected {
    cursor: auto;
    background-color: white;
  }

  ${media.largeUp`
    bottom: ${variableGlsp(0.25)};
  `}
`;

function Carousel({ items }) {
  return (
    <CarouselProvider
      isIntrinsicHeight={true}
      totalSlides={items.length}
      style={{ gridColumn: '1 / -1', gridRow: '2', position: 'relative' }}
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
        {items.length > 1 && <DotGroupPositioned />}
      </FeaturedList>

      {items.length > 1 && (
        <ButtonGroup>
          <ButtonBackStyled>
            <CollecticonChevronLeft title='Go to previous slide' meaningful />
          </ButtonBackStyled>
          <ButtonNextStyled>
            <CollecticonChevronRight title='Go to next slide' meaningful />
          </ButtonNextStyled>
        </ButtonGroup>
      )}
    </CarouselProvider>
  );
}

Carousel.propTypes = {
  items: T.array
};

export default Carousel;
