import * as React from 'react';
import { View, ScrollView, Touchable, Text } from '../../revas';
import NavBar from './Navbar';
import Panel from './Panel';

export default function Animation(props: any) {
  return (
    <View style={styles.container}>
      <NavBar title="Animation" {...props} />
      <ScrollView style={styles.container}>
        <Panel label="Basic">
          <View style={styles.box} />
          <View style={styles.row}>
            <Touchable style={styles.button.container} onPress={() => alert('press')}>
              <Text style={styles.button.text}>opacity</Text>
            </Touchable>
            <Touchable style={styles.button.container} onPress={() => alert('press')}>
              <Text style={styles.button.text}>translateX</Text>
            </Touchable>
            <Touchable style={styles.button.container} onPress={() => alert('press')}>
              <Text style={styles.button.text}>rotation</Text>
            </Touchable>
            <Touchable style={styles.button.container} onPress={() => alert('press')}>
              <Text style={styles.button.text}>scale</Text>
            </Touchable>
          </View>
        </Panel>
        <Panel label="Easing">
          <View style={styles.box} />
          <View style={styles.row}>
            <Touchable style={styles.button.container} onPress={() => alert('press')}>
              <Text style={styles.button.text}>linear</Text>
            </Touchable>
            <Touchable style={styles.button.container} onPress={() => alert('press')}>
              <Text style={styles.button.text}>ease-in</Text>
            </Touchable>
            <Touchable style={styles.button.container} onPress={() => alert('press')}>
              <Text style={styles.button.text}>ease-out</Text>
            </Touchable>
            <Touchable style={styles.button.container} onPress={() => alert('press')}>
              <Text style={styles.button.text}>ease</Text>
            </Touchable>
          </View>
        </Panel>
      </ScrollView>
    </View>
  );
}

const styles = {
  container: { flex: 1 },
  row: { flexDirection: 'row', marginRight: -15, marginTop: 10 },
  button: {
    container: {
      flex: 1,
      height: 30,
      marginRight: 15,
      justifyContent: 'center',
      backgroundColor: '#333',
    },
    text: {
      color: '#fff',
      fontSize: 12,
      textAlign: 'center',
    },
  },
  box: {
    width: 50,
    height: 50,
    backgroundColor: '#D8D8D8',
  },
};
