import ReactReconciler from 'react-reconciler';
import { Node, ChildNode } from './Node'
import { appendChild, noop, updateLayout } from './utils'

const renderer = ReactReconciler<string, any, Node, Node, string, Node, ChildNode, any, any, any, any, any>({
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
  render(app: React.ReactNode, container: any) {
    const c = renderer.createContainer(container, false, false)
    return renderer.updateContainer(app, c, null, noop)
  }
}