import * as React from 'react';
import { View, AnimatedValue, timing } from '../../revas';

export interface SimpleRouterProps{
  width: number;
}

export default class SimpleRouter extends React.Component<SimpleRouterProps> {
  state = {
    animating: false
  };

  pages: React.ReactNode[] = [this.props.children];

  style = {
    translateX: new AnimatedValue(this.props.width),
    animated: true
  };

  push = (Component: any, params: any = {}) => {
    this.pages.push(<Component {...params} router={this} />);
    this.setState({ animating: true });
    setTimeout(() => {
      timing(this.style.translateX, {
        to: 0,
        duration: 300,
      }).start(() => this.setState({ animating: false }));
    }, 120);
  };

  pop = () => {
    this.setState({ animating: true });
    timing(this.style.translateX, {
      to: this.props.width,
      duration: 200,
    }).start(() => {
      this.pages.pop();
      this.setState({ animating: false });
    });
  };

  id = 0;

  renderPage = (page: React.ReactNode, index: number, pages: React.ReactNode[]) => {
    const { animating } = this.state;
    const isLast = index === pages.length - 1;
    const id = isLast && animating ? `pages_anim_${this.id++}` : false;

    return (
      <View
        key={index} cache={!isLast || id}
        style={animating && isLast ? [styles.page, this.style] : styles.page}>
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
    left: 0, right: 0, top: 0, bottom: 0,
    backgroundColor: '#fff'
  }
};