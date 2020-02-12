import Yoga from 'yoga-layout-prebuilt'
import { Node } from './Node'

export function noop() { }

const AVAILABLE = {
  STYLE: [
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
  ],
  EDGE: ['padding', 'margin', 'position', 'border'],
  DIRECTION: ['top', 'right', 'bottom', 'left']
}

function set(key: string) {
  return `set${key[0].toUpperCase()}${key.substr(1)}`
}

function applyYogaStyle(yoga: any, style: any) {
  AVAILABLE.STYLE.forEach(key => {
    const value = style[key];
    value && yoga[set(key)](value);
  });
  AVAILABLE.EDGE.forEach(key => {
    AVAILABLE.DIRECTION.forEach(direction => {
      style[key] && style[key][direction] && yoga[set(key)](
        (Yoga as any)[`EDGE_${direction.toUpperCase()}`],
        style[key][direction],
      );
    });
  });
  yoga.setDisplay(Yoga.DISPLAY_FLEX);
}

export function appendChild(parent: Node, child: Node | string) {
  if (child instanceof Node) {
    parent.children.push(child)
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