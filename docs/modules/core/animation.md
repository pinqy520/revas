---
# AI Metadata Tags
ai_keywords:
  [
    animation,
    Animated,
    AnimatedValue,
    timing,
    interpolation,
    revas core,
    motion,
  ]
ai_contexts: [architecture, implementation, usage, development]
ai_relations:
  [
    docs/modules/core/node.md,
    docs/modules/core/container.md,
    docs/architecture/rendering-pipeline.md,
    'https://reactnative.dev/docs/animated',
  ]
---

# Revas Animation System (`Animated`)

Revas provides a basic animation system, primarily through [`../../../src/revas/core/Animated.ts`](../../../src/revas/core/Animated.ts:1), inspired by React Native's `Animated` API. It allows for time-based animations of style properties, enabling dynamic and interactive UIs on the canvas.

<!-- AI-IMPORTANCE:level=critical -->

## Purpose and Role

1.  **Declarative Animations:** Enables developers to define animations declaratively by associating animated values with style properties.
2.  **Value-Driven Animation:** Animations are driven by changing `Animated.Value` instances over time.
3.  **Interpolation:** Supports mapping an `Animated.Value` from one range of numbers to another, allowing complex animations based on a single animated value (e.g., an animation progress).
4.  **Performance:** Aims to perform animations efficiently, often by directly updating style properties on `Node`s and triggering re-draws, without necessarily involving React's component update lifecycle for every frame of the animation.
<!-- AI-IMPORTANCE:level=critical -->

---

<!-- AI-CONTEXT-START:type=architecture -->

## Key Components of the Animation System

1.  **`Animated.Value`:**

    - A class representing a numeric value that can be animated.
    - **`constructor(initialValue: number)`:** Creates a new animated value.
    - **`setValue(value: number)`:** Directly sets the value. This can be used to imperatively control the value or to update it based on user interactions (e.g., drag gestures). This also typically stops any ongoing animation on this value.
    - **`addListener(callback: (value: { value: number }) => void)`:** Registers a callback that gets invoked whenever the animated value changes. This is how Revas likely connects the animated value to the `Node`'s style and triggers re-draws. The `Container` or drawing orchestrator might subscribe to these changes.
    - **`removeListener(id: string)` / `removeAllListeners()`:** Manages listener cleanup.
    - **`interpolate(config: InterpolationConfig)`:** Creates a new `Animated.Interpolation` instance, which is a derived animated value.
      - `InterpolationConfig`: `{ inputRange: number[], outputRange: (number[] | string[]) }`
      - Allows mapping the input value (from the parent `Animated.Value`) to a different output value. For example, mapping an input range of `[0, 1]` to an output range of `[0, 100]` for position, or `['0deg', '360deg']` for rotation.

2.  **`Animated.timing(value: Animated.Value, config: TimingAnimationConfig)`:**

    - A function that creates and configures a time-based animation for a given `Animated.Value`.
    - **`TimingAnimationConfig`:**
      - `toValue: number`: The target value for the animation.
      - `duration: number` (milliseconds): The length of the animation.
      - `easing?: (t: number) => number`: An easing function (e.g., from `bezier-easing`) to control the animation's rate of change. Defaults to linear.
      - `delay?: number`: Optional delay before the animation starts.
    - **Returns an animation object with methods:**
      - **`start(callback?: (result: { finished: boolean }) => void)`:** Starts the animation. The optional callback is invoked when the animation completes or is stopped.
      - **`stop()`:** Stops the currently running animation on that value.

3.  **`Animated.Interpolation`:**
_ A derived value that automatically updates when its parent `Animated.Value` changes. It performs the mapping defined by its `inputRange` and `outputRange`.
_ It also has `addListener`, `removeListener`, and `interpolate` methods, allowing for chained interpolations.
<!-- AI-CONTEXT-END -->

---

<!-- AI-CONTEXT-START:type=usage -->

## Usage Example

