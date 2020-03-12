import React from 'react';
import { Text, View, Image, Touchable, ScrollView, LinearGradient } from '../../revas';
import Interactable from './Interactable';

export default function App() {
  return (
    <View style={styles.container}>
      <Interactable style={styles.card}>
        <Text style={styles.title}>Drag and Move! </Text>
        <Image style={styles.logo}
          src={require('./logo.png')} />
        <Text style={styles.text} numberOfLines={2}>
          Revas让你可以用React和CSS，在Canvas上绘制高性能交互界面，基于React v16和Yoga Layout～{'🎉'}
        </Text>
        <LinearGradient style={styles.decorator} colors={['#9254DE', '#B37FEB', '#91D5FF', '#40A9FF']} />
        <Touchable style={styles.btn} onPress={() => alert('Enjoy!~🎉')}>
          <Text style={styles.btnText}>Go</Text>
        </Touchable>
      </Interactable>
      <ScrollView style={styles.scroll1}>
        <ScrollView horizontal style={styles.scrollH}>
          <View style={[styles.item1, styles.width100]} />
          <View style={[styles.item2, styles.width100]} />
          <View style={[styles.item3, styles.width100]} />
          <View style={[styles.item4, styles.width100]} />
          <View style={[styles.item1, styles.width100]} />
        </ScrollView>
        <View style={styles.item1} />
        <View style={styles.item2} />
        <View style={styles.item3} />
        <View style={styles.item4} />
        <ScrollView style={styles.scrollNested}>
          <View style={{ height: 80, backgroundColor: 'black' }} />
          <View style={{ height: 80, backgroundColor: 'white' }} />
          <View style={{ height: 80, backgroundColor: 'black' }} />
          <View style={{ height: 80, backgroundColor: 'white' }} />
          <View style={{ height: 80, backgroundColor: 'black' }} />
          <View style={{ height: 80, backgroundColor: 'white' }} />
        </ScrollView>
        <View style={styles.item1} />
        <View style={styles.item2} />
        <View style={styles.item3} />
        <View style={styles.item4} />
      </ScrollView>
    </View>
  )
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    // backgroundColor: '#abcdef',
  },
  card: {
    padding: 20,
    margin: 10,
    borderRadius: 10,
    shadowBlur: 20,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffsetX: 0,
    shadowOffsetY: 5,
    backgroundColor: '#fff',
    // alignItems: 'center',
    zIndex: 1,

  },
  decorator: {
    height: 4, borderRadius: 2,
    margin: 10, marginLeft: 40, marginRight: 40
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    // width: 280,
    padding: 10,
    paddingBottom: 0,
    color: '#333'
  },
  logo: {
    // width: 200,
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
    resizeMode: 'contain'
  },
  btn: {
    justifyContent: 'center',
    height: 40, backgroundColor: 'blue',
    // width: 150
  },
  btnText: {
    fontSize: 20,
    textAlign: 'center',
    height: 30,
    lineHeight: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
  scroll1: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0
  },
  scrollH: { height: 80, backgroundColor: 'red' },
  width100: { width: 100 },
  item1: { height: 80, backgroundColor: '#B37FEB' },
  item2: { height: 80, backgroundColor: '#40A9FF' },
  item3: { height: 80, backgroundColor: '#9254DE' },
  item4: { height: 80, backgroundColor: '#91D5FF' },
  scrollNested: { height: 150, overflow: 'hidden' }
}
