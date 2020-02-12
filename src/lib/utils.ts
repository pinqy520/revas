import Yoga from 'yoga-layout-prebuilt'
import { Node, ChildNode } from './Node'

export function noop() { }

export function appendChild(parent: Node, child: ChildNode) {
  parent.children.push(child)
  if (child instanceof Node) {
    child.parent = parent
  }
}

export function updateLayout(root: Node): [Function, Yoga.YogaNode] {
  const yoga = Yoga.Node.create()
  const children: Function[] = []
  applyYogaStyle(yoga, root.props)
  yoga.setDisplay(Yoga.DISPLAY_FLEX);
  for (let i = 0; i < root.children.length; i++) {
    const child = root.children[i]
    if (child instanceof Node) {
      const [f, y] = updateLayout(child)
      const index = children.push(f)
      yoga.insertChild(y, index - 1)
    }
  }
  function process() {
    if (!root.parent) {
      yoga.calculateLayout(root.props.width, root.props.height)
    }
    root.layout = yoga.getComputedLayout()
    children.forEach(c => c())
  }
  return [process, yoga]
}

const availableStyle = new Set([
  'width',
  'height',
  'minWidth',
  'maxWidth',
  'minHeight',
  'maxHeight',
  'justifyContent',
  'alignItems',
  'alignSelf',
  'alignContent',
  'flexGrow',
  'flexShrink',
  'positionType',
  'aspectRatio',
  'flexWrap',
  'flexDirection',
])

const availableEdge = new Set(['padding', 'margin', 'position', 'border'])

function set(str: string) {
  return `set${str[0].toUpperCase()}${str.substr(1)}`
}

function applyYogaStyle(yoga: any, style: any) {
  Object.keys(style).forEach(key => {
    if (availableStyle.has(key)) {
      const value = style[key];
      value && yoga[set(key)](value);
    } else if (availableEdge.has(key)) {
      ['top', 'right', 'bottom', 'left'].forEach(direction => {
        style[key] && style[key][direction] && yoga[set(key)](
          (Yoga as any)[`EDGE_${direction.toUpperCase()}`],
          style[key][direction],
        );
      });
    }
  });
  yoga.setDisplay(Yoga.DISPLAY_FLEX);
}