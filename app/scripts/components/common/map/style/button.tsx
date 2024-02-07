import styled from 'styled-components';
import { createButtonStyles } from '@devseed-ui/button';
import { themeVal } from '@devseed-ui/theme-provider';

import { TipButton } from '$components/common/tip-button';

// Why you ask? Very well:
// Mapbox's css has an instruction that sets the hover color for buttons to
// near black. The only way to override it is to increase the specificity and
// we need the button functions to get the correct color.
// The infamous instruction:
// .mapboxgl-ctrl button:not(:disabled):hover {
//   background-color: rgba(0, 0, 0, 0.05);
// }

export const SelectorButton = styled(TipButton)`
  &&& {
    ${createButtonStyles({ variation: 'surface-fill', fitting: 'skinny' } as any)}
    background-color: ${themeVal('color.surface')};
    &:hover {
      background-color: ${themeVal('color.surface')};
    }
    & path {
      fill: ${themeVal('color.base')};
    }
  }
`;