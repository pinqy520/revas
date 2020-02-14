import * as React from 'react'
import drawText from '../common/drawText'
import { BaseProps } from '../core/Node'

export type TextProps = {} & BaseProps

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