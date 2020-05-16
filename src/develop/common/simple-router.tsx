import * as React from 'react';
import { View, AnimatedValue, timing } from '../../revas';

export interface SimpleRouterProps {
  width: number;
}

export default class SimpleRouter extends React.Component<SimpleRouterProps> {
  state = {
    animating: 0,
  };

  pages: React.ReactNode[] = [this.props.children];

  animated = new AnimatedValue(0);

  style = {
    first: {
      translateX: this.animated.interpolate([0, 1], [0, this.props.width]),
      animated: true,
    },
    second: {
      opacity: this.animated.interpolate([0, 1], [0.7, 1]),
      scale: this.animated.interpolate([0, 1], [0.9, 1]),
      animated: true,
    },
    others: {
      opacity: 0,
    },
  };

  push = (Component: any, params: any = {}) => {
    this.pages.push(<Component {...params} router={this} />);
    this.animated.setValue(1);
    this.setState({ animating: -1 });
    requestAnimationFrame(this._pushAnim);
  };

  _pushAnim = () => {
    this.setState({ animating: 1 });
    timing(this.animated, {
      to: 0,
      duration: 200,
    }).start(this._pushAnimDone);
  };

  _pushAnimDone = () => this.setState({ animating: 0 });

  pop = () => {
    this.setState({ animating: 1 });
    this.animated.setValue(0);
    timing(this.animated, {
      to: 1,
      duration: 200,
    }).start(this._popAnimDone);
  };

  _popAnimDone = () => {
    this.pages.pop();
    this.setState({ animating: 0 });
  };

  getStyle(index: number, pages: any[]) {
    if (index === pages.length - 1) {
      return this.style.first;
    }
    if (index === pages.length - 2) {
      return this.style.second;
    }
    return this.style.others;
  }

  id = 0;

  renderPage = (page: React.ReactNode, index: number, pages: React.ReactNode[]) => {
    const { animating } = this.state;
    const isLast = index === pages.length - 1;
    const id = isLast && animating > 0 ? `pages_anim_${this.id++}` : false;
    return (
      <View
        key={index}
        cache={!isLast || id}
        forceCache
        pointerEvents={animating ? 'none' : 'auto'}
        style={animating ? [styles.page, this.getStyle(index, pages)] : styles.page}
      >
        {page}
      </View>
    );
  };

  render() {
    return this.pages.map(this.renderPage);
  }
}

const styles = {
  page: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#fff',
  },
};
