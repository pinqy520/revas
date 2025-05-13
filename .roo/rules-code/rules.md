# Code Mode Core Rules for Revas

As an AI Code assistant working on the Revas project, your primary responsibility is writing, refactoring, and debugging TypeScript code for Revas components and core systems. Adhere to these core rules:

1.  **Prioritize Existing Documentation and Patterns:**

    - Before writing code, always consult the relevant documentation in `docs/` (e.g., component specs in `docs/modules/components/`, core logic in `docs/modules/core/`). Use the [`docs/ai-index/navigation-guide.md`](../../../docs/ai-index/navigation-guide.md:1) to find the right documents.
    - Study existing code in `src/revas/` to understand and replicate established patterns, especially for component structure, styling, and core system interactions.

2.  **Adhere to Revas Component Structure:**

    - Revas primitive components (e.g., `<View>`, `<Text>`) are typically simple functional components that return `React.createElement('TypeName', props)`.
    - Components with internal logic or state (e.g., `<Image>`, `<ScrollView>`, `<Touchable>`) might be class components or functional components with hooks.
    - For components requiring custom drawing logic (like `<Text>`, `<Image>`, `<LinearGradient>`), ensure the `customDrawer` prop is correctly implemented and passed to the underlying `React.createElement` call. The `customDrawer` function itself should use the `RevasCanvas` and `Node` information as described in [`docs/modules/core/draw.md`](../../../docs/modules/core/draw.md:1).

3.  **Respect the Rendering Pipeline and Node System:**

    - Understand that your component code will be processed by the Revas reconciler ([`docs/modules/core/reconciler.md`](../../../docs/modules/core/reconciler.md:1)) into `Node` instances ([`docs/modules/core/node.md`](../../../docs/modules/core/node.md:1)).
    - Style props directly influence layout ([`docs/modules/styling/`](../../../docs/modules/styling/)) and drawing ([`docs/modules/core/draw.md`](../../../docs/modules/core/draw.md:1)).
    - For components with asynchronous aspects (like `<Image>`), ensure the `Node.$ready` state is correctly managed to integrate with the caching system ([`docs/modules/core/offscreen.md`](../../../docs/modules/core/offscreen.md:1)).

4.  **Focus on Canvas Performance and Optimization:**

    - Be mindful of canvas drawing operations. Avoid unnecessary or redundant drawing.
    - Utilize the offscreen caching mechanism (`cache` prop) for complex or static components where appropriate.
    - When implementing animations with `Animated.Value` ([`docs/modules/core/animation.md`](../../../docs/modules/core/animation.md:1)), strive for solutions that update styles directly on `Node`s and trigger redraws efficiently, potentially bypassing full React updates for each frame.

5.  **TypeScript Best Practices and Type Safety:**
    - Write strongly-typed TypeScript code. Utilize interfaces and types defined in `src/revas/` (e.g., `NodeProps`, `RevasTouchEvent`).
    - Ensure new code is well-typed and integrates seamlessly with existing type definitions. Refer to [`tsconfig.json`](../../../tsconfig.json:1) for compiler options.
    - If using Perplexity for research, ensure any suggested code is adapted to TypeScript and Revas's specific types.
