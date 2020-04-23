import * as React from 'react';
import { Text, Image, View, RevasScrollEvent, AnimatedValue, ListView } from '../../revas';
import data from './data';

interface ItemProps {
  animated: AnimatedValue;
  index: number;
  item: any;
}

class Item extends React.Component<ItemProps> {
  style = createItemTextStyle(this.props.index, this.props.animated);
  render() {
    const { item, index } = this.props;
    return (
      <View style={styles.item}>
        <Image style={styles.cover} src={item.imageUrl} />
        <View style={this.style} cache={`text_${index}`}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.text} numberOfLines={MAX_LINES}>
            {item.excerpt}
          </Text>
        </View>
      </View>
    );
  }
}

export default class TimelineApp extends React.Component {
  animated = new AnimatedValue(0);

  onScroll = (e: RevasScrollEvent) => {
    this.animated.setValue(e.y);
  };

  renderItem = (item: any, index: number) => <Item index={index} item={item} animated={this.animated} />;

  getItemHeight = () => WINDOW_HEIGHT;

  render() {
    return (
      <ListView
        data={data} paging
        renderItem={this.renderItem}
        getItemHeight={this.getItemHeight}
        onScroll={this.onScroll} style={styles.container}
      />
    );
  }
}

function createItemTextStyle(index: number, animated: AnimatedValue) {
  const offset = (index - 1) * WINDOW_HEIGHT;
  const translateY = animated.interpolate(
    [offset, offset + WINDOW_HEIGHT],
    [-WINDOW_HEIGHT / 2, 0]
  );
  const opacity = animated.interpolate(
    [offset + (WINDOW_HEIGHT / 2), offset + WINDOW_HEIGHT, offset + (2 * WINDOW_HEIGHT)],
    [0, 1, 0]
  );
  return { margin: 20, translateY, opacity, animated: true, height: WINDOW_HEIGHT / 2 };
}

const WINDOW_HEIGHT = window.innerHeight;
const MAX_LINES = Math.floor((WINDOW_HEIGHT / 3 - 20) / 26);

const styles = {
  container: {
    flex: 1
  },
  item: {
    height: WINDOW_HEIGHT,
  },
  cover: {
    backgroundColor: '#eee',
    height: WINDOW_HEIGHT / 2,
    zIndex: 1,
  },
  title: {
    marginBottom: 10,
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '800',
    color: '#333',
    fontFamily: 'serif'
  },
  text: {
    fontSize: 18,
    lineHeight: 26,
    color: '#333',
    fontFamily: 'fantasy'
  }
};