import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { glsp, media } from '@devseed-ui/theme-provider';
import { variableGlsp } from '$styles/variable-utils';

const ImageContainer = styled.div`
  ${media.mediumDown`
    margin: 0 0;
  `}
  margin: ${glsp(0, -8.0)};
`;

const SideBySide = styled(ImageContainer)`
  ${media.mediumDown`
    grid-template-columns: repeat(1, 1fr);
  `}
  display: grid;
  grid-column: 1/-1;
  grid-template-columns: repeat(2, 1fr);
  gap: ${variableGlsp()};
`;

const Gallery = styled(ImageContainer)`
  display: grid;
  grid-column: 1/-1;
  grid-template-columns: repeat(1, 1fr);
  gap: ${variableGlsp()};
`;

const GallerySideBySide = styled.div`
  ${media.mediumDown`
    grid-template-columns: repeat(1, 1fr);
  `}
  display: grid;
  grid-column: 1/-1;
  grid-template-columns: repeat(3, 1fr);
  gap: ${variableGlsp()};
  > img:first-child {
    grid-column: 1 / span 1;
    align-self: end;
  }
  > img:last-child {
    ${media.mediumDown`
    grid-column: 1 / span 1;
  `}
    grid-column: 2 / span 2;
  }
`;

function ImageGallery({ images }) {
  return (
    <Gallery>
      <GallerySideBySide>
        <img src={images[0].src} alt={images[0].alt} loading='lazy' />
        <img src={images[1].src} alt={images[1].alt} loading='lazy' />
      </GallerySideBySide>
      <img src={images[2].src} alt={images[2].alt} loading='lazy' />
    </Gallery>
  );
}

function ImageSideBySide({ images }) {
  return (
    <SideBySide>
      <img src={images[0].src} alt={images[0].alt} loading='lazy' />
      <img src={images[1].src} alt={images[1].alt} loading='lazy' />
    </SideBySide>
  );
}

function Image({ images }) {
  switch (images.length) {
    case 1:
      return (
        <ImageContainer>
          <img src={images[0].src} alt={images[0].alt} loading='lazy' />
        </ImageContainer>
      );
    case 2:
      return <ImageSideBySide images={images} />;
    case 3:
      return <ImageGallery images={images} />;
  }
}

Image.prototype = {
  images: T.array
};

export default Image;
