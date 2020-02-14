import Yoga from 'yoga-layout-prebuilt'
import { Node, Frame } from './Node'
import apply from './style'
import { getStyleFromNode } from '../common/utils'

function _updateLayout(node: Node): [Function, Yoga.YogaNode] {
  const yoga = Yoga.Node.create()
  const children: Function[] = []
  apply(yoga, getStyleFromNode(node))
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i]
    const [f, y] = _updateLayout(child)
    const index = children.push(f)
    yoga.insertChild(y, index - 1)
  }
  function process(x = 0, y = 0) {
    const { left, top, width, height } = yoga.getComputedLayout()
    node.frame = new Frame(x + left, y + top, width, height)
    for (let i = 0; i < children.length; i++) {
      children[i](node.frame.x, node.frame.y)
    }
    yoga.free()
  }
  return [process, yoga]
}

export function updateLayout(root: Node) {
  const [process, yoga] = _updateLayout(root)
  yoga.calculateLayout(root.props.width, root.props.height, Yoga.DIRECTION_LTR)
  return process
}

