import * as React from 'react'
import { ScrollView, Text, Image, View, RevasScrollEvent, AnimatedValue } from '../../revas'


export default class TimelineApp extends React.Component {
  animated = new AnimatedValue(0)

  itemCoverStyles = [
    createItemTextStyle(0, this.animated),
    createItemTextStyle(1, this.animated),
    createItemTextStyle(2, this.animated),
  ]

  onScroll = (e: RevasScrollEvent) => {
    this.animated.setValue(e.y)
  }
  render() {
    return (
      <ScrollView onScroll={this.onScroll} style={styles.container}>
        <View style={styles.item}>
          <Image style={styles.cover} src={require('./assets/item_1.jpeg')} />
          <Text style={this.itemCoverStyles[0]} numberOfLines={MAX_LINES}>
            据外媒报道，特斯拉首席执行官埃隆·马斯克表示，公司将在未来几周内在美国推出交通信号灯和停车标志自动识别功能。特斯拉在功能介绍中称，同时启动自动转向和交通感知巡航控制时，汽车可以在交通信号灯和停车标志处自动停车。这两项功能都包含在特斯拉的基础版Autopilot中，它是该公司目前所有车辆的标准配置。特斯拉的红绿灯和停车标志识别已经筹备了很长时间。2019年3月，特斯拉发布了自动转向停车警告新功能，当司机接近十字路口时，系统自动提醒司机，要求司机接管电动车的操控。
          </Text>
        </View>
        <View style={styles.item}>
          <Image style={styles.cover} src={require('./assets/item_2.jpg')} />
          <Text style={this.itemCoverStyles[1]} numberOfLines={MAX_LINES}>
            The Oppo Find X2 Series are the brand’s new 5G flagship phones
            Chinese smartphone brand Oppo might not be as recognised as Samsung or Huawei, but it’s stepping up to bat with the Oppo Find X2 and Find X2 Pro. Pitched as an all-round 5G flagship, the phones are all set to take on the Samsung Galaxy S20 series, right down to the internal specs.
          </Text>
        </View>
        <View style={styles.item}>
          <Image style={styles.cover} src={require('./assets/item_1.jpeg')} />
          <Text style={this.itemCoverStyles[2]} numberOfLines={MAX_LINES}>
            据外媒报道，特斯拉首席执行官埃隆·马斯克表示，公司将在未来几周内在美国推出交通信号灯和停车标志自动识别功能。特斯拉在功能介绍中称，同时启动自动转向和交通感知巡航控制时，汽车可以在交通信号灯和停车标志处自动停车。这两项功能都包含在特斯拉的基础版Autopilot中，它是该公司目前所有车辆的标准配置。特斯拉的红绿灯和停车标志识别已经筹备了很长时间。2019年3月，特斯拉发布了自动转向停车警告新功能，当司机接近十字路口时，系统自动提醒司机，要求司机接管电动车的操控。
          </Text>
        </View>
      </ScrollView>
    )
  }
}

function createItemTextStyle(index: number, animated: AnimatedValue) {
  const offset = (index - 1) * WINDOW_HEIGHT
  const translateY = animated.interpolate(
    [offset, offset + WINDOW_HEIGHT],
    [-WINDOW_HEIGHT / 2, 0]
  )
  const opacity = animated.interpolate(
    [offset + (WINDOW_HEIGHT / 2), offset + WINDOW_HEIGHT, offset + (2 * WINDOW_HEIGHT)],
    [0, 1, 0]
  )
  return [styles.text, { translateY, opacity, animated: true }]
}

const WINDOW_HEIGHT = window.innerHeight
const MAX_LINES = Math.floor((WINDOW_HEIGHT / 2 - 20) / 25)

const styles = {
  container: {
    flex: 1
  },
  item: {
    height: WINDOW_HEIGHT,
    overflow: 'hidden'
  },
  cover: {
    height: WINDOW_HEIGHT / 2,
    zIndex: 1,
  },
  text: {
    padding: 10,
    fontSize: 16,
    lineHeight: 26,
    color: '#333'
  }
}