// Inspired by https://github.com/tsmith123/react-pluralize
// Adapted to remove wrapper.

import T from 'prop-types';

export const pluralize = ({ singular, plural, count, showCount, zero }) => {
  if (count === 0 && zero) return zero;

  let output = singular;
  if (count !== 1) {
    output = plural || `${singular}s`;
  }

  return showCount ? `${count} ${output}` : output;
};

const Pluralize = (props) => pluralize(props);

Pluralize.propTypes = {
  singular: T.string.isRequired,
  plural: T.string,
  count: T.number,
  showCount: T.bool,
  className: T.string,
  style: T.object,
  zero: T.string
};

Pluralize.defaultProps = {
  count: 1,
  showCount: true,
  zero: null
};

export default Pluralize;
