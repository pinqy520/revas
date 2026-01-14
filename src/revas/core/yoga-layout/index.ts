import Yoga, { Node as YogaNode, Direction } from 'yoga-layout';
import { Node, Frame } from '../Node';
import apply from './style';
import { AppContextType } from '../../components/Context';

function _updateLayout(node: Node): [(x?: number, y?: number) => void, YogaNode] {
  const yoga = Yoga.Node.create();
  const children: Array<(x?: number, y?: number) => void> = [];
  apply(yoga, node.props.style);
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    const [f, y] = _updateLayout(child);
    const index = children.push(f);
    yoga.insertChild(y, index - 1);
  }
  function process(x = 0, y = 0) {
    const layout = yoga.getComputedLayout();
    node.frame = new Frame(x + layout.left, y + layout.top, layout.width, layout.height);
    node.props.onLayout && node.props.onLayout(node.frame);
    for (let i = 0; i < children.length; i++) {
      children[i](node.frame.x, node.frame.y);
    }
    yoga.free();
  }
  return [process, yoga];
}

export function updateLayout(root: Node<AppContextType>) {
  const [process, yoga] = _updateLayout(root);
  const { clientWidth, clientHeight, RTL } = root.props;
  yoga.calculateLayout(clientWidth, clientHeight, RTL ? Direction.RTL : Direction.LTR);
  return process;
}
