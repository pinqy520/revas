---
# AI Metadata Tags
ai_keywords: [revas, overview, canvas, react, css, frontend, ui, library]
ai_contexts: [architecture, usage]
ai_relations:
  [docs/architecture/system-overview.md, docs/ai-index/navigation-guide.md]
---

# Revas Project Overview

<!-- AI-IMPORTANCE:level=critical -->

## Core Purpose and Functionality

Revas is a frontend library designed to empower developers to build rich, interactive User Interfaces (UIs) directly on an HTML5 Canvas element, leveraging the familiar paradigms of React and CSS-like styling. It provides a component-based architecture, similar to React, allowing for the construction of complex UIs from reusable pieces.

The core functionality revolves around:

- **Declarative UI:** Defining UI structure using React components.
- **CSS-in-JS Styling:** Applying styles to components using JavaScript objects that mimic CSS properties, including flexbox for layout.
- **Canvas Rendering:** Translating the React component tree and associated styles into drawing operations on a canvas.
- **Event Handling:** Managing touch and pointer events on canvas elements.
- **Animation Support:** Facilitating animations for dynamic UIs.
<!-- AI-IMPORTANCE:level=critical -->

## Architecture Summary

<!-- AI-CONTEXT-START:type=architecture -->

Revas's architecture is centered around a custom React reconciler. This reconciler takes the React component tree and, instead of targeting the DOM, it translates the component hierarchy into a tree of "Revas Nodes." These nodes represent the visual elements and their properties.

Key architectural components include:

1.  **React Components:** Developers define their UI using standard React components.
2.  **Revas Reconciler:** Interprets the React component tree and updates the internal Revas Node tree.
3.  **Node System:** A tree of `Node` objects representing the UI elements, their styles, and layout information. Each `Node` typically corresponds to a Revas component like `<View>`, `<Text>`, etc.
4.  **Layout Engine:** Calculates the position and size of each `Node` based on its style properties (flexbox, dimensions, etc.), using either a custom CSS layout implementation or Yoga Layout.
5.  **Drawing System:** Traverses the Revas Node tree and issues drawing commands to the `RevasCanvas` abstraction.
6.  **RevasCanvas:** An abstraction over the HTML5 Canvas API, providing a consistent drawing interface.
7.  **Event System:** Captures user interactions (e.g., touch events) on the canvas and dispatches them to the appropriate `Node`s.

This architecture allows developers to benefit from React's component model and declarative nature while rendering UIs in a non-DOM environment, offering potential performance benefits and greater control over rendering.

<!-- AI-CONTEXT-END -->

## Core Value Proposition

The primary value of Revas lies in its ability to:

- **Utilize React Skills:** Developers familiar with React can readily build canvas-based UIs without a steep learning curve.
- **Leverage CSS Knowledge:** Styling is done using a subset of CSS properties, making it intuitive for web developers.
- **High-Performance UIs:** By rendering directly to canvas, Revas can bypass some of the overhead associated with the DOM, potentially leading to smoother animations and interactions, especially for complex visualizations or game-like interfaces.
- **Cross-Platform Potential:** While the current focus is web, the abstraction layer could facilitate rendering on other canvas-based platforms.

## When and Why to Use Revas

Revas is a suitable choice when:

- You need to build highly custom or graphically intensive UIs that are difficult or inefficient to achieve with standard DOM elements.
- Performance for complex animations or large numbers of visual elements is a critical concern.
- You want to leverage the React ecosystem (component model, state management) for a canvas-based application.
- You are developing applications like interactive dashboards, simple games, data visualizations, or custom UI toolkits that need fine-grained control over rendering.

It might not be the best choice for:

- Standard content-heavy websites or applications that primarily rely on semantic HTML and accessibility features provided by the DOM.
- Projects where SEO is a primary concern, as canvas content is not easily indexable by search engines.
