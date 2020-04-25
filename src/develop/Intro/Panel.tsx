import * as React from 'react';
import { View, Text } from '../../revas';

export interface PanelItemProps {
  label: string;
  children?: any;
}

export function PanelItem(props: PanelItemProps) {
  return (
    <View style={styles.item}>
      {props.children}
      <Text style={styles.itemText}>{props.label}</Text>
    </View>
  );
}

export interface PanelProps {
  label: string;
  children?: any;
}

export default function Panel(props: PanelProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{props.label}</Text>
      <View style={styles.line} />
      {props.children}
    </View>
  );
}

const styles = {
  container: {
    padding: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    opacity: 0.5,
  },
  line: {
    height: 1,
    backgroundColor: '#000',
    opacity: 0.05,
    marginTop: 10,
    marginBottom: 15,
  },
  item: {
    marginRight: 15,
  },
  itemText: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 2,
  },
};
