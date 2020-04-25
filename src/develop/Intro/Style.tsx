import * as React from 'react';
import { View, Text, ScrollView } from '../../revas';
import NavBar from './Navbar';
import Panel, { PanelItem } from './Panel';

export default function Style(props: any) {
  return (
    <View style={styles.container}>
      <NavBar title="Style" {...props} />
      <ScrollView style={styles.container}>
        <Panel label="Box">
          <Box text="width: 200; height: 55" style={styles.box.wh} />
          <Box text="backgroundColor: yellow" style={styles.box.yellow} />
          <Box text="borderRadius: 10" style={styles.box.radius} />
          <Box text="shadowOffsetX|Y\shadowColor\shadowBlur" style={styles.box.shadow} />
          <Box text="borderWidth\borderColor" style={styles.box.border} />
        </Panel>
        <Panel label="Layout">
          <View style={styles.row}>
            <PanelItem label="padding" style={styles.container}>
              <View style={styles.layout.padding.out}>
                <View style={styles.layout.padding.in} />
              </View>
            </PanelItem>
            <PanelItem label="margin" style={styles.container}>
              <View style={styles.layout.margin.out}>
                <View style={styles.layout.margin.in} />
              </View>
            </PanelItem>
          </View>
          <View style={styles.row}>
            <PanelItem label="absolute" style={styles.container}>
              <View style={styles.layout.padding.out}>
                <View style={styles.layout.padding.in} />
                <View style={styles.layout.absolute} />
              </View>
            </PanelItem>
            <PanelItem label="zIndex" style={styles.container}>
              <View style={styles.layout.margin.out}>
                <View style={styles.layout.margin.in} />
                <View style={styles.layout.absolute} />
              </View>
            </PanelItem>
          </View>
        </Panel>
      </ScrollView>
    </View>
  );
}

interface BoxProps {
  text: string;
  style: any;
}

function Box(props: BoxProps) {
  return (
    <View style={[styles.box.view, props.style]}>
      <Text style={styles.box.text}>{props.text}</Text>
    </View>
  );
}

const styles = {
  container: { flex: 1 },
  row: { flexDirection: 'row', marginRight: -15, marginBottom: 15 },
  layout: {
    absolute: {
      position: 'absolute',
      width: 30,
      height: 30,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    padding: {
      out: {
        height: 55,
        backgroundColor: '#D8D8D8',
        padding: 10,
      },
      in: {
        flex: 1,
        backgroundColor: '#6B6B6B',
      },
    },
    margin: {
      out: {
        height: 55,
      },
      in: {
        flex: 1,
        backgroundColor: '#D8D8D8',
        margin: 10,
        zIndex: 1,
      },
    },
  },
  box: {
    view: {
      height: 55,
      backgroundColor: '#D8D8D8',
      marginBottom: 5,
      marginTop: 5,
      justifyContent: 'center',
    },
    wh: {
      width: 200,
    },
    yellow: {
      backgroundColor: 'yellow',
    },
    radius: {
      borderRadius: 10,
    },
    shadow: {
      shadowOffsetX: 0,
      shadowOffsetY: 2,
      shadowBlur: 6,
      shadowColor: 'rgba(0, 0, 0, 0.3)',
    },
    border: {
      borderWidth: 2,
      borderColor: '#000',
    },
    text: {
      fontSize: 12,
      color: '#000',
      fontWeight: '600',
      textAlign: 'center',
    },
  },
};
