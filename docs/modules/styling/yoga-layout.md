---
# AI Metadata Tags
ai_keywords:
  [
    yoga,
    yoga-layout,
    yoga-layout-wasm,
    flexbox,
    layout engine,
    styling,
    revas core,
    webassembly,
    performance,
  ]
ai_contexts: [architecture, implementation, development]
ai_relations:
  [
    ../core/node.md,
    css-layout.md,
    ../../architecture/rendering-pipeline.md,
    ../../architecture/tech-stack.md,
    'https://yogalayout.com/',
    'https://github.com/facebook/yoga',
  ]
---

# Revas Yoga Layout Engine (`yoga-layout-wasm`)

Revas utilizes Yoga, a cross-platform layout engine developed by Facebook, to implement a comprehensive and performant version of Flexbox. Specifically, it uses `yoga-layout-wasm` ([`../../../package.json`](../../../package.json:18)), which is the WebAssembly (Wasm) distribution of Yoga, making it suitable for high-performance layout calculations in the browser.

<!-- AI-IMPORTANCE:level=critical -->

## Purpose and Role

1.  **High-Performance Flexbox:** Provides a highly optimized and standards-compliant implementation of the Flexbox layout algorithm. WebAssembly execution can be significantly faster than pure JavaScript layout engines for complex UIs.
2.  **Cross-Platform Consistency:** Yoga is designed to produce consistent layout results across different platforms (though Revas primarily uses its Wasm variant for the web).
3.  **Comprehensive CSS Feature Support:** Supports a wider range of Flexbox properties and behaviors, as well as other CSS layout features like `aspectRatio`, `position: absolute`, and margin/padding/border calculations.
4.  **Primary Layout Engine:** Given its performance and feature set, Yoga is likely the preferred or primary layout engine in Revas, with the JavaScript `css-layout` ([`css-layout.md`](css-layout.md:1)) potentially acting as a fallback or for simpler cases.
<!-- AI-IMPORTANCE:level=critical -->

The integration files for Yoga in Revas are typically found under [`../../../src/revas/core/yoga-layout/`](../../../src/revas/core/yoga-layout/).

---

<!-- AI-CONTEXT-START:type=architecture -->

## How Yoga Layout Works

Yoga operates by constructing its own internal tree of layout nodes. These Yoga nodes are configured with style properties, and then Yoga computes the layout for the entire tree.

1.  **Node Creation:** For each Revas `Node` that needs layout, a corresponding Yoga layout node (`YGNodeRef`) is created.

    - `const ygNode = Yoga.Node.create();`

2.  **Style Application:** Style properties from the Revas `Node`'s `props.style` object are applied to the Yoga node using Yoga's specific API functions.

    - Example: `Yoga.Node.setWidth(ygNode, style.width);`
    - `Yoga.Node.setFlexDirection(ygNode, Yoga.FLEX_DIRECTION_ROW);`
    - [`../../../src/revas/core/yoga-layout/style.ts`](../../../src/revas/core/yoga-layout/style.ts:1) likely contains the mapping from Revas style property names/values to Yoga enum values and setter functions.

3.  **Tree Construction:** The hierarchy of Revas `Node`s is mirrored in the Yoga node tree.

    - `Yoga.Node.insertChild(ygParentNode, ygChildNode, index);`

4.  **Layout Calculation:**

    - Once the Yoga node tree is constructed and styled, `Yoga.Node.calculateLayout(ygRootNode, containerWidth, containerHeight, Yoga.DIRECTION_LTR)` is called on the root Yoga node.
    - Yoga then recursively calculates the position (`left`, `top`) and dimensions (`width`, `height`) for every node in its tree.

5.  **Retrieving Layout Results:**
    - After `calculateLayout` completes, the computed layout for each Yoga node can be retrieved.
    - Example: `const { left, top, width, height } = Yoga.Node.getComputedLayout(ygNode);`

<!-- AI-CONTEXT-START:type=implementation -->

### Integration in Revas ([`../../../src/revas/core/yoga-layout/index.ts`](../../../src/revas/core/yoga-layout/index.ts:1))

1.  **Initialization (`Yoga.init()`):** The Yoga Wasm module needs to be loaded and initialized. This is typically done once when the application or Revas library loads, handled by [`../../../src/revas/core/yoga-layout/init.ts`](../../../src/revas/core/yoga-layout/init.ts:1).

2.  **Recursive Tree Processing:** Revas would have a function that traverses its own `Node` tree. For each Revas `Node`:

    - It creates or retrieves a cached Yoga node.
    - It applies the Revas `Node`'s styles to the Yoga node using the mapping in `style.ts`.
    - It adds the Yoga node as a child to its parent's Yoga node.

3.  **Root Calculation:** The `calculateLayout` function is called on the root Yoga node, providing the viewport dimensions (e.g., canvas width and height) and layout direction.

4.  **Applying Results to Revas Nodes:** After layout computation, another traversal (or the same one) reads the computed layout from each Yoga node and updates the `frame` property (e.g., `revasNode.frame.x = computedLeft;`) of the corresponding Revas `Node`.
    - The `onLayout` callback on the Revas `Node` would then be invoked with the new frame.

