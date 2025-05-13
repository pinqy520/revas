# General Rules for AI Assistants Working with Revas

This document outlines the general operational guidelines, documentation access strategies, mode collaboration workflows, and MCP (Model Context Protocol) usage scenarios for AI assistants working on the Revas project. Adherence to these rules ensures consistency, efficiency, and optimal use of AI capabilities.

<!-- AI-IMPORTANCE:level=critical -->

## Core Principle: Context First

Before performing any task (coding, analysis, documentation), AI assistants must first try to understand the relevant context by:

1.  Consulting the AI-optimized documentation in the `docs/` directory.
2.  Referring to existing code patterns within the `src/revas/` directory.
3.  Utilizing the specific rules for the current operational mode (e.g., `../rules-code/rules.md`).
<!-- AI-IMPORTANCE:level=critical -->

## Document Access Patterns and Usage

AI assistants should access and utilize the documentation library (`docs/`) as their primary source of truth for understanding Revas.

1.  **Entry Point:** Always start with [`docs/ai-index/overview.md`](../../docs/ai-index/overview.md:1) for a general project understanding.
2.  **Navigation:** Use [`docs/ai-index/navigation-guide.md`](../../docs/ai-index/navigation-guide.md:1) to find relevant documents based on the task.
3.  **Architectural Understanding:** For tasks requiring architectural knowledge (e.g., modifying core behavior, designing new features), consult:
    - [`docs/architecture/system-overview.md`](../../docs/architecture/system-overview.md:1)
    - [`docs/architecture/rendering-pipeline.md`](../../docs/architecture/rendering-pipeline.md:1)
    - [`docs/architecture/event-handling.md`](../../docs/architecture/event-handling.md:1)
    - [`docs/architecture/tech-stack.md`](../../docs/architecture/tech-stack.md:1)
4.  **Module-Specific Tasks:** When working on or with specific modules (core, components, styling), refer to the detailed documents within the respective `docs/modules/` subdirectories. For example, for issues related to the `<Image>` component, consult [`docs/modules/components/image.md`](../../docs/modules/components/image.md:1).
5.  **Implementation Details:** When needing to understand how a specific Revas `Node` or system works internally, refer to its corresponding `.md` file in `docs/modules/core/` (e.g., [`docs/modules/core/Node.ts`](../../docs/modules/core/node.md:1) for the Node system).
6.  **Development and Troubleshooting:** Utilize [`docs/dev-guides/setup.md`](../../docs/dev-guides/setup.md:1) and [`docs/dev-guides/troubleshooting.md`](../../docs/dev-guides/troubleshooting.md:1).
7.  **AI Metadata and Markers:** Pay close attention to `ai_keywords`, `ai_contexts`, `ai_relations` in document frontmatter, and inline `<!-- AI-IMPORTANCE -->` / `<!-- AI-CONTEXT-START/END -->` markers to gauge relevance and depth of information.
8.  **Documentation Standards:** When creating or updating documentation (primarily in Summary mode), adhere strictly to [`docs/ai-index/documentation-guide.md`](../../docs/ai-index/documentation-guide.md:1).

## Mode Collaboration Workflow

To efficiently complete development tasks, AI modes should follow this collaboration flow:

1.  **Architect Mode (`../../.roo/rules-architect/rules.md`):**

    - Responsible for initial project planning, high-level design, and significant architectural changes.
    - Analyzes requirements, explores existing architecture via `docs/`, and proposes solutions.
    - Upon completion of planning, typically switches to **Code Mode** for specific implementation, or **Summary Mode** if only documentation changes are needed.

2.  **Code Mode (`../../.roo/rules-code/rules.md`):**

    - Responsible for code writing, refactoring, debugging, and unit testing based on plans from Architect mode or direct user requests.
    - Must adhere to existing coding patterns found in `src/revas/` and relevant documentation.
    - After all coding work is done and basic self-testing is complete, should switch to **Test Mode** for comprehensive testing.

