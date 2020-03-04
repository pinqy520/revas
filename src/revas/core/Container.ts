import { Node, RevasTouchEvent } from './Node'
import { updateLayout } from './css-layout'
// import { updateLayout } from './yoga-layout'
import { drawNode } from './draw'
import { getNodeByTouch, emitTouch } from './touch'

export class Container extends Node {
  private _ready = true
  private _next = false
  private _reflow = false
  private _ctx?: CanvasRenderingContext2D | null

  constructor(ctx: CanvasRenderingContext2D | null, width: number, height: number) {
    super('root', { width, height })
    this._ctx = ctx
  }

  public handleTouch = (evt: RevasTouchEvent) => {
    const emitted = new WeakSet<Node>()
    Object.values(evt.touches).forEach(touch => {
      const node = getNodeByTouch(this, evt.type, touch)
      // check if node is unmounted
      if (node.parent && !emitted.has(node)) {
        emitted.add(node)
        emitTouch(node, evt)
      }
    })
  }

  public handleResize = (width: number, height: number) => {
    if (width !== this.props.width
      && height !== this.props.height) {
      this.props.width = width
      this.props.height = height
      this.draw(true)
    }
  }

  public draw = (reflow = false) => {
    this._reflow = this._reflow || reflow
    if (this._ready === false) {
      this._next = true;
      return;
    }
    this._ready = false;
    if (this._ctx) { // if not unmounted
      if (this._reflow) {
        updateLayout(this)()
        this._reflow = false
      }
      this._ctx.clearRect(0, 0, this.props.width, this.props.height);
      drawNode(this._ctx, this, this)
      requestAnimationFrame(this.ready);
    }
  }

  private ready = () => {
    this._ready = true;
    if (this._next) {
      this._next = false;
      this.draw(false);
    }
  }

  public destory() {
    if (this._ctx) {
      this._ctx.clearRect(0, 0, this.props.width, this.props.height)
      this._ctx = null
    }
  }
}