class CachedImage {
  readonly image = new Image()
  private readonly targets = new Set<Function>()
  private _ready = false
  get empty() {
    return this.targets.size === 0
  }
  constructor(
    public readonly src: string
  ) {
    this.image.onload = this.onload
    this.image.onerror = this.onerror
    this.image.src = src
  }
  onload = () => {
    this._ready = true
    Array.from(this.targets.values()).forEach(target => target(this.image))
  }
  onerror = () => { }
  add(target: Function) {
    this.targets.add(target)
    if (this._ready) {
      target(this.image)
    }
  }
  remove(target: Function) {
    this.targets.delete(target)
  }
}

const cache = new Map<string, CachedImage>()


export function get(src: string, target?: Function) {
  if (!cache.has(src)) {
    cache.set(src, new CachedImage(src))
  }
  const cached = cache.get(src)!
  target && cached.add(target)
  return cached.image
}

export function remove(src: string, target: Function) {
  if (cache.has(src)) {
    const cached = cache.get(src)!
    cached.remove(target)
    if (cached.empty) {
      cache.delete(src)
    }
  }
}