import { DevseedUiThemeProvider as DsTp } from '@devseed-ui/theme-provider';

// Handle wrong types from devseed-ui.
export const DevseedUiThemeProvider = DsTp as any;
export default DevseedUiThemeProvider;
