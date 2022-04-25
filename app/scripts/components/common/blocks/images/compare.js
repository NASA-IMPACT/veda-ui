import React from 'react';
import styled from 'styled-components';
import ReactCompareImage from 'react-compare-image';
import T from 'prop-types';

import { glsp, themeVal, media } from '@devseed-ui/theme-provider';

export const MediaCompare = styled.figure`
  /* Style for plugin (react compare image) */
  /* handle */
  > div {
    > div:nth-child(3) > div:nth-child(2) {
      background-color: ${themeVal('color.primary')};
      width: 3rem;
      height: 3rem;
    }
    /* label */
    > div:nth-child(4) > div:nth-child(1),
    > div:nth-child(5) > div:nth-child(1) {
      border-radius: ${themeVal('shape.rounded')};
    }
  }

  /* stylelint-disable-next-line */
  > *:not(:last-child) {
    margin-bottom: ${glsp()};
  }
`;

function CompareImage({ leftImage, rightImage }) {
  return (
    <MediaCompare>
      <ReactCompareImage
        leftImage={leftImage.src}
        leftImageAlt={leftImage.alt}
        leftImageLabel={leftImage.label}
        rightImage={rightImage.src}
        rightImageAlt={rightImage.alt}
        rightImageLabel={rightImage.label}
      />
    </MediaCompare>
  );
}

const ImageToCompareShape = {
  src: T.string.isRequired,
  alt: T.string.isRequired,
  label: T.string
};

CompareImage.propTypes = {
  leftImage: T.shape(ImageToCompareShape),
  rightImage: T.shape(ImageToCompareShape)
};

export default CompareImage;
