import ReactReconciler from 'react-reconciler';
import { Node, Container } from './Node'
import { appendChild, noop, updateLayout } from './utils'
import { drawRenderLayer } from './Draw';

const renderer = ReactReconciler<string, any, Container, Node, string, Node, Node | string, any, any, any, any, any>({
  supportsHydration: false,
  supportsPersistence: false,
  supportsMutation: true,

  createInstance(type, props) {
    return new Node(type, props);
  },

  createTextInstance(text) {
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

  prepareForCommit: noop,

  prepareUpdate() {
    return true;
  },

  commitUpdate(instance, updatePayload, type, oldProps, newProps) {
    instance.props = newProps
  },


  resetAfterCommit(container) {
    console.log(Date.now())
    updateLayout(container)[0]()
    const ctx = container.canvas.getContext('2d')!
    ctx.clearRect(0, 0, container.props.width, container.props.height);
    drawRenderLayer(ctx, container)
    console.log(Date.now(), container)
  },

  resetTextContent: noop,

  getRootHostContext() {
    return {}
  },

  getChildHostContext() {
    return {};
  },

  shouldSetTextContent: (type, props) => {
    return typeof props.children === 'string' || typeof props.children === 'number';
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


export default {
  render(app: React.ReactNode, canvas: HTMLCanvasElement) {
    const c = renderer.createContainer(new Container(canvas), false, false)
    return renderer.updateContainer(app, c, null, noop)
  }
}