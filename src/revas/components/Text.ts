import * as React from 'react'
import { drawText, measureText } from '../common/drawText'
import { NodeProps, Node } from '../core/Node'

export type TextProps = {
  numberOfLines?: number
} & NodeProps

export default class Text extends React.Component<TextProps> {
  state = { height: 0 }

  drawText = (ctx: CanvasRenderingContext2D, node: Node) => {
    const [lines, height] = measureText(ctx, node)
    if (height !== this.state.height) {
      this.setState({ height })
    } else {
      drawText(ctx, node, lines)
    }
  }
  render() {
    const { children, numberOfLines, ...others } = this.props as any
    return React.createElement('View', others,
      React.createElement('Text', {
        content: children,
        customDrawer: this.drawText,
        textStyle: others.style,
        style: this.state,
        numberOfLines
      })
    )
  }
}

// TODO: nested text support