3.  **Test Mode (`../../.roo/rules-test/rules.md`):**

    - Responsible for creating test plans, preparing test resources (including using Playwright via MCP for E2E tests), and executing tests.
    - If issues are found during testing, should clearly document them and switch back to **Code Mode** for fixes, providing detailed reproduction steps.
    - If tests pass without issues, should switch to **Summary Mode** for summarization and document updates.

4.  **Summary Mode (`../../.roo/rules-summary/rules.md`):**

    - After tests pass (or after direct code/documentation changes), responsible for summarizing work and updating all relevant documents in the `docs/` directory.
    - Ensures documentation is consistent with the final implementation, adhering to `documentation-guide.md`.
    - Updates `changelog.md` and relevant task plans.
    - May initiate a new task for full documentation review if significant changes were made.

5.  **Orchestrator Mode (if used):**
    - Responsible for coordinating complex, multi-step tasks, possibly involving switching between the above modes and allocating sub-tasks. Relies heavily on understanding these general rules.

## MCP (Model Context Protocol) Usage Scenarios

This project may use the following MCP services, applied in specific scenarios. Always seek to use internal documentation and project code first before resorting to external MCPs.

### Playwright (`playwright` MCP server)

- **Primary Use:** End-to-end (E2E) testing and visual verification of Revas components.
- **Scenario 1 (Test Mode):** Conduct E2E testing for Revas applications.
  - Verify UI interactions (touch events, scrolling) on the rendered canvas.
  - Take screenshots of canvas elements for visual regression testing or to verify complex rendering.
  - Automate interaction sequences as defined in test plans.
- **Scenario 2 (Debug/Code Mode - Advanced):** Interact with a live Revas demo page to inspect behavior that is difficult to reproduce locally or to gather visual context for a bug.
- **Scenario 3 (Summary Mode - Rare):** Capture screenshots of well-rendered components for inclusion in documentation (prefer static images if possible).

**Playwright Usage Notes:**

- When interacting with Revas, remember it's a single canvas. Target elements using Playwright's coordinate-based interactions or by identifying unique visual features if possible (though the latter is harder on a canvas).
- Focus on testing the _rendered output_ and _interaction logic_ of Revas, not its internal JavaScript functions (which are better for unit tests).

### Perplexity (`perplexity` MCP server)

- **Primary Use:** Researching unfamiliar concepts, APIs, or best practices related to technologies Revas uses (Canvas, TypeScript, React, Flexbox, WebAssembly).
- **Scenario 1 (Code/Architect Mode):** Query unfamiliar low-level Canvas API usage details or advanced rendering techniques if not covered in existing Revas docs.
  - Example: "Optimal way to draw dashed lines with varying thickness on HTML5 canvas."
- **Scenario 2 (Code/Architect Mode):** Resolve difficult problems encountered during development related to layout engine behavior (Flexbox nuances) or performance characteristics of specific approaches.
  - Example: "Common performance pitfalls with complex Flexbox structures in a JavaScript layout engine."
- **Scenario 3 (Any Mode):** Learn about industry best practices for a specific pattern Revas is trying to implement, if current documentation seems insufficient.
  - Example: "Best practices for virtualized list rendering in a canvas environment."

**Perplexity Usage Notes:**

- **Verify Information:** Information from Perplexity should be cross-referenced and validated, especially if it pertains to Revas's specific internal architecture. Project documentation takes precedence.
- **Avoid Code Copying:** Do not directly copy large code snippets from Perplexity into the Revas codebase without careful review, adaptation, and testing. Use it for understanding and ideas.
- **Contextualize Queries:** Provide sufficient context in queries to Perplexity (e.g., "In the context of a custom React renderer for HTML5 canvas...") to get more relevant answers.

---

Adherence to these general rules and workflows will ensure that AI assistants contribute effectively and consistently to the Revas project.
