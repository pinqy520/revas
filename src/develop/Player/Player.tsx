import * as React from 'react'
import { View, Image, LinearGradient, Text, Touchable, noop, AnimatedValue, timing, Easing } from '../../revas'
import { MUSICS } from './data'
import { ABS_FULL, DEFAULT_TEXT, ROW_CENTER, CENTER_AREA } from './styles'

const music = MUSICS[1]



export default class Player extends React.Component {

  animated = new AnimatedValue(0)

  rotate = new AnimatedValue(0)
  scale = this.animated.interpolate(
    [0, 1],
    [1, 0.4]
  )
  bgScale = this.animated.interpolate(
    [-1, 0, 1, 2],
    [1.2, 1.2, 1, 1]
  )
  translateX = this.animated.interpolate(
    [0, 1],
    [0, WINDOW_WIDTH / 2]
  )
  opacity = this.animated.interpolate(
    [0, 1],
    [1, 0]
  )

  rotateHandler: any

  onPlay = () => {
    if (this.rotateHandler) {
      this.rotateHandler.stop()
    }
    this.rotate.setValue(0)
    this.rotateHandler = timing(this.rotate, {
      to: 2 * Math.PI,
      duration: 10000
    }).start(this.onPlay)
  }

  onSmall = () => {
    const value = this.animated.getValue()
    timing(this.animated, {
      to: value < 1 ? 1 : 0,
      duration: 1000,
      ease: Easing.elastic()
    }).start()
  }

  render() {
    return (
      <View style={[styles.container, { scale: this.scale, translateX: this.translateX }]}>
        <View style={[ABS_FULL, {
          scale: this.bgScale,
          borderRadius: WINDOW_HEIGHT / 2,
          overflow: 'hidden'
        }]}>
          <Image pointerEvents="none" style={[ABS_FULL, {
            rotate: this.rotate,
          }]} src={music.cover} />
          <LinearGradient style={[styles.mask, { opacity: this.opacity }]} colors={['#00000080', '#00000000']}
            start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} />
        </View>
        <View style={[styles.main, { opacity: this.opacity }]}>
          <Text style={styles.name}>Youth (Gryffin Remix)</Text>
          <Text style={styles.singer}>Troye Sivan</Text>
          <View style={styles.progress}>
            <View style={styles.progressIn} />
          </View>
          <View style={styles.controls}>
            <Touchable onPress={this.onSmall} style={styles.btn}>
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
      </View>
    )
  }
}

const WINDOW_WIDTH = window.innerWidth
const WINDOW_HEIGHT = window.innerHeight

const styles = {
  container: {
    position: 'absolute',
    top: 0, left: -(WINDOW_HEIGHT - WINDOW_WIDTH) / 2,
    width: WINDOW_HEIGHT, height: WINDOW_HEIGHT,
    zIndex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: WINDOW_HEIGHT / 2,
    shadowColor: '#98B3B0',
    shadowOffsetX: 0,
    shadowOffsetY: 2,
    shadowBlur: 50
  },
  mask: {
    position: 'absolute',
    top: '50%', left: 0, bottom: 0, right: 0,
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
}