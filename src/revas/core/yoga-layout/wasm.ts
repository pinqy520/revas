import type { YogaWasm } from 'yoga-layout-wasm';

const yoga: YogaWasm = {} as any;

function init(mod: any) {
  return mod.default.init(require('yoga-layout-wasm/dist/yoga.wasm'));
}
function merge(mod: YogaWasm) {
  Object.assign(yoga, mod);
}

export const task =
  typeof WebAssembly === 'undefined' ?
    import('yoga-layout-wasm/asm').then(init).then(merge) :
    import('yoga-layout-wasm').then(init).then(merge);

export default yoga;
