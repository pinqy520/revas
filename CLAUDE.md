# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start development server (Vite)
pnpm build            # Build library (tsup)
pnpm build:demo       # Build demo app (Vite)
pnpm test             # Run tests (Vitest)
pnpm test:run         # Run tests once
```

## Architecture Overview

Revas is a React-based canvas rendering library that lets you build UIs on HTML5 canvas using React components and CSS-like styling. It implements a custom React reconciler to render to canvas instead of DOM.

**Requirements:** React 19.x (peer dependency)

### Core Rendering Pipeline

1. **React Reconciler** (`src/revas/core/reconciler.ts`) - Custom React reconciler built on `react-reconciler@0.33.x` for React 19. Manages the component tree and triggers redraws on updates via `resetAfterCommit`.

2. **Node Tree** (`src/revas/core/Node.ts`) - Internal representation of the component tree. Each `Node` has a `Frame` (x, y, width, height) calculated by the layout engine.

3. **Container** (`src/revas/core/Container.ts`) - Orchestrates the render loop. Manages layout updates, drawing, and touch event handling. Uses `requestAnimationFrame` for rendering.

4. **Layout Engine** (`src/revas/core/yoga-layout/`) - Uses `yoga-layout@3.x` for Flexbox layout calculation. Converts React-Native-like style props to Yoga layout nodes. Synchronous initialization (no async loading).

5. **Drawing** (`src/revas/core/draw.ts`) - Renders nodes to canvas. Handles transforms, opacity, clipping, backgrounds, borders, border-radius, and shadows. Supports offscreen caching for performance.

### Key Components (`src/revas/components/`)

- `View` - Basic container with styling (backgrounds, borders, shadows)
- `Text` - Text rendering with font styling
- `Image` - Async image loading and rendering
- `Touchable` - Touch interaction handling
- `ScrollView/ListView` - Scrollable containers with momentum physics
- `LinearGradient` - Gradient backgrounds

### Entry Points

- `src/revas/index.ts` - Main export (re-exports common + web)
- `src/revas/common.ts` - Platform-agnostic components and core
- `src/revas/web/index.ts` - Web-specific adapter (offscreen canvas creation)
- `src/revas/web/render.ts` - Web render function that creates canvas and sets up touch events

### Animation System (`src/revas/core/Animated.ts`)

- `AnimatedValue` - Mutable animated value with observer pattern
- `AnimatedInterpolate` - Maps input ranges to output ranges with easing
- `timing()` - Creates timed animations with configurable easing
- `Easing` - Collection of easing functions (linear, ease, bounce, elastic)

### Build Output

tsup produces dual-format bundles:
- `dist/revas.js` (ESM) and `dist/revas.cjs` (CJS) - Full library with web adapter
- `dist/revas-common.js` (ESM) and `dist/revas-common.cjs` (CJS) - Platform-agnostic core for non-web targets (WeChat mini-games, ByteDance games)
- TypeScript declarations: `dist/revas.d.ts`, `dist/revas-common.d.ts`

## Code Style

- Single quotes (configured in prettier)
- TypeScript 5.x with strict mode
- React 19 with new JSX transform
- ESM-first module system
