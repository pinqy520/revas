---
# AI Metadata Tags
ai_keywords:
  [
    node,
    Node class,
    scene graph,
    component tree,
    frame,
    props,
    RevasTouchEvent,
    pointerEvents,
  ]
ai_contexts: [architecture, implementation]
ai_relations:
  [
    docs/modules/core/reconciler.md,
    docs/modules/core/container.md,
    docs/modules/core/draw.md,
    docs/architecture/rendering-pipeline.md,
    docs/architecture/event-handling.md,
  ]
---

# Revas Node System (`Node` Class)

The `Node` class, defined in [`../../../src/revas/core/Node.ts`](../../../src/revas/core/Node.ts:1), is a fundamental building block in the Revas architecture. Instances of `Node` form an internal tree structure (often called a scene graph or element tree) that represents the UI hierarchy managed by Revas. This tree is analogous to the DOM in web browsers or the shadow node tree in React Native.

<!-- AI-IMPORTANCE:level=critical -->

## Purpose and Role

1.  **Internal UI Representation:** Each `Node` instance corresponds to a Revas primitive component (e.g., `<View>`, `<Text>`) in the React component tree.
2.  **Data Container:** Stores essential information about a UI element, including:
    - Its `type` (e.g., "View", "Text").
    - Its `props` received from the React component, including `style` information.
    - Its calculated layout (`frame`: position and dimensions).
    - References to its `parent` and `children` `Node`s, forming the tree structure.
3.  **Basis for Layout and Rendering:** The `Node` tree is traversed by the layout engine to calculate positions and sizes, and then by the drawing system to render elements onto the canvas.
4.  **Event Target:** `Node`s serve as potential targets for touch events, facilitating interactivity.
<!-- AI-IMPORTANCE:level=critical -->

---

<!-- AI-CONTEXT-START:type=implementation -->

## `Node` Class Definition

A simplified look at the `Node` class structure from [`../../../src/revas/core/Node.ts`](../../../src/revas/core/Node.ts:7):

```typescript
import { ReactNode } from 'react';

export class Frame {
  constructor(
    public x = 0,
    public y = 0,
    public width = 0,
    public height = 0
  ) {}
}

export class Node<T = any> {
  // T allows for type-safe access to component-specific props
  public readonly children: Node[] = [];
  public frame = new Frame(); // Stores calculated layout (x, y, width, height)
  public parent?: Node;

  constructor(public readonly type: string, public props: NodeProps & T) {}

  // $ready getter: Checks if this node and its children are "ready"
  // (e.g., images loaded), influencing caching.
  get $ready(): boolean {
    if (this.props.$ready === false) {
      return false;
    }
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      if (child.$ready === false) {
        return false;
      }
    }
    return true;
  }
}

// Associated interfaces also defined in Node.ts:

export interface RevasTouch {
  /* ... */
}
export type RevasTouchType = 'touchstart' | 'touchmove' | 'touchend';
export interface RevasTouchEvent {
  /* ... */
}
export type RevasTouchEventListener = (event: RevasTouchEvent) => any;

export interface BaseProps {
  children?: ReactNode;
  style?: any | any[];
  cache?: string | boolean; // Controls offscreen caching
  forceCache?: boolean; // Forces caching even if not $ready
}

export interface NodeProps extends BaseProps {
  onTouchStart?: RevasTouchEventListener;
  onTouchMove?: RevasTouchEventListener;
  onTouchEnd?: RevasTouchEventListener;
  onLayout?: (frame: Frame) => any; // Callback after layout calculation
  pointerEvents?: 'auto' | 'none' | 'box-none'; // Controls hit-testing behavior
  $ready?: boolean; // Internal prop, often set by components like Image
}
```

<!-- AI-CONTEXT-END -->

---

<!-- AI-CONTEXT-START:type=architecture -->

## Key Properties and Concepts

1.  **`type: string`**

    - A string identifier for the kind of element this node represents (e.g., "View", "Text", "Image"). This corresponds to the tag name used in `React.createElement(type, props)`.

