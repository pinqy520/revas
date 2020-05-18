const yoga: any = {};

export const task = require('yoga-wasm')
  .default(require('yoga-wasm/build/yoga.wasm'))
  .then((mod: any) => {
    Object.assign(yoga, mod);
  });

export default yoga;
