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
  AnimatedTiming,
  withContext
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

@withContext
export default class Player extends React.Component<PlayerProps> {
  state = {
    mode: PlayerMode.Mini,
    current: this.props.music,
    playing: false,
  };

  WINDOW_WIDTH = this.context.clientWidth;
  WINDOW_HEIGHT = this.context.clientHeight;
  SIZE = this.WINDOW_WIDTH * 0.85;
  RADIO = this.SIZE / 2;
  IMAGE_SIZE = this.SIZE - 20;
  IMAGE_RADIO = this.IMAGE_SIZE / 2;

  STYLES = {
    cover: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: this.SIZE,
      height: this.SIZE,
      borderRadius: this.RADIO,
      shadowColor: 'rgba(55, 72, 80, 0.4)',
      shadowOffsetX: 0,
      shadowOffsetY: 2,
      shadowBlur: 30,
      backgroundColor: '#fff',
      ...CENTER_AREA,
    },

    coverImage: {
      width: this.IMAGE_SIZE,
      height: this.IMAGE_SIZE,
      borderRadius: this.IMAGE_RADIO,
    },

    main: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: this.WINDOW_HEIGHT / 2,
      justifyContent: 'center',
    },
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
      [(this.WINDOW_WIDTH - this.SIZE) / 2, this.WINDOW_WIDTH - this.SIZE / 2, this.WINDOW_WIDTH + 30]
    ),
    translateY: this.transaction.interpolate(
      [0, 1],
      [this.WINDOW_HEIGHT / 1.8 - this.SIZE, (this.WINDOW_HEIGHT - this.SIZE) / 2]
    ),
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
    this.switchHandler?.stop();
    this.rotateHandler?.stop();
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
      this.switchHandler = timing(this.transaction, {
        to: isFull ? 1 : 0,
        duration: 1000,
        ease: Easing.elastic(),
      }).start();
      await this.switchHandler.promise();
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
          <View style={this.STYLES.main}>
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
        <View style={[this.STYLES.cover, this._coverStyle]} cache={this.state.current.name}>
          <Image style={this.STYLES.coverImage} src={this.state.current.cover} />
          <Touchable style={ABS_FULL} onPress={this.toggle} />
        </View>
      </React.Fragment>
    );
  }
}

const styles = {
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
