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

## Install

``` bash
$ yarn add revas react
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