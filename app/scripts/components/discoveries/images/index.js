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
      {attr && <FigcaptionInner>{attr}</FigcaptionInner>}
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

Caption.propTypes = {
  attr: T.string,
  attrAuthor: T.string,
  attrUrl: T.string
};

const Image = function (props) {
  const { align, attr, attrAuthor } = props;
  const imageAlign = align ? align : 'center';
  return attr || attrAuthor ? (
    // if it is an inline image with a caption
    <Figure className={`align-${imageAlign}`}>
      <img loading='lazy' {...props} />
      <Caption attr={attr} attrAuthor={attrAuthor} attrUrl={props.attrUrl} />
    </Figure>
  ) : (
    <img loading='lazy' {...props} />
  );
};
Image.propTypes = {
  src: T.string,
  alt: T.string,
  align: T.string,
  attr: T.string,
  attrAuthor: T.string,
  attrUrl: T.string
};

export default Image;
