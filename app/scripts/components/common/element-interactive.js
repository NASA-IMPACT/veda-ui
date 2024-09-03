import React, { useCallback, useState } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import SmartLink from './smart-link';

export const Wrapper = styled.div`
  position: relative;
  z-index: 1;

  > *:not(a) {
    pointer-events: none;
  }
`;

const InteractiveLink = styled(SmartLink)`
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: auto;
  font-size: 0;
  margin: 0;
`;

/**
 * The ElementInteractive allows you to create a link with actions "inside" it.
 *
 * The most common use case is to have a card, or a list of items where the
 * whole item is clickable but there are actions (like buttons) inside it. Since
 * it is not allowed to have links within links, the ElementInteractive renders
 * an invisible link that takes up the whole element. In this way it is possible
 * to style the element in response to interactive events.
 *
 * The ElementInteractive requires a styled component to be passed through the
 * `as` property. This element must have the style specified in the example
 * below, and can implement the following props for styling:
 *
 * @example
 * const WrapperElement = styled.article`
 *   position: relative;
 *
 *   > *:not(a) {
 *     pointer-events: none;
 *   }
 *
 *   ${({ isStateFocus }) => isStateFocus && css``}
 *   ${({ isStateOver }) => isStateOver && css``}
 *   ${({ isStateActive }) => isStateActive && css``}
 * `;
 *
 *  ⚠️ IMPORTANT:
 *  The `> *:not(a) { ... }` is needed to ensure that the link over the elements
 *  works properly.
 *  However since we are removing the pointer events from all elements, they
 *  need to be added again to each element that needs to be interacted with,
 *  be it a Link, Button, etc,
 *
 * It is also required to pass a label to be used as the link content (using
 * `linkLabel`). This value is hidden from view.
 * Additional link properties (like `href`, or even a replacement styled link)
 * can be passed through `linkProps`
 *
 * @example
 * <ElementInteractive
 *   as={WrapperElement}
 *   linkLabel='View more'
 *   linkProps={{
 *     as: Link, // import { Link } from 'react-router-dom';
 *     to: '/member/123'
 *   }}
 * >
 *   <p>Content for this item</p>
 *   <button>click</button>
 * </ElementInteractive>
 */
export const ElementInteractive = React.forwardRef(
  function ElementInteractiveFwd(props, ref) {
    const {
      linkProps = {},
      linkLabel = 'View',
      children,
      OverrideLinkElement,
      location,
      ...rest
    } = props;
    const [isStateOver, setStateOver] = useState(false);
    const [isStateActive, setStateActive] = useState(false);
    const [isStateFocus, setStateFocus] = useState(false);

    let InteractiveRoutePush, path;

    if (OverrideLinkElement && location) {
      InteractiveRoutePush = OverrideLinkElement;
      path = `${location}/${linkProps.to.split('/')[2]}`;
    } else {
      InteractiveRoutePush = InteractiveLink;
      path = linkProps.to;
    }

    return (
      <Wrapper
        ref={ref}
        {...rest}
        isStateOver={isStateOver}
        isStateActive={isStateActive}
        isStateFocus={isStateFocus}
        onFocus={useCallback(() => setStateFocus(true), [])}
        onBlur={useCallback(() => setStateFocus(false), [])}
        onMouseEnter={useCallback(() => setStateOver(true), [])}
        onMouseLeave={useCallback(() => {
          setStateOver(false);
          setStateActive(false);
        }, [])}
      >
        {children}
        <InteractiveRoutePush
          {...(OverrideLinkElement ? { href: path } : linkProps)}
          onMouseDown={useCallback(() => setStateActive(true), [])}
          onMouseUp={useCallback(() => setStateActive(false), [])}
          onFocus={useCallback(() => setStateFocus(true), [])}
          onBlur={useCallback(() => setStateFocus(false), [])}
        >
          {linkLabel}
        </InteractiveRoutePush>
      </Wrapper>
    );
  }
);

ElementInteractive.propTypes = {
  children: T.node.isRequired,
  linkLabel: T.string.isRequired,
  linkProps: T.object,
  OverrideLinkElement: T.node,
  location: T.any
};

/**
🍀 FULL EXAMPLE CODE

import { Link } from 'react-router-dom'
import { ElementInteractive, Wrapper } from './element-interactive';

const WrapperElement = styled(Wrapper).attrs({ as: 'article' })`
  ${({ isStateFocus }) => isStateFocus && css``}
  ${({ isStateOver }) => isStateOver && css``}
  ${({ isStateActive }) => isStateActive && css``}
`;

function MyComponent() {
  return (
    <ElementInteractive
      as={WrapperElement}
      linkLabel='View more'
      linkProps={{
        as: Link,
        to: '/member/123'
      }}
    >
      <p>Content for this item</p>
      <button>click</button>
    </ElementInteractive>
  );
}
*/
