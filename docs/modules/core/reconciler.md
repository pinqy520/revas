---
# AI Metadata Tags
ai_keywords:
  [
    reconciler,
    react-reconciler,
    host config,
    fiber,
    node tree,
    custom renderer,
    revas core,
  ]
ai_contexts: [architecture, implementation]
ai_relations:
  [
    docs/architecture/system-overview.md,
    docs/architecture/rendering-pipeline.md,
    docs/modules/core/node.md,
    docs/modules/core/container.md,
    'https://reactjs.org/docs/reconciliation.html',
    'https://github.com/facebook/react/tree/main/packages/react-reconciler',
  ]
---

# Revas Custom React Reconciler

The custom React reconciler is the central piece of Revas that enables React components to drive rendering on an HTML5 Canvas instead of the DOM. It's implemented using the `react-reconciler` package.

<!-- AI-IMPORTANCE:level=critical -->

## Purpose and Role

The primary purpose of the Revas reconciler ([`../../../src/revas/core/reconciler.ts`](../../../src/revas/core/reconciler.ts:1)) is to:

**Interface with React:** Act as a bridge between React's core reconciliation algorithm (Fiber) and Revas's internal scene graph (the `Node` tree).
**Manage Host Instances:** Instead of DOM elements, the "host instances" managed by this reconciler are Revas `Node` objects ([`../../../src/revas/core/Node.ts`](../../../src/revas/core/Node.ts:1)). 3. **Translate React Operations:** Convert React operations (e.g., mount component, update props, add child) into manipulations of the Revas `Node` tree. 4. **Decouple React from Canvas:** Allow React to operate without any direct knowledge of the canvas, promoting a clean separation of concerns.

<!-- AI-IMPORTANCE:level=critical -->

---

<!-- AI-CONTEXT-START:type=architecture -->

## Host Configuration

The `react-reconciler` package requires a "host config" object. This object provides a set of functions that React will call at different stages of the reconciliation process. Revas defines this host config in [`../../../src/revas/core/reconciler.ts`](../../../src/revas/core/reconciler.ts:76).

Key methods implemented in Revas's host config include:

- **`createInstance(type, props)`:**

  - **React Call:** When React encounters a new Revas primitive element (e.g., `<View style={{...}}>`).
  - **Revas Action:** Creates a new `Node` instance (`new Node(type, props)`). The `type` is a string like "View", "Text", etc., and `props` are the properties passed to the React element.
  - **Returns:** The newly created `Node` instance.

- **`createTextInstance(text, rootContainerInstance, hostContext, internalInstanceHandle)`:**

  - **React Call:** If React encounters raw text outside a `<Text>` component.
  - **Revas Action:** Throws an error because Revas requires all text to be within a `<Text>` component for proper styling and layout.

- **`appendInitialChild(parentInstance, child)` / `appendChild(parentInstance, child)`:**

  - **React Call:** When a child element is added to a parent element.
  - **Revas Action:** Adds the child `Node` to the `children` array of the parent `Node` and sets the `parent` property on the child `Node`.

- **`appendChildToContainer(container, child)`:**

  - **React Call:** When the root element of the application is added to the main container.
  - **Revas Action:** Sets the root `Node` on the Revas `Container` instance ([`../../../src/revas/core/Container.ts`](../../../src/revas/core/Container.ts:1)). The `Container` is the top-level object that manages the entire Revas scene.

- **`removeChild(parentInstance, child)` / `removeChildFromContainer(container, child)`:**

  - **React Call:** When an element is removed.
  - **Revas Action:** Removes the child `Node` from its parent's `children` array (or clears the root `Node` from the `Container`).

- **`insertBefore(parentInstance, child, beforeChild)`:**

  - **React Call:** When an element is inserted before another sibling.
  - **Revas Action:** Inserts the child `Node` into the parent's `children` array at the correct position.

- **`commitUpdate(instance, updatePayload, type, oldProps, newProps)`:**

  - **React Call:** When the props of an existing element change.
  - **Revas Action:** Updates the `props` property of the target `Node` instance with `newProps`. Revas doesn't use `updatePayload` directly here but relies on the new props for the subsequent layout and draw phases.
  - **Returns:** `true` if an update is needed (Revas always returns true as it handles diffing in draw/layout).

- **`finalizeInitialChildren(parentInstance, type, props, rootContainerInstance, hostContext)`:**

  - **React Call:** After all children of an instance have been mounted.
  - **Revas Action:** Returns `false` (no mutations needed at this stage based on children).

- **`prepareForCommit(containerInfo)` / `resetAfterCommit(containerInfo)`:**

  - **React Call:** Before and after the "commit phase" (when changes are applied to the host environment).
  - **Revas Action:**
    - `prepareForCommit`: Returns `null` (no preparation needed).
    - `resetAfterCommit`: This is a crucial step. Revas calls `container.draw(true)` here. This triggers the layout calculation and drawing process for the entire scene, effectively rendering the committed changes to the canvas.

- **`getRootHostContext(rootContainerInstance)` / `getChildHostContext(parentHostContext, type, rootContainerInstance)`:**

  - Manages context information passed down the tree during rendering. Revas uses a simple empty object `{}` as it doesn't rely on this for passing contextual data for its core primitives. Context for Revas components is typically handled via React's Context API.

- **`shouldSetTextContent(type, props)`:**

  - **Revas Action:** Returns `false` because text content is handled by the `<Text>` component's specific drawing logic, not by setting a generic `textContent` property on a `Node`.

- **Other Methods:** Many other methods related to scheduling, hydration (not supported), persistence (not supported), and dev tools are also part of the host config, some implemented as no-ops if not relevant to Revas's rendering model.
<!-- AI-CONTEXT-END -->

---

<!-- AI-CONTEXT-START:type=implementation -->

## Integration with Revas Core

1.  **Initialization:** When `Revas.render(app, domContainer)` is called (e.g., in [`../../../src/revas/web/render.ts`](../../../src/revas/web/render.ts:76)), a `Container` instance is created. Then, `RevasReconciler.createContainer(container, false, false)` creates a Fiber root associated with this `Container`.

2.  **Updates:** `RevasReconciler.updateContainer(reactElement, fiberRoot, parentComponent, callback)` is called to initiate rendering or update the React component tree.

3.  **Commit Phase Trigger:** After React completes its reconciliation (diffing what changed), it enters the commit phase. The `resetAfterCommit` host config method is called, which in Revas, triggers `container.draw(true)`.

4.  **Drawing:** The `container.draw(true)` call initiates:
    - Layout calculation for the entire `Node` tree (or the parts that need it).
    - The actual painting of the `Node` tree onto the `RevasCanvas` via the drawing system ([`../../../src/revas/core/draw.ts`](../../../src/revas/core/draw.ts:1)).

<!-- AI-IMPORTANCE:level=high -->

This design effectively means that React is responsible for managing the component tree structure and state, while the Revas reconciler translates these high-level descriptions into a concrete `Node` tree. The actual rendering (layout and paint) is then performed by Revas's own systems, triggered after React's commit phase.

<!-- AI-IMPORTANCE:level=high -->
<!-- AI-CONTEXT-END -->

## Benefits of this Approach

- **Leverages React's Strengths:** Utilizes React's efficient reconciliation, component model, and state management.
- **Platform Agnostic Core:** The core reconciler logic and `Node` system are not tied to the web canvas specifically, opening possibilities for other rendering targets (though currently web-focused).
- **Developer Experience:** Developers can use familiar React patterns.

By abstracting the "host environment" to be its internal `Node` tree and canvas, Revas provides a powerful way to build complex, interactive UIs outside the traditional DOM.
