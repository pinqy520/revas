import React from 'react';
import { View, RevasTouchEvent } from '../revas'

export default class Interactable extends React.Component<any, any> {
  state = {
    translateX: 0, translateY: 0
  }

  private _start = {
    x: 0, y: 0
  }
  private _tid = 0

  touchStart = (e: RevasTouchEvent) => {
    this._tid = +Object.keys(e.touches)[0]
    const start = e.touches[this._tid]
    this._start.x = start.x - this.state.translateX
    this._start.y = start.y - this.state.translateY
  }

  touchMove = (e: RevasTouchEvent) => {
    if (this._start && e.touches[this._tid]) {
      const { x, y } = e.touches[this._tid]
      this.setState({
        translateX: x - this._start.x,
        translateY: y - this._start.y
      })
    }
  }

  render() {
    return <View
      {...this.props}
      style={{
        ...this.props.style,
        ...this.state
      }}
      onTouchStart={this.touchStart}
      onTouchMove={this.touchMove}
    />
  }
}