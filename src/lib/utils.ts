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

function _updateLayout(node: Node): [Function, Yoga.YogaNode] {
  const yoga = Yoga.Node.create()
  const children: Function[] = []
  applyYogaStyle(yoga, node.props)
  yoga.setDisplay(Yoga.DISPLAY_FLEX);
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i]
    const [f, y] = _updateLayout(child)
    const index = children.push(f)
    yoga.insertChild(y, index - 1)
  }
  function process() {
    if (!node.parent) {
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

export class Frame {
  constructor(
    public x = 0,
    public y = 0,
    public width = 0,
    public height = 0
  ) { }
}


export function getStyleAndFrameFromNode(node: Node) {
  const { props: style, layout } = node
  const frame = layout
    ? new Frame(layout.left, layout.top, layout.width, layout.height)
    : new Frame()
  return [style, frame]
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
};
