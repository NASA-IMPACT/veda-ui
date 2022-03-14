import React from 'react';
import T from 'prop-types';

import {
  Figure,
  Figcaption,
  FigcaptionInner,
  FigureAttribution
} from '$components/common/figure';

export const Caption = function ({ attr, attrAuthor, attrUrl }) {
  return (
    <Figcaption>
      <FigcaptionInner>{attr}</FigcaptionInner>
      <FigureAttribution author={attrAuthor} url={attrUrl} forwardedAs='span' />
    </Figcaption>
  );
};

const Image = function (props) {
  const { src, alt, align, attr } = props;
  const imageAlign = align ? align : 'center';
  return <img loading='lazy' {...props} className={`align-${imageAlign}`} />;
};
Image.propTypes = {
  src: T.string,
  alt: T.string,
  align: T.string,
  attr: T.string
};

export default Image;
