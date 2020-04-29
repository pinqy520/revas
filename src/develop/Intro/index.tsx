import * as React from 'react';
import { View } from '../../revas';
import NavBar from './Navbar';
import Entry from './Entry';
import About from './About';
import Components from './Component';
import Style from './Style';
import Animation from './Animation';
import Gesture from './Gesture';

export default function Intro(props: any) {
  return (
    <View style={styles.container}>
      <NavBar {...props} title="Overview" />
      <View style={styles.entries}>
        <Entry label="Component" onPress={() => props.router.push(Components)} />
        <Entry label="Style" onPress={() => props.router.push(Style)} />
        <Entry label="Animation" onPress={() => props.router.push(Animation)} />
        <Entry label="Gesture" onPress={() => props.router.push(Gesture)} />
        <Entry label="About" onPress={() => props.router.push(About)} />
      </View>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
  },
  entries: {
    flex: 1,
    justifyContent: 'center',
  },
};
