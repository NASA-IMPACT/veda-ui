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
      {attrAuthor && attrUrl && (
        <FigureAttribution
          author={attrAuthor}
          url={attrUrl}
          forwardedAs='span'
        />
      )}
    </Figcaption>
  );
};

const Image = function (props) {
  const { align, attr } = props;
  const imageAlign = align ? align : 'center';
  return attr ? (
    <Figure className={`align-${imageAlign}`}>
      <img loading='lazy' {...props} />
      <Caption
        attr={attr}
        attrAuthor={props.attrAuthor}
        attrUrl={props.attrUrl}
      />
    </Figure>
  ) : (
    <img loading='lazy' {...props} />
  );
};
Image.propTypes = {
  src: T.string,
  alt: T.string,
  align: T.string,
  attr: T.string
};

export default Image;
