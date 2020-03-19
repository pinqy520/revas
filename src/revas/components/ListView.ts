import * as React from 'react'
import { RevasScrollEvent } from './common/Scroller'
import { ScrollViewProps } from './ScrollView'
import { ScrollView } from '../common'
import View from './View'
import { Frame } from '../core/Node'


export type ListViewProps<T = any> = {
  data: T[],
  renderItem: (item: T, index: number, data: T[]) => React.ReactNode,
  getItemHeight: (item: T, index: number, data: T[]) => number,
} & ScrollViewProps

export default class ListView extends React.Component<ListViewProps<any>> {
  state = {
    paddingTop: 0,
    cursor: 0,
    length: 0,
    height: 0
  }

  private _height = 0
  // private _width = 0

  componentDidMount() {
    this.checkVisible(0)
  }

  private checkVisible = (y: number, tid = '') => {
    const { data, getItemHeight } = this.props
    let { paddingTop, cursor, length, height } = this.state
    let changed = false
    while (paddingTop >= y && cursor > 0) {
      cursor--
      const _h = getItemHeight(data[cursor], cursor, data)
      paddingTop = paddingTop - _h
      height = height + _h
      length++
      changed = true
    }
    while (!tid && length > 0) {
      const _h = getItemHeight(data[cursor], cursor, data)
      if (_h + paddingTop >= y) break
      cursor++
      paddingTop = paddingTop + _h
      height = height - _h
      length--
      changed = true
    }
    while (paddingTop + height <= y + this._height && cursor + length < data.length) {
      length++
      const next = cursor + length
      const _h = getItemHeight(data[next], next, data)
      height = height + _h
      changed = true
    }
    while (!tid && length > 0) {
      const last = cursor + length
      const _h = getItemHeight(data[last], last, data)
      if (paddingTop + height - _h <= y + this._height) break
      length--
      height = height - _h
      changed = true
    }

    if (changed) {
      this.setState({
        paddingTop, cursor, length, height
      })
    }
  }

  private _onScroll = (e: RevasScrollEvent) => this.checkVisible(e.y, e.tid)

  private _onLayout = (frame: Frame) => {
    this._height = frame.height
    // this._width = frame.width
  }

  renderPadding() {
    return React.createElement('View', {
      pointerEvents: 'none',
      style: {
        height: this.state.paddingTop,
        opacity: 0
      }
    })
  }

  renderItem = (item: any, i: number) => {
    const { data, renderItem } = this.props
    const index = i + this.state.cursor
    return React.createElement(
      View,
      {
        key: index,
        // pointerEvents: 'none'
      },
      renderItem(item, index, data)
    )
  }

  render() {
    const { data } = this.props
    const { cursor, length } = this.state
    return (
      React.createElement(
        ScrollView,
        {
          ...this.props,
          onScroll: this._onScroll,
          onLayout: this._onLayout
        },
        this.renderPadding(),
        data.slice(cursor, cursor + length + 1).map(this.renderItem)
      )
    )
  }
}

