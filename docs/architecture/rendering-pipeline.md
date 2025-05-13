---
# AI Metadata Tags
ai_keywords:
  [
    rendering,
    pipeline,
    react,
    canvas,
    reconciler,
    node tree,
    layout,
    drawing,
    updates,
  ]
ai_contexts: [architecture, implementation]
ai_relations:
  [
    docs/architecture/system-overview.md,
    docs/modules/core/reconciler.md,
    docs/modules/core/node.md,
    docs/modules/core/draw.md,
    docs/modules/core/canvas.md,
    docs/modules/styling/css-layout.md,
    docs/modules/styling/yoga-layout.md,
  ]
---

# Revas Rendering Pipeline

This document details the step-by-step process by which Revas transforms React components written by a developer into visible pixels on an HTML5 Canvas. Understanding this pipeline is crucial for grasping how Revas works internally and for debugging rendering-related issues.

<!-- AI-IMPORTANCE:level=critical -->

## Overview of the Pipeline

The Revas rendering pipeline can be broadly divided into the following stages:

1.  **React Reconciliation:** Processing React component trees and changes.
2.  **Revas Node Tree Construction/Update:** Translating React elements into an internal tree of `Node` objects.
3.  **Layout Calculation:** Determining the size and position of each `Node`.
4.  **Drawing/Painting:** Traversing the `Node` tree and issuing drawing commands to the canvas.
<!-- AI-IMPORTANCE:level=critical -->

Let's explore each stage in detail.

---

<!-- AI-CONTEXT-START:type=architecture -->

## Stage 1: React Reconciliation

This stage is driven by React itself and the custom Revas reconciler ([`src/revas/core/reconciler.ts`](../../src/revas/core/reconciler.ts:1)).

1.  **Component Instantiation/Update:**

    - When a Revas application is first rendered or when a component's state/props change, React's core reconciliation algorithm ("Fiber") runs.
    - React determines what changes need to be made to the UI (e.g., new components to mount, existing ones to update, or components to unmount).

2.  **Invoking Host Config Methods:**
    - Instead of creating DOM elements, React, through the `react-reconciler`, calls methods defined in Revas's "host config."
    - Key host config methods involved:
      - `createInstance(type, props)`: Called when a new Revas primitive component (e.g., `<View>`, `<Text>`) needs to be rendered. This method in Revas creates a new `Node` instance ([`../../src/revas/core/Node.ts`](../../src/revas/core/Node.ts:1)).
      - `appendInitialChild(parentInstance, child)` / `appendChild(parentInstance, child)`: Called to add a child `Node` to a parent `Node`.
      - `removeChild(parentInstance, child)`: Called to remove a child `Node`.
      - `commitUpdate(instance, updatePayload, type, oldProps, newProps)`: Called when an existing `Node`'s props have changed. Revas updates the `props` property on the `Node` instance.
      - `appendChildToContainer(container, child)` / `removeChildFromContainer(container, child)`: Manage the root node within the main `Container`.

<!-- AI-IMPORTANCE:level=high -->

**Outcome of Stage 1:** An up-to-date internal tree of Revas `Node` objects that mirrors the structure of the rendered React component tree. Each `Node` holds its `type` (e.g., "View"), `props` (including styles), and references to its parent and children.

<!-- AI-IMPORTANCE:level=high -->
<!-- AI-CONTEXT-END -->

---

<!-- AI-CONTEXT-START:type=architecture -->

## Stage 2: Revas Node Tree Construction/Update

This stage is a direct consequence of Stage 1, as the host config methods manipulate the Revas `Node` tree.

1.  **Node Creation:** For each Revas primitive component in the React tree, a corresponding `Node` object is instantiated.

    - `new Node(type, props)` stores the component type (e.g., 'View') and its given properties.

2.  **Tree Linkage:** Parent-child relationships are established.

    - `node.children.push(childNode)` and `childNode.parent = node` create the tree structure.

3.  **Props Update:** When React components update, their new props are assigned to the corresponding `Node` instances.

<!-- AI-CONTEXT-START:type=implementation -->

**Implementation Detail:** The `Node` class itself is relatively simple, primarily acting as a data container and a structural element in the tree. It doesn't contain rendering or layout logic itself but holds the necessary information for those stages.

<!-- AI-CONTEXT-END -->

**Outcome of Stage 2:** A fully constructed or updated tree of `Node` objects in memory. This tree represents the current state of the UI.

---

<!-- AI-CONTEXT-START:type=architecture -->

## Stage 3: Layout Calculation

Once the `Node` tree reflects the current UI state, the layout system calculates the dimensions and position of each `Node`. This is primarily handled by the `Container` instance ([`../../src/revas/core/Container.ts`](../../src/revas/core/Container.ts:1)) which typically initiates layout on its root node.

1.  **Style Aggregation:** Styles (from `props.style`) for each `Node` are processed. These styles include layout properties like `width`, `height`, `flex`, `margin`, `padding`, etc.

