import React from 'react';
import T from 'prop-types';

function AltTitle({ title, desc }) {
  return (
    <>
      <title>{title}</title>
      <desc>{desc}</desc>
    </>
  );
}

AltTitle.props = {
  title: T.string,
  desc: T.string
};

export default AltTitle;
