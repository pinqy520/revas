import { Node } from '../core/Node'

export function noop() { }
export const EMPTY_OBJECT = Object.freeze({})
export const EMPTY_ARRAY = Object.freeze([])

export function appendChild(parent: Node, child: Node | string) {
  if (child instanceof Node) {
    parent.children.push(child)
    child.parent = parent
  }
}

export function getStyleFromNode(node: Node) {
  const { props: { style = EMPTY_OBJECT } } = node
  return style
}

export function getFrameFromNode(node: Node) {
  const { frame } = node
  return frame
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
};

const ASTRAL_RANGE = /\ud83c[\udffb-\udfff](?=\ud83c[\udffb-\udfff])|(?:[^\ud800-\udfff][\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]?|[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/g
export function getChars(str: string) {
  return str.match(ASTRAL_RANGE) || EMPTY_ARRAY
}