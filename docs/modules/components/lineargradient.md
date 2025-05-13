---
# AI Metadata Tags
ai_keywords:
  [
    LinearGradient,
    component,
    gradient,
    color,
    styling,
    revas component,
    UI,
    graphics,
  ]
ai_contexts: [usage, implementation, development]
ai_relations: [../core/node.md, view.md, ../core/draw.md]
---

# Revas `<LinearGradient>` Component

The `<LinearGradient>` component in Revas allows developers to create views with a linear gradient background. It provides control over the gradient's direction and color stops.

<!-- AI-IMPORTANCE:level=critical -->

## Purpose and Role

1.  **Gradient Backgrounds:** Enables the creation of smooth transitions between two or more specified colors along a straight line.
2.  **Declarative Gradients:** Defines gradients using props for start/end points and color arrays.
3.  **Visual Enhancement:** Used to add depth, visual appeal, or highlight areas in the UI.
<!-- AI-IMPORTANCE:level=critical -->

---

<!-- AI-CONTEXT-START:type=usage -->

## Usage

The `<LinearGradient>` component requires `start`, `end`, and `colors` props to define the gradient.

```typescript
import React from 'react';
import { render, View, LinearGradient, Text } from 'revas';

const App = () => (
  <View style={styles.container}>
    <Text style={styles.label}>Horizontal Gradient (Left to Right)</Text>
    <LinearGradient
      style={styles.gradientBox}
      start={{ x: 0, y: 0.5 }} // Starts at left-center
      end={{ x: 1, y: 0.5 }} // Ends at right-center
      colors={['#FFD700', '#FFA500', '#FF4500']} // Gold to OrangeRed
    >
      <Text style={styles.gradientText}>Left to Right</Text>
    </LinearGradient>

    <Text style={styles.label}>Vertical Gradient (Top to Bottom)</Text>
    <LinearGradient
      style={styles.gradientBox}
      start={{ x: 0.5, y: 0 }} // Starts at top-center
      end={{ x: 0.5, y: 1 }} // Ends at bottom-center
      colors={['#4A90E2', '#004E92']} // Light Blue to Dark Blue
    >
      <Text style={styles.gradientText}>Top to Bottom</Text>
    </LinearGradient>

    <Text style={styles.label}>
      Diagonal Gradient (Top-Left to Bottom-Right)
    </Text>
    <LinearGradient
      style={styles.gradientBox}
      start={{ x: 0, y: 0 }} // Starts at top-left
      end={{ x: 1, y: 1 }} // Ends at bottom-right
      colors={['#34E89E', '#0F3443']} // Green to Dark Slate
    >
      <Text style={styles.gradientText}>Diagonal</Text>
    </LinearGradient>
  </View>
);

const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'stretch', // Gradients take full width
  },
  label: {
    fontSize: 14,
    marginTop: 15,
    marginBottom: 5,
    textAlign: 'center',
  },
  gradientBox: {
    height: 100,
    width: '100%', // Take full width of parent
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    // Other View styles like margin, padding can be applied
  },
  gradientText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { x: 1, y: 1 },
    textShadowBlur: 2,
  },
};

// render(<App />, document.getElementById('root'));
```

The `start` and `end` coordinates are relative to the component's frame, where `(0,0)` is the top-left corner and `(1,1)` is the bottom-right corner.

<!-- AI-CONTEXT-END -->

---

<!-- AI-CONTEXT-START:type=implementation -->

## Implementation

The `<LinearGradient>` component is defined in [`../../../src/revas/components/LinearGradient.ts`](../../../src/revas/components/LinearGradient.ts:1).

```typescript
import * as React from 'react';
import { NodeProps, Frame } from '../core/Node';
import { RevasCanvas } from '../core/Canvas'; // For type RevasCanvas
// No View import needed if it directly uses React.createElement('LinearGradient', ...)

export interface Point {
  x: number;
  y: number;
}

export interface LinearGradientProps extends NodeProps {
  style?: any | any[]; // Should be ViewStyle as it's a visual element
  colors: string[]; // Array of color strings
  start: Point; // Start point of the gradient {x, y} (0-1 relative)
  end: Point; // End point of the gradient {x, y} (0-1 relative)
  locations?: number[]; // Optional: Positions of color stops (0-1 relative)
}

function linearGradientDrawer(
  canvas: RevasCanvas,
  node: any /* Node<LinearGradientProps> */
) {
  const { colors, start, end, locations } = node.props as LinearGradientProps;
  const frame = node.frame as Frame; // { x, y, width, height } of the component

  if (!colors || colors.length === 0 || !start || !end) {
    return; // Not enough info to draw a gradient
  }

  const { context: ctx } = canvas;

  // Calculate absolute start and end points based on the frame
  const x0 = frame.x + start.x * frame.width;
  const y0 = frame.y + start.y * frame.height;
  const x1 = frame.x + end.x * frame.width;
  const y1 = frame.y + end.y * frame.height;

  // Create the canvas gradient object
  const gradient = ctx.createLinearGradient(x0, y0, x1, y1);

  // Add color stops
  if (locations && locations.length === colors.length) {
    for (let i = 0; i < colors.length; i++) {
      gradient.addColorStop(locations[i], colors[i]);
    }
  } else {
    // If locations are not provided, distribute colors evenly
    colors.forEach((color, index) => {
      gradient.addColorStop(index / (colors.length - 1 || 1), color);
    });
  }

  // Apply the gradient fill
  ctx.fillStyle = gradient;

  // Draw the rectangle covering the component's frame
  // This component typically doesn't handle borderRadius itself in the drawer;
  // borderRadius clipping would be handled by the generic drawNode logic if LinearGradient
  // is drawn as a standard View background.
  // If it needs to respect borderRadius directly, it would need path creation here.
  // For simplicity, assume it fills its rectangular frame.
  // The main draw.ts might handle clipping for borderRadius before this customDrawer is called.
  ctx.fillRect(frame.x, frame.y, frame.width, frame.height);
}

export default function LinearGradient(props: LinearGradientProps) {
  // It passes its drawing logic via the 'customDrawer' prop
  return React.createElement('LinearGradientView', {
    ...props,
    customDrawer: linearGradientDrawer,
  });
  // Note: The type 'LinearGradientView' (or similar) would be a conventional type name
  // that the reconciler treats like a 'View' for layout and basic props,
  // but the drawing system specifically calls its `customDrawer`.
  // Alternatively, it could be React.createElement('View', { ...props, customDrawer: ... })
  // if the 'View' type is flexible enough to accept and use customDrawers.
  // Given Revas components like Text and Image use their own type names, 'LinearGradientView' is plausible.
}
```

