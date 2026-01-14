<h1 align="center">
  <img src="https://user-images.githubusercontent.com/5719833/74748305-3fb20680-52a3-11ea-81c3-98804dceb602.png" width=220 />
  <br />
  <a href="https://badge.fury.io/js/revas">
    <img src="https://badge.fury.io/js/revas.svg" alt="npm version" height="18">
  </a>
</h1>

<p align="center">
  Use React and CSS to build UI interfaces on canvas
</p>

<p align="center">
  <a target="_blank" href="https://github.com/pinqy520/revas/blob/master/doc/API.md">Document</a> | <a target="_blank" href="https://github.com/pinqy520/revas/blob/master/doc/README-zh.md">中文文档</a> | <a target="_blank" href="https://pinqy520.github.io/demo/revas-pwa/" rel="nofollow">Live DEMO</a> | <a target="_blank" href="https://github.com/pinqy520/revas/blob/master/src/develop/App.tsx">DEMO Code</a>
</p>

## Requirements

- **React 19.x** (peer dependency)

## Install

``` bash
$ pnpm add revas react@19
```
## Usage

### Render to a DOM
```jsx
import React from 'react'
import {render, View, Text} from 'revas'

render(
  <View style={{ flex: 1 }}>
    <Text style={{ fontSize: 20 }}>Revas</Text>
  </View>,
  document.getElementById('container')
)
```
[![Edit purple-browser-h56ht](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/purple-browser-h56ht?fontsize=14&hidenavigation=1&theme=dark)

### Render to a DOM rendered by React
```jsx
import React from 'react'
import {render, View, Text} from 'revas'

export class Widget extends React.Component {
  componentDidMount() {
    this.app = render(
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 20 }}>Revas</Text>
      </View>,
      document.getElementById('container'),
      this
    )
  }
  componentDidUpdate() {
    this.app.update()
  }
  componentWillUnmount() {
    this.app.unmount()
  }
  render() {
    return <div id="container" />
  }
}
```
[![Edit reverent-river-vbypp](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/reverent-river-vbypp?fontsize=14&hidenavigation=1&theme=dark)

### Render to a custom canvas api

- https://github.com/pinqy520/revas-wxgame-example
- https://github.com/pinqy520/revas-bytegame-example


## DEMO

<p align="center">
  <img src="https://user-images.githubusercontent.com/5719833/81006150-9b8f3300-8e81-11ea-8cb1-08de6550ea03.png" />
</p>

## Upgrading from v1.x to v2.x

Revas 2.0 is a major upgrade with breaking changes:

### Breaking Changes

| Change | v1.x | v2.x |
|--------|------|------|
| React version | React 17.x | **React 19.x** (required) |
| Layout engine | `yoga-layout-wasm` (async) | `yoga-layout` 3.x (sync) |
| Module format | CJS + ESM | ESM-first with CJS fallback |

### What You Need to Do

1. **Upgrade React** to version 19.x:
   ```bash
   pnpm add react@19 react-dom@19
   ```

2. **Update imports** (if using `/common` export):
   ```js
   // No changes needed - API is the same
   import { View, Text } from 'revas'
   import { View, Text } from 'revas/common'
   ```

### Layout Engine Changes

The layout engine has been upgraded from `yoga-layout-wasm` to `yoga-layout` 3.x:

- **For most users**: No changes needed. The style API remains the same.
- **Performance**: Layout calculation is now synchronous (no async initialization).
- **Bundle size**: Slightly larger due to WASM being bundled differently.

**Supported Flexbox properties** (unchanged):
- Layout: `flex`, `flexDirection`, `justifyContent`, `alignItems`, `alignSelf`, `flexWrap`
- Sizing: `width`, `height`, `minWidth`, `maxWidth`, `minHeight`, `maxHeight`
- Spacing: `padding`, `margin`, `borderWidth`
- Positioning: `position` (`relative`, `absolute`, `static`), `top`, `left`, `right`, `bottom`

For full style reference, see [style.ts](https://github.com/pinqy520/revas/blob/master/src/revas/core/yoga-layout/style.ts).

### For Custom Canvas Platforms

If you're using Revas on custom platforms (WeChat mini-games, ByteDance games), the `revas/common` export now uses synchronous yoga-layout. Remove any async initialization code:

```js
// v1.x (old)
import { initYoga } from 'revas/common'
await initYoga()  // ❌ No longer needed

// v2.x (new)
import { render } from 'revas/common'
render(...)  // ✅ Works immediately
```

## Other Framework
- Vue - [huruji/vuvas](https://github.com/huruji/vuvas) by [@huruji](https://github.com/huruji)