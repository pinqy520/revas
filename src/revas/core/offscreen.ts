import { adapter } from './utils';
import { Node } from './Node';

export interface CachedCanvas {
  id: string;
  ctx: CanvasRenderingContext2D;
}

const MAX_SIZE = 30;

const cache = new Map<string, CachedCanvas>();
const ids: string [] = [];

export function getCache(id: string) {
  return cache.get(id);
}

export function createCache(width: number, height: number, id: string): CachedCanvas {
  if (ids.length >= MAX_SIZE) {
    const expiredId = ids.shift()!;
    const { ctx } = cache.get(expiredId)!;
    const canvas: CachedCanvas = {
      ctx: adapter.resetOffscreenCanvas!(ctx, width, height),
      id,
    };
    cache.delete(expiredId);
    cache.set(canvas.id, canvas);
    ids.push(canvas.id);
    return canvas;
  } else {
    const canvas: CachedCanvas = {
      ctx: adapter.createOffscreenCanvas!(width, height),
      id,
    };
    cache.set(canvas.id, canvas);
    ids.push(canvas.id);
    return canvas;
  }
}

const idCache = new WeakMap<Node, string>();
let __ID = 0;

export function autoCacheId(node: Node) {
  if (idCache.has(node)) {
    return idCache.get(node);
  } else {
    const id = `$$auto_id-${__ID++}`;
    idCache.set(node, id);
    return id;
  }
}