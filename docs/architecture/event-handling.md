---
# AI Metadata Tags
ai_keywords:
  [
    event handling,
    touch events,
    gestures,
    propagation,
    hit testing,
    pointerEvents,
    revas,
  ]
ai_contexts: [architecture, implementation]
ai_relations:
  [
    docs/architecture/system-overview.md,
    docs/modules/core/node.md,
    docs/modules/core/container.md,
    docs/modules/components/touchable.md,
  ]
---

# Revas Event Handling System

This document describes how Revas handles user interactions, primarily touch events, on the canvas and propagates them to the appropriate Revas components (represented as `Node`s).

<!-- AI-IMPORTANCE:level=critical -->

## Overview

Since Revas renders to a single HTML5 Canvas element, traditional DOM event handling (where events are dispatched to individual DOM elements) is not available. Revas implements its own event handling system to:

1.  Capture native browser events from the root canvas element.
2.  Translate these native events into a Revas-specific format.
3.  Perform hit-testing to determine which Revas `Node`(s) are under the event coordinates.
4.  Dispatch the Revas event to the target `Node`(s) and manage propagation (bubbling).
<!-- AI-IMPORTANCE:level=critical -->

---

<!-- AI-CONTEXT-START:type=architecture -->

## Key Components in Event Handling

1.  **Root Canvas Element:** The single HTML element that receives all raw browser touch/mouse events.
    **Top-Level Event Listeners:** Attached to the root canvas element (typically during the `render` process in [`src/revas/web/render.ts`](../../src/revas/web/render.ts:1)). These listeners capture events like `touchstart`, `touchmove`, `touchend`, `touchcancel`.
    **Event Normalization:** Raw browser events are converted into a standardized `RevasTouchEvent` format, defined in [`src/revas/core/Node.ts`](../../src/revas/core/Node.ts:34). This includes normalizing coordinates relative to the canvas.
    **Container ([`src/revas/core/Container.ts`](../../src/revas/core/Container.ts:1)):** The `Container` instance, which holds the root of the Revas `Node` tree, is responsible for receiving normalized `RevasTouchEvent`s and initiating the dispatch process. Its `handleTouch()` method is the main entry point.
2.  **Node Tree Traversal / Hit Testing:** The `Container` traverses the `Node` tree to identify which `Node`(s) are affected by the event.
3.  **Node Properties:**
    - `frame`: The `Node`'s calculated layout (x, y, width, height) is used for hit testing.
    - `onTouchStart`, `onTouchMove`, `onTouchEnd`: Props on a `Node` that define event handler functions.
    - `pointerEvents`: A prop that controls how a `Node` (and its children) participate in touch events (similar to the CSS `pointer-events` property). Values can be:
      - `'auto'` (default): The `Node` can be a target of touch events. Events can also target its children.
      - `'none'`: The `Node` is never the target of touch events. Events "pass through" it to elements below.
      - `'box-none'`: The `Node` itself is not a target, but its children can be.

<!-- AI-IMPORTANCE:level=high -->

## Event Handling Flow

<!-- AI-IMPORTANCE:level=high -->

The process generally follows these steps:

1.  **Native Event Capture:**

    - User interacts with the canvas (e.g., touches the screen).
    - The browser fires a native `TouchEvent` (e.g., `touchstart`) on the `<canvas>` element.
    - The top-level event listener registered by Revas (in [`../../src/revas/web/render.ts`](../../src/revas/web/render.ts:63) for web) captures this event.

2.  **Event Normalization:**

    - The native event is processed by a function like `createRevasTouchEvent` ([`../../src/revas/web/render.ts`](../../src/revas/web/render.ts:22)).
    - Coordinates are adjusted to be relative to the canvas origin.
    - A `RevasTouchEvent` object is created, containing:
      - `type`: `touchstart`, `touchmove`, or `touchend`.
      - `touches`: An object mapping touch identifiers to `RevasTouch` objects (each with `identifier`, `x`, `y`).
      - `timestamp`.

3.  **Dispatch to Container:**

    - The normalized `RevasTouchEvent` is passed to the `Container`'s `handleTouch(event)` method.

4.  **Hit Testing and Target Identification (within `Container.handleTouch`):**
    <!-- AI-CONTEXT-START:type=implementation -->

    - The `Container` initiates a recursive traversal (typically depth-first, rendering order) of its `Node` tree, starting from the root `Node`.
    - For each `Node`, it checks if the event coordinates (e.g., `event.touches[0].x`, `event.touches[0].y`) fall within the `Node`'s `frame`.
    - The `pointerEvents` property of each `Node` influences hit testing:
      - If `pointerEvents === 'none'`, the `Node` and its entire subtree are skipped.
      - If `pointerEvents === 'box-none'`, the `Node` itself cannot be a target, but the hit testing continues for its children.
      - If `pointerEvents === 'auto'`, the `Node` can be a target. If a touch hits this `Node`, hit testing may stop for its children for this specific event unless the event needs to bubble or be captured by children first (Revas typically uses a bubbling model).
    - The deepest, topmost `Node` that satisfies the hit test and `pointerEvents` criteria is usually considered the primary target for the event.
    <!-- AI-CONTEXT-END -->

5.  **Event Propagation (Bubbling):**

    - Once a target `Node` is identified for an event type (e.g., `touchstart`), Revas typically simulates event bubbling.
    - The event handler prop (e.g., `props.onTouchStart`) on the target `Node` is invoked, if it exists.
    - The event then "bubbles" up the `Node` tree: the same event handler prop is checked and invoked on the target's parent, then its grandparent, and so on, up to the root `Node`.
    - Event handlers can typically stop propagation if needed, though this mechanism might be implicitly handled by how React event handlers work or require custom logic within the handlers.

6.  **Handler Execution:**
    - When an event handler (e.g., `(event) => { console.log('Touched!'); }`) is invoked, it receives the `RevasTouchEvent` object.
    - These handlers can then trigger React state updates (`this.setState`, `useState`'s setter), leading to component re-renders and thus updating the canvas through the rendering pipeline.

<!-- AI-IMPORTANCE:level=normal -->

## Touch State Management

<!-- AI-IMPORTANCE:level=normal -->

- For `touchmove` and `touchend` events, Revas needs to ensure these are dispatched to the `Node`(s) that initially received the `touchstart` for that specific touch identifier.
- The `Container` or a dedicated touch state manager might keep track of active touches and their initial targets to correctly route subsequent events of a gesture.
- Components like [`Touchable`](../modules/components/touchable.md:1) ([`../../src/revas/components/Touchable.ts`](../../src/revas/components/Touchable.ts:1)) build upon this system to provide higher-level press interactions (`onPress`, `onPressIn`, `onPressOut`) and visual feedback (like `activeOpacity`).

---

<!-- AI-CONTEXT-START:type=implementation -->

## Implementation Considerations

- **Performance:** Hit testing can be performance-intensive for very deep or complex `Node` trees. Optimizations might include spatial partitioning or selective tree traversal if this becomes a bottleneck, though for most UI applications, a direct traversal is often sufficient.
- **Coordinate Systems:** Ensuring correct translation between native browser event coordinates, canvas-relative coordinates, and `Node`-local coordinates (if applicable for complex components) is critical.
- **Gestures:** While Revas provides the raw touch events, more complex gesture recognition (swipes, pinches, etc.) would typically be built on top of this system, either within custom components or through a separate gesture library that consumes `RevasTouchEvent`s.
<!-- AI-CONTEXT-END -->

This event handling system allows Revas to create interactive UIs on the canvas, responding to user input in a way that aligns with React's component-based event model.
