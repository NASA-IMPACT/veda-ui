# Custom Icons

Custom SVG icons that follow USWDS patterns and sizing system.

## Usage

```tsx
import { DropIcon } from '$components/common/custom-icon';

// Basic usage
<DropIcon size={3} aria-hidden='true' />

// With accessibility
<DropIcon role='img' aria-label='Water data' />
```

## Creating New Icons

```tsx
import React from 'react';
import { makeUSWDSIcon } from './utils';
import type { IconProps } from '@trussworks/react-uswds/lib/components/Icon/Icon';

const YourIconComponent = (props: IconProps) => (
  <svg viewBox='0 0 24 24' fill='currentColor' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path d='...' />
  </svg>
);

YourIconComponent.displayName = 'YourIcon';
export const YourIcon = makeUSWDSIcon(YourIconComponent);
```

**Requirements:**

- Use `viewBox='0 0 24 24'` and `fill='currentColor'`
- No hardcoded width/height attributes
- Set displayName for debugging
- Wrap with `makeUSWDSIcon`
