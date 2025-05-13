import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import pkg from './package.json' with { type: 'json' };

const BASE_CONFIG = {
  input: 'src/revas/index.ts',
  output: [
    { file: pkg.main, format: 'cjs', sourcemap: true, exports: 'named' },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies }).concat(['yoga-layout-wasm/asm']),
  watch: {
    include: 'src/revas/**',
  },
  plugins: [
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({ tsconfig: './tsconfig.json' }), // Ensure it uses our tsconfig
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),
    // Note: rollup-plugin-sourcemaps was removed as @rollup/plugin-typescript
    // and Rollup's core sourcemap handling should be sufficient.
  ],
};

export default [
  BASE_CONFIG,
  {
    ...BASE_CONFIG,
    input: 'src/revas/common.ts',
    output: [{ file: 'dist/revas.common.js', format: 'cjs', sourcemap: true, exports: 'named' }],
  },
];