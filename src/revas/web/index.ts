import { adapter } from '../core/utils';

export * from './render';

adapter.createOffscreenCanvas = (width: number, height: number) => {
  const canvas = document.createElement('canvas');
  const scale = window.devicePixelRatio;
  canvas.width = width * scale;
  canvas.height = height * scale;
  const context = canvas.getContext('2d')!;
  context.scale(scale, scale);
  return context;
};

adapter.resetOffscreenCanvas = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const { canvas } = ctx;
  const scale = window.devicePixelRatio;
  canvas.width = width * scale;
  canvas.height = height * scale;
  ctx.scale(scale, scale);
  return ctx;
};