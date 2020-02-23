// import Yoga from 'yoga-layout-prebuilt'
import { Node, Frame } from './Node'
// import apply from './style'
import { getStyleFromNode } from './utils'

// function _updateLayout(node: Node): [Function, Yoga.YogaNode] {
//   const yoga = Yoga.Node.create()
//   const children: Function[] = []
//   apply(yoga, getStyleFromNode(node))
//   for (let i = 0; i < node.children.length; i++) {
//     const child = node.children[i]
//     const [f, y] = _updateLayout(child)
//     const index = children.push(f)
//     yoga.insertChild(y, index - 1)
//   }
//   function process(x = 0, y = 0) {
//     const { left, top, width, height } = yoga.getComputedLayout()
//     node.frame = new Frame(x + left, y + top, width, height)
//     node.props.onLayout && node.props.onLayout(node.frame)
//     for (let i = 0; i < children.length; i++) {
//       children[i](node.frame.x, node.frame.y)
//     }
//     yoga.free()
//   }
//   return [process, yoga]
// }

// export function updateLayout(root: Node) {
//   const [process, yoga] = _updateLayout(root)
//   yoga.calculateLayout(root.props.width, root.props.height, Yoga.DIRECTION_LTR)
//   return process
// }

const computeLayout = require('css-layout')

export interface YogaNode {
  node: Node,
  style: any, layout: any,
  children: YogaNode[]
}

export function updateLayout(root: Node) {
  const yogas = createYoga(root)
  yogas.style = root.props
  return () => {
    computeLayout(yogas)
    layout(yogas)
  }
}


function createYoga(node: Node): any {
  return {
    style: getStyleFromNode(node),
    children: node.children.map(createYoga),
    node,
  }
}

function layout(yoga: YogaNode, x = 0, y = 0) {
  const { left, top, width, height } = yoga.layout
  const { node, children } = yoga
  node.frame = new Frame(x + left, y + top, width, height)
  node.props.onLayout && node.props.onLayout(node.frame)
  for (let i = 0; i < children.length; i++) {
    layout(children[i], node.frame.x, node.frame.y)
  }
}

