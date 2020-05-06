import * as React from 'react';
import {
  View,
  ScrollView,
  Touchable,
  Text,
  AnimatedValue,
  timing,
  AnimatedTiming,
  Easing,
  withContext
} from '../../revas';
import NavBar from './Navbar';
import Panel from './Panel';

export default function Animation(props: any) {
  return (
    <View style={styles.container}>
      <NavBar title="Animation" {...props} />
      <ScrollView style={styles.container}>
        <AnimateTypeExample />
        <AnimateEaseExample />
      </ScrollView>
    </View>
  );
}

@withContext
class AnimateEaseExample extends React.Component {
  state = {
    style: {},
  };
  onAnim = (style: any) => this.setState({ style });
  render() {
    return (
      <Panel label="Easing">
        <View style={[styles.box, this.state.style]} />
        <View style={styles.row}>
          <AnimateButton
            label="linear"
            type="translateX"
            ease={Easing.linear}
            from={0}
            to={this.context.clientWidth! / 1.5}
            onAnimate={this.onAnim}
          />
          <AnimateButton
            label="ease"
            type="translateX"
            ease={Easing.ease}
            from={0}
            to={this.context.clientWidth! / 1.5}
            onAnimate={this.onAnim}
          />
          <AnimateButton
            label="bounce"
            type="translateX"
            ease={Easing.bounce}
            from={0}
            to={this.context.clientWidth! / 1.5}
            onAnimate={this.onAnim}
          />
          <AnimateButton
            label="ease-out"
            type="translateX"
            ease={Easing.out()}
            from={0}
            to={this.context.clientWidth! / 1.5}
            onAnimate={this.onAnim}
          />
        </View>
      </Panel>
    );
  }
}

@withContext
class AnimateTypeExample extends React.Component {
  state = {
    style: {},
  };
  onAnim = (style: any) => this.setState({ style });
  render() {
    return (
      <Panel label="Basic">
        <View style={[styles.box, this.state.style]} />
        <View style={styles.row}>
          <AnimateButton label="opacity" type="opacity" from={1} to={0} onAnimate={this.onAnim} />
          <AnimateButton
            label="translateX"
            type="translateX"
            from={0}
            to={this.context.clientWidth! / 1.5}
            onAnimate={this.onAnim}
          />
          <AnimateButton label="rotation" type="rotate" from={0} to={Math.PI} onAnimate={this.onAnim} />
          <AnimateButton label="scale" type="scale" from={1} to={0.5} onAnimate={this.onAnim} />
        </View>
      </Panel>
    );
  }
}

interface AnimateButtonProps {
  ease?: any;
  label: string;
  type: string;
  from: number;
  to: number;
  onAnimate: Function;
}

class AnimateButton extends React.Component<AnimateButtonProps> {
  animated = new AnimatedValue(0);

  style: any = {
    [this.props.type]: this.animated.interpolate([0, 0.5, 1], [this.props.from, this.props.to, this.props.from]),
    animated: true,
  };

  timing?: AnimatedTiming;

  onPress = () => {
    this.timing && this.timing.stop();
    this.animated.setValue(0);
    this.timing = timing(this.animated, {
      to: 1,
      duration: 2000,
      ease: this.props.ease || Easing.ease,
    }).start();
    this.props.onAnimate(this.style);
  };

  render() {
    return (
      <Touchable style={styles.button.container} onPress={this.onPress}>
        <Text style={styles.button.text}>{this.props.label}</Text>
      </Touchable>
    );
  }
}

const styles = {
  container: { flex: 1 },
  row: { flexDirection: 'row', marginRight: -15, marginTop: 10 },
  button: {
    container: {
      flex: 1,
      height: 30,
      marginRight: 15,
      justifyContent: 'center',
      backgroundColor: '#333',
    },
    text: {
      color: '#fff',
      fontSize: 12,
      textAlign: 'center',
    },
  },
  box: {
    width: 50,
    height: 50,
    backgroundColor: '#D8D8D8',
  },
};
