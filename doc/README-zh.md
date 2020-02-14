<h1 align="center">
<img src="https://user-images.githubusercontent.com/5719833/74559602-ce6f0c80-4f9f-11ea-87ab-cac5362674f2.png" width=220 />
</h1>

<p align="center">
Revas可以让你用 React和 Flexible CSS 在 Canvas 上编写交互界面
</p>

<p align="center">
  <a href="https://badge.fury.io/js/revas">
    <img src="https://badge.fury.io/js/revas.svg" alt="npm version" height="18">
  </a>
</p>

与ReactCanvas主要不同点在于，它不强依赖于ReactDOM，使得它可以通过不同宿主提供的canvas接口在不同终端中展示，此外Revas相较ReactCanvas，还有：

  1. 升级至最新版的React，在Fiber下获得更好的交互体验；使用最新版的Yoga，更稳定
  2. 类ReactNative的View和Text组件，理解成本更低

性能上，之前ReactCanvas就是主打流畅的60FPS交互，因为摆脱了DOM操作的束缚之后，在canvas上进行UI绘制，渲染更快。跨端能力上，依赖于canvas接口的统一定义，更容易在平台间互相迁移，当native的canvas接口下架或者动态化无法使用时，更容易迁移\降级到小程序或者Web。

<p align="center">
  <img src="https://user-images.githubusercontent.com/5719833/74560799-4b9b8100-4fa2-11ea-81c4-3948c00ad3ac.png" width=600 />
</p>

## 安装

``` bash
$ yarn add revas
```

## 基本用法

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

## 组件

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

## 样式

> 基本 React Native支持的，都支持了，除：transform

## 效果截图

<p align="center">
  <img src="https://user-images.githubusercontent.com/5719833/74564277-aa182d80-4fa9-11ea-801e-a1953d6e8af5.png" width=600 />
</p>

## TODO

- 交互事件机制
- ScrollView、ListView、FlatList等滑动组件
- Animated动画高效控制
- Native Canvas API
- Canvas通用化离屏渲染方案
- WebAssembly & GPU
- 官网 & 文档
- Example & 最佳实践

> 期待你的加入，一起搞事情

## 参与开发

```bash
$ yarn           # install
$ yarn start     # start a web server for development
$ yarn build     # build for production
```

## 测试用例

- vDom
  - 增加节点
  - 删除节点
  - 重拍节点
- Style
  - Yoga
  - Font
  - Others
    - overflow
    - zIndex
- Component
