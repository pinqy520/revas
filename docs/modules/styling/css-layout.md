---
# AI Metadata Tags
ai_keywords:
  [
    css-layout,
    javascript layout,
    flexbox,
    layout engine,
    styling,
    revas core,
    facebook css-layout,
  ]
ai_contexts: [architecture, implementation, development]
ai_relations:
  [
    ../core/node.md,
    yoga-layout.md,
    ../../architecture/rendering-pipeline.md,
    'https://github.com/facebookarchive/css-layout',
  ]
---

# Revas CSS Layout Engine (Legacy)

Revas incorporates a JavaScript-based CSS layout engine, specifically the one originally developed by Facebook (often referred to as `css-layout`, now archived but its principles live on in Yoga). This engine provides the logic for calculating the position and size of Revas `Node`s based on a subset of CSS properties, most notably Flexbox.

<!-- AI-IMPORTANCE:level=high -->

## Purpose and Role

1.  **Flexbox Implementation:** Provides a JavaScript implementation of the Flexbox layout algorithm, allowing developers to use `flex`, `flexDirection`, `justifyContent`, `alignItems`, etc., for dynamic and responsive UIs on the canvas.
2.  **Box Model Calculation:** Handles standard CSS box model properties like `width`, `height`, `margin`, `padding`, and `borderWidth` to determine the final dimensions and spacing of elements.
3.  **Tree-Based Layout:** Computes layout for an entire tree of `Node`s, taking into account parent-child relationships and how they affect sizing and positioning.
4.  **Decoupling from DOM:** Enables CSS-like layout capabilities without relying on a browser's native DOM rendering engine, making it suitable for canvas environments.
<!-- AI-IMPORTANCE:level=high -->

Revas also integrates `yoga-layout-wasm` ([`yoga-layout.md`](yoga-layout.md:1)), which is a more modern and comprehensive Flexbox implementation. The `css-layout` JS engine might be used as a fallback, for specific configurations, or might represent an earlier stage of Revas's development.

---

<!-- AI-CONTEXT-START:type=architecture -->

## How it Works

The `css-layout` engine typically operates as follows:

1.  **Input Node Tree:** It takes a representation of the Revas `Node` tree. Each node in this input tree must have its style properties (relevant to layout) attached.
2.  **Style Extraction:** For each node, layout-specific style properties are extracted (e.g., `width`, `height`, `flex`, `marginLeft`, `paddingTop`, `flexDirection`, `position`, `left`, `top`).
3.  **Layout Computation:**
    - The engine recursively traverses the node tree.
    - It applies the Flexbox algorithm and other CSS layout rules (like absolute positioning) to calculate the computed `width`, `height`, `x` (left), and `y` (top) for each node relative to its parent or the layout root.
    - The constraints of parent nodes affect the layout of child nodes.
4.  **Output Layout Information:** The engine outputs the computed layout for each node. In Revas, this computed layout is then stored in the `frame` property (e.g., `node.frame = { x, y, width, height }`) of the corresponding Revas `Node` object.

The file [`../../../src/revas/core/css-layout/index.ts`](../../../src/revas/core/css-layout/index.ts:1) in the Revas codebase is the entry point or wrapper for this JavaScript-based layout engine.

<!-- AI-CONTEXT-START:type=implementation -->

### Integration in Revas

1.  **Node Styles:** When a Revas `Node` is created or updated, its `props.style` object contains the CSS-like layout directives.
    **Layout Trigger:** The layout process is typically triggered by the `Container` ([`../core/container.md`](../core/container.md:1)) before drawing, especially if the node tree or styles have changed.
2.  **Data Transformation:** Revas code would transform its `Node` tree and style properties into a format that the `css-layout` engine understands.
3.  **Applying Results:** After the `css-layout` engine computes the layouts, Revas updates the `frame` (e.g., `node.frame.x`, `node.frame.y`, `node.frame.width`, `node.frame.height`) of each Revas `Node`.
    **Drawing:** The drawing system ([`../core/draw.md`](../core/draw.md:1)) then uses these `frame` values to position and size elements when rendering them on the canvas.

