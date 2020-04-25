import * as React from 'react';
import { View, Text } from '../../revas';
import NavBar from './Navbar';
import Panel from './Panel';
import Interactable from './Interactable';

export default function Gesture(props: any) {
  return (
    <View style={styles.container}>
      <NavBar title="Gesture" {...props} />
      <Panel label="Basic" style={styles.container}>
        <Interactable style={styles.box}>
          <Text style={styles.text}>Drag!</Text>
        </Interactable>
      </Panel>
    </View>
  );
}

const styles = {
  container: { flex: 1 },
  box: {
    width: 80,
    height: 80,
    backgroundColor: '#D8D8D8',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
};
