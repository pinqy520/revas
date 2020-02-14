<h1 align="center">
<img src="https://user-images.githubusercontent.com/5719833/74559602-ce6f0c80-4f9f-11ea-87ab-cac5362674f2.png" width=220 />
</h1>

<p align="center">
Build Apps on Canvas, with React and Flexible CSS, inspired by <code>react-canvas</code>
</p>

<p align="center">
  <a href="https://badge.fury.io/js/revas">
    <img src="https://badge.fury.io/js/revas.svg" alt="npm version" height="18">
  </a> ｜ <a href="https://github.com/pinqy520/revas/blob/master/doc/README-zh.md">中文文档</a>
</p>

The main difference from `react-canvas` is that it does not depend strongly on `react-dom`, so that it can run in different terminals through the `canvas` interface provided by different implementation. In addition, compared to `react-canvas`, `revas` is:

  1. Support for the latest version of React for a better interactive experience under Fiber; use the latest version of Yoga for more stability
  2. Same `View` and `Text` API as `react-native`, lower understanding cost

In terms of performance, `react-canvas` was previously focused on smooth 60FPS interaction, because after getting rid of the constraints of DOM operations, UI drawing on canvas can be rendered faster. In terms of cross-end capabilities, it depends on the unified definition of the canvas interface, which makes it easier to migrate between platforms. When the native canvas interface is delisted or dynamic cannot be used, it is easier to migrate / downgrade to the Web.

<p align="center">
  <img src="https://user-images.githubusercontent.com/5719833/74560799-4b9b8100-4fa2-11ea-81c4-3948c00ad3ac.png" width=600 />
</p>

## Install

``` bash
$ yarn add revas
```

## Usage

```jsx
import React from 'react'
import {render, View, Text} from 'revas'
import createCanvas from './some-where'

render(
  <View style={{ flex: 1 }}>
    <Text style={{ fontSize: 20 }}>Revas</Text>
  </View>,
  createCanvas()
)
```

## Components

### View

```jsx
<View style={styles.view} />
```

### Text

```jsx
<Text style={styles.text}>Hello World</Text>
```

### Image

```jsx
<Image style={styles.text} src="https://some.img/url.jpg" />
```

## Styles

> Same as React Native, except：transform

## Screenshot

<p align="center">
  <img src="https://user-images.githubusercontent.com/5719833/74564277-aa182d80-4fa9-11ea-801e-a1953d6e8af5.png" width=600 />
</p>

