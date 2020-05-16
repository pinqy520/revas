import * as React from 'react';
import { Text, Image, View, RevasScrollEvent, AnimatedValue, ListView, withContext } from '../../revas';
import data from './data';
import Back from '../common/back';

interface ItemProps {
  animated: AnimatedValue;
  index: number;
  item: any;
  lines: number;
  height: number;
}

class Item extends React.Component<ItemProps> {
  style = createItemTextStyle(this.props.index, this.props.animated, this.props.height);
  render() {
    const { item, index, lines } = this.props;
    return (
      <View style={this.style.item}>
        <Image style={this.style.cover} src={item.imageUrl} />
        <View style={this.style.text} cache={`text_${index}`}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.text} numberOfLines={lines}>
            {item.excerpt}
          </Text>
        </View>
      </View>
    );
  }
}

@withContext
export default class TimelineApp extends React.Component<any> {
  WINDOW_HEIGHT = this.context.clientHeight;
  MAX_LINES = Math.floor((this.WINDOW_HEIGHT / 3 - 20) / 26);

  animated = new AnimatedValue(0);

  onScroll = (e: RevasScrollEvent) => {
    this.animated.setValue(e.y);
  };

  renderItem = (item: any, index: number) => (
    <Item index={index} item={item} animated={this.animated} lines={this.MAX_LINES} height={this.WINDOW_HEIGHT} />
  );

  getItemHeight = () => this.WINDOW_HEIGHT;

  render() {
    return (
      <React.Fragment>
        <ListView
          data={data}
          paging
          renderItem={this.renderItem}
          itemHeight={this.WINDOW_HEIGHT}
          onScroll={this.onScroll}
          style={styles.container}
        />
        <Back router={this.props.router} />
      </React.Fragment>
    );
  }
}

function createItemTextStyle(index: number, animated: AnimatedValue, height: number) {
  const offset = (index - 1) * height;
  const translateY = animated.interpolate([offset, offset + height], [-height / 2, 0]);
  const opacity = animated.interpolate([offset + height / 2, offset + height, offset + 2 * height], [0, 1, 0]);
  return {
    item: {
      height,
    },
    cover: {
      backgroundColor: '#eee',
      height: height / 2,
      zIndex: 1,
    },
    text: { margin: 20, translateY, opacity, animated: true, height: height / 2 },
  };
}

const styles = {
  container: {
    flex: 1,
  },
  title: {
    marginBottom: 10,
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '800',
    color: '#333',
    fontFamily: 'serif',
  },
  text: {
    fontSize: 18,
    lineHeight: 26,
    color: '#555',
    fontFamily: 'fantasy',
  },
};
