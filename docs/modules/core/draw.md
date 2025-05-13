---
# AI Metadata Tags
ai_keywords:
  [
    draw,
    drawing system,
    rendering,
    canvas,
    Node tree,
    styles,
    transformations,
    opacity,
    caching,
    offscreen,
  ]
ai_contexts: [architecture, implementation]
ai_relations:
  [
    docs/modules/core/node.md,
    docs/modules/core/canvas.md,
    docs/modules/core/container.md,
    docs/modules/core/offscreen.md,
    docs/architecture/rendering-pipeline.md,
  ]
---

# Revas Drawing System

The Revas drawing system is responsible for traversing the `Node` tree and rendering each `Node` onto the `RevasCanvas` according to its type, styles, and calculated layout frame. The core logic for this is primarily located in [`../../../src/revas/core/draw.ts`](../../../src/revas/core/draw.ts:1), with the main function being `drawNode`.

<!-- AI-IMPORTANCE:level=critical -->

## Purpose and Role

1.  **Visual Representation:** Translates the abstract `Node` tree into actual pixels on the canvas.
2.  **Style Application:** Interprets style properties from each `Node` (e.g., `backgroundColor`, `borderColor`, `opacity`, `transformations`) and applies them using Canvas API calls.
3.  **Tree Traversal:** Recursively processes the `Node` tree to draw elements in the correct order (respecting `zIndex`).
4.  **Transformation Handling:** Manages 2D transformations (translation, rotation, scaling) for each `Node`.
5.  **Clipping and Opacity:** Implements `overflow: 'hidden'` for clipping and hierarchical opacity.
6.  **Caching Integration:** Interacts with the offscreen caching system ([`../../../src/revas/core/offscreen.ts`](../../../src/revas/core/offscreen.ts:1)) to draw cached `Node` subtrees for performance optimization.
<!-- AI-IMPORTANCE:level=critical -->

---

<!-- AI-CONTEXT-START:type=architecture -->

## The `drawNode` Function

The `drawNode(canvas: RevasCanvas, node: Node, container: Container)` function is the heart of the drawing system. It's called recursively, starting from the root `Node` (usually invoked by the `Container`'s `draw()` method).

### Core Steps within `drawNode` for a Single Node:

1.  **Style and Frame Retrieval:**

    - `const style = getMergedStyleFromNode(node, container.draw)`: Retrieves the computed styles for the current `Node`. The `container.draw` callback might be used for style resolution involving context or dynamic values.
    - `const frame = getFrameFromNode(node)`: Gets the calculated layout frame (`x`, `y`, `width`, `height`) of the `Node`.

2.  **Early Exit (Opacity Check):**

    - If `style.opacity <= 0`, the node is fully transparent, so rendering is skipped.

3.  **Canvas State Save (Transformations & Clipping):**

    - If the `Node` has transformations (`translateX`, `rotate`, etc.) or clipping (`overflow: 'hidden'`), the current state of the `RevasCanvas`'s transformation matrix (`canvas.transform.save()`) or the native canvas context (`canvas.context.save()` for clipping) is saved. This allows the state to be restored after the `Node` and its children are drawn.

4.  **Opacity Application:**

    - `const popOpacity = pushOpacity(canvas, style.opacity)`: The `Node`'s opacity is applied multiplicatively to the current canvas opacity. `pushOpacity` (a utility from [`../../../src/revas/core/utils.ts`](../../../src/revas/core/utils.ts:1) interacting with `RevasCanvas`) handles this and returns a function to restore the previous opacity.

5.  **Transformation Application:**

    - The `Node`'s `translateX`, `translateY`, `rotate`, `scaleX`, `scaleY`, and `scale` style properties are applied to the `RevasCanvas`'s transformation matrix.
    - Rotations and scales are typically applied around the center of the `Node`'s frame.