```typescript
import { Animated, View, Text, timing } from 'revas'; // Assuming timing is exported or part of Animated
import { Easing } from 'bezier-easing'; // Hypothetical import if easing is separate

class MyAnimatedComponent extends React.Component {
  // 1. Create an Animated.Value in the constructor or as a class property
  private animatedX = new Animated.Value(0);
  private opacity = new Animated.Value(1);

  componentDidMount() {
    // 2. Configure and start an animation
    Animated.timing(this.animatedX, {
      toValue: 100,
      duration: 1000,
      easing: Easing.easeInOutCubic, // Example easing
    }).start(({ finished }) => {
      if (finished) {
        console.log('Animation X completed!');
        // Start another animation or a reverse
        Animated.timing(this.opacity, { toValue: 0, duration: 500 }).start();
      }
    });
  }

  render() {
    // 3. Use the Animated.Value directly in style properties
    // Or use an interpolation for more complex transformations
    const interpolatedRotation = this.animatedX.interpolate({
      inputRange: [0, 100],
      outputRange: ['0deg', '90deg'],
    });

    return (
      <Animated.View // Revas might require special Animated.<Component> wrappers
        style={{
          translateX: this.animatedX, // Direct use
          opacity: this.opacity,
          rotate: interpolatedRotation, // Use interpolated value
          width: 50,
          height: 50,
          backgroundColor: 'blue',
        }}
      >
        <Text>Animating!</Text>
      </Animated.View>
    );
  }
}
```

**Note:** The example assumes Revas might provide `Animated.View`, `Animated.Text` etc., similar to React Native, which are components whose style props can accept `Animated.Value` instances. If not, the connection might be manual via `addListener` updating component state or directly manipulating node props (less common in a pure React model but possible in custom renderers). Given Revas's structure, it's more likely that `Animated.Value` instances, when used in `style` props, are specially handled by the Revas reconciler or drawing system.

When an `Animated.Value` is used in a style property (e.g., `style={{ translateX: this.animatedX }}`), Revas needs a mechanism to:

1.  Detect that `this.animatedX` is an `Animated.Value` and not a static number.
2.  Subscribe to its changes.
3.  When the value changes (due to `timing()` or `setValue()`), the subscribed listener would:
    - Update the corresponding style property on the target `Node`.
    - Trigger a re-draw of the `Container` to reflect the visual change.

<!-- AI-CONTEXT-END -->

---

<!-- AI-CONTEXT-START:type=implementation -->

## Integration with Rendering Pipeline

1.  **Animation Loop:** The `Animated.timing` function likely uses `requestAnimationFrame` (or a similar mechanism like `setTimeout` for Node.js environments if applicable, though Revas is canvas/browser focused) to update the `Animated.Value` incrementally over the specified `duration`.
2.  **Value Update and Notification:** In each step of the animation loop, the `Animated.Value` is updated, and its registered listeners are notified.
3.  **Style Update on Node:** One of these listeners would be responsible for updating the actual style property (e.g., `node.props.style.translateX`) on the internal Revas `Node` that corresponds to the `Animated.View`.
4.  **Triggering Re-draw:** After the style property on the `Node` is updated, a re-draw of the Revas `Container` must be scheduled (e.g., `container.draw()`). This ensures the canvas is updated with the new style.

<!-- AI-IMPORTANCE:level=high -->

**Optimization Consideration:** For performance, it's often desirable that these per-frame style updates from animations bypass the full React reconciliation process if only style properties are changing. The `Animated.Value` listeners might directly update the Revas `Node`'s internal style representation and then request a direct re-draw from the `Container`. This avoids the overhead of React's virtual DOM diffing for simple visual tweaks during an animation. The Revas reconciler and `Node`'s `commitUpdate` would handle initial setup and larger prop changes.

<!-- AI-IMPORTANCE:level=high -->
<!-- AI-CONTEXT-END -->

The `Animated` system provides a powerful, declarative way to add motion and interactivity to Revas applications, closely mirroring the familiar API from React Native.
