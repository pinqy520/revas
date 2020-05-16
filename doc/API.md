# Revas Document

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

## Components

### View


#### ViewProps

| Property | Type | Description |
| -: | - | - |
| style | `ViewStyle` | Inline css|
| pointerEvents | `'auto' \| 'box-none' \| 'none'` |  |
| onLayout | `(Frame): void` | x, y, width, height |
| onTouchStart | `(RevasTouch): void` | callback |
| onTouchMove | `(RevasTouch): void` | callback |
| onTouchEnd | `(RevasTouch): void` | callback |
| cache | `boolean \| string` | enable offscreen cache |
| forceCache | `boolean` | force enable cache |

```jsx
<View {...props} />
```

### Text

#### TextProps 

> extends ViewProps

| Property | Type | Description |
| -: | - | - |
| style | `TextStyle` | Inline css|
| numberOfLines | `number` | max lines |

```jsx
<Text numberOfLines={1}>Hello World</Text>
```

### Image

#### ImageProps 

> extends ViewProps

| Property | Type | Description |
| -: | - | - |
| style | `ImageStyle` | Inline css|
| src | string | `Image` source url |

```jsx
<Image src="https://some.img/url.jpg" />
```

### Touchable

#### TouchableProps 

> extends ViewProps

| Property | Type | Description |
| -: | - | - |
| onPress | `Function` | callback |
| onPressIn | `Function` | callback |
| onPressOut | `Function` | callback |
| activeOpacity | `number` | opacity when pressing in |

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
| horizontal | `boolean` | direction |
| onScroll | `(RevasScrollEvent): void` | scrolling callback |
| onScrollStart | `(RevasScrollEvent): void` | scroll start |
| onScrollEnd | `(RevasScrollEvent): void` | scroll end |
| paging | `boolean \| number` | enable paging, and the length |
| offset | `{x: number, y: number}` | offset |

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
| start | `{x: number, y: number}` | start position |
| end | `{x: number, y: number}` | end position |
| colors | `Color[]` | colors |

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
| data | `T[]` | list data |
| renderItem | `(item, index, data): JSX` | render item |
| itemHeight | `number` | height of each item |

```jsx
<ListView
  data={[1, 2, 3, 4, 5, 12, 123, 1, 23, 2]}
  getItemHeight={() => 80} renderItem={(item, index) => (
    <View style={{ height: 80, backgroundColor: (index % 2) > 0 ? 'white' : 'black' }} />
  )} />
```

## API

### render(app: JSX, target: DOM): Renderer

> [WEB ONLY] render to a DOM container

### new AnimatedValue(number)

> animated value

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

> start a animation

### AnimatedValue.interpolate(inputRange: number[], outputRange: number[])

> interpolate animated value


### withContext(Component)

> inject context to a component

clientWidth, clientHeight, pixelRatio, canvas

## CSS

| Category | Styles |
| -: | - |
| Flexible Layout | **width**, minWidth, maxWidth, **height**, minHeight, maxHeight, **padding**, paddingLeft, **margin**, marginLeft, position, left, top, **flex**, flexDirection, justifyContent, alignItems [...more](https://github.com/pinqy520/revas/blob/master/src/revas/core/yoga-layout/style.ts)|
| Box | borderRadius, borderWidth, borderColor, borderTopLeftRadius, shadowColor, shadowOffsetX, shadowOffsetY, shadowBlur, backgroundColor, overflow, opacity |
| Text | fontFamily, fontSize, fontWeight, color, lineHeight, textAlign, wordBreak, fontStyle, textBaseline, textShadowBlur, textShadowColor, textShadowOffsetX, textShadowOffsetY | 
| Image | resizeMode |
| Transform | translateX, translateY, rotate, scale, scaleX, scaleY | 
| Other | animated, path |


## Advantage

### Render to a custom canvas

> TODO
