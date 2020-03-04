import { getFrameFromNode, sortByZIndexDescending, getStyleFromNode } from "./utils"
import { Node, RevasTouchEvent, RevasTouchType, RevasTouch } from "./Node"
import { getAnimatedValue } from "./Animated"

function scaled(x: number, c: number, s = 1) {
  if (!s && s === 1) return x
  return ((s - 1) * c + x) / s
}

function findNodeByPoint(node: Node, x: number, y: number): Node | void {
  if (node.props.pointerEvents === 'none') return
  const children = node.children.slice().sort(sortByZIndexDescending)
  const style = getStyleFromNode(node)
  const frame = getFrameFromNode(node)

  // tranlate, TODO: rotate & scale
  const translateX = getAnimatedValue(style.translateX, 0)
  const translateY = getAnimatedValue(style.translateY, 0)
  const scale = getAnimatedValue(style.scale)
  const scaleX = getAnimatedValue(style.scaleX, scale)
  const scaleY = getAnimatedValue(style.scaleY, scale)
  const originX = frame.width / 2 + frame.x
  const originY = frame.height / 2 + frame.y

  x -= translateX
  y -= translateY
  x = scaled(x, originX, scaleX)
  y = scaled(y, originY, scaleY)

  for (let i = 0; i < children.length; i++) {
    const target = findNodeByPoint(children[i], x, y)
    if (target) return target
  }
  if (node.props.pointerEvents === 'box-none') return
  if (frame.x < x && frame.y < y
    && x <= frame.x + frame.width
    && y <= frame.y + frame.height) {
    return node
  }
}

const eventNodeHolder: { [key: number]: Node } = {}

export function getNodeByTouch(root: Node, type: RevasTouchType, touch: RevasTouch) {
  if (type === 'touchstart') {
    const target = findNodeByPoint(root, touch.x, touch.y)
    eventNodeHolder[touch.identifier] = target || root
    return eventNodeHolder[touch.identifier]
  } else if (type === 'touchmove') {
    return eventNodeHolder[touch.identifier] || root
  } else if (type === 'touchend') {
    const target = eventNodeHolder[touch.identifier]
    delete eventNodeHolder[touch.identifier]
    return target || root
  }
  return root
}

const LISTENER_MAP = {
  touchstart: 'onTouchStart',
  touchmove: 'onTouchMove',
  touchend: 'onTouchEnd'
}


export function emitTouch(node: Node | void, e: RevasTouchEvent) {
  const funcName = LISTENER_MAP[e.type]
  if (funcName) {
    while (node) {
      if (node.props[funcName]
        && node.props.pointerEvents !== 'box-none'
        && node.props[funcName](e) === false) return
      node = node.parent
    }
  }
}