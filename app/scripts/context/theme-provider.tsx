import { DevseedUiThemeProvider as DsTp } from '@devseed-ui/theme-provider';

// @DEPRECATED: This theme provider is to be replaced with USWDS design system.

// Handle wrong types from devseed-ui.
export const DevseedUiThemeProvider = DsTp as any;
export default DevseedUiThemeProvider;