```typescript
// Conceptual flow of Yoga layout integration in Revas
import Yoga from 'yoga-layout-wasm'; // Actual import from the package
// import { applyStylesToYogaNode } from './style'; // Helper from style.ts
// import { ensureYogaInitialized } from './init'; // Helper from init.ts

async function calculateLayoutWithYoga(
  rootRevasNode: RevasNode,
  containerWidth: number,
  containerHeight: number
) {
  // await ensureYogaInitialized(); // Make sure Wasm is loaded

  const yogaNodeMap = new Map<RevasNode, Yoga.YogaNode>(); // Cache Yoga nodes

  function getOrCreateYogaNode(revasNode: RevasNode): Yoga.YogaNode {
    if (yogaNodeMap.has(revasNode)) {
      return yogaNodeMap.get(revasNode)!;
    }
    const ygNode = Yoga.Node.create();
    yogaNodeMap.set(revasNode, ygNode);
    return ygNode;
  }

  function buildYogaTreeRecursive(
    revasNode: RevasNode,
    ygParentNode?: Yoga.YogaNode
  ) {
    const ygNode = getOrCreateYogaNode(revasNode);
    // applyStylesToYogaNode(ygNode, revasNode.props.style); // From style.ts

    if (ygParentNode) {
      // Determine index carefully
      Yoga.Node.insertChild(
        ygParentNode,
        ygNode,
        Yoga.Node.getChildCount(ygParentNode)
      );
    }

    revasNode.children.forEach((childRevasNode) => {
      buildYogaTreeRecursive(childRevasNode, ygNode);
    });
  }

  const rootYogaNode = getOrCreateYogaNode(rootRevasNode);
  buildYogaTreeRecursive(rootRevasNode); // Build tree starting from root, no parent for root initially

  // Set dimensions for the root layout node if not already in styles
  Yoga.Node.setWidth(rootYogaNode, containerWidth);
  Yoga.Node.setHeight(rootYogaNode, containerHeight);

  Yoga.Node.calculateLayout(
    rootYogaNode,
    Yoga.UNDEFINED,
    Yoga.UNDEFINED,
    Yoga.DIRECTION_LTR
  ); // Or pass actual W/H if root size isn't container

  function applyYogaLayoutToRevasNodeRecursive(revasNode: RevasNode) {
    const ygNode = yogaNodeMap.get(revasNode);
    if (ygNode) {
      const layout = Yoga.Node.getComputedLayout(ygNode);
      revasNode.frame.x = layout.left;
      revasNode.frame.y = layout.top;
      revasNode.frame.width = layout.width;
      revasNode.frame.height = layout.height;
      revasNode.props.onLayout?.(revasNode.frame);
    }
    revasNode.children.forEach(applyYogaLayoutToRevasNodeRecursive);
  }

  applyYogaLayoutToRevasNodeRecursive(rootRevasNode);

  // Cleanup: Free Yoga nodes after use to prevent memory leaks
  yogaNodeMap.forEach((ygNode) => Yoga.Node.freeRecursive(ygNode)); // Or free one by one if tree structure is complex for freeRecursive
  yogaNodeMap.clear();
}
```

<!-- AI-IMPORTANCE:level=high -->

**Memory Management:** A crucial aspect of using Yoga (especially the Wasm version) is proper memory management. `Yoga.Node.free(ygNode)` or `Yoga.Node.freeRecursive(ygRootNode)` must be called to release the memory allocated by Yoga nodes when they are no longer needed (e.g., after each layout pass if nodes are recreated, or when Revas nodes are unmounted). Failure to do so can lead to memory leaks. Revas likely maintains a pool or cache of Yoga nodes corresponding to its Revas `Node`s and manages their lifecycle.

<!-- AI-IMPORTANCE:level=high -->
<!-- AI-CONTEXT-END -->
<!-- AI-CONTEXT-END -->

---

<!-- AI-CONTEXT-START:type=development -->

## Supported CSS Properties

Yoga supports a rich set of CSS properties for layout, including:

- **Flexbox:** All major `flex`, `flexDirection`, `flexWrap`, `justifyContent`, `alignItems`, `alignSelf`, `alignContent`, `flexBasis`, `flexGrow`, `flexShrink`.
- **Dimensions:** `width`, `height`, `minWidth`, `maxWidth`, `minHeight`, `maxHeight`.
- **Aspect Ratio:** `aspectRatio`.
- **Margins:** `margin`, `marginTop`, `marginRight`, `marginBottom`, `marginLeft`, `marginStart`, `marginEnd`.
- **Paddings:** `padding`, `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft`, `paddingStart`, `paddingEnd`.
- **Borders:** `borderWidth`, `borderTopWidth`, etc. (Yoga uses border widths in layout calculations).
- **Positioning:** `position` (`relative`, `absolute`). `left`, `top`, `right`, `bottom`, `start`, `end`.
- **Display:** `display` (`flex`, `none`).
- **Overflow:** `overflow` (`visible`, `hidden`, `scroll`) - affects layout calculations regarding scrollable content size.

The `style.ts` file in Revas's yoga-layout directory maps these Revas style props to the corresponding Yoga API calls and enum values (e.g., `Yoga.FLEX_DIRECTION_COLUMN`).

By using `yoga-layout-wasm`, Revas benefits from a mature, battle-tested, and performant layout engine, enabling complex and responsive UIs to be built with a familiar Flexbox-based styling approach on the canvas.

<!-- AI-CONTEXT-END -->
