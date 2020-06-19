import * as React from 'react';
import { View, Text, AnimatedValue, timing, AnimatedTiming, Touchable, withContext } from '../revas';
import Intro from './Intro';
import Timeline from './Timeline';
import MusicApp from './Music';
import SimpleRouter from './common/simple-router';

@withContext
export default class App extends React.Component {
  router = React.createRef<SimpleRouter>();

  push = (Comp: any) => () => {
    this.router.current?.push(Comp);
  };

  open = () => {
    window.open('https://pinqy520.github.io/demo/revas-three/');
  };

  render() {
    const cardHeight = this.context.clientHeight / 7;
    return (
      <SimpleRouter ref={this.router} width={this.context.clientWidth}>
        <View style={styles.container}>
          <Text style={styles.title}>Revas Examples</Text>
          <View style={styles.cards}>
            <Card
              color="#9254DE"
              shadowColor="rgba(146, 84, 222, 0.5)"
              height={cardHeight}
              text="Overview"
              tap={this.push(Intro)}
            />
            <Card
              color="#F759AB"
              shadowColor="rgba(247, 89, 171, 0.5)"
              height={cardHeight}
              text="Timeline App"
              tap={this.push(Timeline)}
            />
            <Card
              color="#597EF7"
              shadowColor="rgba(89, 126, 247, 0.5)"
              height={cardHeight}
              text="Music App"
              tap={this.push(MusicApp)}
            />
            <Touchable style={styles.extra} onPress={this.open}>
              <Text style={styles.extraText}>Revas + THREE.js ></Text>
            </Touchable>
          </View>
        </View>
      </SimpleRouter>
    );
  }
}

interface CardProps {
  color: string;
  shadowColor: string;
  text: string;
  tap: Function;
  height: number;
}

class Card extends React.Component<CardProps> {
  animated = new AnimatedValue(30);
  animating?: AnimatedTiming;

  style = [
    styles.card,
    {
      height: this.props.height,
      backgroundColor: this.props.color,
      shadowColor: this.props.shadowColor,
      shadowBlur: this.animated,
      shadowOffsetY: this.animated.interpolate([4, 30], [1, 5]),
      animated: true,
    },
  ];

  onPress = () => {
    this.animating?.stop();
    this.animating = timing(this.animated, {
      to: 4,
      duration: (this.animated.getValue() - 4) * 10,
    }).start();
  };

  onPressOut = () => {
    this.animating?.stop();
    this.animating = timing(this.animated, {
      to: 30,
      duration: (30 - this.animated.getValue()) * 10,
    }).start();
  };

  render() {
    return (
      <Touchable
        activeOpacity={1}
        style={this.style}
        onPress={this.props.tap}
        onPressIn={this.onPress}
        onPressOut={this.onPressOut}
        cache
      >
        <Text style={styles.text}>{this.props.text}</Text>
      </Touchable>
    );
  }
}

const styles = {
  container: {
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '500',
    color: '#000',
    opacity: 0.56,
    marginBottom: 20,
    fontFamily:
      "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue'",
  },
  cards: {
    alignItems: 'center',
  },
  card: {
    width: 280,
    shadowOffsetX: 0,
    borderRadius: 15,
    justifyContent: 'center',
    marginTop: 20,
  },
  text: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '500',
    color: '#fff',
    fontFamily:
      "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue'",
  },
  extra: {
    width: 280,
    height: 50,
    justifyContent: 'center',
    marginTop: 10,
  },
  extraText: {
    textAlign: 'center',
  },
};
