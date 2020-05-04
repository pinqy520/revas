import * as React from 'react';
import {
  View,
  Image,
  Touchable,
  AnimatedValue,
  Text,
  timing,
  Easing,
  noop,
  LinearGradient,
  AnimatedTiming
} from '../../revas';
import { ABS_FULL, DEFAULT_TEXT, ROW_CENTER, CENTER_AREA } from './styles';

export interface PlayerProps {
  music: any;
  disabled: boolean;
  transaction: AnimatedValue;
}

enum PlayerMode {
  Mini,
  Toggle,
  Full,
  Switch,
}

function isMini(mode: PlayerMode) {
  return mode === PlayerMode.Mini || mode === PlayerMode.Switch;
}

function isAnim(mode: PlayerMode) {
  return mode === PlayerMode.Toggle || mode === PlayerMode.Switch;
}

export default class Player extends React.Component<PlayerProps> {
  state = {
    mode: PlayerMode.Mini,
    current: this.props.music,
    playing: false,
  };

  get transaction() {
    return this.props.transaction;
  }

  audio = new Audio(this.props.music.audio);

  rotateHandler?: AnimatedTiming;

  switchHandler?: AnimatedTiming;

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

  componentWillUnmount() {
    this.audio.pause();
    this.audio.remove();
    this.audio.src = '';
  }

  onPlay = () => {
    if (this.rotateHandler) {
      this.audio.pause();
      this.rotateHandler.stop();
      this.rotateHandler = void 0;
      this.setState({ playing: false });
    } else {
      this._play();
      this.audio.loop = true;
      this.audio.play();
      this.setState({ playing: true });
    }
  };

  _play = () => {
    const to = 2 * Math.PI;
    if (this._coverStyle.rotate.getValue() >= to) {
      this._coverStyle.rotate.setValue(0);
    }
    this.rotateHandler = timing(this._coverStyle.rotate, {
      to,
      duration: ((to - this._coverStyle.rotate.getValue()) / to) * 10000,
    }).start(this._play);
  };

  next = async () => {
    if (isMini(this.state.mode)) {
      if (this.state.mode === PlayerMode.Switch) {
        this.switchHandler?.stop();
        const currentValue = this.transaction.getValue();
        if (currentValue < 2) {
          this.switchHandler = timing(this.transaction, {
            to: 2,
            duration: (2 - currentValue) * 500,
          }).start();
          await this.switchHandler.promise();
        }
      } else {
        this.setState({ mode: PlayerMode.Switch });
        this.switchHandler = timing(this.transaction, {
          to: 2,
          duration: 500,
        }).start();
        await this.switchHandler.promise();
      }
      this.setState({ current: this.props.music });
      this.audio.src = this.props.music.audio;
      if (this.rotateHandler) {
        this.audio.play();
      } else {
        this._coverStyle.rotate.setValue(0);
      }
      this.switchHandler = timing(this.transaction, {
        to: 1,
        duration: 1000,
        ease: Easing.elastic(),
      }).start();
      await this.switchHandler.promise();
      this.setState({ mode: PlayerMode.Mini });
    }
  };

  toggle = async () => {
    if (!this.props.disabled && !isAnim(this.state.mode)) {
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
    if (!isMini(this.state.mode)) {
      const { music } = this.props;
      return (
        <LinearGradient
          cache={this.state.mode === PlayerMode.Toggle}
          style={[ABS_FULL, this._opacity]}
          colors={music.color}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.main}>
            <Text style={styles.name}>{music.name}</Text>
            <Text style={styles.singer}>{music.singer}</Text>
            <View style={styles.controls}>
              <Touchable onPress={this.toggle} style={styles.btn}>
                <Image style={styles.btnS} src={require('./assets/btn-mini.png')} />
              </Touchable>
              <Touchable onPress={this.onPlay} style={styles.btn}>
                <Image
                  style={styles.play}
                  src={this.state.playing ? require('./assets/btn-pause.png') : require('./assets/btn-play.png')}
                />
              </Touchable>
              <Touchable onPress={noop} style={styles.btn}>
                <Image style={styles.btnS} src={require('./assets/btn-loop.png')} />
              </Touchable>
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
        <View style={[styles.cover, this._coverStyle]} cache={this.state.current.name}>
          <Image style={styles.coverImage} src={this.state.current.cover} />
          <Touchable style={ABS_FULL} onPress={this.toggle} />
        </View>
      </React.Fragment>
    );
  }
}

const WINDOW_WIDTH = window.innerWidth;
const WINDOW_HEIGHT = window.innerHeight;
const SIZE = Math.min(WINDOW_WIDTH * 0.85, WINDOW_HEIGHT * 0.6);
const RADIO = SIZE / 2;
const IMAGE_SIZE = SIZE - 20;
const IMAGE_RADIO = IMAGE_SIZE / 2;

const styles = {
  cover: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SIZE,
    height: SIZE,
    borderRadius: RADIO,
    shadowColor: 'rgba(55, 72, 80, 0.4)',
    shadowOffsetX: 0,
    shadowOffsetY: 2,
    shadowBlur: 30,
    backgroundColor: '#fff',
    ...CENTER_AREA,
  },

  coverImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_RADIO,
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
    marginLeft: 45,
  },
  singer: {
    ...DEFAULT_TEXT,
    color: '#fff',
    fontSize: 14,
    marginTop: 10,
    marginLeft: 45,
  },
  controls: {
    ...ROW_CENTER,
    paddingLeft: 13,
    marginTop: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  btnS: {
    width: 22,
    height: 22,
  },
  play: {
    width: 40,
    height: 40,
  },
  btn: {
    ...CENTER_AREA,
    width: 90,
    height: 54,
  },
};
