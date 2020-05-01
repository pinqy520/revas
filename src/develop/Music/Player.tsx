import * as React from 'react';
import { View, Image, Touchable, AnimatedValue, Text, timing, Easing, noop, LinearGradient } from '../../revas';
import { ABS_FULL, DEFAULT_TEXT, ROW_CENTER, CENTER_AREA } from './styles';

export interface PlayerProps {
  music: any;
}

enum PlayerMode {
  Mini,
  Toggle,
  Full,
}

export default class Player extends React.Component<PlayerProps> {
  state = {
    mode: PlayerMode.Mini,
    current: this.props.music,
  };

  rotateHandler: any;

  transaction = new AnimatedValue(1);

  _coverStyle = {
    translateX: this.transaction.interpolate(
      [0, 1, 2],
      [(WINDOW_WIDTH - SIZE) / 2, WINDOW_WIDTH - SIZE / 2, WINDOW_WIDTH + 30]
    ),
    translateY: this.transaction.interpolate([0, 1], [WINDOW_HEIGHT * 0.1, (WINDOW_HEIGHT - SIZE) / 2]),
    rotate: new AnimatedValue(0),
    animated: true,
  };

  _opacity = {
    opacity: this.transaction.interpolate([0, 1], [1, 0]),
    animated: true,
  };

  componentDidUpdate() {
    if (this.props.music !== this.state.current) {
      this.next();
    }
  }

  onPlay = () => {
    if (this.rotateHandler) {
      this.rotateHandler.stop();
      this.rotateHandler = void 0;
    } else {
      this._play();
    }
  };

  _play = () => {
    this._coverStyle.rotate.setValue(0);
    this.rotateHandler = timing(this._coverStyle.rotate, {
      to: 2 * Math.PI,
      duration: 10000,
    }).start(this._play);
  };

  next = async () => {
    if (this.state.mode === PlayerMode.Mini) {
      await timing(this.transaction, {
        to: 2,
        duration: 1000,
        ease: Easing.elastic(),
      })
        .start()
        .promise();
      this.setState({ current: this.props.music });
      await timing(this.transaction, {
        to: 1,
        duration: 1000,
        ease: Easing.elastic(),
      })
        .start()
        .promise();
    }
  };

  toggle = async () => {
    if (this.state.mode !== PlayerMode.Toggle) {
      const isFull = this.state.mode === PlayerMode.Full;
      this.setState({ mode: PlayerMode.Toggle });
      await timing(this.transaction, {
        to: isFull ? 1 : 0,
        duration: 1000,
        ease: Easing.elastic(),
      })
        .start()
        .promise();
      this.setState({ mode: isFull ? PlayerMode.Mini : PlayerMode.Full });
    }
  };

  renderMain() {
    if (this.state.mode !== PlayerMode.Mini) {
      const { music } = this.props;
      return (
        <LinearGradient
          cache={this.state.mode === PlayerMode.Toggle}
          style={[ABS_FULL, this._opacity]}
          colors={['#B9C9CF', '#8398A1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.main}>
            <Text style={styles.name}>{music.name}</Text>
            <Text style={styles.singer}>{music.singer}</Text>
            <View style={styles.controls}>
              <Touchable onPress={this.toggle} style={styles.btn}>
                <Image style={styles.btnS} src={require('./assets/btn-prev.png')} />
              </Touchable>
              <Touchable onPress={this.onPlay} style={styles.btn}>
                <Image style={styles.play} src={require('./assets/btn-play.png')} />
              </Touchable>
              <Touchable onPress={noop} style={styles.btn}>
                <Image style={styles.btnS} src={require('./assets/btn-next.png')} />
              </Touchable>
              <Text style={styles.time}>1:03</Text>
            </View>
          </View>
        </LinearGradient>
      );
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.renderMain()}
        <Image style={[styles.cover, this._coverStyle]} src={this.state.current.cover} cache={this.state.current.cover}>
          <Touchable style={ABS_FULL} onPress={this.toggle} />
        </Image>
      </React.Fragment>
    );
  }
}

const WINDOW_WIDTH = window.innerWidth;
const WINDOW_HEIGHT = window.innerHeight;
const SIZE = Math.min(WINDOW_WIDTH * 0.8, WINDOW_HEIGHT * 0.5);
console.log(SIZE);
const RADIO = SIZE / 2;

const styles = {
  cover: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SIZE,
    height: SIZE,
    borderRadius: RADIO,
    shadowColor: '#98B3B0',
    shadowOffsetX: 0,
    shadowOffsetY: 2,
    shadowBlur: 30,
    backgroundColor: '#fff',
  },

  main: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 20,
    height: WINDOW_HEIGHT * 0.9 - SIZE,
    justifyContent: 'center',
  },
  name: {
    ...DEFAULT_TEXT,
    color: '#fff',
    fontSize: 25,
    fontWeight: '600',
    marginLeft: 38,
  },
  singer: {
    ...DEFAULT_TEXT,
    color: '#fff',
    fontSize: 14,
    marginTop: 10,
    marginLeft: 38,
  },
  controls: {
    ...ROW_CENTER,
    marginLeft: 10,
    marginTop: 30,
  },
  btnS: {
    width: 14,
    height: 14,
  },
  play: {
    width: 29,
    height: 34,
  },
  btn: {
    ...CENTER_AREA,
    width: 78,
    height: 54,
  },
  time: {
    ...DEFAULT_TEXT,
    color: '#fff',
    fontSize: 14,
    width: 70,
    textAlign: 'center',
    marginTop: 3,
  },
};
