import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable TypeScript decorators
      tsDecorators: true,
    }),
  ],
  // The `root` option is not set here, so Vite will look for an index.html
  // in the project root directory (where vite.config.ts is).
  // This index.html should then load the demo app's entry point,
  // e.g., <script type="module" src="/src/develop/index.tsx"></script>

  // Configure server options if needed, e.g., port
  server: {
    port: 3000,
    open: true, // Automatically open in browser
  },

  // Configure build options for the demo app if we use Vite to build it
  // (The plan currently uses react-scripts for build:pwa, this might change)
  // build: {
  //   outDir: 'build', // Default CRA output dir
  //   sourcemap: true,
  // },

  // Aliases can be useful if the library imports itself by name
  // or for cleaner paths within the demo app.
  resolve: {
    alias: {
      // If 'revas' library is imported by name within the demo app
      // during development, we want it to point to the source, not dist.
      // This assumes the Revas library source entry is src/revas/index.ts
      revas: path.resolve(__dirname, 'src/revas/index.ts'),
    },
  },
});
