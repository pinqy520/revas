---
# AI Metadata Tags
ai_keywords:
  [View, component, container, layout, style, flexbox, revas component, UI]
ai_contexts: [usage, implementation, development]
ai_relations:
  [
    ../core/node.md,
    ../styling/css-layout.md,
    ../styling/yoga-layout.md,
    ../../architecture/event-handling.md,
  ]
---

# Revas `<View>` Component

The `<View>` component is the most fundamental building block for creating UIs in Revas. It's a generic container that supports layout with flexbox, styling, touch handling, and nesting of other Revas components.

<!-- AI-IMPORTANCE:level=critical -->

## Purpose and Role

1.  **Container:** Acts as a primary container for other components, allowing grouping and structuring of the UI.
2.  **Layout:** Supports flexbox and other CSS-like layout properties (`width`, `height`, `margin`, `padding`, etc.) to position and size itself and its children.
3.  **Styling:** Can be styled with various properties like `backgroundColor`, `borderColor`, `borderRadius`, `opacity`, etc.
4.  **Interaction:** Can handle touch events (`onTouchStart`, `onTouchMove`, `onTouchEnd`).
<!-- AI-IMPORTANCE:level=critical -->

---

<!-- AI-CONTEXT-START:type=usage -->

## Usage

`<View>` is analogous to `<div>` in HTML or `View` in React Native.

```typescript
import React from 'react';
import { render, View, Text } from 'revas';

const App = () => (
  <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.headerText}>Welcome to Revas</Text>
    </View>
    <View style={styles.content}>
      <Text>This is a View component!</Text>
    </View>
    <View style={styles.footer} />
  </View>
);

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  header: {
    height: 50,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 5,
  },
  headerText: {
    fontSize: 18,
    color: 'white',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
  },
  footer: {
    height: 30,
    backgroundColor: 'lightgray',
    marginTop: 10,
    borderRadius: 5,
  },
};

// Assuming a DOM element with id 'root' exists
// render(<App />, document.getElementById('root'));
```

<!-- AI-CONTEXT-END -->

---

<!-- AI-CONTEXT-START:type=implementation -->

## Implementation

The `<View>` component is defined in [`../../../src/revas/components/View.ts`](../../../src/revas/components/View.ts:1).

```typescript
import * as React from 'react';
import { NodeProps } from '../../../src/revas/core/Node'; // Assuming NodeProps covers all standard View props

export default function View(props: NodeProps) {
  return React.createElement('View', props);
}
```

Internally, it's a very simple functional component that uses `React.createElement('View', props)`. This "View" string type is then recognized by the Revas custom reconciler ([`../../../src/revas/core/reconciler.ts`](../../../src/revas/core/reconciler.ts:1)), which creates a Revas `Node` of type "View".

The actual rendering logic (drawing background, borders, etc.) and layout calculations are handled by the core Revas systems based on the `Node`'s type ("View") and its `props.style`.

- **Layout:** The `style` prop is interpreted by the layout engine ([`../styling/css-layout.md`](../styling/css-layout.md:1) or [`../styling/yoga-layout.md`](../styling/yoga-layout.md:1)).
- **Drawing:** The drawing system ([`../core/draw.md`](../core/draw.md:1)) uses the `style` prop (e.g., `backgroundColor`, `borderColor`, `borderRadius`) and the calculated `frame` to paint the View onto the canvas. A `<View>` node typically doesn't have a `customDrawer` prop; its appearance is derived from standard style properties.
- **Event Handling:** Touch events are managed as described in [`../../architecture/event-handling.md`](../../architecture/event-handling.md:1), with `pointerEvents` and event handlers (`onTouchStart`, etc.) from `props` influencing behavior.
<!-- AI-CONTEXT-END -->

---

<!-- AI-CONTEXT-START:type=development -->

## Props

The `<View>` component accepts `NodeProps` from [`../../../src/revas/core/Node.ts`](../../../src/revas/core/Node.ts:50), which include:

- **`style?: ViewStyle | ViewStyle[]`**

  - An object (or an array of objects for merging) defining the appearance and layout of the View.
  - **Layout Properties:** `width`, `height`, `flex`, `flexDirection`, `justifyContent`, `alignItems`, `margin`, `padding`, `position`, `left`, `top`, etc. (See CSS/Yoga layout docs).
  - **Appearance Properties:** `backgroundColor`, `borderColor`, `borderWidth`, `borderRadius` (and specific corners like `borderTopLeftRadius`), `opacity`, `shadowColor`, `shadowOffsetX`, `shadowOffsetY`, `shadowBlur`, `overflow`.
  - **Transform Properties:** `translateX`, `translateY`, `rotate`, `scale`, `scaleX`, `scaleY`.

- **`children?: React.ReactNode`**

  - Other Revas components to be nested within this View.

- **`onTouchStart?: (event: RevasTouchEvent) => void`**

  - Callback for when a touch begins on the View.

- **`onTouchMove?: (event: RevasTouchEvent) => void`**

  - Callback for when a touch moves over the View.

- **`onTouchEnd?: (event: RevasTouchEvent) => void`**

  - Callback for when a touch ends on the View.

- **`onLayout?: (frame: Frame) => void`**

  - Callback that is invoked after the View's layout (position and dimensions) has been calculated. The `frame` object (`{ x, y, width, height }`) is passed as an argument.

- **`pointerEvents?: 'auto' | 'none' | 'box-none'`**

  - Controls how the View interacts with touch events.
    - `'auto'` (default): The View can be a target of touch events. Events can also target its children.
    - `'none'`: The View is never the target of touch events. Events "pass through" it and its children to elements below.
    - `'box-none'`: The View itself is not a target, but its children can be.

- **`cache?: string | boolean`**

  - Enables offscreen caching for this View and its children to potentially improve rendering performance. If `true`, an auto ID is used. If a string, that string is used as the cache ID.
  - See [`../core/offscreen.md`](../core/offscreen.md:1).

- **`forceCache?: boolean`**
  - If `cache` is enabled, `forceCache: true` will cache the View even if some of its children (e.g., images) are not yet fully loaded (not `$ready`).

<!-- AI-IMPORTANCE:level=high -->

`<View>` is the cornerstone for structuring UIs in Revas. Its versatile styling and layout capabilities, combined with event handling, make it the primary tool for defining the visual and interactive aspects of an application.

<!-- AI-IMPORTANCE:level=high -->
<!-- AI-CONTEXT-END -->
