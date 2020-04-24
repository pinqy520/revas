import * as React from 'react';
import { View } from '../../revas';
import NavBar from './Navbar';
import Entry from './Entry';
import About from './About';
import Components from './Component';


export default function Intro(props: any) {
  return (
    <View style={styles.container}>
      <NavBar {...props} title="Introduction" />
      <View style={styles.entries}>
        <Entry label="Component" onPress={() => props.router.push(Components)} />
        <Entry label="Style" onPress={() => {}} />
        <Entry label="Animation" onPress={() => {}} />
        <Entry label="Gesture" onPress={() => {}} />
        <Entry label="About" onPress={() => props.router.push(About)} />
      </View>
    </View>
  );
}


const styles = {
  container: {
    flex: 1
  },
  entries: {
    flex: 1,
    justifyContent: 'center'
  }
};