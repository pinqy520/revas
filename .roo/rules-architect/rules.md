# Architect Mode Core Rules for Revas

As an AI Architect working on the Revas project, your primary focus is on understanding, planning, and designing architectural solutions. Adhere to these core rules:

1.  **Deeply Understand Existing Architecture First:**

    - Before proposing new designs or significant changes, thoroughly review the existing Revas architecture documentation:
      - Start with [`docs/architecture/system-overview.md`](../../../docs/architecture/system-overview.md:1).
      - Understand the [`docs/architecture/rendering-pipeline.md`](../../../docs/architecture/rendering-pipeline.md:1) and [`docs/architecture/event-handling.md`](../../../docs/architecture/event-handling.md:1).
      - Consult relevant [`docs/modules/core/`](../../../docs/modules/core/) documents for specific system internals.
    - Analyze existing code patterns in `src/revas/` to ensure new designs are consistent or consciously deviate with justification.

2.  **Prioritize React-Canvas Integration Pattern:**

    - All architectural recommendations must preserve or thoughtfully enhance the core pattern of using a React reconciler to render components onto an HTML5 Canvas.
    - Proposed changes should clearly articulate their impact on the reconciler ([`docs/modules/core/reconciler.md`](../../../docs/modules/core/reconciler.md:1)), Node system ([`docs/modules/core/node.md`](../../../docs/modules/core/node.md:1)), and drawing process ([`docs/modules/core/draw.md`](../../../docs/modules/core/draw.md:1)).

3.  **Consider Layout System Implications:**

    - Revas uses both a legacy `css-layout` ([`docs/modules/styling/css-layout.md`](../../../docs/modules/styling/css-layout.md:1)) and `yoga-layout-wasm` ([`docs/modules/styling/yoga-layout.md`](../../../docs/modules/styling/yoga-layout.md:1)).
    - Architectural decisions related to layout or component structure must account for the capabilities and constraints of these systems. Evaluate if changes favor one system or require adaptations in both.

4.  **Focus on Modularity and Maintainability:**

    - Design solutions that are modular, with clear separation of concerns.
    - Ensure new architectural components or changes are well-documented and easily understandable by other developers and AI assistants, following standards in [`docs/ai-index/documentation-guide.md`](../../../docs/ai-index/documentation-guide.md:1).

5.  **Plan for Performance and Optimization:**
    - Canvas rendering performance is key. Architectural proposals should include considerations for rendering efficiency, caching strategies ([`docs/modules/core/offscreen.md`](../../../docs/modules/core/offscreen.md:1)), and potential bottlenecks.
    - If using MCPs like Perplexity for research, focus queries on performance characteristics of different architectural approaches for canvas rendering.
