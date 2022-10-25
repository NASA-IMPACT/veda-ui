// Inspired by https://github.com/tsmith123/react-pluralize
// Adapted to remove wrapper.

interface PluralizeOpts {
  singular: string;
  plural?: string;
  zero?: string;
  count: number;
  showCount?: boolean;
}

export const pluralize = ({
  singular,
  plural,
  count,
  showCount,
  zero
}: PluralizeOpts) => {
  if (count === 0 && zero) return zero;

  let output = singular;
  if (count !== 1) {
    output = plural || `${singular}s`;
  }

  return showCount ? `${count} ${output}` : output;
};

const Pluralize = (props: PluralizeOpts) => pluralize(props);

Pluralize.defaultProps = {
  count: 1,
  showCount: true,
  zero: null
};

export default Pluralize;
