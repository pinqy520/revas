import { YogaStatic } from 'yoga-layout-wasm';

const yoga: YogaStatic = {} as any;

export const task = require('yoga-layout-wasm/dist/index.js')({
  wasm: require('yoga-layout-wasm/dist/yoga.wasm'),
  asm: require('yoga-layout-wasm/dist/yoga.wasm.js'),
}).then((mod: any) => {
  Object.assign(yoga, mod);
});

export default yoga;
