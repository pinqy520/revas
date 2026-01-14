import ReactReconciler from 'react-reconciler';
import { DefaultEventPriority } from 'react-reconciler/constants';
import { version } from 'react';
import { Node } from './Node';
import { noop, now } from './utils';
import { Container } from './Container';

const isDev = process.env.NODE_ENV !== 'production';

// Track current update priority
let currentUpdatePriority = DefaultEventPriority;

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

const RevasReconciler = ReactReconciler({
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,
  isPrimaryRenderer: false,

  // Timing
  now,
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,
  supportsMicrotasks: true,
  scheduleMicrotask:
    typeof queueMicrotask === 'function' ? queueMicrotask : setTimeout,

  // Update priority (required for React 19)
  getCurrentEventPriority: () => DefaultEventPriority,
  setCurrentUpdatePriority: (priority: number) => {
    currentUpdatePriority = priority;
  },
  getCurrentUpdatePriority: () => currentUpdatePriority,
  resolveUpdatePriority: () => currentUpdatePriority || DefaultEventPriority,

  // Suspense commit control (required for React 19)
  maySuspendCommit: () => false,
  preloadInstance: () => true,
  startSuspendingCommit: noop,
  suspendInstance: noop,
  waitForCommitToBeReady: () => null,

  // Transitions (required for React 19)
  NotPendingTransition: null as null,
  HostTransitionContext: {
    $$typeof: Symbol.for('react.context'),
    _currentValue: null,
    _currentValue2: null,
  },
  resetFormInstance: noop,

  // Event tracking (required for React 19)
  trackSchedulerEvent: noop,
  resolveEventType: () => null,
  resolveEventTimeStamp: () => -1.1,
  shouldAttemptEagerTransition: () => false,

  // Instance creation
  createInstance(type: string, props: any) {
    return new Node(type, props);
  },

  createTextInstance() {
    throw new Error('Revas: string cannot be child out of <Text/>');
  },

  // Tree operations
  appendChild,
  appendInitialChild: appendChild,
  appendChildToContainer(container: Container, instance: Node) {
    if (instance.type !== 'Root') {
      throw new Error(`wrong root instance type: ${instance.type}`);
    }
    container.setRoot(instance);
  },

  removeChild(parent: Node, child: Node) {
    checkAndRemove(parent, child);
    child.parent = void 0;
  },
  removeChildFromContainer(container: Container) {
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
    // noop
  },

  // Finalization
  finalizeInitialChildren() {
    return false;
  },

  // Public instance
  getPublicInstance(instance: Node) {
    return instance;
  },

  // Updates
  prepareUpdate() {
    return true;
  },

  commitUpdate(
    instance: Node,
    _updatePayload: any,
    _type: string,
    oldProps: any,
    newProps: any
  ) {
    // Merge old props with new props, keeping old values for undefined new values
    // This handles React 19's behavior where unchanged props may be undefined
    const mergedProps = { ...oldProps };
    for (const key in newProps) {
      if (newProps[key] !== undefined) {
        mergedProps[key] = newProps[key];
      }
    }
    instance.props = mergedProps;
  },

  commitMount: noop,

  // Commit phase
  prepareForCommit() {
    return null;
  },

  resetAfterCommit(container: Container) {
    container.draw(true);
  },

  resetTextContent: noop,

  // Context
  getRootHostContext() {
    return {};
  },

  getChildHostContext(parentHostContext: object) {
    return parentHostContext;
  },

  shouldSetTextContent() {
    return false;
  },

  // Visibility (required for React 19 Offscreen)
  hideInstance: noop,
  hideTextInstance: noop,
  unhideInstance: noop,
  unhideTextInstance: noop,

  // Required stubs for React 19
  getInstanceFromNode() {
    return null;
  },

  beforeActiveInstanceBlur: noop,
  afterActiveInstanceBlur: noop,
  preparePortalMount: noop,
  prepareScopeUpdate: noop,

  getInstanceFromScope() {
    return null;
  },

  detachDeletedInstance: noop,
});

RevasReconciler.injectIntoDevTools({
  bundleType: isDev ? 1 : 0,
  version: version,
  rendererPackageName: 'revas',
  findHostInstanceByFiber: RevasReconciler.findHostInstance,
});

export default RevasReconciler;
