import React from 'react';

interface AltTitleProps {
  title: string;
  desc: string;
}

export default function AltTitle(props: AltTitleProps) {
  const { title, desc } = props;

  return (
    <>
      <title>{title}</title>
      <desc>{desc}</desc>
    </>
  );
}
