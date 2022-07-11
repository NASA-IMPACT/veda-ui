import React from 'react';
import T from 'prop-types';
// This component offers title/description of the chart for screen readers
/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-unused-vars */
const ChartTitle = (customProps) => (nivoProps) => {
  const { title, desc } = customProps;
  return (
    <>
      <title>{title}</title>
      <desc>{desc}</desc>
    </>
  );
};

ChartTitle.props = {
  title: T.string,
  desc: T.string
};

export default ChartTitle;
