---
# AI Metadata Tags
ai_keywords:
  [
    Touchable,
    component,
    press,
    touch events,
    interaction,
    button,
    revas component,
  ]
ai_contexts: [usage, implementation, development]
ai_relations: [../core/node.md, view.md, ../../architecture/event-handling.md]
---

# Revas `<Touchable>` Component

The `<Touchable>` component in Revas is a wrapper that makes its children responsive to touch interactions, similar to a button. It provides feedback on press and handles press events.

<!-- AI-IMPORTANCE:level=critical -->

## Purpose and Role

1.  **Interaction Handling:** Provides a convenient way to handle common touch gestures like a "press".
2.  **Visual Feedback:** Can change its appearance (e.g., opacity) when a touch interaction begins.
3.  **Event Abstraction:** Abstracts lower-level `onTouchStart`, `onTouchMove`, and `onTouchEnd` events into higher-level `onPress`, `onPressIn`, and `onPressOut` events.
<!-- AI-IMPORTANCE:level=critical -->

---

<!-- AI-CONTEXT-START:type=usage -->

## Usage

`<Touchable>` wraps other Revas components to make them interactive.

```typescript
import React from 'react';
import { render, View, Text, Touchable, Animated } from 'revas';

const App = () => {
  const handlePress = () => {
    console.log('Button Pressed!');
    // Trigger an animation or state change
  };

  const animatedValue = new Animated.Value(1);

  const onPressIn = () => {
    Animated.timing(animatedValue, { toValue: 0.5, duration: 150 }).start();
  };

  const onPressOut = () => {
    Animated.timing(animatedValue, { toValue: 1, duration: 150 }).start();
  };

  return (
    <View style={styles.container}>
      <Touchable
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={0.7} // Default is often 0.2 or similar
      >
        <Animated.View style={[styles.button, { opacity: animatedValue }]}>
          <Text style={styles.buttonText}>Press Me</Text>
        </Animated.View>
      </Touchable>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'dodgerblue',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
};

// render(<App />, document.getElementById('root'));
```

In this example, `activeOpacity` is used directly by `<Touchable>`. The example also shows how `onPressIn` and `onPressOut` can be used with the `Animated` API for custom feedback. Revas's `<Touchable>` might internally handle `activeOpacity` without needing `Animated.View` if the opacity change is simple.

<!-- AI-CONTEXT-END -->

---

<!-- AI-CONTEXT-START:type=implementation -->

## Implementation

The `<Touchable>` component is defined in [`../../../src/revas/components/Touchable.ts`](../../../src/revas/components/Touchable.ts:1). It is likely a class component (or a functional component with hooks like `useState`, `useRef`, `useEffect`) to manage internal state related to the touch interaction (e.g., whether a press is active).

```typescript
import * as React from 'react';
import { NodeProps, RevasTouchEvent, Frame } from '../core/Node';
import View from './View'; // Touchables often wrap a View or are a View themselves

export interface TouchableProps extends NodeProps {
  onPress?: (event: RevasTouchEvent) => void;
  onPressIn?: (event: RevasTouchEvent) => void;
  onPressOut?: (event: RevasTouchEvent) => void;
  activeOpacity?: number; // Opacity when pressed in
  // Other props like disabled, delayPressIn, delayPressOut might exist
}

interface TouchableState {
  isPressed: boolean;
  // Potentially other state like layout for press retention logic
}

// A simplified conceptual implementation
export default class Touchable extends React.Component<
  TouchableProps,
  TouchableState
> {
  private pressIsActive: boolean = false;
  private touchStartPosition: { x: number; y: number } | null = null;
  // A threshold to differentiate a scroll/drag from a tap
  private static PRESS_RETENTION_OFFSET = {
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
  };

  constructor(props: TouchableProps) {
    super(props);
    this.state = {
      isPressed: false,
    };
  }

  private _handleTouchStart = (event: RevasTouchEvent) => {
    this.pressIsActive = true;
    this.touchStartPosition = { x: event.touches[0].x, y: event.touches[0].y };
    this.setState({ isPressed: true });
    this.props.onPressIn?.(event);
  };

  private _handleTouchMove = (event: RevasTouchEvent) => {
    if (!this.pressIsActive || !this.touchStartPosition) return;

    const touch = event.touches[0];
    // Example press retention logic (simplified): if finger moves too far, it's not a press
    // A real implementation would use onLayout to get the component's frame.
    // For now, this is a conceptual check.
    const dx = Math.abs(touch.x - this.touchStartPosition.x);
    const dy = Math.abs(touch.y - this.touchStartPosition.y);

    // A more robust check would use the actual frame of the Touchable
    // and the PRESS_RETENTION_OFFSET.
    if (
      dx > Touchable.PRESS_RETENTION_OFFSET.left ||
      dy > Touchable.PRESS_RETENTION_OFFSET.top
    ) {
      if (this.state.isPressed) {
        this.setState({ isPressed: false });
        this.props.onPressOut?.(event); // Press cancelled by moving out
        this.pressIsActive = false; // No longer a candidate for onPress
      }
    }
  };

  private _handleTouchEnd = (event: RevasTouchEvent) => {
    if (this.pressIsActive) {
      // Was it a valid press start?
      if (this.state.isPressed) {
        // Is it still considered pressed (e.g. finger didn't move out too much)?
        this.props.onPress?.(event);
      }
      // onPressOut should always be called if onPressIn was.
      this.props.onPressOut?.(event);
    }
    this.pressIsActive = false;
    this.setState({ isPressed: false });
    this.touchStartPosition = null;
  };

  // onTouchCancel would typically also call _handleTouchEnd logic
  private _handleTouchCancel = (event: RevasTouchEvent) => {
    this._handleTouchEnd(event);
  };

  render() {
    const { style, activeOpacity, children, ...restProps } = this.props;
    let currentOpacity = style?.opacity !== undefined ? style.opacity : 1;

    if (this.state.isPressed && activeOpacity !== undefined) {
      currentOpacity = activeOpacity;
    }

    // The Touchable component renders a View and passes down its own touch handlers
    // and merges the opacity style.
    return (
      <View
        {...restProps} // Pass down other View-compatible props
        style={[style, { opacity: currentOpacity }]} // Apply activeOpacity effect
        onTouchStart={this._handleTouchStart}
        onTouchMove={this._handleTouchMove}
        onTouchEnd={this._handleTouchEnd}
        onTouchCancel={this._handleTouchCancel} // Important to handle cancellation
      >
        {children}
      </View>
    );
  }
}
```

