import * as React from 'react'
import drawText from '../common/drawText'


export default class Text extends React.Component<any> {
  render() {
    const { children, ...others } = this.props as any
    return React.createElement('Text', {
      content: children,
      customDrawer: drawText,
      ...others
    })
  }
}