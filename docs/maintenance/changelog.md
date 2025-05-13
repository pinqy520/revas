---
# AI Metadata Tags
ai_keywords:
  [changelog, versions, updates, releases, history, maintenance, revas]
ai_contexts: [development, usage]
ai_relations: [../ai-index/overview.md, ../../package.json]
---

# Revas Changelog

This document records all notable changes to the Revas project, including new features, bug fixes, performance improvements, and breaking changes. It follows the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format.

<!-- AI-IMPORTANCE:level=high -->

## [Unreleased] - 2025-05-13

### Added

- Vite is now used as the development server for the example application (via `npm start` or `yarn start`).
- Created a root `index.html` for Vite to serve the example application.
- Added module declarations for `.mp4` assets in `src/custom.d.ts`.

### Changed

- Updated TypeScript configuration ([`tsconfig.json`](../../tsconfig.json:1)) to enable stricter checks and modern ES module settings (e.g., `"module": "esnext"`, `"moduleResolution": "bundler"`, `"jsx": "react-jsx"`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`).
- Refactored React imports in Revas library components (under [`src/revas/components/`](../../src/revas/components/)) to use named imports (e.g., `import { Component } from 'react';`) instead of namespace imports (`import * as React from 'react';`) to improve clarity and potentially tree-shaking.
- Updated the example application's entry point logic in [`index.html`](../../index.html:1) and [`src/index.tsx`](../../src/index.tsx:1) for Vite compatibility.
- Asset loading in the example application (e.g., in [`src/develop/Music/data.ts`](../../src/develop/Music/data.ts:1) and [`src/develop/Intro/Entry.tsx`](../../src/develop/Intro/Entry.tsx:1)) refactored from CommonJS `require()` to ES module `import` statements.
- The `build:pwa` script in [`package.json`](../../package.json:47) now uses `vite build`.

### Deprecated

- Placeholder for soon-to-be removed features.

### Removed

- Placeholder for now-removed features.

### Fixed

- Resolved numerous TypeScript errors across the library and example application codebase stemming from stricter compiler options (`exactOptionalPropertyTypes`, `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, `verbatimModuleSyntax`) and ES module requirements.
- Corrected CSS in [`src/develop/index.css`](../../src/develop/index.css:1) to ensure the example application's canvas renders full-window.
- Resolved "require is not defined" runtime errors in the example application by migrating to ES module imports for assets.
- Addressed Rollup warnings related to "Unused external imports Component" by standardizing React imports.

### Security

- Placeholder in case of vulnerabilities.
<!-- AI-IMPORTANCE:level=high -->

---

<!-- AI-CONTEXT-START:type=development -->

## Versioning Scheme

Revas adheres to [Semantic Versioning (SemVer)](https://semver.org/spec/v2.0.0.html).
Given a version number `MAJOR.MINOR.PATCH`, increment the:

1.  `MAJOR` version when you make incompatible API changes,
2.  `MINOR` version when you add functionality in a backward-compatible manner, and
3.  `PATCH` version when you make backward-compatible bug fixes.

## Past Releases

_(This section will be populated with actual release notes as the project evolves. The current version in [`../../package.json`](../../package.json:3) is `1.0.3` but no historical changelog entries are available in the current file structure.)_

### Example: [1.0.0] - YYYY-MM-DD (Hypothetical First Major Release)

#### Added

- Initial public release of Revas.
- Core components: `<View>`, `<Text>`, `<Image>`.
- Basic Flexbox layout support via `css-layout`.
- Custom React reconciler for canvas rendering.
- Touch event handling system.

---

This changelog helps users and contributors understand the evolution of the Revas library and track specific changes between versions. When contributing, please ensure to update the "[Unreleased]" section with any significant changes you make.

<!-- AI-CONTEXT-END -->
