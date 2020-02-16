import * as React from 'react'
import drawText from '../common/drawText'
import { NodeProps } from '../core/Node'

export type TextProps = {} & NodeProps

export default class Text extends React.Component<TextProps> {
  render() {
    const { children, ...others } = this.props as any
    return React.createElement('Text', {
      content: children,
      customDrawer: drawText,
      ...others
    })
  }
}

// TODO: Auto height and padding support
// TODO: nested text support