import { Node } from './Node'

export function noop(): any { }
export const EMPTY_OBJECT = Object.freeze({})
export const EMPTY_ARRAY = Object.freeze([])

function checkAndRemove(parent: Node, child: Node) {
  const index = parent.children.indexOf(child);
  if (index >= 0) {
    parent.children.splice(index, 1);
  }
}

export function appendChild(parent: Node, child: Node) {
  checkAndRemove(parent, child)
  parent.children.push(child);
  child.parent = parent
}

export function flatten(array: any[]) {
  var flattend: any[] = [];
  (function flat(array) {
    array.forEach(function (el) {
      if (Array.isArray(el)) flat(el);
      else flattend.push(el);
    });
  })(array);
  return flattend;
}

export function removeChild(parent: Node, child: Node) {
  checkAndRemove(parent, child)
  child.parent = void 0
}

export function insertBefore(parent: Node, child: Node, before: Node) {
  checkAndRemove(parent, child)
  const beforeIndex = parent.children.indexOf(before);
  parent.children.splice(beforeIndex, 0, child);
  child.parent = parent
}

function observeAnimatedValue(value: any, observer?: Function, defaultValue?: number) {
  if (value === undefined)
    return defaultValue!
  if (value && value.getValue)
    return value.getValue(observer)
  return value
}

export function applyAnimated(style: any, callback?: Function) {
  if (style.animated) {
    // Animated Styles
    for (const key in style) {
      style[key] = observeAnimatedValue(style[key], callback)
    }
  }
  return style
}

export function getMergedStyleFromNode(node: Node, callback?: Function) {
  const { props: { style = EMPTY_ARRAY } } = node
  return applyAnimated(Object.assign({}, ...flatten([style])), callback)
}

export function getFrameFromNode(node: Node) {
  const { frame } = node
  return frame
}

export function sortByZIndexAscending(a: Node, b: Node) {
  const styleA = getMergedStyleFromNode(a)
  const styleB = getMergedStyleFromNode(b)
  return (styleA.zIndex || 0) - (styleB.zIndex || 0);
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
};

const ASTRAL_RANGE = /\ud83c[\udffb-\udfff](?=\ud83c[\udffb-\udfff])|(?:[^\ud800-\udfff][\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]?|[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/g
const WORD_RANGE = /\w+|\ud83c[\udffb-\udfff](?=\ud83c[\udffb-\udfff])|(?:[^\ud800-\udfff][\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]?|[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/g

export function getChars(str: string): readonly string[] {
  return str.match(ASTRAL_RANGE) || EMPTY_ARRAY
}

export function getWords(str: string): readonly string[] {
  return str.match(WORD_RANGE) || EMPTY_ARRAY
}

export function setShadow(ctx: CanvasRenderingContext2D, color: string, x: number, y: number, blur: number) {
  if (color) {
    const { shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY } = ctx
    ctx.shadowBlur = blur;
    ctx.shadowColor = color;
    ctx.shadowOffsetX = x;
    ctx.shadowOffsetY = y;
    return () => {
      ctx.shadowBlur = shadowBlur;
      ctx.shadowColor = shadowColor;
      ctx.shadowOffsetX = shadowOffsetX;
      ctx.shadowOffsetY = shadowOffsetY;
    }
  }
  return noop
}

export function pushOpacity(ctx: CanvasRenderingContext2D, opacity: number) {
  if (opacity !== null && opacity < 1 && opacity >= 0) {
    const cachedOpacity = ctx.globalAlpha || 1
    ctx.globalAlpha = cachedOpacity * opacity
    return () => {
      ctx.globalAlpha = cachedOpacity
    }
  }
  return noop
}


export type RevasAdapter = {
  createImage: () => HTMLImageElement
  createOffscreenCanvas?: () => HTMLCanvasElement
}

export const adapter: RevasAdapter = {
  createImage: () => new Image(),
}