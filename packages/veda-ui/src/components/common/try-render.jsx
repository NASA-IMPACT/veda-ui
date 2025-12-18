/* eslint-disable react/prop-types */
import React, { isValidElement } from 'react';

/**
 * Tries to render the given function falling back to the children if it is not
 * set. It is possible to pass a wrapper element that will only be used if there
 * is something to render, preventing empty elements from being rendered.
 *
 * @param {function} fn The render function to try to run
 * @param {element} wrapWith The wrapper element.
 * @param {node} children The fallback if the render function is not set
 * @prop {any} rest Remaining props are passed to the function
 */
export default function Try(props) {
  const { fn: F, wrapWith: W, children, ...rest } = props;

  let value = children;

  // Styled-components fail with isValidElement, so checking directly.
  if (isValidElement(F) || F?.styledComponentId) {
    value = <F {...props} />;
  } else if (typeof F === 'function') {
    value = F(rest);
  }

  if (isValidElement(W) || W?.styledComponentId) {
    return value ? <W>{value}</W> : null;
  }

  return value || null;
}