Key implementation details:

1.  **`React.createElement('LinearGradientView', ...)`:** It creates an element with a specific type (e.g., "LinearGradientView" or potentially just "View" if the drawing system is flexible) that the Revas reconciler processes.
2.  **`customDrawer: linearGradientDrawer`:** This is the core of its rendering. The `<LinearGradient>` component provides its drawing logic to the Revas core drawing system ([`../core/draw.md`](../core/draw.md:1)) via this prop. When a `Node` with this `customDrawer` is encountered, the `linearGradientDrawer` function is executed.
3.  **`linearGradientDrawer` Function:**

    - Receives the `RevasCanvas` and the `Node` instance.
    - Retrieves `colors`, `start`, `end`, `locations` props, and the calculated `frame` from the `Node`.
    - **Calculates Absolute Coordinates:** Converts the relative `start` and `end` points (0-1 range) into absolute pixel coordinates based on the `Node`'s `frame`.
    - **`ctx.createLinearGradient(x0, y0, x1, y1)`:** Uses the native Canvas API to create a `CanvasGradient` object.
    - **`gradient.addColorStop(offset, color)`:** Adds color stops to the gradient.
      - If `locations` prop is provided and valid, it uses those explicit offsets for each color.
      - Otherwise, it distributes the `colors` evenly along the gradient line.
    - **`ctx.fillStyle = gradient`:** Sets the created gradient as the fill style for subsequent drawing operations.
    - **`ctx.fillRect(frame.x, frame.y, frame.width, frame.height)`:** Fills the entire rectangular area of the component's frame with the gradient.
    - **Border Radius:** The `linearGradientDrawer` itself typically doesn't handle `borderRadius`. If the `<LinearGradient>` component has `borderRadius` in its style, the main Revas drawing system (`drawNode` in `draw.ts`) would usually apply a clipping path _before_ calling this `customDrawer`. The `fillRect` would then be constrained by that clip.

4.  **Layout and Other Styles:** \* The `<LinearGradient>` component behaves like a `<View>` regarding layout (flexbox, width, height, etc.) and most other style properties (padding, margin, opacity, transforms). These are handled by the standard Revas `Node` processing and drawing logic, with the `customDrawer` only responsible for painting the gradient content itself.
<!-- AI-CONTEXT-END -->

---

<!-- AI-CONTEXT-START:type=development -->

## Props

The `<LinearGradient>` component accepts `LinearGradientProps`:

- **`colors: string[]`** (Required)

  - An array of color strings (e.g., `'#FF0000'`, `'rgba(0,0,255,0.5)'`, `'blue'`). At least two colors are needed to form a gradient.

- **`start: { x: number; y: number }`** (Required)

  - An object specifying the start point of the gradient line. `x` and `y` are fractional values (0 to 1) relative to the component's frame.
  - `(0,0)` is top-left, `(1,0)` is top-right, `(0.5,0)` is top-center.

- **`end: { x: number; y: number }`** (Required)

  - An object specifying the end point of the gradient line, with `x` and `y` being fractional values (0 to 1) relative to the component's frame.

- **`locations?: number[]`** (Optional)

  - An array of numbers (0 to 1) specifying the position of each color stop along the gradient line.
  - The length of this array must match the length of the `colors` array.
  - If omitted, colors are distributed evenly. For example, for `colors = [c1, c2, c3]`, default locations would be `[0, 0.5, 1]`.

- **`style?: ViewStyle | ViewStyle[]`** (Inherited from `NodeProps`)

  - Allows styling the `<LinearGradient>` component like a `<View>` (e.g., `width`, `height`, `borderRadius`, `margin`, `padding`, `opacity`). The gradient will fill the bounds defined by these styles.

- **`children?: React.ReactNode`** (Inherited from `NodeProps`)

  - `<LinearGradient>` can have children, which will be rendered on top of the gradient background.

- **Inherited `NodeProps`:**
  - Includes touch event handlers (`onTouchStart`, etc.), `onLayout`, `pointerEvents`, `cache`, `forceCache`. Caching a `<LinearGradient>` can be beneficial if its props don't change frequently.

The `<LinearGradient>` component provides a declarative and easy way to add rich gradient effects to UIs built with Revas.

<!-- AI-CONTEXT-END -->
