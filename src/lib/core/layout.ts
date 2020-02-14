import Yoga from 'yoga-layout-prebuilt'
import { Node } from './Node'
import apply from './style'

const EMPTY = {}

function _updateLayout(node: Node): [Function, Yoga.YogaNode] {
  const yoga = Yoga.Node.create()
  const children: Function[] = []
  apply(yoga, node.props.style || EMPTY)
  yoga.setDisplay(Yoga.DISPLAY_FLEX);
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i]
    const [f, y] = _updateLayout(child)
    const index = children.push(f)
    yoga.insertChild(y, index - 1)
  }
  function process() {
    if (!node.parent) { // is root container
      yoga.calculateLayout(node.props.width, node.props.height)
    }
    node.layout = yoga.getComputedLayout()
    children.forEach(c => c())
  }
  return [process, yoga]
}

export function updateLayout(root: Node) {
  return _updateLayout(root)[0]
}

