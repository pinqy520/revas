---
# AI Metadata Tags
ai_keywords:
  [
    offscreen canvas,
    caching,
    performance,
    rendering optimization,
    draw cache,
    RevasCanvas,
  ]
ai_contexts: [architecture, implementation, development]
ai_relations:
  [
    docs/modules/core/draw.md,
    docs/modules/core/canvas.md,
    docs/modules/core/node.md,
    docs/architecture/rendering-pipeline.md,
  ]
---

# Revas Offscreen Caching System

Revas implements an offscreen caching mechanism, primarily managed by logic in [`../../../src/revas/core/offscreen.ts`](../../../src/revas/core/offscreen.ts:1), to optimize rendering performance. This system allows parts of the `Node` tree to be pre-rendered to an invisible offscreen canvas. Subsequently, instead of re-drawing all primitives for these nodes on every frame, the pre-rendered image from the offscreen canvas can be quickly drawn onto the main visible canvas.

<!-- AI-IMPORTANCE:level=critical -->

## Purpose and Role

1.  **Performance Optimization:** The main goal is to reduce the number of drawing operations on the main canvas, especially for complex or static subtrees of the UI. Drawing a single cached image is often much faster than executing many individual drawing commands.
2.  **Reduced CPU Load:** By avoiding redundant calculations and drawing operations for unchanged parts of the UI, CPU load can be decreased.
3.  **Improved Animation Smoothness:** Can help in achieving smoother animations for other parts of the UI by freeing up rendering time.
<!-- AI-IMPORTANCE:level-critical -->

---

<!-- AI-CONTEXT-START:type=architecture -->

## Key Concepts and Workflow

1.  **Cache Trigger (`Node.props.cache`):**

    - Caching for a `Node` and its subtree is typically enabled by setting the `cache` prop on that `Node`.
    - `cache: true`: Revas will attempt to use an automatically generated ID for the cache.
    - `cache: "your-custom-id"`: A specific string ID can be provided, allowing more control over cache invalidation or sharing if applicable (though sharing is less common for subtree caches).

2.  **Cache Readiness (`Node.$ready` and `Node.props.forceCache`):**

    - Before a `Node`'s subtree is cached, Revas checks if it's "ready" using the `Node.$ready` getter. This is important for components like `Image` that might have asynchronous loading. A subtree isn't fully ready if, for example, an image within it hasn't loaded.
    - The `forceCache: true` prop can be used to bypass this readiness check and cache the subtree in its current state, even if some content isn't fully loaded.

3.  **Cache Storage:**

    - A global or per-container cache store (e.g., a JavaScript `Map` or object) is used to hold the offscreen canvases. This is represented by `CACHED_TEXTURES` in [`../../../src/revas/core/offscreen.ts`](../../../src/revas/core/offscreen.ts:1).
    - Each cache entry typically stores:
      - The offscreen `RevasCanvas` instance itself.
      - The style properties of the node when it was cached (to check if styles have changed, invalidating the cache).
      - Dimensions (`width`, `height`) of the cached content.

