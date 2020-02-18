import * as React from 'react'
import { NodeProps, Frame } from '../core/Node'
import Scroller from '../common/Scroller'

export type ScrollViewProps = {

} & NodeProps

export default class ScrollView extends React.Component<ScrollViewProps> {
  state = {
    top: 0
  }

  _height = -1
  _contentHeight = -1

  private _scroller = new Scroller(top => this.setState({ top }))

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
