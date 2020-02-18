import { getFrameFromNode, sortByZIndexDescending } from "./utils"
import { Node, RevasTouchEvent, RevasTouchType, RevasTouch } from "./Node"

function findNodeByPoint(node: Node, x: number, y: number): Node | void {
  const children = node.children.slice().sort(sortByZIndexDescending)
  for (let i = 0; i < children.length; i++) {
    const target = findNodeByPoint(children[i], x, y)
    if (target) return target
  }
  const frame = getFrameFromNode(node)
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
      if (node.props[funcName]) {
        if (node.props[funcName](e) === false)
          return
      }
      node = node.parent
    }
  }
}