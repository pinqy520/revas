import * as React from 'react'
import { View, Text } from '../../revas'

export interface PanelProps {
  label: string
}

export default function Panel (props: PanelProps) {
  return (
    <View>
      <Text>{props.label}</Text>
    </View>
  )
}