4.  **Cache Creation (Cache Miss):**

    - During the drawing process for a cachable `Node` ([`../../../src/revas/core/draw.ts`](../../../src/revas/core/draw.ts:1)'s `drawCache` function):
      - If no valid cache exists (cache miss) and the node is ready (or `forceCache` is true):
        1.  An offscreen `RevasCanvas` is created using `adapter.createOffscreenCanvas(width, height)` (from [`../../../src/revas/core/utils.ts`](../../../src/revas/core/utils.ts:1)). The dimensions accommodate the node's frame plus any shadow spread.
        2.  The `Node`'s subtree is drawn onto this offscreen canvas. Transformations are applied so drawing occurs relative to the offscreen canvas's origin.
        3.  This new offscreen canvas, along with current styles and dimensions, is stored in the `CACHED_TEXTURES`.
        4.  The content of this newly created offscreen canvas is then drawn onto the main visible canvas.

5.  **Cache Usage (Cache Hit):**

    - If a valid cache entry exists for the `Node`'s ID and its relevant style properties haven't changed significantly (the exact invalidation logic can vary):
      - The pre-rendered image from the stored offscreen `RevasCanvas` is drawn directly onto the main visible canvas using `canvas.context.drawImage()`. This bypasses drawing the individual child nodes and their primitives.

6.  **Cache Invalidation:**
_ **Implicit:** If a `Node`'s props (especially styles that affect its appearance or the appearance of its children) change, the old cache might become invalid. The `drawCache` function in `draw.ts` implicitly handles this by comparing current styles with cached styles; if they differ, it re-creates the cache.
_ **Explicit:** `clearCache(id?: string)` function in [`../../../src/revas/core/offscreen.ts`](../../../src/revas/core/offscreen.ts:1).
_ If called with an `id`, it removes that specific cache entry.
_ If called without an `id`, it clears all cache entries. This is typically done when the overall canvas size changes (e.g., on window resize) because cached images at old resolutions would be incorrect.
<!-- AI-CONTEXT-END -->

---

<!-- AI-CONTEXT-START:type=implementation -->

## Implementation Details in `offscreen.ts`

- **`CACHED_TEXTURES = new Map<string, CacheEntry>()`:** The global store for cache entries.
- **`CacheEntry` Interface:** Defines the structure of a cache entry (canvas, style, width, height).
- **`autoCacheId(node: Node)`:** Generates a unique ID for a node based on its path from the root. This is used when `cache: true`.
- **`getCache(id: string)`:** Retrieves a cache entry by ID.
- **`createCache(style: any, width: number, height: number, id: string)`:** Creates a new offscreen canvas, stores it, and returns the `CacheEntry`.
  - Uses `adapter.createOffscreenCanvas()` which, for the web, creates a new `<canvas>` element and a `RevasCanvas` instance for it.
- **`clearCache(id?: string)`:** Manages cache invalidation.

## Interaction with Drawing System (`draw.ts`)

The `drawCache` function within [`../../../src/revas/core/draw.ts`](../../../src/revas/core/draw.ts:1) is where the decision to use or create a cache entry happens:

```typescript
// Simplified logic within draw.ts drawCache function
function drawCache(mainCanvas: RevasCanvas, node: Node /* ... */) {
  const cacheId =
    node.props.cache === true
      ? autoCacheId(node)
      : (node.props.cache as string);
  let cachedEntry = getCache(cacheId);

  // Simplified invalidation check (actual check might be more complex)
  if (
    cachedEntry &&
    !areStylesCompatible(node.props.style, cachedEntry.style)
  ) {
    clearCache(cacheId);
    cachedEntry = undefined;
  }

  if (!cachedEntry) {
    if (!node.$ready && !node.props.forceCache) {
      // Fallback to direct drawing if not ready and not forced
      return drawContent(mainCanvas, node /* ... */);
    }
    // Create cache:
    // 1. const offscreenCanvas = adapter.createOffscreenCanvas(width, height);
    // 2. drawContent(offscreenCanvas, node, /* ... */); // Draw to offscreen
    // 3. cachedEntry = storeInCache(cacheId, offscreenCanvas, node.props.style, width, height);
    // For simplicity, assume createCache in offscreen.ts handles storing.
    cachedEntry = createCache(node.props.style, width, height, cacheId);
    // ... draw node to cachedEntry.canvas ...
    drawContent(cachedEntry.canvas, node, container, style, frame, hasClip); // Draw to the new cache
  }

  // Draw from cache (or newly created cache) to main canvas
  mainCanvas.context.drawImage(
    cachedEntry.canvas.element /* coordinates and dimensions */
  );
}
```

<!-- AI-CONTEXT-END -->

<!-- AI-IMPORTANCE:level=normal -->

## When to Use Caching

- **Complex, Static Subtrees:** Ideal for parts of the UI that are expensive to render but do not change frequently (e.g., a complex background, a fully rendered chart that only updates occasionally).
- **Items in Virtualized Lists:** Individual list items that are scrolled off and then on screen could benefit if their content is cachable, though virtualization itself often provides more significant gains.
- **Text Heavy Sections:** Rendering text can be relatively expensive. If a block of text doesn't change, caching it can be beneficial.

Care must be taken not to over-cache, as creating and managing many offscreen canvases can also consume memory and add overhead. It's a trade-off that needs to be profiled for specific use cases.

<!-- AI-IMPORTANCE:level=normal -->
