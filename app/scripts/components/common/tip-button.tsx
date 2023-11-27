import { Button, ButtonProps } from '@devseed-ui/button';
import { ToolbarIconButton } from '@devseed-ui/toolbar';
import { TippyProps } from '@tippyjs/react';
import React from 'react';
import { Tip } from './tip';

type TipButtonProps = Omit<
  JSX.IntrinsicElements['button'] &
    ButtonProps & {
      tipContent: React.ReactNode;
      tipProps?: TippyProps;
    },
  'ref'
>;

export const TipButton = React.forwardRef<HTMLButtonElement, TipButtonProps>(
  function TipButtonFwd(props, ref) {
    const { tipContent, tipProps = {}, ...rest } = props;
    return (
      <Tip content={tipContent} {...tipProps}>
        <Button ref={ref} {...rest} />
      </Tip>
    );
  }
);

export const TipToolbarIconButton = React.forwardRef<
  HTMLButtonElement,
  Omit<TipButtonProps, 'fitting'>
>(function TipToolbarIconButtonFwd(props, ref) {
  const { tipContent, tipProps = {}, ...rest } = props;
  return (
    <Tip content={tipContent} {...tipProps}>
      <ToolbarIconButton ref={ref} {...rest} />
    </Tip>
  );
});
