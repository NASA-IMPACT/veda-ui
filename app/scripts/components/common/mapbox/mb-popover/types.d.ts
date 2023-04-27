import { Map as MapboxMap } from 'mapbox-gl';
import { ReactNode } from 'react';

export interface PopoverRenderFunctionBag {
  close: () => void;
}

export type PopoverRenderFunction = (
  bag: PopoverRenderFunctionBag
) => ReactNode;

export interface MBPopoverProps {
  /**
   * Mapbox map which the popover will use.
   */
  mbMap: MapboxMap;
  /**
   * Coordinates the popover points to.
   */
  lngLat: [number, number] | null;
  /**
   * Callback when the popover is hidden.
   */
  onClose?: () => void;
  /**
   * Whether or not the popover should close when the map gets clicked.
   * @default true
   */
  closeOnClick?: boolean;
  /**
   * Whether or not the popover should close when the map is dragged.
   * @default false
   */
  closeOnMove?: boolean;
  /**
   * Whether or not the popover should render the default close button.
   * @default true
   */
  closeButton?: boolean;
  /**
   * Title for the popover.
   * Required unless the header is being overridden.
   */
  title?: ReactNode;
  /**
   * Heading level for the popover.
   * @default h2
   */
  titleHLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /**
   * Subtitle for the popover. It is displayed below the title.
   */
  subtitle?: ReactNode;
  /**
   * Suptitle for the popover. It is displayed above the title. If both subtitle
   * and suptitle are present, the suptitle gets ignored.
   */
  suptitle?: ReactNode;
  /**
   * Popover body content, rendered inside `PopoverBody`. Required unless the
   * body is being overridden.
   */
  content?: ReactNode;
  /**
   * Popover footer content, rendered inside `PopoverFooter`.
   */
  footerContent?: ReactNode;
  /**
   * Vertical offset for the popover. The array must have 2 values. The first
   * for the top offset the second for the bottom offset.
   */
  offset?: [number, number];
  /**
   * Overrides the contents of the popover.
   * Anything returned by this function is rendered inside `PopoverContents`.
   * Signature: fn(bag). Bag has the following props:
   * close - Method to close the popover.
   */
  renderContents?: PopoverRenderFunction;
  /**
   * Overrides the popover header element.
   * Anything returned by this function is rendered instead of `PopoverHeader`.
   * Signature: fn(bag). Bag has the following props:
   * close - Method to close the popover.
   */
  renderHeader?: PopoverRenderFunction;
  /**
   * Overrides the popover headline element.
   * Anything returned by this function is rendered instead of
   * `PopoverHeadline`.
   * Signature: fn(bag). Bag has the following props:
   * close - Method to close the popover.
   */
  renderHeadline?: PopoverRenderFunction;
  /**
   * Overrides the popover toolbar element.
   * Anything returned by this function is rendered instead of `PopoverToolbar`.
   * Signature: fn(bag). Bag has the following props:
   * close - Method to close the popover.
   */
  renderToolbar?: PopoverRenderFunction;
  /**
   * Overrides the popover body element.
   * Anything returned by this function is rendered instead of `PopoverBody`.
   * Signature: fn(bag). Bag has the following props: function} close Method to
   * close the popover.
   */
  renderBody?: PopoverRenderFunction;
  /**
   * Overrides the popover footer element.
   * Anything returned by this function is rendered instead of `PopoverFooter`.
   * Signature: fn(bag). Bag has the following props:
   * close - Method to close the popover.
   */
  renderFooter?: PopoverRenderFunction;
}
