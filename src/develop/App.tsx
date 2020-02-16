import React from 'react';
import { Text, View, Image, Touchable, ScrollView } from '../revas';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image style={styles.logo}
          src={require('./logo.png')} />
        <Text style={styles.text}>
          Revas让你可以用React和Flexible CSS，{'\n'}在Canvas上绘制高性能交互式界面～🎉
        </Text>
        <Touchable style={styles.btn} onPress={() => alert('Enjoy!~🎉')}>
          <Text style={styles.btnText}>Go</Text>
        </Touchable>
      </View>
      <ScrollView style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <View style={{ height: 80, backgroundColor: '#9254DE' }} />
        <View style={{ height: 80, backgroundColor: '#91D5FF' }} />
        <View style={{ height: 80, backgroundColor: '#B37FEB' }} />
        <View style={{ height: 80, backgroundColor: '#40A9FF' }} />
        <View style={{ height: 80, backgroundColor: '#9254DE' }} />
        <View style={{ height: 80, backgroundColor: '#91D5FF' }} />
        <View style={{ height: 80, backgroundColor: '#B37FEB' }} />
        <View style={{ height: 80, backgroundColor: '#40A9FF' }} />
        <View style={{ height: 80, backgroundColor: '#9254DE' }} />
        <View style={{ height: 80, backgroundColor: '#91D5FF' }} />
        <View style={{ height: 80, backgroundColor: '#B37FEB' }} />
        <View style={{ height: 80, backgroundColor: '#40A9FF' }} />
        <View style={{ height: 80, backgroundColor: '#9254DE' }} />
        <View style={{ height: 80, backgroundColor: '#91D5FF' }} />
        <View style={{ height: 80, backgroundColor: '#B37FEB' }} />
        <View style={{ height: 80, backgroundColor: '#40A9FF' }} />
      </ScrollView>
    </View>
  )
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#abcdef',
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
    alignItems: 'center',
    zIndex: 1
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    height: 55,
    width: 280,
    marginTop: 20,
  },
  logo: {
    width: 200,
    height: 94,
    borderRadius: 10,
    overflow: 'hidden'
  },
  btn: {
    justifyContent: 'center',
    height: 40, backgroundColor: 'blue',
    width: '100%'
  },
  btnText: {
    fontSize: 20,
    textAlign: 'center',
    height: 30,
    lineHeight: 30,
    color: '#fff',
    fontWeight: 'bold',
  },

}
