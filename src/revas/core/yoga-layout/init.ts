import Yoga, { YogaStatic } from 'yoga-layout-wasm/asm';

export const yoga: YogaStatic = {} as any;

export const promise = Yoga.then(y => {
  Object.assign(yoga, y);
});
