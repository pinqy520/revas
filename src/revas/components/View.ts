import * as React from 'react'
import { RawViewProps } from '../core/Node'

export default function View(props: RawViewProps) {
  return React.createElement('View', props)
}