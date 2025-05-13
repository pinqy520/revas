---
# AI Metadata Tags
ai_keywords:
  [
    setup,
    installation,
    environment,
    development,
    getting started,
    revas,
    react,
    yarn,
    npm,
    vite,
  ]
ai_contexts: [development, usage]
ai_relations: [../ai-index/overview.md, ../../package.json]
---

# Revas Development Environment Setup

This guide explains how to set up your development environment to start building applications with Revas or to contribute to the Revas library itself.

<!-- AI-IMPORTANCE:level=high -->

## Using Revas in Your Project (as a Library)

<!-- AI-IMPORTANCE:level=high -->

If you want to use Revas to build your own canvas-based application:

### Prerequisites

1.  **Node.js and npm/Yarn:**

    - Ensure you have Node.js installed. LTS version is recommended. Node.js usually comes with npm (Node Package Manager).
    - Yarn is an alternative package manager and is used in Revas's own scripts. You can install it via `npm install -g yarn`.

2.  **React Project:**
    - Revas is designed to be used with React. You'll typically integrate it into an existing React project or start a new one (e.g., using Create React App, Next.js, Vite, or your custom Webpack/Rollup setup).

<!-- AI-CONTEXT-START:type=development -->

### Installation

1.  **Navigate to your project directory:**

    ```bash
    cd your-react-project
    ```

2.  **Install Revas and React:**
    Revas requires `react` as a peer dependency.

    Using Yarn:

    ```bash
    yarn add revas react
    ```

    Using npm:

    ```bash
    npm install revas react --save
    ```

    Refer to the `peerDependencies` section in Revas's [`package.json`](../../package.json:26) for compatible React versions.

### Basic Usage Example

Here's how you might render a simple Revas component into a DOM element:

```typescript jsx
// src/App.tsx (or your main application file)
import React from 'react';
import { render, View, Text } from 'revas';

const MyRevasApp = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightblue',
      }}
    >
      <Text style={{ fontSize: 24, color: 'white' }}>Hello from Revas!</Text>
    </View>
  );
};

// Ensure you have a DOM element to render into, e.g., in your public/index.html:
// <div id="revas-root" style="width: 300px; height: 200px; border: 1px solid black;"></div>

const container = document.getElementById('revas-root');

if (container) {
  render(<MyRevasApp />, container);
} else {
  console.error('Revas container element not found.');
}

export default MyRevasApp; // If you are integrating into a larger React app
```

Ensure your HTML has a container element (e.g., `<div id="revas-root"></div>`) where Revas can mount its canvas.

<!-- AI-CONTEXT-END -->

---

<!-- AI-IMPORTANCE:level=normal -->

## Developing Revas Itself (Contributing to the Library)

<!-- AI-IMPORTANCE:level=normal -->

If you want to contribute to the Revas library, fix bugs, or add new features:

### Prerequisites

1.  **Node.js and Yarn:** As mentioned above, Yarn is used for scripts in Revas.
2.  **Git:** For cloning the repository and version control.
3.  **TypeScript Knowledge:** Revas is written in TypeScript.
4.  **React Knowledge:** Deep understanding of React and ideally `react-reconciler`.
5.  **Canvas API Knowledge:** Familiarity with the HTML5 Canvas 2D API.

<!-- AI-CONTEXT-START:type=development -->

### Setup Steps

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/pinqy520/revas.git
    cd revas
    ```

    (Replace with the actual repository URL if different)

2.  **Install Dependencies:**

    ```bash
    yarn install
    ```

    This will install all dependencies listed in [`../../package.json`](../../package.json:1).

3.  **Build the Library:**
    Revas has a build process to compile TypeScript and bundle the library.

    ```bash
    yarn build
    ```

    This script (defined in [`../../package.json`](../../package.json:46)) typically runs `tsc` (TypeScript Compiler) and then `rollup` using [`../../rollup.config.ts`](../../rollup.config.ts:1) to create the distributable files in the `dist/` directory.

4.  **Running the Demo/Development App:**
    Revas includes a development application (often under `src/develop/` or a similar examples folder) that's useful for testing changes.
    The [`../../package.json`](../../package.json:1) includes a `start` script:

    ```bash
    yarn start # or npm start
    ```

    This command now launches the Vite development server. Vite serves the example application using the [`index.html`](../../index.html:1) file at the project root, which in turn loads the main application entry point from [`../../src/index.tsx`](../../src/index.tsx:1) (which then typically loads [`../../src/develop/App.tsx`](../../src/develop/App.tsx:1)). This setup allows you to see your changes to the Revas library or the example app live with Hot Module Replacement (HMR).

    - **Linking:** If you make changes to the Revas core files (`src/revas/`), you'll need to rebuild the library (`yarn build`) for those changes to be reflected in the demo app if it imports from `dist/`. Some setups might use `yarn link` or TypeScript path aliases for a tighter development loop, but the `prepare` script (`npm run build`) suggests that building is a common step.

5.  **Running Tests:**
    ```bash
    yarn test
    ```
    This script (from [`../../package.json`](../../package.json:48)) likely runs `react-scripts test` for any unit or integration tests set up for the library or the demo app.

### Development Workflow

1.  Make changes to the Revas source code (primarily in `src/revas/`).
2.  Rebuild the library: `yarn build`.
3.  Test your changes using the demo app (`yarn start`) or by writing new examples/tests.
4.  Follow linting and formatting guidelines (e.g., ESLint from `eslintConfig` in [`../../package.json`](../../package.json:52), Prettier from `prettier` config in [`../../package.json`](../../package.json:67)).
5.  Commit your changes and create a pull request if contributing.

By following these steps, you can set up an environment for either using Revas in your applications or for contributing to its development.

<!-- AI-CONTEXT-END -->
