import React from 'react';
import { View, RevasTouchEvent, AnimatedValue } from '../../revas'

export default class Interactable extends React.Component<any, any> {

  private _start = {
    x: 0, y: 0
  }
  private _tid = ''

  private _style = {
    translateX: new AnimatedValue(this._start.x),
    translateY: new AnimatedValue(this._start.y),
    animated: true
  }

  touchStart = (e: RevasTouchEvent) => {
    this._tid = Object.keys(e.touches)[0]
    const start = e.touches[this._tid]
    this._start.x = start.x - this._style.translateX.getValue()
    this._start.y = start.y - this._style.translateY.getValue()
  }

  touchMove = (e: RevasTouchEvent) => {
    if (this._start && e.touches[this._tid]) {
      const { x, y } = e.touches[this._tid]
      this._style.translateX.setValue(x - this._start.x)
      this._style.translateY.setValue(y - this._start.y)
    }
  }

  render() {
    return <View
      {...this.props}
      style={[this.props.style, this._style]}
      onTouchStart={this.touchStart}
      onTouchMove={this.touchMove}
    />
  }
}