import * as React from 'react';
import { Touchable, Text, View, Image } from '../../revas';

export interface EntryProps {
  label: string;
  onPress: any;
}

export default function Entry(props: EntryProps) {
  return (
    <Touchable onPress={props.onPress} style={styles.container}>
      <Text style={styles.label}>{props.label}</Text>
      <Image src={require('./entry.jpg')} style={styles.icon} />
      <View style={styles.line} />
    </Touchable>
  );
}


const styles = {
  container: {
    height: 58,
    justifyContent: 'center',
    paddingLeft: 20
  },
  label: {
    color: '#191919',
    fontSize: 15,
    fontWeight: '600'
  },
  line: {
    position: 'absolute',
    left: 20, right: 0, bottom: 0, height: 1,
    backgroundColor: '#000',
    opacity: 0.05
  },
  icon: {
    width: 9, height: 12,
    position: 'absolute',
    right: 16, top: 23
  }
};