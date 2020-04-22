import * as React from 'react';
import { View, Image, LinearGradient, Text, Touchable, noop, AnimatedValue, timing, Easing } from '../../revas';
import { MUSICS } from './data';
import { ABS_FULL, DEFAULT_TEXT, ROW_CENTER, CENTER_AREA } from './styles';

const music = MUSICS[1];



export default class Player extends React.Component {
  state = {
    mode: 'normal'
  };

  animated = new AnimatedValue(0);

  rotateHandler: any;

  _bgStyle = {
    scale: this.animated.interpolate(
      [-1, 0, 1, 2],
      [1.2, 1.2, 1, 1]
    ),
    borderRadius: WINDOW_HEIGHT / 2,
    overflow: 'hidden',
    animated: true
  };

  _coverStyle = {
    rotate: new AnimatedValue(0),
    animated: true,
  };

  _containerStyle = {
    scale: this.animated.interpolate(
      [0, 1],
      [1, 0.4]
    ),
    translateX: this.animated.interpolate(
      [0, 1],
      [0, WINDOW_WIDTH / 2]
    ),
    animated: true
  };

  _opacity = {
    opacity: this.animated.interpolate(
      [0, 1],
      [1, 0]
    ),
    animated: true
  };

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
      duration: 10000
    }).start(this._play);
  };

  toggle = () => {
    if (this.state.mode !== 'toggle') {
      const isNormal = this.state.mode === 'normal';
      this.setState({ mode: 'toggle' });
      timing(this.animated, {
        to: isNormal ? 1 : 0,
        duration: 1000,
        ease: Easing.elastic()
      }).start(() => this.setState({ mode: isNormal ? 'minimal' : 'normal' }));
    }
  };

  render() {
    return (
      <View style={[styles.container, this._containerStyle]}>
        <View style={[ABS_FULL, this._bgStyle]} pointerEvents="none">
          <Image style={[ABS_FULL, this._coverStyle]} src={music.cover} />
          <LinearGradient
            style={[styles.mask, this._opacity]} colors={['rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0)']}
            start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }}
          />
        </View>
        <View style={[styles.main, this._opacity]} cache>
          <Text style={styles.name}>Youth (Gryffin Remix)</Text>
          <Text style={styles.singer}>Troye Sivan</Text>
          <View style={styles.progress}>
            <View style={styles.progressIn} />
          </View>
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
        {
          this.state.mode === 'minimal' && <Touchable style={ABS_FULL} onPress={this.toggle} />
        }
      </View>
    );
  }
}

const WINDOW_WIDTH = window.innerWidth;
const WINDOW_HEIGHT = window.innerHeight;

const styles = {
  container: {
    position: 'absolute',
    top: 0, left: -(WINDOW_HEIGHT - WINDOW_WIDTH) / 2,
    width: WINDOW_HEIGHT, height: WINDOW_HEIGHT,
    zIndex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: WINDOW_HEIGHT / 2,
    // shadowColor: '#98B3B0',
    // shadowOffsetX: 2,
    // shadowOffsetY: 2,
    // shadowBlur: 50
  },
  mask: {
    position: 'absolute',
    top: WINDOW_HEIGHT / 2, left: 0, bottom: 0, right: 0,
  },
  main: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    justifyContent: 'flex-end',
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
    marginBottom: 100
  },
  btnS: {
    width: 14, height: 14,
  },
  play: {
    width: 29, height: 34,
  },
  btn: {
    ...CENTER_AREA,
    width: 78, height: 54,
  },
  time: {
    ...DEFAULT_TEXT,
    color: '#fff',
    fontSize: 14,
    width: 70,
    textAlign: 'center',
    marginTop: 3
  },
  progress: {
    height: 6,
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 30,
    marginBottom: 20,
  },
  progressIn: {
    height: 6,
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  }
};