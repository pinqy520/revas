import ReactReconciler from 'react-reconciler';
import { Node } from './Node';
import { appendChild, noop, removeChild, insertBefore } from './utils';
import { Container } from './Container';

export const now =
  typeof performance === 'object' && typeof performance.now === 'function' ? () => performance.now() : () => Date.now();

export default ReactReconciler({
  supportsHydration: false,
  supportsPersistence: false,
  supportsMutation: true,
  isPrimaryRenderer: false,

  createInstance(type: string, props: any, container: Container) {
    return new Node(type, props);
  },

  createTextInstance() {
    throw new Error('Revas: string cannot be child out of <Text/>');
  },

  appendInitialChild: appendChild,
  appendChild,
  appendChildToContainer: appendChild,
  removeChild,
  removeChildFromContainer: removeChild,
  insertBefore,
  insertInContainerBefore: insertBefore,

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
    instance.props = newProps;
  },

  prepareForCommit: noop,

  resetAfterCommit(container: Container) {
    container.draw(true);
  },

  resetTextContent: noop,

  getRootHostContext() {
    return {};
  },

  getChildHostContext(parentHostContext: object) {
    return parentHostContext;
  },

  shouldSetTextContent() {
    return false;
  },

  shouldDeprioritizeSubtree: () => false,

  scheduleDeferredCallback: noop,
  cancelDeferredCallback: noop,
  setTimeout,
  clearTimeout,
  noTimeout: -1,
  now,
});
