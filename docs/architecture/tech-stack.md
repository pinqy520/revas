---
# AI Metadata Tags
ai_keywords:
  [
    tech stack,
    technology,
    libraries,
    react,
    react-reconciler,
    canvas,
    yoga,
    css-layout,
    typescript,
    vite,
    rollup,
    build tools,
  ]
ai_contexts: [architecture]
ai_relations: [docs/architecture/system-overview.md, package.json]
---

# Revas Technology Stack

This document details the key technologies, libraries, and dependencies that form the foundation of the Revas project. Understanding this stack is crucial for comprehending Revas's capabilities and limitations.

<!-- AI-IMPORTANCE:level=high -->

## Core Technologies

<!-- AI-IMPORTANCE:level=high -->

<!-- AI-CONTEXT-START:type=architecture -->

1.  **React (`react` package):**

    - **Version:** As specified in `peerDependencies` (e.g., `^17.0.0` from [`../../package.json`](../../package.json:27)).
    - **Role:** Provides the component model, state management (useState, useReducer), context API, hooks, and declarative UI paradigm. Revas allows developers to write UIs using familiar React patterns.
    - **Integration:** Revas components are React components. The core rendering mechanism is driven by React's lifecycle and update process.

2.  **React Reconciler (`react-reconciler` package):**

    - **Version:** As specified in `dependencies` (e.g., `^0.26.1` from [`../../package.json`](../../package.json:16)).
    - **Role:** This is a critical library from the React team that allows the creation of custom React renderers. Revas uses it to build a renderer that targets its internal "Node tree" and ultimately the HTML5 Canvas, instead of the DOM.
    - **Integration:** The [`src/revas/core/reconciler.ts`](../../src/revas/core/reconciler.ts:1) file defines the host config for the custom renderer, specifying how to create instances, append children, handle updates, etc., for Revas `Node`s.

3.  **HTML5 Canvas API:**

    - **Role:** The ultimate rendering target. Revas uses the 2D rendering context (`CanvasRenderingContext2D`) to draw all visual elements.
    - **Integration:** The [`src/revas/core/Canvas.ts`](../../src/revas/core/Canvas.ts:1) (`RevasCanvas`) class provides an abstraction layer over the native Canvas API, managing context state and providing drawing primitives used by the [`src/revas/core/draw.ts`](../../src/revas/core/draw.ts:1) system.

4.  **TypeScript:**
_ **Version:** As specified in `devDependencies` (e.g., `^4.0.0` from [`../../package.json`](../../package.json:41)).
_ **Role:** The primary programming language for the Revas codebase. It provides static typing, improving code quality, maintainability, and developer experience. \* **Integration:** All Revas core files and components are written in TypeScript. Type definitions (`.d.ts` files) are generated for consumers of the library.
<!-- AI-CONTEXT-END -->

<!-- AI-IMPORTANCE:level=normal -->

## Layout Engines

<!-- AI-IMPORTANCE:level=normal -->

Revas employs layout engines to calculate the position and size of elements based on CSS-like style properties, particularly Flexbox.

<!-- AI-CONTEXT-START:type=architecture -->

1.  **CSS Layout (`css-layout` package):**

    - **Version:** As specified in `dependencies` (e.g., `^1.1.1` from [`../../package.json`](../../package.json:15)).
    - **Role:** A JavaScript implementation of a subset of CSS layout, including a Flexbox engine. This was an early standard for implementing Flexbox in JavaScript environments.
    - **Integration:** Used in [`src/revas/core/css-layout/index.ts`](../../src/revas/core/css-layout/index.ts:1) as one of the layout calculation strategies.

2.  **Yoga Layout (`yoga-layout-wasm` package):**
_ **Version:** As specified in `dependencies` (e.g., `^1.9.3-alpha.7` from [`../../package.json`](../../package.json:18)).
_ **Role:** Yoga is a cross-platform layout engine developed by Facebook that implements Flexbox. The `yoga-layout-wasm` package provides a WebAssembly version for use in browsers, offering potentially better performance and more comprehensive Flexbox support than pure JS implementations. \* **Integration:** Used in [`src/revas/core/yoga-layout/index.ts`](../../src/revas/core/yoga-layout/index.ts:1) as an alternative and often preferred layout strategy. The choice of layout engine might be configurable or determined at runtime/build time.
<!-- AI-CONTEXT-END -->

<!-- AI-IMPORTANCE:level=normal -->

## Animation

<!-- AI-IMPORTANCE:level=normal -->

<!-- AI-CONTEXT-START:type=architecture -->

1.  **Bezier Easing (`bezier-easing` package):**
_ **Version:** As specified in `dependencies` (e.g., `^2.1.0` from [`../../package.json`](../../package.json:14)).
_ **Role:** Provides bezier curve calculation for smooth animation easing functions. \* **Integration:** Likely used by the [`src/revas/core/Animated.ts`](../../src/revas/core/Animated.ts:1) system to create natural-looking animations beyond simple linear transitions.
<!-- AI-CONTEXT-END -->

<!-- AI-IMPORTANCE:level=normal -->

## Build Tools & Development Dependencies

<!-- AI-IMPORTANCE:level=normal -->

While not part of the runtime stack for the end-user, these tools are crucial for developing and building Revas itself.

<!-- AI-CONTEXT-START:type=development -->

1.  **Rollup (`rollup`):**
    - Used as the module bundler to package the Revas library into distributable formats (CommonJS, ES modules). See [`../../rollup.config.ts`](../../rollup.config.ts:1).
2.  **TypeScript (`typescript`):**
    - Transpiles TypeScript code to JavaScript.
3.  **Rollup Plugins:**
    - `rollup-plugin-typescript2`: Integrates TypeScript compilation into the Rollup build process.
    - `rollup-plugin-commonjs`: Converts CommonJS modules to ES6.
    - `rollup-plugin-node-resolve`: Resolves Node.js modules.
    - `rollup-plugin-json`: Allows importing JSON files.
    - `@rollup/plugin-typescript`: (Replacing `rollup-plugin-typescript2` if that was a typo or older plugin, [`../../rollup.config.mjs`](../../rollup.config.mjs:1) uses this) Integrates TypeScript compilation.
4.  **Vite (`vite`):**


    - Used as the development server and build tool for the example/demo application ([`../../src/develop/App.tsx`](../../src/develop/App.tsx:1)).
    - Provides a fast development experience with Hot Module Replacement (HMR).
    - The `start` script in [`../../package.json`](../../package.json:44) (`npm start` or `yarn start`) now runs Vite.
    - The `build:pwa` script also uses Vite for building the demo application (see [`../../package.json`](../../package.json:47)).
    - Configuration is in [`../../vite.config.ts`](../../vite.config.ts:1).
    - Uses `@vitejs/plugin-react-swc` for React support with SWC.

5.  **React Scripts (`react-scripts`):**


    - Its role is now primarily limited to running tests for the example application via the `test` script in [`../../package.json`](../../package.json:48).

6.  **TSLib (`tslib`):**


    - A runtime library for TypeScript that contains helper functions generated by the TypeScript compiler. Listed in `dependencies` (e.g., [`../../package.json`](../../package.json:17)) to ensure these helpers are available.

<!-- AI-CONTEXT-END -->

This technology stack enables Revas to provide a React-centric development experience while abstracting away the complexities of direct canvas manipulation and layout calculations.