Key implementation aspects:

1.  **Internal State:** Manages `isPressed` state to track if a touch interaction is active.
2.  **Touch Event Handlers:**
    - `_handleTouchStart`: Sets `isPressed` to true, calls `props.onPressIn`. Stores touch start position.
    - `_handleTouchMove`: Implements "press retention" logic. If the touch moves too far outside the component's bounds (or a slop area), the press is considered cancelled (`isPressed` set to false, `props.onPressOut` called).
    - `_handleTouchEnd`: If the press was still active and considered "pressed" (e.g., touch up occurred within bounds), it calls `props.onPress`. It always calls `props.onPressOut` if `onPressIn` was called. Resets `isPressed` state.
    - `_handleTouchCancel`: Similar to `_handleTouchEnd` for resetting state.
3.  **Opacity Change:** If `activeOpacity` prop is provided, the component dynamically adjusts the opacity of its wrapping `<View>` when `isPressed` is true.
4.  **Rendering:** The `<Touchable>` component itself usually renders a `<View>` (or another base Revas component) and attaches its internal touch handlers (`_handleTouchStart`, etc.) to this `<View>`. It passes through other props and children to this underlying `<View>`.

<!-- AI-IMPORTANCE:level=normal -->

**Press Retention Logic (Slop Area):**
A robust `<Touchable>` implementation includes logic to ensure that a "press" is only registered if the `touchend` event occurs reasonably close to the `touchstart` location and within the component's bounds. This involves:

- Getting the component's layout (`onLayout`) to know its `frame`.
- During `onTouchMove` and `onTouchEnd`, checking if the touch coordinates are still within the "slop area" (the component's frame plus some configurable padding). If the touch moves out, the press is typically cancelled.
  The simplified example above uses a fixed offset for movement, but a real one would use the component's frame.
  <!-- AI-IMPORTANCE:level=normal -->
  <!-- AI-CONTEXT-END -->

---

<!-- AI-CONTEXT-START:type=development -->

## Props

The `<Touchable>` component accepts `TouchableProps`:

- **`onPress?: (event: RevasTouchEvent) => void`**

  - Callback invoked when a "press" gesture is completed (typically on `touchend` if the touch remained within bounds).

- **`onPressIn?: (event: RevasTouchEvent) => void`**

  - Callback invoked as soon as a `touchstart` event occurs on the component.

- **`onPressOut?: (event: RevasTouchEvent) => void`**

  - Callback invoked when the touch is released (`touchend`) or when the touch moves out of the retention area, effectively cancelling the press.

- **`activeOpacity?: number`**

  - A value between 0 and 1. When the Touchable is pressed (`onPressIn`), its opacity is set to this value. It reverts to the original opacity on `onPressOut`. Defaults to a value like 0.2 or 0.7 if not specified, or might not apply an opacity change if undefined.

- **`disabled?: boolean`**

  - If `true`, the Touchable will not respond to touch events, and `activeOpacity` will not be applied.

- **`style?: ViewStyle | ViewStyle[]`** (Inherited from `NodeProps` if it renders a View)

  - Allows styling the underlying View that `<Touchable>` renders.

- **`children?: React.ReactNode`**

  - The content to be made touchable.

- **Other `NodeProps`:** Inherits other props compatible with `<View>` like `onLayout`, `pointerEvents`, `cache`, etc.

The `<Touchable>` component simplifies the handling of common press interactions, providing a higher-level API over raw touch events and built-in visual feedback.

<!-- AI-CONTEXT-END -->
