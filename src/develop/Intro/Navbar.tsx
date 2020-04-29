import * as React from 'react';
import { View, Text, Image, Touchable } from '../../revas';

export interface NavBarProps {
  title: string;
  router: any;
}

export default function NavBar(props: NavBarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.title}</Text>
      <Touchable style={styles.back} onPress={props.router.pop}>
        <Image style={styles.icon} src={require('./navback.png')} />
      </Touchable>
    </View>
  );
}

const styles = {
  container: {
    height: 50,
    backgroundColor: '#333',
    justifyContent: 'center',
    zIndex: 100,
  },
  title: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  icon: {
    width: 9,
    height: 14,
  },
  back: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
};
