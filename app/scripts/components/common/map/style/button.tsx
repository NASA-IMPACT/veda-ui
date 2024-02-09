import styled from 'styled-components';
import { createButtonStyles } from '@devseed-ui/button';
import { themeVal } from '@devseed-ui/theme-provider';

import { TipButton } from '$components/common/tip-button';

// &&&: To increase the specificity of css class
// https://styled-components.com/docs/faqs#how-can-i-override-styles-with-higher-specificity
// so we can override the derived selectors from Mapbox .mapboxgl-ctrl button
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