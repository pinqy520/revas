import * as React from 'react'
import { NodeProps, Frame } from '../core/Node'
import Scroller, { RevasScrollEvent } from '../common/Scroller'

export type ScrollViewProps = {
  onScroll?: (e: RevasScrollEvent) => any
} & NodeProps

export default class ScrollView extends React.Component<ScrollViewProps> {
  state = {
    top: 0
  }

  private _height = -1
  private _contentHeight = -1

  private _scroller = new Scroller(e => {
    this.setState({ top: e.y })
    this.props.onScroll && this.props.onScroll(e)
  })

  private _onLayout = (frame: Frame) => {
    if (this._height !== frame.height) {
      this._height = frame.height
      this._checkLayout()
    }
  }

  private _onContentLayout = (frame: Frame) => {
    if (this._contentHeight !== frame.height) {
      this._contentHeight = frame.height
      this._checkLayout()
    }
  }

  private _checkLayout = () => {
    const max = this._contentHeight - this._height
    if (max > 0 && max !== this._scroller.max) {
      this._scroller.max = max
      this._scroller.change(0)
    }
  }

  render() {
    const { children, ...others } = this.props
    return React.createElement(
      'Scrollable',
      {
        ...others,
        onTouchStart: this._scroller.touchStart,
        onTouchMove: this._scroller.touchMove,
        onTouchEnd: this._scroller.touchEnd,
        onLayout: this._onLayout,
      },
      React.createElement('ScrollContent', {
        onLayout: this._onContentLayout,
        style: {
          translateY: -this.state.top
        },
        children
      })
    )
  }
}
