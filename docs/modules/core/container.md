---
# AI Metadata Tags
ai_keywords:
  [
    container,
    root node,
    scene manager,
    event dispatch,
    drawing trigger,
    layout trigger,
    RevasTouchEvent,
  ]
ai_contexts: [architecture, implementation]
ai_relations:
  [
    docs/modules/core/node.md,
    docs/modules/core/reconciler.md,
    docs/modules/core/draw.md,
    docs/modules/core/canvas.md,
    docs/architecture/event-handling.md,
    docs/architecture/rendering-pipeline.md,
  ]
---

# Revas Container

The `Container` class, defined in [`../../../src/revas/core/Container.ts`](../../../src/revas/core/Container.ts:1), acts as the root manager for a Revas application instance. It holds the root of the `Node` tree and orchestrates key processes like drawing, layout updates, and touch event dispatching.

<!-- AI-IMPORTANCE:level=critical -->

## Purpose and Role

1.  **Root Node Management:** The `Container` holds a reference to the single root `Node` of the Revas UI tree.
2.  **Drawing Orchestration:** It's responsible for initiating the drawing process that renders the entire `Node` tree onto the `RevasCanvas`.
3.  **Layout Initiation:** Although layout logic might reside elsewhere (e.g., in specific layout engines or utility functions), the `Container` often triggers the layout calculation for the `Node` tree.
4.  **Event Hub:** Acts as the primary recipient of normalized `RevasTouchEvent`s from the environment (e.g., the web renderer) and dispatches them to the appropriate `Node`s in the tree.
5.  **Interface for Reconciler:** The Revas custom reconciler interacts with the `Container` to mount the root `Node` (via `appendChildToContainer`) and to trigger rendering after React commits changes (via `resetAfterCommit` which calls `container.draw()`).
<!-- AI-IMPORTANCE:level=critical -->

---

<!-- AI-CONTEXT-START:type=architecture -->

## Key Responsibilities and Interactions

### 1. Root Node Management

- **`setRoot(node?: Node)`:** This method is called by the Revas reconciler (specifically, `appendChildToContainer` and `removeChildFromContainer` host config methods) to set or clear the root `Node` of the UI.
- The `Container` stores this root `Node` (e.g., in a `this.rootNode` property). All traversals for drawing, layout, and event handling begin from this root `Node`.

### 2. Drawing Orchestration

- **`draw(forceLayout?: boolean)`:** This is a crucial method. When called, it orchestrates the rendering of the current state of the `Node` tree to the canvas.
  - It typically first ensures layout is up-to-date. If `forceLayout` is true or if a layout invalidation flag is set, it will trigger a layout calculation pass on the `Node` tree.
  - After layout, it invokes the main drawing logic (e.g., `drawNode` from [`../../../src/revas/core/draw.ts`](../../../src/revas/core/draw.ts:1)), passing the `RevasCanvas` associated with this `Container` and its root `Node`.
  - This method is called by `resetAfterCommit` in the reconciler, ensuring the canvas reflects React's committed state. It can also be called manually if needed, for example, for animations that don't involve React state changes.

<!-- AI-CONTEXT-START:type=implementation -->

```typescript
// Simplified conceptual structure of Container
import { Node, RevasTouchEvent } from './Node';
import { RevasCanvas } from './Canvas';
import { drawNode } from './draw';
// import { calculateLayout } from './layout'; // Hypothetical layout function

export class Container {
  private rootNode?: Node;
  private canvas: RevasCanvas; // Assuming canvas is associated or passed

  constructor(canvas: RevasCanvas) {
    this.canvas = canvas;
  }

  setRoot(node?: Node) {
    this.rootNode = node;
  }

  draw(forceLayout: boolean = false) {
    if (!this.rootNode) return;

    if (forceLayout /* || this.isLayoutInvalid */) {
      // calculateLayout(this.rootNode, this.canvas.clientWidth, this.canvas.clientHeight);
      // Actual layout call might be more complex or integrated
      this.rootNode.props.onLayout?.(this.rootNode.frame); // Example: top level onLayout
    }

    // Clear canvas (or parts of it)
    // this.canvas.context.clearRect(0, 0, this.canvas.element.width, this.canvas.element.height);

    drawNode(this.canvas, this.rootNode, this);
  }

  handleTouch(event: RevasTouchEvent) {
    if (!this.rootNode) return;
    // Hit testing and event dispatch logic...
    // (Described in detail in docs/architecture/event-handling.md)
  }
}
```

<!-- AI-CONTEXT-END -->

### 3. Layout Initiation

- While the `Container` itself might not contain the complex layout algorithms, its `draw()` method is often the point where a layout pass is initiated before drawing.
- It needs to know the dimensions of the viewport (e.g., canvas client width/height) to provide as constraints to the layout engine.

### 4. Touch Event Handling

- **`handleTouch(event: RevasTouchEvent)`:** This method is the entry point for all touch interactions.
  - It receives a normalized `RevasTouchEvent` from the top-level event listeners (e.g., from [`../../../src/revas/web/render.ts`](../../../src/revas/web/render.ts:1)).
  - It then performs hit testing by traversing the `Node` tree (starting from `this.rootNode`).
  - It identifies the target `Node`(s) based on event coordinates, `Node` frames, and `pointerEvents` properties.
  - Finally, it dispatches the event to the appropriate handlers on the target `Node`(s) and simulates event bubbling.
  - The detailed logic for this is covered in [`../../architecture/event-handling.md`](../../architecture/event-handling.md:1).

---

<!-- AI-CONTEXT-START:type=implementation -->

## Context and Initialization

- A `Container` instance is typically created when a Revas application is initialized. For example, in [`../../../src/revas/web/render.ts`](../../../src/revas/web/render.ts:76), `new Container()` is created.
- It might be associated with a specific `RevasCanvas` instance upon creation or have one passed to its methods.
- The Revas reconciler is then linked to this `Container` instance: `renderer.createContainer(container, false, false)`.

The `Container` effectively acts as the "stage manager" for a Revas UI instance, coordinating the efforts of the reconciler, layout engine, drawing system, and event handling mechanisms to bring the React components to life on the canvas.

<!-- AI-CONTEXT-END -->
