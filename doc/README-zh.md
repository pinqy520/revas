<h1 align="center">
<img src="https://user-images.githubusercontent.com/5719833/74748305-3fb20680-52a3-11ea-81c3-98804dceb602.png" width=220 />
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
  <img src="https://user-images.githubusercontent.com/5719833/74748350-52c4d680-52a3-11ea-9a00-f23c8f359b72.png" width=600 />
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

## 共有属性

- Touch
  - onTouchStart
  - onTouchMove
  - onTouchEnd
- Layout
  - onLayout
- pointerEvents

## 样式支持

- Flexible box (powered by Yoga)
  - width, minWidth, maxWidth
  - height, minHeight, maxHeight
  - padding, paddingLeft, ...
  - margin, marginLeft, ...
  - position, left, top, ....
  - flex, flexDirection, justifyContent, alignItems
  - [...更多](https://github.com/pinqy520/revas/blob/master/src/revas/core/style.ts)
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


## 效果截图

<p align="center">
  <img src="https://user-images.githubusercontent.com/5719833/74612290-052f5900-513f-11ea-94ff-17ea50b31a50.png" width=600 />
</p>

## TODO

- [x] 交互事件机制
- [x] ScrollView基础滑动组件
- [ ] ListView、FlatList等高性能滑动组件
- [ ] Animated动画高效控制
- [ ] Native Canvas API
- [ ] Canvas通用化离屏渲染方案
- [ ] WebAssembly & GPU
- [ ] 官网 & 文档
- [ ] Example & 最佳实践

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
