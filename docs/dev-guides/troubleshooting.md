---
# AI Metadata Tags
ai_keywords:
  [
    troubleshooting,
    debugging,
    issues,
    errors,
    common problems,
    revas,
    development,
    help,
  ]
ai_contexts: [development, usage]
ai_relations:
  [
    ../architecture/rendering-pipeline.md,
    ../architecture/event-handling.md,
    ../modules/core/node.md,
    setup.md,
  ]
---

# Revas Troubleshooting Guide

This guide provides solutions and debugging tips for common issues encountered when working with Revas.

<!-- AI-IMPORTANCE:level=high -->

## General Debugging Steps

1.  **Check Console Logs:** Always inspect your browser's developer console for error messages or warnings from React, Revas, or JavaScript itself.
    **Revas Version:** Ensure you are using a compatible version of Revas and React (see `peerDependencies` in Revas's [`../../package.json`](../../package.json:26)).
2.  **Simplify:** Try to isolate the problem by creating a minimal reproducible example. Remove components and styles until the issue disappears or becomes clear.
3.  **Refer to Documentation:** Consult the relevant documentation sections (components, core modules, architecture) for expected behavior and props.
**Revas Demo App:** Compare your implementation with the examples in the Revas demo app ([`../../src/develop/App.tsx`](../../src/develop/App.tsx:1)) if you are developing the library itself.
<!-- AI-IMPORTANCE:level=high -->

---

<!-- AI-CONTEXT-START:type=development -->

## Common Issues and Solutions

### 1. Nothing Renders on the Canvas / Blank Canvas

- **Cause:** Revas container DOM element not found or has no dimensions.
  - **Solution:** Ensure the DOM element you pass to `Revas.render()` exists in your HTML and has explicit `width` and `height` styles (e.g., `style="width: 500px; height: 300px;"`). A canvas with zero width or height will not be visible.
- **Cause:** Root component returns `null` or has issues.
  - **Solution:** Verify your root Revas component (e.g., `<App />`) is correctly defined and returns valid Revas elements. Add a simple `<View style={{ flex: 1, backgroundColor: 'red' }} />` to test if anything renders.
- **Cause:** JavaScript error during initialization.
  - **Solution:** Check the console for errors that might be halting script execution before Revas can render.
- **Cause:** Incorrect `render` call.
  - **Solution:** Double-check the arguments to `Revas.render(reactElement, domContainerNode)`.

### 2. Elements Not Visible or Incorrectly Positioned

- **Cause:** Incorrect layout styles (Flexbox).
  - **Solution:** Review your `flex`, `flexDirection`, `alignItems`, `justifyContent`, `width`, `height`, `margin`, `padding` styles. Use background colors on `<View>`s to visually debug their frames. Refer to [`../modules/styling/css-layout.md`](../modules/styling/css-layout.md:1) or [`../modules/styling/yoga-layout.md`](../modules/styling/yoga-layout.md:1).
- **Cause:** `z-index` issues (if applicable, though Revas core draw loop sorts by z-index from style).
  - **Solution:** Revas's drawing system in [`../../src/revas/core/draw.ts`](../../src/revas/core/draw.ts:1) sorts children by `zIndex`. Ensure `zIndex` is used correctly if you rely on it for stacking.
- **Cause:** Off-canvas rendering due to incorrect `x`, `y` in `frame` or transformations.
  - **Solution:** Log the `frame` property in an `onLayout` callback. Ensure transformations (`translateX`, `translateY`, `rotate`, `scale`) are applied as expected.
- **Cause:** `opacity: 0` or transparent colors.
  - **Solution:** Check style properties related to visibility.

### 3. Text Not Appearing or Incorrectly Styled

- **Cause:** Text content is not a direct child string of `<Text>`.
  - **Solution:** `<Text>` expects its children to be strings. `React.Children.toArray(children).join('')` is used internally, so `<Text>{variable}</Text>` where `variable` is a string or number should work. Complex children might not.
- **Cause:** Font issues (font not loaded, incorrect `fontFamily`).
  - **Solution:** Ensure the specified `fontFamily` is available to the browser/canvas. Default system fonts are safer. For custom web fonts, ensure they are loaded _before_ Revas tries to render text using them.
- **Cause:** Text color same as background color.
  - **Solution:** Check `color` style on `<Text>` and `backgroundColor` of its parent.
- **Cause:** `fontSize: 0` or very small.
  - **Solution:** Verify `fontSize`.
- **Cause:** Text clipped by `numberOfLines` or `overflow: 'hidden'` on a parent.
  - **Solution:** Check these properties. Increase `numberOfLines` or adjust parent's layout.

### 4. Images Not Loading or Displaying

- **Cause:** Incorrect `src` URL or path.
  - **Solution:** Verify the image URL is correct and accessible. Check the browser's network tab for 404 errors.
- **Cause:** CORS issues for remote images.
  - **Solution:** Ensure the image server allows cross-origin requests if loading from a different domain.
- **Cause:** Component dimensions are zero or image is not yet `$ready` for caching.
  - **Solution:** Give the `<Image>` component explicit `width` and `height` in its style. Check the `onLoad` and `onError` callbacks. If using `cache: true`, the image needs to be loaded for the cache to be effective, unless `forceCache: true` is used. See [`../modules/components/image.md`](../modules/components/image.md:1).
- **Cause:** `resizeMode` behavior misunderstood.
  - **Solution:** Experiment with `cover`, `contain`, `stretch` to see their effects. `backgroundColor` on the `<Image>` style can help visualize its frame.

### 5. Touch Interactions Not Working

- **Cause:** No touch handlers (`onTouchStart`, etc.) attached.
  - **Solution:** Add the necessary handlers to your `<View>` or `<Touchable>` components.
- **Cause:** `pointerEvents` prop misconfigured.
  - **Solution:**
    - `pointerEvents: 'none'` on an element or its ancestor will prevent it from receiving touch.
    - `pointerEvents: 'box-none'` on a parent means the parent won't receive touch but its children might.
    - Default is `'auto'`. Review [`../architecture/event-handling.md`](../architecture/event-handling.md:1).
- **Cause:** Element is visually obscured by another element that _is_ handling touch.
  - **Solution:** Check for overlapping elements. The topmost, hittable element usually receives the touch.
- **Cause:** `<ScrollView>` or `<ListView>` intercepting touches.
  - **Solution:** These components manage their own touch events for scrolling. If you have touchable items inside a ScrollView, ensure event propagation or specific touch handling within items is correctly managed. Sometimes, simpler interactions are easier to place outside heavily interactive scrollers.
- **Cause:** Incorrect frame calculation leading to hit-testing misses.
  - **Solution:** Use `onLayout` to verify the component's actual `frame` on the canvas.

### 6. Animations Jerky or Not Working

- **Cause:** `Animated.Value` not correctly linked to style or animation not started.
  - **Solution:** Ensure `Animated.timing(...).start()` is called. Verify the `Animated.Value` instance is passed to the style property (e.g., `style={{ translateX: this.animatedX }}`).
- **Cause:** Excessive re-renders or heavy computations on the main thread during animation.
  - **Solution:** Profile your application. Optimize expensive components. Use `React.memo` or `shouldComponentUpdate`. Offload heavy work. Ensure Revas animations are, where possible, bypassing full React VDOM diffs for style-only updates (see "Optimization Consideration" in [`../modules/core/animation.md`](../modules/core/animation.md:1)).
- **Cause:** Incorrect use of `addListener` or `interpolate`.
  - **Solution:** Double-check the `inputRange` and `outputRange` for interpolations. Ensure listeners correctly update styles and trigger re-draws.

### 7. Performance Problems

- **Cause:** Rendering too many elements or too many complex drawing operations per frame.
  - **Solution:**
    - Use `<ListView>` for long lists instead of mapping over data in a `<ScrollView>`.
    - Enable caching (`cache: true`) for complex, static subtrees using the offscreen cache: [`../modules/core/offscreen.md`](../modules/core/offscreen.md:1).
    - Simplify complex vector graphics or text effects if possible.
    - Reduce the frequency of re-draws if they are happening unnecessarily.
- **Cause:** Heavy layout calculations.
  - **Solution:** Simplify complex nested flexbox structures if they are causing bottlenecks. Ensure `onLayout` callbacks are not doing excessive work.

---

If you encounter an issue not listed here, try to understand which part of the Revas pipeline might be involved ([`../architecture/rendering-pipeline.md`](../architecture/rendering-pipeline.md:1)) and debug systematically from React components down to canvas drawing operations.

<!-- AI-CONTEXT-END -->
