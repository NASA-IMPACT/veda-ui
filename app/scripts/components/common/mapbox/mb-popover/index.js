import React, { useCallback, useEffect, useRef } from 'react';
import T from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import MBPopoverInner from './popover-inner';
import { POPOVER_SHOW_HIDE_ANIM_TIME } from './styled';

// Note: This wrapper acts as the entrypoint for the popover mounting and
// unmouting it when coordinates are removed. This approach helps to deal with
// setting event listeners and managing animations

/**
 * Mapbox Popover
 * An alternative to mapbox popover that is portaled to the body to avoid
 * clipping due to map and or popover size.
 * The popover is shown when coordinates are present, if they are currently
 * within the map viewport.
 *
 * The popover has internal mechanisms to hide itself when the map gets clicked
 * but it is important to remove the coordinates once the popover is hidden.
 *
 * @example
 *  <ReactPopoverGl
 *    mbMap={mbMap}
 *    lngLat={this.state.coords}
 *    onClose={() => this.setState({ coords: null })}
 * />
 *
 * If no overrides are applied, the popover structure is outlined below.
 * It is listed with styled components and the corresponding html element
 * in front.
 * <Popover>                   // article
 *   <PopoverContents>         // div
 *     <PopoverHeader>         // header
 *       <PopoverHeadline>     // div
 *         <h1></h1>           -- title prop
 *         <p></p>             -- subtitle or suptitle (see below) prop
 *       </PopoverHeadline>
 *       <PopoverToolbar>      // div
 *         <CloseButton />     // button
 *       </PopoverToolbar>
 *     </PopoverHeader>
 *     <PopoverBody />         // div -- content prop
 *     <PopoverFooter />       // footer -- footerContent prop
 *   </PopoverContents>
 * </Popover>
 *
 * The `Popover` and `PopoverContents` are required for positioning and styling
 * purposes. All other elements can be replaced with render functions.
 * The code that generates the structure above is:
 * @example
 * <ReactPopoverGl
 *   mbMap={mbMap}
 *   lngLat={this.state.coords}
 *   onClose={() => this.setState({ coords: null })}
 *   title='Popover Title'
 *   subtitle='Subtitle below'
 *   content={<p>This is the content</p>}
 *   footerContent={<p>This is the footer content</p>}
 * />
 *
 * @param {object} mbMap Mapbox map which the popover will use. Required.
 * @param {array} lngLat Coordinates the popover points to. Required.
 * @param {function} onClose Callback when the popover is hidden. Required.
 * @param {bool} closeOnClick Whether or not the popover should close when the
 *               map gets clicked. Default `true`.
 * @param {bool} closeOnMove Whether or not the popover should close when the
 *               map is dragged. Default `false`.
 * @param {bool} closeButton Whether or not the popover should render
 *               the default close button. Default `true`.
 * @param {string} title Title for the popover. Required unless the header is
 *                 being overridden.
 * @param {string} subtitle Subtitle for the popover. It is displayed below the
 *                 title.
 * @param {string} suptitle Suptitle for the popover. It is displayed above the
 *                 title. If both subtitle and suptitle are present, the
 *                 suptitle gets ignored.
 * @param {node} content Popover body content, rendered inside `PopoverBody`.
 *               Required unless the body is being overridden.
 * @param {node} footerContent Popover footer content, rendered
 *               inside `PopoverFooter`.
 * @param {array} offset Vertical offset for the popover. The array must have 2
 *                values. The first for the top offset the second for the
 *                bottom offset.
 * @param {function} renderContents Overrides the contents of the popover.
 *                   Anything returned by this function is rendered inside
 *                   `PopoverContents`.
 *                   Signature: fn(bag). Bag has the following props:
 *                     {function} close Method to close the popover.
 * @param {function} renderHeader Overrides the popover header element.
 *                   Anything returned by this function is rendered instead of
 *                   `PopoverHeader`.
 *                   Signature: fn(bag). Bag has the following props:
 *                     {function} close Method to close the popover.
 * @param {function} renderHeadline Overrides the popover headline element.
 *                   Anything returned by this function is rendered instead of
 *                   `PopoverHeadline`.
 *                   Signature: fn(bag). Bag has the following props:
 *                     {function} close Method to close the popover.
 * @param {function} renderToolbar Overrides the popover toolbar element.
 *                   Anything returned by this function is rendered instead of
 *                   `PopoverToolbar`.
 *                   Signature: fn(bag). Bag has the following props:
 *                     {function} close Method to close the popover.
 * @param {function} renderBody Overrides the popover body element.
 *                   Anything returned by this function is rendered instead of
 *                   `PopoverBody`.
 *                   Signature: fn(bag). Bag has the following props:
 *                     {function} close Method to close the popover.
 * @param {function} renderFooter Overrides the popover footer element.
 *                   Anything returned by this function is rendered instead of
 *                   `PopoverFooter`.
 *                   Signature: fn(bag). Bag has the following props:
 *                     {function} close Method to close the popover.
 */
export default function MBPopover(props) {
  const { mbMap, lngLat, onClose: onCloseProp, ...rest } = props;

  const switchingPopovers = useRef(false);
  // Store the previous lat long.
  const pLngLat = useRef(false);

  const onClose = useCallback(() => {
    if (switchingPopovers.current) {
      switchingPopovers.current = false;
      return;
    }
    onCloseProp?.();
  }, [onCloseProp]);

  useEffect(() => {
    // When we're transitioning the popover to a different location we need to
    // prevent the map click from triggering the close callback or the new
    // popover will not show up because the coordinates will be cleared on the
    // parent component.
    if (pLngLat.current && lngLat) {
      const prev = pLngLat.current.join('-');
      const curr = lngLat.join('-');
      if (prev !== curr) {
        switchingPopovers.current = true;
      }
    }

    pLngLat.current = lngLat;
  }, [lngLat]);

  if (lngLat && !mbMap) {
    /* eslint-disable-next-line no-console */
    console.error('Mapbox map required for the popover. Use the mbMap prop.');
    return null;
  }

  return (
    <TransitionGroup component={null}>
      {lngLat && (
        // Ideally we'd use a Transition instead of CSSTransition and handle
        // the transitions with styled components.
        // However when the component is mounting there is no reflow between
        // the exited and entering states and therefore there's no time for
        // the initial styles to be applied.
        // The suggestion listed at
        // https://github.com/reactjs/react-transition-group/issues/223 of
        // reading a node property onEnter and causing a reflow is not working
        // in this case. CSSTransition relies on css classes which work
        // perfectly fine.
        <CSSTransition
          key={lngLat.join('-')}
          timeout={POPOVER_SHOW_HIDE_ANIM_TIME}
          classNames='popover-gl'
        >
          <MBPopoverInner
            {...rest}
            mbMap={mbMap}
            lngLat={lngLat}
            onClose={onClose}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  );
}

MBPopover.propTypes = {
  onClose: T.func,
  lngLat: T.array,
  mbMap: T.object
};
