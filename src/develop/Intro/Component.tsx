import * as React from 'react';
import { View, Text, Image, ScrollView, Touchable, LinearGradient } from '../../revas';
import NavBar from './Navbar';
import Panel, { PanelItem } from './Panel';

export default function Components(props: any) {
  return (
    <View style={styles.container}>
      <NavBar title="Component" {...props} />
      <ScrollView style={styles.container}>
        <Panel label="View">
          <View style={styles.row}>
            <View style={styles.view.base} />
            <View style={[styles.view.base, styles.view.radius]} />
            <View style={[styles.view.base, styles.view.border]} />
            <View style={[styles.view.base, styles.view.shadow]} />
          </View>
        </Panel>
        <Panel label="Text" cache>
          <View style={styles.row}>
            <Text style={styles.text.base}>default style</Text>
            <Text style={[styles.text.base, styles.text.weight]}>fontWeight</Text>
            <Text style={[styles.text.base, styles.text.color]}>color: red</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text.base}>textAlign: center</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.text.base, styles.text.serif]}>fontFamily: serif</Text>
            <Text style={[styles.text.base, styles.text.shadow]}>textShadow</Text>
          </View>
        </Panel>
        <Panel label="Image" cache>
          <View style={styles.rowLeft}>
            <PanelItem label="contain">
              <Image style={[styles.view.base, styles.image.contain]} src={require('./logo.png')} />
            </PanelItem>
            <PanelItem label="cover">
              <Image style={styles.view.base} src={require('./logo.png')} />
            </PanelItem>
          </View>
        </Panel>
        <Panel label="Touchable">
          <Touchable style={styles.button.container} onPress={() => alert('press')}>
            <Text style={styles.button.text}>Button</Text>
          </Touchable>
        </Panel>
        <Panel label="ScrollView">
          <ScrollView horizontal style={styles.scrollView.container}>
            <View style={styles.scrollView.box}>
              <Text style={styles.scrollView.text}>1</Text>
            </View>
            <View style={styles.scrollView.box}>
              <Text style={styles.scrollView.text}>2</Text>
            </View>
            <View style={styles.scrollView.box}>
              <Text style={styles.scrollView.text}>3</Text>
            </View>
            <View style={styles.scrollView.box}>
              <Text style={styles.scrollView.text}>4</Text>
            </View>
            <View style={styles.scrollView.box}>
              <Text style={styles.scrollView.text}>5</Text>
            </View>
            <View style={styles.scrollView.box}>
              <Text style={styles.scrollView.text}>6</Text>
            </View>
            <View style={styles.scrollView.box}>
              <Text style={styles.scrollView.text}>7</Text>
            </View>
            <View style={styles.scrollView.box}>
              <Text style={styles.scrollView.text}>8</Text>
            </View>
            <View style={styles.scrollView.box}>
              <Text style={styles.scrollView.text}>9</Text>
            </View>
            <View style={styles.scrollView.box}>
              <Text style={styles.scrollView.text}>10</Text>
            </View>
            <View style={styles.scrollView.box}>
              <Text style={styles.scrollView.text}>11</Text>
            </View>
          </ScrollView>
        </Panel>
        <Panel label="LinearGradient" cache>
          <LinearGradient style={styles.gradient} colors={['#C48DF1', '#91D5FF', '#40A9FF']} />
        </Panel>
      </ScrollView>
    </View>
  );
}

const styles = {
  container: { flex: 1 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItem: 'center',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItem: 'center',
  },
  gradient: {
    height: 40,
  },
  button: {
    container: {
      width: 120,
      height: 40,
      justifyContent: 'center',
      backgroundColor: '#333',
    },
    text: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 14,
      textAlign: 'center',
    },
  },
  image: {
    contain: {
      resizeMode: 'contain',
    },
  },
  text: {
    base: {
      flex: 1,
      textAlign: 'center',
      lineHeight: 20,
    },
    weight: {
      fontWeight: '800',
    },
    color: {
      color: 'red',
    },
    serif: {
      fontFamily: 'serif',
    },
    shadow: {
      textShadowOffsetX: 2,
      textShadowOffsetY: 2,
      textShadowBlur: 1,
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
    },
  },
  view: {
    base: {
      width: 60,
      height: 55,
      backgroundColor: '#D8D8D8',
    },
    radius: {
      borderRadius: 5,
    },
    border: {
      borderWidth: 1,
      borderColor: '#979797',
    },
    shadow: {
      backgroundColor: 'white',
      shadowOffsetX: 0,
      shadowOffsetY: 2,
      shadowBlur: 6,
      shadowColor: 'rgba(0, 0, 0, 0.3)',
    },
  },
  scrollView: {
    container: {
      height: 55,
    },
    box: {
      width: 60,
      height: 55,
      justifyContent: 'center',
      backgroundColor: '#333',
      marginRight: 10,
    },
    text: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 14,
      textAlign: 'center',
    },
  },
};
