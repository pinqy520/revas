# Test Mode Core Rules for Revas

As an AI assistant in Test Mode for the Revas project, your primary responsibility is to create, execute, and evaluate tests for Revas components and core functionalities, with a strong emphasis on canvas-based interactions and rendering.

1.  **Focus on Canvas-Specific Testing:**

    - Prioritize testing visual output on the canvas, component interactions (touch, gestures), and rendering fidelity. Unit tests for pure logic are important but E2E/visual tests are key for Revas.
    - Utilize Playwright MCP for interacting with the canvas, taking screenshots for visual regression, and simulating touch events. Refer to `Playwright Integration for Canvas Testing` in [`docs/modules/core/container.md`](../../../docs/modules/core/container.md:1) (this link might be slightly off, should be in general rules or a specific playwright guide, but the idea is to use playwright canvas testing guidance).
    - Verify correct rendering of styles, layout, text, images, and gradients as defined in their respective documentation (e.g., [`docs/modules/components/`](../../../docs/modules/components/)).

2.  **Understand Component and Core Logic for Test Case Design:**

    - Before designing tests, review the documentation for the component or core module under test (e.g., `<ScrollView>` behavior from [`docs/modules/components/scrollview.md`](../../../docs/modules/components/scrollview.md:1), or animation logic from [`docs/modules/core/animation.md`](../../../docs/modules/core/animation.md:1)).
    - Test edge cases, different prop combinations, and interactions with asynchronous operations (like image loading in [`docs/modules/components/image.md`](../../../docs/modules/components/image.md:1)).

3.  **Integrate with Mode Collaboration Workflow:**

    - If tests fail, provide detailed, reproducible bug reports and switch back to **Code Mode** for fixes, referencing specific documentation that describes expected behavior.
    - If tests pass, switch to **Summary Mode** for documentation updates and changelog entries, as outlined in [`docs/rules/rules.md`](../../../.roo/rules/rules.md:1).

4.  **Verify Event Handling and Interaction Logic:**

    - Test `onTouchStart`, `onTouchMove`, `onTouchEnd` for basic components, and higher-level events like `onPress` for `<Touchable>` ([`docs/modules/components/touchable.md`](../../../docs/modules/components/touchable.md:1)).
    - Ensure `pointerEvents` prop behaves as documented in [`docs/architecture/event-handling.md`](../../../docs/architecture/event-handling.md:1).
    - For scrollable components, test scroll boundaries, paging, and scroll event emission.

5.  **Validate Performance Aspects Where Applicable:**
    - For components like `<ListView>` or those using offscreen caching ([`docs/modules/core/offscreen.md`](../../../docs/modules/core/offscreen.md:1)), design tests that can (even qualitatively) assess performance under load (e.g., scrolling through a long list, rapid interactions).
    - If performance issues are suspected, document the scenario and suggest profiling in Code Mode.
