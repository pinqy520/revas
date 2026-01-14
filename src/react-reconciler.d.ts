declare module 'react-reconciler' {
  export type OpaqueRoot = any;

  export interface Reconciler<
    Container,
    Instance,
    TextInstance,
    SuspenseInstance,
    PublicInstance
  > {
    createContainer(
      containerInfo: Container,
      tag: number,
      hydrationCallbacks: null | any,
      isStrictMode: boolean,
      concurrentUpdatesByDefaultOverride: null | boolean,
      identifierPrefix: string,
      onUncaughtError: (error: Error) => void,
      onCaughtError: (error: Error) => void,
      onRecoverableError: (error: Error) => void,
      transitionCallbacks: null | any
    ): OpaqueRoot;
    updateContainer(
      element: React.ReactNode,
      container: OpaqueRoot,
      parentComponent: React.Component<any, any> | null | undefined,
      callback?: (() => void) | null
    ): void;
    injectIntoDevTools(devToolsConfig: {
      bundleType: number;
      version: string;
      rendererPackageName: string;
      findHostInstanceByFiber?: (fiber: any) => Instance | null;
    }): boolean;
    findHostInstance(component: any): Instance | null;
  }

  export type HostConfig<
    Type,
    Props,
    Container,
    Instance,
    TextInstance,
    SuspenseInstance,
    HydratableInstance,
    PublicInstance,
    HostContext,
    UpdatePayload,
    ChildSet,
    TimeoutHandle,
    NoTimeout
  > = {
    supportsMutation: boolean;
    supportsPersistence: boolean;
    supportsHydration: boolean;
    isPrimaryRenderer: boolean;
    now: () => number;
    scheduleTimeout: typeof setTimeout;
    cancelTimeout: typeof clearTimeout;
    noTimeout: number;
    supportsMicrotasks: boolean;
    scheduleMicrotask: (fn: () => void) => void;
    getCurrentEventPriority: () => number;
    setCurrentUpdatePriority: (priority: number) => void;
    getCurrentUpdatePriority: () => number;
    resolveUpdatePriority: () => number;
    maySuspendCommit: (type: Type, props: Props) => boolean;
    preloadInstance: (type: Type, props: Props) => boolean;
    startSuspendingCommit: () => void;
    suspendInstance: (type: Type, props: Props) => void;
    waitForCommitToBeReady: () => null | ((cb: () => void) => void);
    NotPendingTransition: null;
    HostTransitionContext: any;
    resetFormInstance: (form: Instance) => void;
    trackSchedulerEvent: () => void;
    resolveEventType: () => null | string;
    resolveEventTimeStamp: () => number;
    shouldAttemptEagerTransition: () => boolean;
    createInstance: (
      type: Type,
      props: Props,
      rootContainer: Container,
      hostContext: HostContext,
      internalHandle: any
    ) => Instance;
    createTextInstance: (
      text: string,
      rootContainer: Container,
      hostContext: HostContext,
      internalHandle: any
    ) => TextInstance;
    appendChild: (parent: Instance, child: Instance | TextInstance) => void;
    appendInitialChild: (
      parent: Instance,
      child: Instance | TextInstance
    ) => void;
    appendChildToContainer: (
      container: Container,
      child: Instance | TextInstance
    ) => void;
    removeChild: (parent: Instance, child: Instance | TextInstance) => void;
    removeChildFromContainer: (
      container: Container,
      child: Instance | TextInstance
    ) => void;
    insertBefore: (
      parent: Instance,
      child: Instance | TextInstance,
      before: Instance | TextInstance
    ) => void;
    insertInContainerBefore: (
      container: Container,
      child: Instance | TextInstance,
      before: Instance | TextInstance
    ) => void;
    clearContainer: (container: Container) => void;
    finalizeInitialChildren: (
      instance: Instance,
      type: Type,
      props: Props,
      rootContainer: Container,
      hostContext: HostContext
    ) => boolean;
    getPublicInstance: (instance: Instance) => PublicInstance;
    prepareUpdate: (
      instance: Instance,
      type: Type,
      oldProps: Props,
      newProps: Props,
      rootContainer: Container,
      hostContext: HostContext
    ) => UpdatePayload | null;
    commitUpdate: (
      instance: Instance,
      updatePayload: UpdatePayload,
      type: Type,
      prevProps: Props,
      nextProps: Props,
      internalHandle: any
    ) => void;
    commitMount: (
      instance: Instance,
      type: Type,
      props: Props,
      internalHandle: any
    ) => void;
    prepareForCommit: (container: Container) => object | null;
    resetAfterCommit: (container: Container) => void;
    resetTextContent: (instance: Instance) => void;
    getRootHostContext: (rootContainer: Container) => HostContext;
    getChildHostContext: (parentHostContext: HostContext, type: Type) => HostContext;
    shouldSetTextContent: (type: Type, props: Props) => boolean;
    hideInstance: (instance: Instance) => void;
    hideTextInstance: (textInstance: TextInstance) => void;
    unhideInstance: (instance: Instance, props: Props) => void;
    unhideTextInstance: (textInstance: TextInstance, text: string) => void;
    getInstanceFromNode: (node: any) => Instance | null;
    beforeActiveInstanceBlur: () => void;
    afterActiveInstanceBlur: () => void;
    preparePortalMount: (container: Container) => void;
    prepareScopeUpdate: (scope: any, instance: Instance) => void;
    getInstanceFromScope: (scope: any) => Instance | null;
    detachDeletedInstance: (instance: Instance) => void;
  };

  function ReactReconciler<
    Type,
    Props,
    Container,
    Instance,
    TextInstance,
    SuspenseInstance,
    HydratableInstance,
    PublicInstance,
    HostContext,
    UpdatePayload,
    ChildSet,
    TimeoutHandle,
    NoTimeout
  >(
    config: Partial<
      HostConfig<
        Type,
        Props,
        Container,
        Instance,
        TextInstance,
        SuspenseInstance,
        HydratableInstance,
        PublicInstance,
        HostContext,
        UpdatePayload,
        ChildSet,
        TimeoutHandle,
        NoTimeout
      >
    >
  ): Reconciler<Container, Instance, TextInstance, SuspenseInstance, PublicInstance>;

  export default ReactReconciler;
}

declare module 'react-reconciler/constants' {
  export const DiscreteEventPriority: number;
  export const ContinuousEventPriority: number;
  export const DefaultEventPriority: number;
  export const IdleEventPriority: number;
}
