import { createUITheme } from '@devseed-ui/theme-provider';

export default function themeOverrides() {
  return createUITheme({
    color: {
      base: '#2c3e50',
      primary: '#2276ac'
    },
    type: {
      base: {
        extrabold: '800'
      }
    },
    layout: {
      // The gap is defined as a multiplier of the layout.space The elements
      // that use the gap should use it as a parameter for the glsp function
      gap: {
        xsmall: 1,
        small: 1,
        medium: 2,
        large: 2,
        xlarge: 2
      }
    }
  });
}
