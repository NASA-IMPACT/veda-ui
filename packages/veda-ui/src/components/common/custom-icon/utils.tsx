import React from 'react';
import classnames from 'classnames';
import type { IconProps } from '@trussworks/react-uswds/lib/components/Icon/Icon';

export const makeUSWDSIcon = (
  Component: React.ComponentType<IconProps>
): React.FunctionComponent<IconProps> => {
  const IconComponent = (props: IconProps): JSX.Element => {
    const {
      size,
      className,
      focusable = false,
      role = 'img',
      ...iconProps
    } = props;

    const classes = classnames(
      'usa-icon',
      {
        [`usa-icon--size-${size}`]: size !== undefined
      },
      className
    );

    // Default to aria-hidden=true unless explicitly labeled for assistive tech
    const hasAccessibleLabel = Boolean(
      iconProps['aria-label'] ||
        iconProps['aria-labelledby'] ||
        iconProps['title']
    );

    return (
      <Component
        {...iconProps}
        className={classes}
        focusable={focusable}
        role={role}
        aria-hidden={iconProps['aria-hidden'] ?? !hasAccessibleLabel}
      />
    );
  };
  IconComponent.displayName = Component.displayName;
  return IconComponent;
};
