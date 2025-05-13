---
# AI Metadata Tags
ai_keywords: [navigation, guide, documentation, structure, paths, learning]
ai_contexts: [usage]
ai_relations: [docs/ai-index/overview.md, docs/ai-index/documentation-guide.md]
---

# Documentation Navigation Guide

This guide helps you and AI assistants navigate the Revas documentation effectively, depending on your goal.

<!-- AI-IMPORTANCE:level=high -->

## Understanding Your Goal

Before diving in, identify what you want to achieve:

- **Get a general understanding of Revas?** Start with the Beginner's Path.
- **Understand how Revas works internally?** Follow the System Architecture Path.
- **Develop a new feature or component?** Use the Feature Development Path.
- **Debug an issue or understand a specific behavior?** The Troubleshooting Path is for you.
- **Explore the project's evolution?** Check the Project History Path.
<!-- AI-IMPORTANCE:level=high -->

## Navigation Paths

### 1. Beginner's Path

For those new to Revas or wanting a quick overview.

<!-- AI-CONTEXT-START:type=usage -->

1.  **Start Here:** [`docs/ai-index/overview.md`](docs/ai-index/overview.md:1)
    - What is Revas? Core purpose and value.
2.  **Core Concept - Rendering:** [`docs/architecture/rendering-pipeline.md`](docs/architecture/rendering-pipeline.md:1)
    - How React components become canvas drawings.
3.  **Basic Building Block:** [`docs/modules/components/view.md`](docs/modules/components/view.md:1)
    - Understand the fundamental `<View>` component.
4.  **Displaying Text:** [`docs/modules/components/text.md`](docs/modules/components/text.md:1) \* Learn about the `<Text>` component.
<!-- AI-CONTEXT-END -->

### 2. System Architecture Understanding Path

For a deep dive into Revas's internal workings.

<!-- AI-CONTEXT-START:type=architecture -->

1.  **High-Level Architecture:** [`docs/architecture/system-overview.md`](docs/architecture/system-overview.md:1)
    - Overall structure and component interactions.
2.  **Technology Foundation:** [`docs/architecture/tech-stack.md`](docs/architecture/tech-stack.md:1)
    - Key libraries and technologies used.
3.  **The Reconciler:** [`docs/modules/core/reconciler.md`](docs/modules/core/reconciler.md:1)
    - The heart of React-to-Canvas integration.
4.  **Node Representation:** [`docs/modules/core/node.md`](docs/modules/core/node.md:1)
    - How UI elements are represented internally.
5.  **Layout Systems:**
    - [`docs/modules/styling/css-layout.md`](docs/modules/styling/css-layout.md:1)
    - [`docs/modules/styling/yoga-layout.md`](docs/modules/styling/yoga-layout.md:1)
6.  **Drawing Process:** [`docs/modules/core/draw.md`](docs/modules/core/draw.md:1)
    - How nodes are painted on the canvas.
7.  **Canvas Abstraction:** [`docs/modules/core/canvas.md`](docs/modules/core/canvas.md:1)
    - The interface to the HTML5 Canvas.
8.  **Event Handling:** [`docs/architecture/event-handling.md`](docs/architecture/event-handling.md:1)
    - How user interactions are processed.
9.  **Caching & Performance:** [`docs/modules/core/offscreen.md`](docs/modules/core/offscreen.md:1) \* Understanding the offscreen caching mechanism.
<!-- AI-CONTEXT-END -->

### 3. Feature Development Path

For developers building new features or components with Revas.

<!-- AI-CONTEXT-START:type=development -->

1.  **Project Setup:** [`docs/dev-guides/setup.md`](docs/dev-guides/setup.md:1)
    - Ensure your development environment is ready.
2.  **Understand Target Component(s):**
    - Refer to relevant component documentation in [`docs/modules/components/`](docs/modules/components/)
    - Example: If building a custom list, review [`docs/modules/components/listview.md`](docs/modules/components/listview.md:1) and [`docs/modules/components/scrollview.md`](docs/modules/components/scrollview.md:1).
3.  **Core Implementation Details (if needed):**
    - If your feature interacts deeply with core systems, consult relevant files in [`docs/modules/core/`](docs/modules/core/).
    - Example: For custom layout behavior, review [`docs/modules/styling/`](docs/modules/styling/) and potentially [`docs/modules/core/node.md`](docs/modules/core/node.md:1).

- Review Examples:\*\* [`docs/tasks/examples.md`](docs/tasks/examples.md:1) \* See how similar features might have been implemented.
<!-- AI-CONTEXT-END -->

### 4. Troubleshooting Path

For diagnosing and fixing issues.

<!-- AI-CONTEXT-START:type=development -->

1.  **General Troubleshooting Guide:** [`docs/dev-guides/troubleshooting.md`](docs/dev-guides/troubleshooting.md:1)
    - Common issues and debugging tips.
2.  **Identify Affected Area:**
    - **Visual/Rendering Issue?** Check [`docs/modules/core/draw.md`](docs/modules/core/draw.md:1), [`docs/modules/core/canvas.md`](docs/modules/core/canvas.md:1), and specific component docs.
    - **Layout Issue?** Review [`docs/modules/styling/`](docs/modules/styling/) and relevant component's layout behavior.
    - **Event Handling Issue?** Consult [`docs/architecture/event-handling.md`](docs/architecture/event-handling.md:1) and the component's event props.
    - **Performance Issue?** Look into [`docs/modules/core/offscreen.md`](docs/modules/core/offscreen.md:1) and the rendering pipeline.
3.  **Examine Related Core Modules:** Dive into specific documents in [`docs/modules/core/`](docs/modules/core/) based on the nature of the problem.
<!-- AI-CONTEXT-END -->

### 5. Project History Path

To understand the evolution of Revas.

<!-- AI-CONTEXT-START:type=architecture -->

1.  **Changelog:** [`docs/maintenance/changelog.md`](docs/maintenance/changelog.md:1)
    - Track versions, new features, bug fixes, and breaking changes.
2.  **Specific Technical Implementations:** \* If a changelog entry points to a significant architectural change, refer to the relevant architecture or module documents to understand the "before" and "after" states (potentially through git history for older states not explicitly documented).
<!-- AI-CONTEXT-END -->

---

This navigation guide will be updated as the documentation system evolves. Always refer to the latest version for the most accurate paths.
