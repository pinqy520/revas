import { Node, Frame } from '../Node'
import { getStyleFromNode } from '../utils'

const computeLayout = require('css-layout')

export interface YogaNode {
  node: Node,
  style: any, layout: any,
  children: YogaNode[]
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

export function updateLayout(root: Node) {
  const yogas = createYoga(root)
  yogas.style = root.props
  return () => {
    computeLayout(yogas)
    layout(yogas)
  }
}
