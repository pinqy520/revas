import React from 'react';
import { Text, View, Image } from '../revas';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.card} >
        <Image style={styles.logo}
          src={require('./logo.png')} />
        <Text style={styles.text}>
          Revas让你可以用React和Flexible CSS，{'\n'}在Canvas上绘制高性能交互式界面～🎉
        </Text>
      </View>
    </View>
  )
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#abcdef',
  },
  card: {
    padding: 20,
    borderRadius: 10,
    shadowBlur: 20,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffsetX: 0,
    shadowOffsetY: 5,
    backgroundColor: '#fff',
    alignItems: 'center',
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
  },

}
