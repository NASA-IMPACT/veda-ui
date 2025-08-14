// Shim for @devseed-ui/collecticons compatibility
// The library uses 'react-dom/server', which is not supported in Vite
// See: https://github.com/developmentseed/ui-library-seed/issues/237
export class Readable {}
export default { Readable };
