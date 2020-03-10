import * as React from 'react'
import { View, ScrollView, Text, LinearGradient, Image, Touchable } from '../../revas'
import { ABS_FULL, DEFAULT_TEXT, ROW_CENTER } from './styles'
import { MUSICS, MusicItemData } from './data'
import Player from './Player'

export default class PlayerApp extends React.Component {
  renderMusic = (item: MusicItemData, index: number) => {
    return (
      <View style={styles.musicItem} key={index}>
        <Image style={styles.musicCover}
          src={item.cover} />
        <View style={styles.musicInfo}>
          <Text style={styles.musicName}>{item.name}</Text>
          <Text style={styles.musicSinger}>{item.singer}</Text>
        </View>
      </View>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <LinearGradient style={styles.bg} colors={['#D3E6E4', '#98B3B0', '#A8C8C4']}
          start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} />
        <Touchable onPress={() => alert(1)} style={styles.title}>
          <Text style={styles.titleText}>Playlist</Text>
        </Touchable>
        <ScrollView style={styles.list}>
          {
            MUSICS.map(this.renderMusic)
          }
        </ScrollView>
        {/* <Player /> */}
      </View>
    )
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bg: {
    ...ABS_FULL,
    opacity: 0.2,
    // zIndex: -1
  },
  title: {
    justifyContent: 'center',
    height: 120,
  },
  titleText: {
    ...DEFAULT_TEXT,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 25,
  },
  list: {
    flex: 1,
    overflow: 'hidden'
    // backgroundColor: 'red'
  },
  musicItem: {
    ...ROW_CENTER,
  },
  musicCover: {
    width: 83, height: 83,
    borderRadius: 5,
    marginLeft: 20, marginRight: 20,
    marginTop: 15, marginBottom: 15,
    shadowColor: '#98B3B0',
    shadowBlur: 15,
    shadowOffsetY: 2,
    shadowOffsetX: 0,
    backgroundColor: '#fff'
  },
  musicInfo: {
    flex: 1,
  },
  musicName: {
    ...DEFAULT_TEXT,
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '600',
  },
  musicSinger: {
    ...DEFAULT_TEXT,
    fontSize: 14,
    fontWeight: '400',
    opacity: 0.5
  }
}