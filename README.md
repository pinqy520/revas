<h1 align="center">
<img src="https://user-images.githubusercontent.com/5719833/74748305-3fb20680-52a3-11ea-81c3-98804dceb602.png" width=220 />
</h1>

<p align="center">
Build Apps on Canvas, with React and CSS, inspired by <code>react-canvas</code>
</p>

<p align="center">
  <a href="https://badge.fury.io/js/revas">
    <img src="https://badge.fury.io/js/revas.svg" alt="npm version" height="18">
  </a> ｜ <a href="https://github.com/pinqy520/revas/blob/master/doc/README-zh.md">中文文档</a>
</p>

The main difference from `react-canvas` is that it does not depend strongly on `react-dom`, so that it can run in different terminals through the `canvas` interface provided by different implementation. In addition, compared to `react-canvas`, `revas` is:

1. Support for the latest version of React for a better interactive experience under Fiber, use the latest version of Yoga for more stability
2. Same `View` and `Text` API as `react-native`, lower understanding cost

In terms of performance, `react-canvas` was previously focused on smooth 60FPS interaction, because after getting rid of the constraints of DOM operations, UI drawing on canvas can be rendered faster. In terms of cross-end capabilities, it depends on the unified definition of the canvas interface, which makes it easier to migrate between platforms. When the native canvas interface is delisted or dynamic cannot be used, it is easier to migrate / downgrade to the Web.

<p align="center">
  <img src="https://user-images.githubusercontent.com/5719833/74748350-52c4d680-52a3-11ea-9a00-f23c8f359b72.png" width=600 />
</p>

## Install

```bash
$ yarn add revas
```

## Usage

### Minimal

```jsx
import React from 'react'
import { render, View, Text } from 'revas'

render(
  <View style={{ flex: 1 }}>
    <Text style={{ fontSize: 20 }}>Revas</Text>
  </View>,
  document.getElementById('my-canvas'),
)
```

### Render to a canvas rendered by React

If the `<canvas>` we want to `revas.render` to is rendered by React, we need to ensure that the `<canvas>` exists in the DOM before calling `revas.render`.

In the following example, we make use of `React.useEffect()` to invoke `revas.render`. Since `useEffect` is asynchronous, `revas.render` will be invoked _after_ the `<canvas>` element has been rendered to the DOM and `canvasRef` has the correct reference to the element.   

<a href="https://codesandbox.io/s/polished-browser-n2myg?fontsize=14&hidenavigation=1&theme=dark">
  <img alt="Open in CodeSandbox" src="https://codesandbox.io/static/img/play-codesandbox.svg">
</a>
   

```jsx
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { render, View, Text } from 'revas'

const CANVAS_ELEMENT_STYLE = { border: '1px solid black' }

const MyCanvasComponent = (props) => {
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 20 }}>Revas</Text>
    </View>
  )
}

const App = () => {
  const canvasRef = React.useRef()

  useEffect(() => {
    render(<MyCanvasComponent />, canvasRef.current)
  }, [])

  return (
    <div className="App">
      <canvas
        ref={canvasRef}
        style={CANVAS_ELEMENT_STYLE}
      />
    </div>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
```

## Components

### View

```jsx
<View style={styles.view} />
```

### Text

```jsx
<Text style={styles.text} numberOfLines={1}>Hello World</Text>
```

### Image

```jsx
<Image style={styles.text} src="https://some.img/url.jpg" />
```

### Touchable

```jsx
<Touchable style={styles.btn} onPress={() => alert('Enjoy!~🎉')}>
  <Text style={styles.btnText}>Go</Text>
</Touchable>
```

### ScrollView

```jsx
<ScrollView style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
  {colors.map((c, i) => (
    <View key={i} style={{ height: 80, backgroundColor: c }} />
  ))}
</ScrollView>
```

### LinearGradient

```jsx
<LinearGradient style={styles.decorator}
  start={{x: 0, y, 0}} end={{x: 1, y, 0}} 
  colors={['#9254DE', '#B37FEB', '#91D5FF', '#40A9FF']} />
```

## Styles

- Flexible box (powered by Yoga)
  - width, minWidth, maxWidth
  - height, minHeight, maxHeight
  - padding, paddingLeft, ...
  - margin, marginLeft, ...
  - position, left, top, ....
  - flex, flexDirection, justifyContent, alignItems
  - [...more](https://github.com/pinqy520/revas/blob/master/src/revas/core/style.ts)
- Common
  - borderRadius, borderWidth, borderColor
  - shadowColor, shadowOffsetX, shadowOffsetY, shadowBlur
  - backgroundColor
  - overflow
  - opacity
- Text
  - fontFamily
  - fontSize
  - fontWeight
  - color
  - lineHeight
  - textAlign
  - wordBreak
  - fontStyle
  - textBaseline
  - textShadowBlur, textShadowColor, textShadowOffsetX, textShadowOffsetY
- Image
  - resizeMode
- Animation
  - translateX, translateY
  - rotate
  - scale, scaleX, scaleY

## Screenshot

<p align="center">
  <img src="https://user-images.githubusercontent.com/5719833/74612290-052f5900-513f-11ea-94ff-17ea50b31a50.png" width=600 />
</p>

## Try

```bash
$ git clone ...
$ yarn           # install
$ yarn start     # start a web server for development
```

