import { Node, RevasTouchEvent } from './Node';
// import { updateLayout } from './css-layout'
import { updateLayout } from './yoga-layout';
import { drawNode } from './draw';
import { getNodeByTouch, emitTouch } from './touch';
import { RevasCanvas } from './Canvas';

export class Container extends Node {
  private _ready = true;
  private _next = false;
  private _reflow = false;
  private _canvas?: RevasCanvas;

  constructor(canvas: RevasCanvas, width: number, height: number) {
    super('root', { width, height });
    this._canvas = canvas;
  }

  public handleTouch = (evt: RevasTouchEvent) => {
    const emitted = new WeakSet<Node>();
    Object.values(evt.touches).forEach(touch => {
      const node = getNodeByTouch(this, evt.type, touch);
      // check if node is unmounted
      if (node.parent && !emitted.has(node)) {
        emitted.add(node);
        emitTouch(node, evt);
      }
    });
  };

  public handleResize = (width: number, height: number) => {
    if (width !== this.props.width && height !== this.props.height) {
      this.props.width = width;
      this.props.height = height;
    }
  };

  public draw = (reflow = false) => {
    this._reflow = this._reflow || reflow;
    if (!this._ready) {
      this._next = true;
      return;
    }
    this._ready = false;
    if (this._canvas) {
      // if not unmounted
      if (this._reflow) {
        updateLayout(this)();
        this._reflow = false;
      }
      this._canvas.context.clearRect(0, 0, this.props.width, this.props.height);
      drawNode(this._canvas, this, this);
      requestAnimationFrame(this.ready);
    }
  };

  private ready = () => {
    this._ready = true;
    if (this._next) {
      this._next = false;
      this.draw();
    }
  };

  public destory() {
    if (this._canvas) {
      this._canvas.context.clearRect(0, 0, this.props.width, this.props.height);
      this._canvas = void 0;
    }
  }
}
