import ReactReconciler, { DevToolsConfig } from 'react-reconciler';
import { version } from 'react';
import { Node } from './Node';
import { noop, now } from './utils';
import { Container } from './Container';

const isDev = process.env.NODE_ENV !== 'production';

function checkAndRemove(parent: Node, child: Node) {
  const index = parent.children.indexOf(child);
  if (index >= 0) {
    parent.children.splice(index, 1);
  }
}

function appendChild(parent: Node, child: Node) {
  checkAndRemove(parent, child);
  parent.children.push(child);
  child.parent = parent;
}

const unused: any = {
  unhideTextInstance() {
    // noop
  },

  mountEventComponent() {
    // noop
  },

  getFundamentalComponentInstance() {
    throw new Error('Not yet implemented.');
  },

  mountFundamentalComponent() {
    throw new Error('Not yet implemented.');
  },

  shouldUpdateFundamentalComponent() {
    throw new Error('Not yet implemented.');
  },

  unmountFundamentalComponent() {
    throw new Error('Not yet implemented.');
  },

  getInstanceFromNode() {
    throw new Error('Not yet implemented.');
  },

  isOpaqueHydratingObject() {
    throw new Error('Not yet implemented');
  },

  makeOpaqueHydratingObject() {
    throw new Error('Not yet implemented.');
  },

  makeClientIdInDEV() {
    throw new Error('Not yet implemented');
  },

  beforeActiveInstanceBlur() {
    // noop
  },

  afterActiveInstanceBlur() {
    // noop
  },

  preparePortalMount() {
    // noop
  },
};

const RevasReconciler = ReactReconciler({
  supportsHydration: false,
  supportsPersistence: false,
  supportsMutation: true,
  isPrimaryRenderer: false,

  ...unused,

  createInstance(type: string, props: any) {
    return new Node(type, props);
  },

  createTextInstance() {
    throw new Error('Revas: string cannot be child out of <Text/>');
  },

  appendChild,
  appendInitialChild: appendChild,
  appendChildToContainer(container: Container, instance: any) {
    if (instance.type !== 'Root') {
      throw new Error(`wrong root instance type: ${instance.type}`);
    }
    container.setRoot(instance);
  },

  removeChild(parent: Node, child: Node) {
    checkAndRemove(parent, child);
    child.parent = void 0;
  },
  removeChildFromContainer(container) {
    container.setRoot();
  },

  insertBefore(parent: Node, child: Node, before: Node) {
    checkAndRemove(parent, child);
    const beforeIndex = parent.children.indexOf(before);
    parent.children.splice(beforeIndex, 0, child);
    child.parent = parent;
  },

  insertInContainerBefore() {
    throw new Error("shouldn't be here: insertInContainerBefore");
  },

  clearContainer() {
    // TODO implement this
  },

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

  prepareForCommit() {
    return null;
  },

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

RevasReconciler.injectIntoDevTools({
  bundleType: isDev ? 1 : 0,
  version: version,
  rendererPackageName: 'revas-react',

  // could not get this typed.
  // The above `DevToolsConfig` is a generic expecting an `Instance`
  // and `TextInstance` type, but I didn't see these declared anywhere

  // @ts-ignore
  findHostInstanceByFiber: RevasReconciler.findHostInstance,
});

export default RevasReconciler;