6.  **Caching Logic (`node.props.cache`):**
    <!-- AI-IMPORTANCE:level=high -->

    - If `node.props.cache` is enabled and an offscreen canvas ([`../../../src/revas/core/offscreen.ts`](../../../src/revas/core/offscreen.ts:1)) is suitable:
    _ **Cache Hit:** If a valid cached image exists for this `Node` (identified by `node.props.cache === true` for an auto ID, or a string ID), that cached image (an offscreen canvas) is drawn directly onto the main `RevasCanvas` using `drawImage()`.
    _ **Cache Miss:** If no valid cache exists:
    _ If the `Node` is not `$ready` (e.g., an image child is still loading) and `forceCache` is not true, it falls back to drawing content directly (Step 7).
    _ Otherwise, a new offscreen canvas is created. The `Node` and its children are drawn onto this offscreen canvas (by recursively calling `drawContent` or `drawNode` targeting the offscreen canvas). This offscreen canvas is then stored in the cache and also drawn onto the main `RevasCanvas`.
    <!-- AI-IMPORTANCE:level=high -->

7.  **Direct Content Drawing (`drawContent` function, called if not drawing from cache):**
    This internal function handles the actual drawing of a node's visual features.

    - **Path Creation (for border radius, clipping):**
      - If the `Node` has `borderRadius` or `overflow: 'hidden'`, a path (rectangle or rounded rectangle) is created on the `RevasCanvas`'s context.
      - If `overflow: 'hidden'`, `ctx.clip()` is called to restrict subsequent drawing to this path.
    - **Background and Border:**
      - Shadows (`shadowColor`, `shadowOffsetX`, etc.) are set on the canvas context.
      - If `style.backgroundColor` is present, it's filled using `ctx.fillStyle` and `ctx.fill()` (if a path was made) or `ctx.fillRect()`.
      - If `style.borderWidth` and `style.borderColor` are present, the border is stroked using `ctx.lineWidth`, `ctx.strokeStyle`, and `ctx.stroke()` (if a path was made) or `ctx.strokeRect()`.
      - Shadows are then reset.
    - **Custom Drawer (`node.props.customDrawer`):**
      - If a `Node` has a `customDrawer` function in its props (this is how specific components like Text, Image, LinearGradient implement their unique rendering), this function is called.
      - The `customDrawer` receives the `RevasCanvas`, the `node` itself, and flags like `hasRadius`, `hasClip`.
      - Examples:
        - Examples:
          - `Text` component's drawer: Uses `drawText` utility ([`../../../src/revas/components/common/drawText.ts`](../../../src/revas/components/common/drawText.ts:1)).
          - `Image` component's drawer: Uses `drawImage` utility ([`../../../src/revas/components/common/drawImage.ts`](../../../src/revas/components/common/drawImage.ts:1)) after the image is loaded ([`../../../src/revas/components/common/imageLoader.ts`](../../../src/revas/components/common/imageLoader.ts:1)).

8.  **Children Rendering (Recursive Call):**

    - The `node.children` array is retrieved, potentially sorted by `zIndex` (`sortByZIndexAscending` utility).
    - `drawNode` is called recursively for each child `Node`.

9.  **Canvas State Restore:**
_ The opacity is restored by calling `popOpacity()`.
_ If canvas state was saved in Step 3, it's restored using `canvas.transform.restore()` or `canvas.context.restore()`.
<!-- AI-CONTEXT-END -->

---

<!-- AI-CONTEXT-START:type=implementation -->

## Key Considerations

- **Order of Operations:** The order of applying opacity, transformations, clipping, and drawing primitives is critical for achieving the correct visual output.
- **Canvas State Management:** The drawing system must carefully manage the canvas context's state (fillStyle, strokeStyle, globalAlpha, transform matrix, clipping region), saving and restoring it as needed to prevent styles from one `Node` affecting others unintentionally. `RevasCanvas` helps with some of this.
- **Performance:**
_ Minimizing canvas state changes is generally good for performance.
_ The offscreen caching mechanism is a key optimization for complex or static subtrees, avoiding re-drawing all primitives for cached nodes. \* Careful culling (not drawing offscreen elements) could be another optimization, though not explicitly detailed as a primary feature in the provided `draw.ts`.
<!-- AI-CONTEXT-END -->

The drawing system, through `drawNode` and its helpers, forms the final stage of the rendering pipeline, converting the structured and styled `Node` tree into the visual output seen by the user.
