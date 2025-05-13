---
# AI Metadata Tags
ai_keywords:
  [Text, component, typography, font, styling, revas component, UI, string]
ai_contexts: [usage, implementation, development]
ai_relations: [../core/node.md, view.md, ../core/draw.md]
---

# Revas `<Text>` Component

The `<Text>` component in Revas is used to display text strings on the canvas. It supports various styling options for typography and inherits layout and basic styling capabilities from `<View>`.

<!-- AI-IMPORTANCE:level=critical -->

## Purpose and Role

1.  **Display Text:** Its primary function is to render text content.
2.  **Typography Styling:** Allows control over font family, size, weight, color, line height, alignment, etc.
3.  **Layout:** Participates in the flexbox layout system like any other Revas component.
4.  **Nesting (Limited):** While `<Text>` can be nested within `<View>` components, nesting other components _inside_ a `<Text>` component is generally not supported or meaningful in the same way as in the DOM. Text styling is typically inherited from parent `<Text>` components in React Native, but Revas's behavior might be simpler; it primarily styles the direct text content it holds.
<!-- AI-IMPORTANCE:level=critical -->

---

<!-- AI-CONTEXT-START:type=usage -->

## Usage

The children of a `<Text>` component should be raw text strings.

```typescript
import React from 'react';
import { render, View, Text } from 'revas';

const App = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Hello Revas!</Text>
    <Text style={styles.paragraph}>
      This is a paragraph of text rendered on the canvas using the Revas Text
      component. It supports various styling options.
    </Text>
    <View style={styles.customTextContainer}>
      <Text style={styles.specialText}>Special Highlighted Text</Text>
    </View>
  </View>
);

const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20, // Note: line height behavior depends on drawText implementation
    marginBottom: 15,
  },
  customTextContainer: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 4,
  },
  specialText: {
    fontSize: 16,
    color: 'purple',
    fontStyle: 'italic',
  },
};

// render(<App />, document.getElementById('root'));
```

<!-- AI-CONTEXT-END -->

---

<!-- AI-CONTEXT-START:type=implementation -->

## Implementation

The `<Text>` component is defined in [`../../../src/revas/components/Text.ts`](../../../src/revas/components/Text.ts:1).

```typescript
import * as React from 'react';
import { NodeProps, Frame } from '../core/Node'; // Assuming NodeProps includes Text-specific props or is extended
import { drawText, measureText, TextMetrics } from './common/drawText'; // Crucial for rendering
import { RevasCanvas } from '../core/Canvas';

export interface TextProps extends NodeProps {
  style?: any | any[]; // Should be a more specific TextStyle type
  numberOfLines?: number;
  children?: string | string[]; // Primarily expects string children
}

// Store measured text to avoid re-calculating on every draw if content/style unchanged
const MEASURED_TEXT_CACHE = new Map<string, TextMetrics>();

function textDrawer(canvas: RevasCanvas, node: any /* Node<TextProps> */) {
  const { children, style } = node.props as TextProps;
  const frame = node.frame as Frame;
  const textContent = React.Children.toArray(children).join('');

  // Basic caching key - more robust key needed for production (e.g., hash of content + relevant styles)
  const cacheKey = `${textContent}-${JSON.stringify(style)}-${frame.width}-${
    frame.height
  }`;
  let metrics = MEASURED_TEXT_CACHE.get(cacheKey);

  if (!metrics) {
    // If not animating or frequently changing, measuring text on each draw can be inefficient.
    // Revas might measure text during a layout or pre-draw phase.
    // For simplicity here, assume drawText also handles measurement or it's done before.
    // The actual measureText might be called in a layout phase by Revas core.
  }

  // drawText is responsible for handling text wrapping, alignment, numberOfLines, etc.
  drawText(
    canvas.context,
    textContent,
    frame.x,
    frame.y,
    frame.width,
    frame.height,
    style, // Pass all relevant text styles
    node.props.numberOfLines
  );
}

export default function Text(props: TextProps) {
  // The 'customDrawer' prop is a Revas-specific mechanism to tell the core drawing
  // system how to render this particular type of Node.
  return React.createElement('Text', { ...props, customDrawer: textDrawer });
}
```

Key aspects of the `<Text>` component's implementation:

1.  **`React.createElement('Text', ...)`:** Like `<View>`, it creates an element with a specific type ("Text") that the Revas reconciler understands.
2.  **`customDrawer: textDrawer`:** This is a crucial part. The `Text` component passes a `customDrawer` function in its props. The main Revas drawing system ([`../../../src/revas/core/draw.ts`](../../../src/revas/core/draw.ts:1)) will invoke this `textDrawer` function when it encounters a `Node` of type "Text".
3.  **`textDrawer` Function:**

    - Receives the `RevasCanvas` and the `Node` to be rendered.
    - Extracts the text content from `node.props.children`. `React.Children.toArray(children).join('')` ensures that if multiple text strings or numbers are passed as children, they are concatenated.
    - Retrieves the `style` and `frame` (layout) from the `Node`.
    - Calls a specialized utility function, `drawText` (from [`../../../src/revas/components/common/drawText.ts`](../../../src/revas/components/common/drawText.ts:1)), to perform the actual rendering of the text onto the canvas context.
    - The `drawText` utility is responsible for handling complex text rendering tasks like font application, color, alignment, potential text wrapping (based on `frame.width`), and truncating based on `numberOfLines`.

4.  **Text Measurement:**
_ For accurate layout and wrapping, text needs to be measured before it's drawn. Revas likely has a text measurement utility (e.g., `measureText` also from `drawText.ts` or a similar module) that uses `canvas.context.measureText()`.
_ This measurement would influence the layout phase, determining the intrinsic width/height of the Text node if not explicitly set. \* The simplified `textDrawer` above hints at a cache for measured text, which is a common optimization. In a full implementation, `measureText` would be called during the layout phase, and its results would inform the `frame` calculations and be available to `drawText`.
<!-- AI-CONTEXT-END -->

---

<!-- AI-CONTEXT-START:type=development -->

## Props

The `<Text>` component accepts `TextProps`, which extend `NodeProps` and add text-specific properties:

- **`style?: TextStyle | TextStyle[]`** (inherits from `NodeProps` but with text-specific styles)

  - **Typography Properties:** `color`, `fontFamily`, `fontSize`, `fontStyle`, `fontWeight`, `textAlign`, `lineHeight`, `textBaseline`.
  - **Text Shadow Properties:** `textShadowColor`, `textShadowOffsetX`, `textShadowOffsetY`, `textShadowBlur`.
  - **Layout & Box Properties:** Inherits properties like `margin`, `padding`, `width`, `height`, `backgroundColor`, etc., from `ViewStyle` which `<Text>` effectively uses.
  - Refer to Revas CSS documentation for a full list of supported text styles.

- **`children?: string | string[] | number`**

  - The text content to be displayed. Typically a single string. If an array of strings or numbers is provided, they are concatenated.

- **`numberOfLines?: number`**

  - If provided, limits the displayed text to a maximum number of lines. Text exceeding this limit is typically truncated (e.g., with an ellipsis "..."), depending on the `drawText` utility's implementation.

- **Inherited `NodeProps`:**
  - `onTouchStart`, `onTouchMove`, `onTouchEnd`: Text elements can be interactive.
  - `onLayout`: Callback after layout.
  - `pointerEvents`: Controls touch interactivity.
  - `cache`, `forceCache`: For offscreen caching.

The `<Text>` component, through its `customDrawer` and the `drawText` utility, encapsulates the complexities of rendering styled text onto a canvas within the Revas framework.

<!-- AI-CONTEXT-END -->
