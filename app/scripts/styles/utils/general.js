import React from 'react';

/**
 * Removes given props from the component returning a new one.
 * This is used to circumvent a bug with styled-component where unwanted props
 * are passed to the dom causing react to display an error:
 *
 * ```
 *   `Warning: React does not recognize the hideText prop on a DOM element.
 *   If you intentionally want it to appear in the DOM as a custom attribute,
 *   spell it as lowercase hideText instead. If you accidentally passed it from
 *   a parent component, remove it from the DOM element.`
 * ```
 *
 * This commonly happens when an element is impersonating another with the
 * `as` or `forwardedAs` prop:
 *
 *     <Button hideText forwardedAs={Link}>Home</Button>
 *
 * Because of a bug, all the props passed to `Button` are passed to `Link`
 * without being filtered before rendering, causing the aforementioned error.
 *
 * This utility creates a component that filter out unwanted props and can be
 * safely used as an impersonator.
 *
 *     const CleanLink = filterComponentProps(Link, ['hideText'])
 *     <Button hideText forwardedAs={CleanLink}>Home</Button>
 *
 * Issue tracking the bug: https://github.com/styled-components/styled-components/issues/2131
 *
 * Note: The props to filter out are manually defined to reduce bundle size,
 * but it would be possible to automatically filter out all invalid props
 * using something like @emotion/is-prop-valid
 *
 * @param {object} Comp The react component
 * @param {array} filterProps Props to filter off of the component
 */
export function filterComponentProps(Comp, filterProps = []) {
  const isValidProp = (p) => !filterProps.includes(p);

  return React.forwardRef((rawProps, ref) => {
    const props = Object.keys(rawProps).reduce(
      (acc, p) => (isValidProp(p) ? { ...acc, [p]: rawProps[p] } : acc),
      {}
    );
    return <Comp ref={ref} {...props} />;
  });
}