2.  **Layout Engine Invocation:**

    - Revas can use either its JavaScript-based CSS layout ([`../../src/revas/core/css-layout/index.ts`](../../src/revas/core/css-layout/index.ts:1)) or Yoga Layout ([`../../src/revas/core/yoga-layout/index.ts`](../../src/revas/core/yoga-layout/index.ts:1)).
    - The chosen layout engine takes the `Node` tree (or a representation of it) and the associated style information.
    - It computes the `x`, `y`, `width`, and `height` for each `Node` based on Flexbox and other CSS layout rules.

3.  **Frame Update:**
    - The calculated layout (position and dimensions) is stored in the `frame` property (an instance of `Frame` class from [`../../src/revas/core/Node.ts`](../../src/revas/core/Node.ts:3)) of each `Node`.
    - The `frame` property usually contains coordinates relative to the parent `Node`.

<!-- AI-IMPORTANCE:level=high -->

**Outcome of Stage 3:** Every `Node` in the tree now has an updated `frame` object specifying its exact position and size on the canvas.

<!-- AI-IMPORTANCE:level=high -->
<!-- AI-CONTEXT-END -->

---

<!-- AI-CONTEXT-START:type=architecture -->

## Stage 4: Drawing/Painting

After layout calculation, the `Node` tree is ready to be rendered onto the canvas. This process is managed by the `Container`'s `draw()` method, which typically calls the main drawing function from [`../../src/revas/core/draw.ts`](../../src/revas/core/draw.ts:1).

1.  **Canvas Preparation:**

    - The `RevasCanvas` ([`../../src/revas/core/Canvas.ts`](../../src/revas/core/Canvas.ts:1)) might clear the previous frame (or parts of it).
    - Global canvas transformations (like device pixel ratio scaling) are applied.

2.  **Node Tree Traversal:**

    - The `drawNode` function in [`../../src/revas/core/draw.ts`](../../src/revas/core/draw.ts:1) is recursively called, usually starting from the root `Node`.
    - Children are typically drawn after their parent, respecting `zIndex` where applicable.

3.  **Individual Node Drawing:** For each `Node`:
    - **Style Interpretation:** The `Node`'s styles (background color, border, opacity, text properties, image source, etc.) are read.
    - **Canvas State Setup:**
      - The `RevasCanvas` context is configured based on the `Node`'s styles (e.g., `ctx.fillStyle`, `ctx.globalAlpha`).
      - Transformations (translate, rotate, scale) specific to the `Node` are applied to the canvas context, using its `frame` for positioning.
    - **Clipping:** If `overflow: 'hidden'` is set, a clipping region is applied.
    - **Caching Check:**
      - If the `Node` has `props.cache` enabled and a valid cache exists in the offscreen cache ([`../../src/revas/core/offscreen.ts`](../../src/revas/core/offscreen.ts:1)), the cached image is drawn directly to the main canvas.
      - If no cache exists or it's invalid, the `Node` and its children are drawn to an offscreen canvas first (which is then cached), and then this offscreen canvas is drawn to the main canvas.
    - **Drawing Primitives:**
      - Based on the `Node`'s `type` and styles, appropriate HTML5 Canvas API drawing commands are issued:
        - `View`: `ctx.fillRect()`, `ctx.strokeRect()` for background and borders.
        - `Text`: `ctx.fillText()` for text content (drawing logic in [`../../src/revas/components/common/drawText.ts`](../../src/revas/components/common/drawText.ts:1)).
        - `Image`: `ctx.drawImage()` for images (loading logic in [`../../src/revas/components/common/imageLoader.ts`](../../src/revas/components/common/imageLoader.ts:1), drawing in [`../../src/revas/components/common/drawImage.ts`](../../src/revas/components/common/drawImage.ts:1)).
        - `LinearGradient`: `ctx.createLinearGradient()` and `ctx.fillRect()`.
    - **Children Rendering:** Recursively calls `drawNode` for child `Node`s.
    - **Canvas State Restoration:** Transformations and other canvas states are restored after the `Node` and its children are drawn.

<!-- AI-IMPORTANCE:level=critical -->

**Outcome of Stage 4:** The visual representation of the React component tree is rendered as pixels on the HTML5 Canvas element.

<!-- AI-IMPORTANCE:level=critical -->
<!-- AI-CONTEXT-END -->

---

## Update Cycle

When a React component updates:

1.  React informs the Revas reconciler (Stage 1).
2.  The reconciler updates the `Node` tree (Stage 2).
3.  The `Container` typically invalidates the layout and schedules a new draw.
4.  Layout is recalculated for the affected `Node`s (Stage 3).
5.  The `Container`'s `draw()` method is called, re-painting the canvas with the updated `Node` tree information (Stage 4). Revas attempts to optimize this by only re-drawing what's necessary, often aided by the offscreen caching mechanism.

This pipeline ensures that changes in the React component state are efficiently translated into visual updates on the canvas.
