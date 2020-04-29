import { adapter } from './utils';
import { Node } from './Node';
import { RevasCanvas } from './Canvas';

export interface CachedCanvas {
  id: string;
  canvas: RevasCanvas;
}

const MAX_SIZE = 30;

const cache = new Map<string, CachedCanvas>();
const ids: string[] = [];

export function getCache(id: string) {
  return cache.get(id);
}

export function createCache(width: number, height: number, id: string): CachedCanvas {
  if (ids.length >= MAX_SIZE) {
    const expiredId = ids.shift()!;
    const { canvas } = cache.get(expiredId)!;
    const cached: CachedCanvas = {
      canvas: adapter.resetOffscreenCanvas!(canvas, width, height),
      id,
    };
    cache.delete(expiredId);
    cache.set(cached.id, cached);
    ids.push(cached.id);
    return cached;
  } else {
    const cached: CachedCanvas = {
      canvas: adapter.createOffscreenCanvas!(width, height),
      id,
    };
    cache.set(cached.id, cached);
    ids.push(cached.id);
    return cached;
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
