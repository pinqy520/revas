---
# AI Metadata Tags
ai_keywords:
  [
    canvas,
    RevasCanvas,
    HTML5 Canvas,
    2D context,
    drawing abstraction,
    rendering,
    graphics,
  ]
ai_contexts: [architecture, implementation]
ai_relations:
  [
    docs/modules/core/draw.md,
    docs/architecture/rendering-pipeline.md,
    docs/architecture/tech-stack.md,
    'https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D',
  ]
---

# RevasCanvas Abstraction

The `RevasCanvas` class ([`../../../src/revas/core/Canvas.ts`](../../../src/revas/core/Canvas.ts:1)) serves as an abstraction layer over the native HTML5 Canvas 2D rendering context (`CanvasRenderingContext2D`). It provides a controlled interface for drawing operations within the Revas ecosystem and helps manage canvas state.

<!-- AI-IMPORTANCE:level=high -->

## Purpose and Role

1.  **Abstraction:** Decouples the Revas drawing system ([`../../../src/revas/core/draw.ts`](../../../src/revas/core/draw.ts:1)) from direct manipulation of the native canvas context. This can simplify the drawing logic and make it easier to manage.
2.  **State Management:** Helps manage the canvas context's state, particularly transformations, global alpha, and potentially other properties, by providing its own state stack for these.
3.  **Convenience:** May offer convenience methods or encapsulate common sequences of canvas operations.
4.  **Extensibility:** Provides a point for future extensions, such as supporting different canvas types (e.g., offscreen canvas for caching, or even different rendering backends if Revas were to expand beyond the web canvas).
<!-- AI-IMPORTANCE:level=high -->

---

<!-- AI-CONTEXT-START:type=architecture -->

## Key Features and Responsibilities

1.  **Context Encapsulation:**

    - A `RevasCanvas` instance holds a reference to a native `CanvasRenderingContext2D` (passed during instantiation).
    - All drawing operations performed through `RevasCanvas` are ultimately executed on this underlying native context.

2.  **Transformation Management:**

    - `RevasCanvas` maintains its own transformation matrix (`this.transform` which is an instance of `TransformMatrix`).
    - Methods like `translate(x, y)`, `scale(sx, sy)`, `rotate(angle)` modify this internal matrix.
    - When drawing operations occur, this internal matrix is applied to the native canvas context using `ctx.setTransform()` or `ctx.transform()`.
    - It provides `save()` and `restore()` methods that manage a stack of transformation states, allowing nested transformations to be applied and reverted correctly. This is often more robust or specialized than relying solely on `ctx.save()` and `ctx.restore()` for transformations if Revas needs finer control or to track the current transform.

3.  **Global Alpha Management:**

    - Similar to transformations, `RevasCanvas` can manage a stack of global alpha values.
    - `pushOpacity(opacity)`: Multiplies the current effective opacity by the new opacity and applies it to `ctx.globalAlpha`. It returns a function to pop/restore the previous opacity.
    - This allows for hierarchical opacity settings where a child's opacity is relative to its parent's.

4.  **Access to Native Context:**

    - Provides direct access to the underlying `CanvasRenderingContext2D` via its `context` property (e.g., `revasCanvas.context.fillRect(...)`). This allows the drawing system to use any native canvas API features directly when needed.

5.  **Canvas Element Reference:** \* Stores a reference to the underlying `<canvas>` HTML element via `this.element` (which is `this.context.canvas`).
<!-- AI-CONTEXT-END -->

---

<!-- AI-CONTEXT-START:type=implementation -->

## Usage in Revas

- **Initialization:**

  - In the web renderer ([`../../../src/revas/web/render.ts`](../../../src/revas/web/render.ts:1)), a `RevasCanvas` instance is created using the 2D context obtained from the dynamically created `<canvas>` element: `new RevasCanvas(dom.getContext('2d')!)`.
  - For offscreen caching ([`../../../src/revas/core/offscreen.ts`](../../../src/revas/core/offscreen.ts:1)), `RevasCanvas` instances are also created for the offscreen canvas elements.

- **Drawing Process ([`../../../src/revas/core/draw.ts`](../../../src/revas/core/draw.ts:1)):**
  - The main `drawNode` function receives a `RevasCanvas` instance as an argument.
  - All transformations (translate, rotate, scale) are applied using `revasCanvas.transform.translate()`, `revasCanvas.transform.rotate()`, etc.
  - Opacity is managed using `pushOpacity()` on the `RevasCanvas` instance.
  - Actual drawing primitives (like `fillRect`, `fillText`, `drawImage`) are called on `revasCanvas.context`.

```typescript
// Simplified example from draw.ts
import { RevasCanvas } from './Canvas';
import { Node } from './Node';

export function drawNode(canvas: RevasCanvas, node: Node, /* ... */) {
    const style = /* get styles */;
    const frame = /* get frame */;

    // Save canvas transform state
    canvas.transform.save();
    const popOpacity = pushOpacity(canvas, style.opacity);

    // Apply transformations
    if (style.translateX || style.translateY) {
        canvas.transform.translate(style.translateX || 0, style.translateY || 0);
    }
    // ... other transforms ...

    // Draw background (using native context)
    if (style.backgroundColor) {
        canvas.context.fillStyle = style.backgroundColor;
        // Apply current transform to context before drawing
        canvas.context.setTransform(...canvas.transform.matrix());
        canvas.context.fillRect(frame.x, frame.y, frame.width, frame.height);
    }

    // ... draw children recursively ...

    popOpacity();
    canvas.transform.restore();
}
```

<!-- AI-IMPORTANCE:level=normal -->

**Note on `TransformMatrix`:** The `TransformMatrix` class (likely defined within `Canvas.ts` or imported) would handle the actual matrix calculations (multiplication, inversion, etc.) for 2D transformations. `RevasCanvas` uses an instance of this to manage its current transformation state.

<!-- AI-IMPORTANCE:level=normal -->

By providing this managed layer, `RevasCanvas` contributes to the clarity and organization of the rendering code, especially when dealing with complex nested transformations and opacity adjustments common in UI rendering.

<!-- AI-CONTEXT-END -->
