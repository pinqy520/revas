import React from 'react';
import { View, RevasTouchEvent, AnimatedValue } from '../revas'

export default class Interactable extends React.Component<any, any> {

  translateX = new AnimatedValue(0)
  translateY = new AnimatedValue(0)

  private _start = {
    x: 0, y: 0
  }
  private _tid = 0

  touchStart = (e: RevasTouchEvent) => {
    this._tid = +Object.keys(e.touches)[0]
    const start = e.touches[this._tid]
    this._start.x = start.x - this.translateX.getValue()
    this._start.y = start.y - this.translateY.getValue()
  }

  touchMove = (e: RevasTouchEvent) => {
    if (this._start && e.touches[this._tid]) {
      const { x, y } = e.touches[this._tid]
      this.translateX.setValue(x - this._start.x)
      this.translateY.setValue(y - this._start.y)
    }
  }

  render() {
    return <View
      {...this.props}
      style={{
        ...this.props.style,
        translateX: this.translateX,
        translateY: this.translateY
      }}
      onTouchStart={this.touchStart}
      onTouchMove={this.touchMove}
    />
  }
}