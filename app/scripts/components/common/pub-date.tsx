import React from 'react';
import format from 'date-fns/format';

function PublishedDate(props: { date: Date }) {
  const { date } = props;

  return (
    <>
      <span>published on</span>{' '}
      <time dateTime={format(date, 'yyyy-MM-dd')}>
        {format(date, 'MMM d, yyyy')}
      </time>
    </>
  );
}

export default PublishedDate;
