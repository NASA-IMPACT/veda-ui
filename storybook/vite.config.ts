import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const rootEnvDir = path.resolve(__dirname, '..');
  const env = loadEnv(mode, rootEnvDir, '');

  return {
    envDir: rootEnvDir,
    publicDir: path.resolve(__dirname, '../static'),
    plugins: [react()],
    css: {
      preprocessorOptions: {
        scss: {
          api: 'legacy',
          includePaths: [
            // USWDS from node_modules
            path.resolve(__dirname, 'node_modules/@uswds/uswds'),
            path.resolve(__dirname, 'node_modules/@uswds/uswds/dist'),
            path.resolve(__dirname, 'node_modules/@uswds/uswds/packages')
          ]
        }
      }
    },
    resolve: {
      alias: {
        // Application path aliases
        $uswds: path.resolve(__dirname, '../app/scripts/uswds'),
        $components: path.resolve(__dirname, '../app/scripts/components'),
        $context: path.resolve(__dirname, '../app/scripts/context'),
        $utils: path.resolve(__dirname, '../app/scripts/utils'),
        $styles: path.resolve(__dirname, '../app/scripts/styles'),

        // Shim for @devseed-ui/collecticons compatibility
        // The library uses 'react-dom/server', which is not supported in Vite
        // See: https://github.com/developmentseed/ui-library-seed/issues/237
        stream: path.resolve(__dirname, './utils/stream-shim.js')
      }
    },
    define: {
      'import.meta.env.MAPBOX_TOKEN': JSON.stringify(env.MAPBOX_TOKEN ?? ''),
      'import.meta.env.API_STAC_ENDPOINT': JSON.stringify(
        env.API_STAC_ENDPOINT ?? ''
      ),
      'import.meta.env.API_RASTER_ENDPOINT': JSON.stringify(
        env.API_RASTER_ENDPOINT ?? ''
      ),
      'import.meta.env.API_CMR_ENDPOINT': JSON.stringify(
        env.API_CMR_ENDPOINT ?? ''
      )
    }
  };
});