2.  **`props: NodeProps & T`**

    - An object containing all properties passed to the Revas component from React. This includes:
      - `style`: The style object used for layout and appearance.
      - `children`: The React children (though the Revas `Node` tree uses the `this.children` array of `Node` instances).
      - Event handlers: `onTouchStart`, `onTouchMove`, `onTouchEnd`.
      - Layout callback: `onLayout`.
      - Caching directives: `cache`, `forceCache`.
      - Interaction control: `pointerEvents`.
      - Component-specific props (e.g., `src` for an `Image` node, `numberOfLines` for a `Text` node). These are captured by the generic `T`.

3.  **`children: Node[]`**

    - An array of child `Node` instances, forming the hierarchical tree structure. Manipulated by the Revas reconciler (`appendChild`, `removeChild`, `insertBefore`).

4.  **`parent?: Node`**

    - A reference to the parent `Node` in the tree. Undefined for the root node.

5.  **`frame: Frame`**

    - An instance of the `Frame` class, storing the calculated absolute or relative position (`x`, `y`) and dimensions (`width`, `height`) of the node after the layout phase. This is crucial for drawing and hit-testing.
    - The `onLayout` prop, if provided, is called with this `frame` object after layout is complete for the node.

6.  **`pointerEvents: 'auto' | 'none' | 'box-none'`**

    - Controls how the node participates in touch event hit-testing.
      - `'auto'`: The node can be a target, and events can target its children.
      - `'none'`: The node and its children are invisible to touch events.
      - `'box-none'`: The node itself is not a target, but its children can be.
    - See [`../../architecture/event-handling.md`](../../architecture/event-handling.md:1) for more details.

7.  **`cache?: string | boolean` and `forceCache?: boolean`**

    - Directives for the offscreen caching mechanism ([`../../../src/revas/core/offscreen.ts`](../../../src/revas/core/offscreen.ts:1)).
    - If `cache` is `true` or a string (cache ID), Revas will attempt to render this node and its children to an offscreen canvas and then draw that cached image to the main canvas. This can improve performance for complex, static subtrees.
    - `forceCache` can force caching even if some children (e.g., images) are not yet fully loaded (as indicated by `$ready`).

8.  **`$ready?: boolean`**
_ An internal property typically managed by components that have asynchronous loading aspects (like `<Image>`).
_ The `Node`'s `$ready` getter aggregates this status from itself and its children. If any part of the subtree is not ready, the node is not considered fully ready, which can affect caching decisions (unless `forceCache` is true).
<!-- AI-CONTEXT-END -->

---

<!-- AI-CONTEXT-START:type=implementation -->

## Lifecycle and Interaction

1.  **Creation:** `Node` instances are created by the `createInstance` method of the Revas reconciler when React processes a Revas primitive component.
2.  **Tree Manipulation:** The reconciler's `appendChild`, `removeChild`, and `insertBefore` methods modify the `children` array and `parent` references to build and update the tree.
3.  **Props Update:** The `commitUpdate` method in the reconciler updates the `props` on a `Node`.
4.  **Layout Phase:** The layout engine traverses the tree, reads style information from `node.props.style`, and computes the `node.frame` for each node. The `onLayout` callback is invoked if present.
5.  **Drawing Phase:** The drawing system ([`../../../src/revas/core/draw.ts`](../../../src/revas/core/draw.ts:1)) traverses the tree, using `node.type`, `node.props` (especially `style`), and `node.frame` to render the visual representation onto the `RevasCanvas`.
6.  **Event Handling Phase:** The `Container` ([`../../../src/revas/core/Container.ts`](../../../src/revas/core/Container.ts:1)) uses the `Node` tree and `node.frame` information for hit-testing to dispatch `RevasTouchEvent`s to the correct `Node`(s).

The `Node` system is thus central to all major operations within Revas, acting as the in-memory representation of the UI that bridges React's declarative world with the imperative canvas rendering world.

<!-- AI-CONTEXT-END -->
