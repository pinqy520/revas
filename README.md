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

The main difference from `react-canvas` is that it does not depend strongly on `react-dom`, so that it can run in different terminals through the `canvas` interface provided by different implementation. 

In terms of performance, `react-canvas` was previously focused on smooth 60FPS interaction, because after getting rid of the constraints of DOM operations, UI drawing on canvas can be rendered faster. In terms of cross-end capabilities, it depends on the unified definition of the canvas interface, which makes it easier to migrate between platforms. When the native canvas interface is delisted or dynamic cannot be used, it is easier to migrate / downgrade to the Web.

<p align="center">
  <img src="https://user-images.githubusercontent.com/5719833/81074433-9252a480-8f1b-11ea-8e29-fda1e3957204.gif" width=600 />
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
<ScrollView onScroll={e => {}}
  style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
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

### ListView

```jsx
<ListView
  data={[1, 2, 3, 4, 5, 12, 123, 1, 23, 2]} style={styles.scrollNested} 
  getItemHeight={() => 80} renderItem={(item, index) => (
    <View style={{ height: 80, backgroundColor: (index % 2) > 0 ? 'white' : 'black' }} />
  )} />
```


## API

## AnimatedValue

> translateX, translateY, opacity, rorate, scale, scaleX, scaleY

**Example:** [/src/develop/Interactable.tsx](https://github.com/pinqy520/revas/blob/master/src/develop/Interactable.tsx)

```jsx
import { AnimatedValue } from 'revas'

const translateX = new AnimatedValue(0)

function Comp() {
  return <View 
    style={{
      translateX: translateX
    }}
    onTouchMove={e => {
      translateX.setValue(e.touches[0].x)
    }}
  />
}

```


## Common Properties

- Touch
  - onTouchStart
  - onTouchMove
  - onTouchEnd
- Layout
  - onLayout
- pointerEvents
- cache // boolean\string

## Styles

- Flexible Layout (powered by Yoga)
  - width, minWidth, maxWidth
  - height, minHeight, maxHeight
  - padding, paddingLeft, ...
  - margin, marginLeft, ...
  - position, left, top, ....
  - flex, flexDirection, justifyContent, alignItems
  - [...more](https://github.com/pinqy520/revas/blob/master/src/revas/core/style.ts)
- Common
  - borderRadius, borderWidth, borderColor, borderTopLeftRadius, ...
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

## Examples

| PWA - Web | 微信小游戏 | 字节跳动小程序 | Native |
| :-:| :-: | :-: | :-: |
| <img src="https://user-images.githubusercontent.com/5719833/75115614-25a96700-569b-11ea-944a-5fd87f264812.png" width=100 /> | [revas-wxgame-example](https://github.com/pinqy520/revas-wxgame-example) | [revas-bytegame-example](https://github.com/pinqy520/revas-bytegame-example) | WIP |

## Screenshots

<p align="center">
  <img src="https://user-images.githubusercontent.com/5719833/81006150-9b8f3300-8e81-11ea-8cb1-08de6550ea03.png" width=800 />
</p>

## Try

```bash
$ git clone ...
$ yarn           # install
$ yarn start     # start a web server for development
```

