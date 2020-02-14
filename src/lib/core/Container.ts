import { Node } from './Node'
import { updateLayout } from './layout'
import { drawRenderLayer } from './draw'

export class Container extends Node {
  private _ready = true
  private _pending = false

  constructor(
    private canvas: HTMLCanvasElement
  ) {
    super('root', {
      width: canvas.clientWidth,
      height: canvas.clientHeight,
    })
  }

  public draw = () => {
    if (this._ready === false) {
      this._pending = true;
      return;
    }
    this._ready = false;
    const start = performance.now()
    updateLayout(this)()
    const ctx = this.canvas.getContext('2d')!
    ctx.clearRect(0, 0, this.props.width, this.props.height);
    drawRenderLayer(ctx, this)
    console.log('draw', performance.now() - start, this)
    requestAnimationFrame(this.ready);
  }

  private ready = () => {
    this._ready = true;
    if (this._pending) {
      this._pending = false;
      this.draw();
    }
  }
}