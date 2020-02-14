import ReactReconciler from 'react-reconciler';
import { Node } from './Node'
import { appendChild, noop } from '../common/utils'
import { Container } from './Container';

export default ReactReconciler({
  supportsHydration: false,
  supportsPersistence: false,
  supportsMutation: true,
  isPrimaryRenderer: true,

  createInstance(type: string, props: any) {
    return new Node(type, props);
  },

  createTextInstance(text: string) {
    return text;
  },

  appendInitialChild: appendChild,
  appendChild: appendChild,
  appendChildToContainer: appendChild,

  finalizeInitialChildren() {
    return false;
  },

  getPublicInstance(instance) {
    return instance;
  },

  prepareUpdate() {
    return true;
  },

  commitUpdate(instance, updatePayload, type, oldProps, newProps) {
    instance.props = newProps
  },

  prepareForCommit: noop,

  resetAfterCommit(container: Container) {
    container.draw()
  },

  resetTextContent: noop,

  getRootHostContext() {
    return {}
  },

  getChildHostContext() {
    return {};
  },

  shouldSetTextContent() {
    return false
  },

  shouldDeprioritizeSubtree: () => false,

  scheduleDeferredCallback: noop,
  cancelDeferredCallback: noop,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  noTimeout: -1,
  now: Date.now,
})
