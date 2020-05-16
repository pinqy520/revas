<h1 align="center">
  <img src="https://user-images.githubusercontent.com/5719833/74748305-3fb20680-52a3-11ea-81c3-98804dceb602.png" width=220 />
  <br />
  <a href="https://badge.fury.io/js/revas">
    <img src="https://badge.fury.io/js/revas.svg" alt="npm version" height="18">
  </a>
</h1>

<p align="center">
  用React和CSS在Canvas上编写高性能交互界面
</p>

<p align="center"> 
  <a target="_blank" href="https://pinqy520.github.io/demo/revas-pwa/" rel="nofollow">Live DEMO</a> | <a target="_blank" href="https://github.com/pinqy520/revas/blob/master/src/develop/App.tsx">DEMO Code</a>
</p>


<p align="center">
  <img src="https://user-images.githubusercontent.com/5719833/81006150-9b8f3300-8e81-11ea-8cb1-08de6550ea03.png" />
</p>

## 安装

``` bash
$ yarn add revas react
```

## 基本用法

### 直接渲染到DOM元素
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

### 在ReactDOM中嵌入
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

## 组件

### View


#### ViewProps

| Property | Type | Description |
| -: | - | - |
| style | ViewStyle | Inline css|
| pointerEvents | `'auto' \| 'box-none' \| 'none'` | 点击事件接受类型 |
| onLayout | `(Frame): void` | 获取当前布局 |
| onTouchStart | `(RevasTouch): void` | 开始触碰回调 |
| onTouchMove | `(RevasTouch): void` | 触碰移动回调 |
| onTouchEnd | `(RevasTouch): void` | 结束触碰回调 |
| cache | `boolean \| string` | 开启离屏缓存 |
| forceCache | `boolean` | 不等待子组件加载完毕就缓存 |

```jsx
<View {...props} />
```

### Text

#### TextProps 

> extends ViewProps

| Property | Type | Description |
| -: | - | - |
| style | `TextStyle` | Inline css|
| numberOfLines | `number` | 最多多少行 |

```jsx
<Text numberOfLines={1}>Hello World</Text>
```

### Image

#### ImageProps 

> extends ViewProps

| Property | Type | Description |
| -: | - | - |
| style | ImageStyle | Inline css|
| src | string | Image source url |

```jsx
<Image src="https://some.img/url.jpg" />
```

### Touchable

#### TouchableProps 

> extends ViewProps

| Property | Type | Description |
| -: | - | - |
| onPress | `Function` | 点击回调 |
| onPressIn | `Function` | 点按回调 |
| onPressOut | `Function` | 点按弹起回调 |
| activeOpacity | `number` | 点击的时候透明度 |

```jsx
<Touchable onPress={() => alert('Enjoy!~🎉')}>
  <Text>Go</Text>
</Touchable>
```

### ScrollView

#### ScrollViewProps 

> extends ViewProps

| Property | Type | Description |
| -: | - | - |
| horizontal | `boolean` | 滑动方向 |
| onScroll | `(RevasScrollEvent): void` | 滑动回调 |
| onScrollStart | `(RevasScrollEvent): void` | 滑动开始回调 |
| onScrollEnd | `(RevasScrollEvent): void` | 滑动停止回调 |
| paging | `boolean \| number` | 是否开启paging，paging长度 |
| offset | `{x: number, y: number}` | 相对位移 |

```jsx
<ScrollView>
  {colors.map(renderColorItem)}
</ScrollView>
```

### LinearGradient

#### LinearGradientProps

> extends ViewProps

| Property | Type | Description |
| -: | - | - |
| start | `{x: number, y: number}` | 渐变色开始的点 |
| end | `{x: number, y: number}` | 渐变色结束的点 |
| colors | `Color[]` | 滑动回调 |

```jsx
<LinearGradient style={styles.decorator}
  start={{x: 0, y, 0}} end={{x: 1, y, 0}} 
  colors={['#9254DE', '#B37FEB', '#91D5FF', '#40A9FF']} />
```

### ListView

#### ListViewProps

> extends ScrollViewProps

| Property | Type | Description |
| -: | - | - |
| data | `T[]` | 数据 |
| renderItem | `(item, index, data): JSX` |渲染每一行 |
| itemHeight | `number` | 一行的高度 |

```jsx
<ListView
  data={[1, 2, 3, 4, 5, 12, 123, 1, 23, 2]}
  itemHeight={80} renderItem={(item, index) => (
    <View style={{ height: 80, backgroundColor: (index % 2) > 0 ? 'white' : 'black' }} />
  )} />
```

## API

### render(app: JSX, target: DOM): Renderer

> [WEB ONLY] 渲染到指定DOM节点里

### new AnimatedValue(number)

> 控制动画

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

### timing(AnimatedValue, Config).start().stop()

> 配置动画

### AnimatedValue.interpolate(inputRange: number[], outputRange: number[])

> 配置动画


### withContext(Component)

> 获取全局参数 clientWidth, clientHeight, pixelRatio, canvas

## CSS

| Category | Styles |
| -: | - |
| Flexible Layout | **width**, minWidth, maxWidth, **height**, minHeight, maxHeight, **padding**, paddingLeft, **margin**, marginLeft, position, left, top, **flex**, flexDirection, justifyContent, alignItems [...more](https://github.com/pinqy520/revas/blob/master/src/revas/core/yoga-layout/style.ts)|
| Box | borderRadius, borderWidth, borderColor, borderTopLeftRadius, shadowColor, shadowOffsetX, shadowOffsetY, shadowBlur, backgroundColor, overflow, opacity |
| Text | fontFamily, fontSize, fontWeight, color, lineHeight, textAlign, wordBreak, fontStyle, textBaseline, textShadowBlur, textShadowColor, textShadowOffsetX, textShadowOffsetY | 
| Image | resizeMode |
| Transform | translateX, translateY, rotate, scale, scaleX, scaleY | 
| Other | animated, path |


## 高级用法

> 参考DOM渲染函数的编写

### 渲染到自定义Canvas容器

#### 准备：配置离屏渲染函数

#### 第一步：生成RevasCanvas对象

#### 第二步：监听Canvas上手势

#### 第三部：渲染