```typescript
// Conceptual usage within Revas (simplified)
// Assume 'cssLayout' is the entry function from the css-layout library
// import cssLayout from 'css-layout'; // or from '../core/css-layout'

function calculateLayoutWithCSSLayout(
  rootRevasNode: RevasNode,
  containerWidth: number,
  containerHeight: number
) {
  // 1. Transform RevasNode tree into the structure expected by css-layout
  // This usually involves creating a simpler object tree with 'style' and 'children' properties.
  const layoutNodeTree = convertRevasTreeToLayoutTree(rootRevasNode);

  // Set dimensions for the root layout node (viewport)
  layoutNodeTree.style.width = containerWidth;
  layoutNodeTree.style.height = containerHeight;

  // 2. Run the layout engine
  cssLayout(layoutNodeTree); // This function mutates the tree, adding 'layout' objects to each node

  // 3. Apply the computed layout back to the RevasNode tree
  applyLayoutTreeToRevasTree(rootRevasNode, layoutNodeTree);
}

function convertRevasTreeToLayoutTree(revasNode: RevasNode): any {
  const layoutNode: any = {
    style: { ...revasNode.props.style }, // Copy relevant style properties
    children: [],
  };
  if (revasNode.children) {
    for (const child of revasNode.children) {
      layoutNode.children.push(convertRevasTreeToLayoutTree(child));
    }
  }
  return layoutNode;
}

function applyLayoutTreeToRevasTree(revasNode: RevasNode, layoutNode: any) {
  if (layoutNode.layout) {
    revasNode.frame.x = layoutNode.layout.left;
    revasNode.frame.y = layoutNode.layout.top;
    revasNode.frame.width = layoutNode.layout.width;
    revasNode.frame.height = layoutNode.layout.height;

    // Trigger onLayout callback if provided
    revasNode.props.onLayout?.(revasNode.frame);
  }
  if (revasNode.children && layoutNode.children) {
    for (let i = 0; i < revasNode.children.length; i++) {
      applyLayoutTreeToRevasTree(revasNode.children[i], layoutNode.children[i]);
    }
  }
}
```

This illustrates the general pattern: adapt the Revas `Node` tree, run the layout engine, and then transfer the computed results back to the Revas `Node`s.

<!-- AI-CONTEXT-END -->
<!-- AI-CONTEXT-END -->

---

<!-- AI-CONTEXT-START:type=development -->

## Supported CSS Properties (Subset)

The `css-layout` JavaScript engine supports a subset of standard CSS properties relevant to layout. These typically include:

- **Dimensions:** `width`, `height`, `minWidth`, `maxWidth`, `minHeight`, `maxHeight`
- **Flexbox:** `flex`, `flexDirection` (`row`, `column`), `justifyContent` (`flex-start`, `center`, `flex-end`, `space-between`, `space-around`), `alignItems` (`flex-start`, `center`, `flex-end`, `stretch`), `alignSelf`
- **Margins:** `margin`, `marginTop`, `marginRight`, `marginBottom`, `marginLeft`
- **Paddings:** `padding`, `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft`
- **Borders:** `borderWidth`, `borderTopWidth`, `borderRightWidth`, `borderBottomWidth`, `borderLeftWidth` (Border widths affect layout; actual border rendering is separate)
- **Positioning:** `position` (`relative`, `absolute`), `left`, `top`, `right`, `bottom`

The exact set of supported properties and their behavior would conform to the specification of the particular `css-layout` version used.

<!-- AI-IMPORTANCE:level=normal -->

While functional, JavaScript-based layout engines like this version of `css-layout` can sometimes be a performance bottleneck for very complex UIs compared to native implementations or WebAssembly-based engines like Yoga. This is likely why Revas also includes `yoga-layout-wasm` as an alternative or preferred method.

<!-- AI-IMPORTANCE:level=normal -->
<!-- AI-CONTEXT-END -->
