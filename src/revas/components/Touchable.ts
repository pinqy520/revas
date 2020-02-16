import * as React from 'react'
import { BaseProps, RevasTouchEvent, RevasTouch } from '../core/Node'

export type TouchableProps = {
  onPress: Function
  activeOpacity?: number
} & BaseProps

export default class Touchable extends React.Component<TouchableProps> {
  static defaultProps = {
    activeOpacity: 0.7
  }

  state = {
    touching: false
  }

  private _start?: RevasTouch
  private _tid = 0

  private _onTouchStart = (e: RevasTouchEvent) => {
    this._tid = +Object.keys(e.touches)[0]
    this._start = e.touches[this._tid]
    this.setState({ touching: true })
  }

  private _onTouchEnd = (e: RevasTouchEvent) => {
    if (this._start && e.touches[this._tid]) {
      if (Math.abs(this._start.x - e.touches[this._tid].x) < 3
        && Math.abs(this._start.y - e.touches[this._tid].y) < 3) {
        this.props.onPress && this.props.onPress()

      }
    }
    this.setState({ touching: false })
  }

  render() {
    return React.createElement('Touchable', {
      onTouchStart: this._onTouchStart,
      onTouchEnd: this._onTouchEnd,
      ...this.props,
      style: {
        ...this.props.style,
        opacity: this.state.touching ? this.props.activeOpacity : 1
      }
    })
  }
}