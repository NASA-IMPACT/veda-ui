import React from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
  DotGroup,
  Dot
} from 'pure-react-carousel';
// required CSS for pure-react-carousel
import 'pure-react-carousel/dist/react-carousel.es.css';

import {
  CollecticonChevronLeft,
  CollecticonChevronRight
} from '@devseed-ui/collecticons';
import { listReset, media, themeVal } from '@devseed-ui/theme-provider';
import { variableGlsp } from '$styles/variable-utils';

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

const ButtonGroup = styled.div`
  position: absolute;
  bottom: ${variableGlsp(1)};
  right: ${variableGlsp(1)};
  ${media.mediumDown`
    top: ${variableGlsp(1)};
    left: ${variableGlsp(1)};
  `};
`;

const ButtonStyle = css`
  width: 35px;
  height: 35px;
  border: none;
  background-color: ${themeVal('color.base-400a')};
  border-radius: ${themeVal('shape.rounded')};
  &:disabled {
    cursor: auto;
    filter: opacity(0.1);
  }
`;

const ButtonBackPositioned = styled(ButtonBack)`
  ${ButtonStyle}
  margin-right: ${variableGlsp(0.25)};
  ${media.mediumDown`
  
  `}
`;
const ButtonNextPositioned = styled(ButtonNext)`
  ${ButtonStyle}
  right: 0;

  ${media.mediumDown`
    left: 50px;
  `}
`;

const DotGroupPositioned = styled(DotGroup)`
  position: absolute;
  bottom: ${variableGlsp(0.25)};
  left: 50%;
  transform: translate(-50%, -50%);
  /* overriding pure react carousel style */
  .carousel__dot {
    width: 12px;
    height: 8px;
    margin-right: ${variableGlsp(0.25)};
    border-radius: ${themeVal('shape.ellipsoid')};
    background-color: white;
    border: 0;
  }
  .carousel__dot--selected {
    cursor: auto;
    filter: opacity(0.1);
  }
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
          <ButtonBackPositioned>
            <CollecticonChevronLeft color='white' />
          </ButtonBackPositioned>
          <ButtonNextPositioned>
            <CollecticonChevronRight color='white' />
          </ButtonNextPositioned>
        </ButtonGroup>
      )}
    </CarouselProvider>
  );
}

Carousel.propTypes = {
  items: T.array
};

export default Carousel;
