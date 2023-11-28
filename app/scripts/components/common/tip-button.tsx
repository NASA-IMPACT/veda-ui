import React from 'react';
import styled from 'styled-components';
import { TippyProps } from '@tippyjs/react';
import { Button, ButtonProps } from '@devseed-ui/button';
import { ToolbarIconButton } from '@devseed-ui/toolbar';

import { Tip } from './tip';

import { composeVisuallyDisabled } from '$utils/utils';

const VdButton = composeVisuallyDisabled(Button);
const VdToolbarIconButton = composeVisuallyDisabled(ToolbarIconButton);

type TipButtonProps = Omit<
  JSX.IntrinsicElements['button'] &
    ButtonProps & {
      tipContent: React.ReactNode;
      tipProps?: TippyProps;
      visuallyDisabled?: boolean;
    },
  'ref'
>;

export const TipButton = styled(
  React.forwardRef<HTMLButtonElement, TipButtonProps>(function TipButtonFwd(
    props,
    ref
  ) {
    const {
      tipContent,
      tipProps = {},
      as,
      ...rest
      // as injected by styled components
    } = props as TipButtonProps & { as: any };

    return (
      <Tip content={tipContent} {...tipProps}>
        <VdButton ref={ref} forwardedAs={as} {...rest} />
      </Tip>
    );
  })
)`
  /* Convert to styled component */
`;

export const TipToolbarIconButton = styled(
  React.forwardRef<HTMLButtonElement, Omit<TipButtonProps, 'fitting'>>(
    function TipToolbarIconButtonFwd(props, ref) {
      const {
        tipContent,
        tipProps = {},
        as,
        ...rest
        // as injected by styled components
      } = props as TipButtonProps & { as: any };

      return (
        <Tip content={tipContent} {...tipProps}>
          <VdToolbarIconButton ref={ref} forwardedAs={as} {...rest} />
        </Tip>
      );
    }
  )
)`
  /* Convert to styled component */
`;
