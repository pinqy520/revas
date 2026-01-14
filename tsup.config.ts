import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    revas: 'src/revas/index.ts',
    'revas-common': 'src/revas/common.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'yoga-layout'],
  treeshake: true,
});
