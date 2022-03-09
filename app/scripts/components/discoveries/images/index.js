import React from 'react';
import T from 'prop-types';

import {
  Figure,
  Figcaption,
  FigcaptionInner,
  FigureAttribution
} from '$components/common/figure';

const Image = function (props) {
  const { src, alt, align, attr } = props;
  const imageAlign = align ? align : 'center';
  return (
    <Figure className={`align-${imageAlign}`}>
      <img loading='lazy' {...props} />
      {attr && (
        <Figcaption>
          <FigcaptionInner>{alt}</FigcaptionInner>
          <FigureAttribution author={attr} url={src} forwardedAs='span' />
        </Figcaption>
      )}
    </Figure>
  );
};
Image.propTypes = {
  src: T.string,
  alt: T.string,
  align: T.string,
  attr: T.string
};

export default Image;
