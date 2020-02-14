import ReactReconciler from 'react-reconciler';
import { Node, Container } from './Node'
import { appendChild, noop } from './utils'
import { drawRenderLayer } from '../common/draw';
import { updateLayout } from './layout';

export default ReactReconciler({
  supportsHydration: false,
  supportsPersistence: false,
  supportsMutation: true,

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
    const start = performance.now()
    updateLayout(container)()
    const ctx = container.canvas.getContext('2d')!
    ctx.clearRect(0, 0, container.props.width, container.props.height);
    drawRenderLayer(ctx, container)
    console.log(performance.now() - start, container)
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

  shouldDeprioritizeSubtree: () => true,

  isPrimaryRenderer: false,

  scheduleDeferredCallback: noop,
  cancelDeferredCallback: noop,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  noTimeout: noop,
  now: Date.now,
})
