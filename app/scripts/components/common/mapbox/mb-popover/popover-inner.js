import React, { useCallback, useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import T from 'prop-types';
import { Toolbar, ToolbarIconButton } from '@devseed-ui/toolbar';
import { CollecticonXmarkSmall } from '@devseed-ui/collecticons';

import {
  getAnchorTranslate,
  Popover,
  PopoverContents,
  PopoverHeader,
  PopoverHeadline,
  PopoverTitle,
  PopoverSubtitle,
  PopoverBody,
  PopoverFooter
} from './styled';

const Try = (props) => {
  const { fn, children, ...rest } = props;
  return typeof fn === 'function' ? fn(rest) : children || null;
};

/**
 * Mapbox popover inner element.
 * NOT TO BE USED DIRECTLY
 *
 * See documentation on index.js file.
 */
export default function MBPopoverInner(props) {
  const {
    className,
    mbMap,
    closeOnClick,
    closeOnMove,
    onClose,
    lngLat,
    offset: [offsetTop, offsetBottom],
    renderContents,
    renderHeader,
    renderHeadline,
    renderToolbar,
    renderBody,
    renderFooter,
    closeButton,
    title,
    subtitle,
    suptitle,
    content,
    footerContent
  } = props;

  const popoverEl = useRef(null);
  const [anchorPoints, setAnchorPoints] = useState([]);
  const [position, setPosition] = useState({
    top: null,
    left: null
  });

  const update = useCallback(() => {
    if (!popoverEl.current) return;

    const { pageYOffset, pageXOffset } = window;
    const { width, height, top, left } = mbMap
      .getContainer()
      .getBoundingClientRect();

    const mapTop = pageYOffset + top;
    const mapLeft = pageXOffset + left;
    const mapRight = pageXOffset + left + width;
    const mapBottom = pageYOffset + top + height;

    const pos = mbMap.project(lngLat);

    const anchorPosition = {
      top: mapTop + pos.y,
      left: mapLeft + pos.x
    };

    if (
      // Top bound
      anchorPosition.top < mapTop ||
      // Bottom bound
      anchorPosition.top > mapBottom ||
      // Left bound
      anchorPosition.left < mapLeft ||
      // Right bound
      anchorPosition.left > mapRight
    ) {
      setAnchorPoints([]);
      setPosition({
        top: null,
        left: null
      });
      return;
    }

    let anchorPoints = [];

    const popoverDomRect = popoverEl.current.getBoundingClientRect();
    const halfW = popoverDomRect.width / 2;

    if (anchorPosition.top - popoverDomRect.height - offsetTop < pageYOffset) {
      anchorPoints = ['top'];
      anchorPosition.top += offsetBottom;
    } else {
      anchorPoints = ['bottom'];
      anchorPosition.top -= offsetTop;
    }

    if (anchorPosition.left - halfW < mapLeft) {
      anchorPoints.push('left');
    } else if (anchorPosition.left + halfW > mapRight) {
      anchorPoints.push('right');
    }

    setAnchorPoints(anchorPoints);
    setPosition(anchorPosition);
  }, [mbMap, lngLat, offsetTop, offsetBottom]);

  const destroy = useCallback(() => {
    mbMap.off('click', destroy);
    mbMap.off('move', update);
    mbMap.off('move', destroy);
    onClose();
  }, [mbMap, onClose, update]);

  // Setup listeners.
  useEffect(() => {
    if (closeOnClick) {
      mbMap.on('click', destroy);
    }

    if (closeOnMove) {
      mbMap.on('move', destroy);
    } else {
      mbMap.on('move', update);
    }

    return () => {
      mbMap.off('click', destroy);
      mbMap.off('move', update);
      mbMap.off('move', destroy);
    };
  }, [mbMap, closeOnClick, closeOnMove, update, destroy]);

  // Update on mount.
  useEffect(() => {
    update();
    // Ensure the popover gets repositioned after it has sizes defined.
    setTimeout(update, 1);
    // Only do this on mount. The update is then called by the listener.
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  const { top, left } = position;

  const hasPlacement = top !== null && left !== null;
  const anchor = anchorPoints.join('-');

  const popoverStyle = {
    transform: hasPlacement
      ? `${getAnchorTranslate(anchor)} translate(${left}px, ${top}px)`
      : undefined,
    display: !hasPlacement ? 'none' : undefined
  };

  return ReactDOM.createPortal(
    // This wrapper div is needed because it will receive the css classes from
    // CSSTransition.
    <div>
      <Popover className={className} style={popoverStyle} ref={popoverEl}>
        <PopoverContents anchor={anchor} verticalAttachment={anchorPoints[0]}>
          <Try fn={renderContents} close={destroy}>
            <Try fn={renderHeader} close={destroy}>
              <PopoverHeader>
                <Try fn={renderHeadline} close={destroy}>
                  <PopoverHeadline>
                    <PopoverTitle>{title}</PopoverTitle>
                    {(subtitle || suptitle) && (
                      <PopoverSubtitle isSup={!subtitle}>
                        {subtitle || suptitle}
                      </PopoverSubtitle>
                    )}
                  </PopoverHeadline>
                </Try>
                <Try fn={renderToolbar} close={destroy}>
                  {closeButton && (
                    <Toolbar>
                      <ToolbarIconButton size='small' onClick={destroy}>
                        <CollecticonXmarkSmall
                          title='Close popover'
                          meaningful
                        />
                      </ToolbarIconButton>
                    </Toolbar>
                  )}
                </Try>
              </PopoverHeader>
            </Try>
            <Try fn={renderBody} close={destroy}>
              <PopoverBody>{content}</PopoverBody>
            </Try>
            <Try fn={renderFooter} close={destroy}>
              {footerContent && <PopoverFooter>{footerContent}</PopoverFooter>}
            </Try>
          </Try>
        </PopoverContents>
      </Popover>
    </div>,
    document.querySelector('body')
  );
}

MBPopoverInner.propTypes = {
  onClose: T.func,
  className: T.string,

  mbMap: T.object,
  lngLat: T.array,
  closeOnClick: T.bool,
  closeOnMove: T.bool,
  closeButton: T.bool,
  title: T.node,
  subtitle: T.string,
  suptitle: T.string,
  offset: T.array,

  renderContents: T.func,
  renderHeader: T.func,
  renderHeadline: T.func,
  renderToolbar: T.func,
  renderBody: T.func,
  content: T.node,
  renderFooter: T.func,
  footerContent: T.node
};

MBPopoverInner.defaultProps = {
  closeOnClick: true,
  closeButton: true,
  offset: [0, 0]
};
