import React from 'react';
import { Text, View, Image, Touchable, LinearGradient } from '../../revas';
import Interactable from './Interactable';

export default function App() {
  return (
    <View style={styles.container}>
      <Interactable style={styles.card} cache>
        <Text style={styles.title}>Drag and Move! </Text>
        <Image
          style={styles.logo}
          src={require('./logo.png')}
        />
        <Text style={styles.text} numberOfLines={2}>
          Revas让你可以用React和CSS，在Canvas上绘制高性能交互界面，基于React v16和Yoga Layout～{'🎉'}
        </Text>
        <Touchable style={styles.btn} onPress={() => alert('Enjoy!~🎉')}>
          <Text style={styles.btnText}>Go</Text>
        </Touchable>
      </Interactable>
      <LinearGradient
        style={styles.background}
        start={{ x: 0, y: 0.3 }} end={{ x: 1, y: 0.7 }}
        colors={['#91D5FF', '#40A9FF']}
      />
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    padding: 20,
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    zIndex: 1,
  },
  background: {
    position: 'absolute',
    top: 0, bottom: 0, right: 0, left: 0
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
    padding: 10,
    color: '#333',
  },
  logo: {
    height: 100,
    borderRadius: 10,
    resizeMode: 'contain'
  },
  btn: {
    justifyContent: 'center',
    height: 40, backgroundColor: '#9254DE',
  },
  btnText: {
    fontSize: 20,
    textAlign: 'center',
    height: 30,
    lineHeight: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
};
