import { createElement } from 'react';
import type { NodeProps } from '../core/Node';

export default function View(props: NodeProps) {
  return createElement('View', props);
}
