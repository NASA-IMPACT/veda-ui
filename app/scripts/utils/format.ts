/**
 * Rounds a number to a specified amount of decimals.
 *
 * @param {number} value The value to round
 * @param {number} decimals The number of decimals to keep. Default to 2
 */
export function round(value: number, decimals = 2) {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

export function shortenLargeNumber(value: number, decimals = 2) {
  if (value / 1e9 >= 1) {
    return {
      num: round(value / 1e9, decimals),
      unit: 'B'
    };
  } else if (value / 1e6 >= 1) {
    return {
      num: round(value / 1e6, decimals),
      unit: 'M'
    };
  } else if (value / 1e3 >= 1) {
    return {
      num: round(value / 1e3, decimals),
      unit: 'K'
    };
  }
  return {
    num: value,
    unit: ''
  };
}

interface FormatThousandsOptions {
  decimals?: number;
  separator?: string;
  forceDecimals?: boolean;
  shorten?: boolean;
}

/**
 * Adds a separator every 3 digits and rounds the number.
 *
 * @param {number} num The number to format.
 * @param {object} options Options for the formatting.
 * @param {number} options.decimals Amount of decimals to keep. (Default 2)
 * @param {string} options.separator Separator to use. (Default ,)
 * @param {boolean} options.forceDecimals Force the existence of decimal. (Default false)
 *                  Eg: Using 2 decimals and force `true` would result:
 *                  formatThousands(1 /2, { forceDecimals: true }) => 0.50
 * @param {boolean} options.shorten Shorten large numbers. (Default false)
 *                  Shortening is done for millions and billions.
 *                  formatThousands(10000000, { shorten: true }) => 10M
 *
 * @example
 * formatThousands(1)               1
 * formatThousands(1000)            1,000
 * formatThousands(10000000)        10,000,000
 * formatThousands(1/3)             0.33
 * formatThousands(100000/3)        33,333.33
 * formatThousands()                --
 * formatThousands('asdasdas')      --
 * formatThousands(1/2, { decimals: 0 })                        1
 * formatThousands(1/2, { decimals: 0, forceDecimals: true})    1
 * formatThousands(1/2, { decimals: 5 })                        0.5
 * formatThousands(1/2, { decimals: 5, forceDecimals: true})    0.50000
 *
 */
export function formatThousands(num: number, options: FormatThousandsOptions) {
  const opts = {
    decimals: 2,
    separator: ',',
    forceDecimals: false,
    shorten: false,
    ...options
  };

  // isNaN(null) === true
  if (isNaN(num) || (!num && num !== 0)) {
    return '--';
  }

  const repeat = (char, length) => {
    let str = '';
    for (let i = 0; i < length; i++) str += char + '';
    return str;
  };

  let [int, dec] = Number(round(num, opts.decimals)).toString().split('.');

  let largeNumUnit = '';
  if (opts.shorten) {
    const { num, unit } = shortenLargeNumber(Number(int), 0);
    int = num.toString();
    largeNumUnit = unit;
  }

  // Space the integer part of the number.
  int = int.replace(/\B(?=(\d{3})+(?!\d))/g, opts.separator);
  // Round the decimals.
  dec = (dec || '').substring(0, opts.decimals);
  // Add decimals if forced.
  dec = opts.forceDecimals
    ? `${dec}${repeat(0, opts.decimals - dec.length)}`
    : dec;

  return dec !== ''
    ? `${int}.${dec} ${largeNumUnit}`
    : `${int} ${largeNumUnit}`;
}

/**
 * Adds leading 0 until reaching length.
 *
 * @param {int} num The number to pad.
 * @param {int} length The desired length. Default to 2
 *
 * @returns string
 */
export const zeroPad = (num: number, length = 2) => {
  const prefix = num < 0 ? '-' : '';

  const abdsNum = Math.abs(num);
  const wholeNum = Math.floor(abdsNum);
  const padLength = Math.max(length - String(wholeNum).length, 0);

  const pads = new Array(padLength + 1).join('0');
  return prefix + pads + abdsNum;
};

export const formatAsScientificNotation = (num: number, decimals = 2) => {
  const [coefficient, exponent] = num
    .toExponential()
    .split('e')
    .map((item) => Number(item));

  const sups = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const exponentSup = exponent
    .toString()
    .split('')
    .map((v) => sups[v])
    .join('');

  return `${round(coefficient, decimals)}x10${exponentSup}`;
};
