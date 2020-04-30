import * as React from 'react';
import { NodeProps, Frame } from '../core/Node';
import Scroller, { RevasScrollEvent } from './common/Scroller';
import { AnimatedValue } from '../core/Animated';

export type ScrollViewProps = {
  horizontal?: boolean;
  onScroll?: (e: RevasScrollEvent) => any;
  paging?: boolean | number;
} & NodeProps;

export default class ScrollView extends React.Component<ScrollViewProps> {
  private _height = -1;
  private _contentHeight = -1;
  private _width = -1;
  private _contentWidth = -1;
  private _innerStyle = {
    translateX: new AnimatedValue(0),
    translateY: new AnimatedValue(0),
    position: 'absolute',
    animated: true,
  };

  private _scroller = new Scroller(e => {
    this.props.horizontal ? this._innerStyle.translateX.setValue(-e.x) : this._innerStyle.translateY.setValue(-e.y);
    this.props.onScroll && this.props.onScroll(e);
  });

  private _onLayout = (frame: Frame) => {
    if (this._width !== frame.width || this._height !== frame.height) {
      this._height = frame.height;
      this._width = frame.width;
      this._checkLayout();
      if (this.props.paging) {
        if (this.props.horizontal) {
          this._scroller.pagingX = this.props.paging === true ? frame.width : this.props.paging;
        } else {
          this._scroller.pagingY = this.props.paging === true ? frame.height : this.props.paging;
        }
      }
    }
    this.props.onLayout && this.props.onLayout(frame);
  };

  private _onContentLayout = (frame: Frame) => {
    if (this._contentWidth !== frame.width || this._contentHeight !== frame.height) {
      this._contentHeight = frame.height;
      this._contentWidth = frame.width;
      this._checkLayout();
    }
  };

  private _checkLayout = () => {
    const maxX = this._contentWidth - this._width;
    const maxY = this._contentHeight - this._height;
    if ((maxX > 0 && maxX !== this._scroller.maxX) || (maxY > 0 && maxY !== this._scroller.maxY)) {
      this._scroller.maxX = maxX;
      this._scroller.maxY = maxY;
      this._scroller.emit();
    }
  };

  render() {
    const { children, horizontal, ...others } = this.props;

    this._scroller.horizontal = horizontal;

    return React.createElement(
      'Scrollable',
      { ...others, onLayout: this._onLayout },
      React.createElement('ScrollContent', {
        onTouchStart: this._scroller.touchStart,
        onTouchMove: this._scroller.touchMove,
        onTouchEnd: this._scroller.touchEnd,
        onLayout: this._onContentLayout,
        style: [
          this._innerStyle,
          {
            flexDirection: horizontal ? 'row' : 'column',
            [horizontal ? 'height' : 'width']: '100%',
          },
        ],
        children,
      })
    );
  }
}
